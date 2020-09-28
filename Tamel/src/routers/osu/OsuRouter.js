import { google } from 'googleapis';
import * as R from 'ramda';
import OsuBuffer from 'osu-buffer';
import DiscordMessage from '../../common/DiscordMessage';
import Promise from 'bluebird';
import fs from 'fs';
import { exec } from 'child_process';
import md5 from 'md5';

import axios from 'axios';

import config from '../../config';

const sheets = google.sheets({
    version: 'v4',
    auth: config.googleApiKey,
});

const osuApiClient = {
    get: async (url, params) => {
        try {
            const fullUrl = `https://osu.ppy.sh/api/${url}`;        
            const { data } = await axios.get(fullUrl, {
                params: {
                    ...params,
                    k: config.osuApiKey,
                },
            });

            return data;
        } catch (err) {
            console.error('Failed to get osu data', err);

            throw err;
        }
    }
}

class CollectionDbParser {
    constructor() {
        this._parsed = false;
    }

    parse(buffer) {
        this._osuver = buffer.ReadInt32();
        this._numCollections = buffer.ReadInt32();
        this._collections = [];

        for (let i = 0; i < this._numCollections; i++) {
            const name = buffer.ReadOsuString();
            const beatmapsCount = buffer.ReadInt32();
            const collection = {
                name,
                beatmapsCount,
                md5s: [],
            }            

            for (let j = 0; j < beatmapsCount; j++) {
                const md5 = buffer.ReadOsuString();
                collection.md5s.push(md5);   
            }

            this._collections.push(collection);
        }

        this._parsed = true;
    }

    injectCollection(name, md5s) {
        if (!this._parsed) {
            throw new Error('no data');
        }

        this._numCollections++;

        this._collections.push({
            name,
            beatmapsCount: md5s.length,
            md5s,
        });
    }

    write(fileSrc) {
        if (!this._parsed) {
            throw new Error('no data');
        }

        let buffer = new OsuBuffer();

        buffer.WriteInt32(this._osuver);
        buffer.WriteInt32(this._numCollections);

        for (let i = 0; i < this._numCollections; i++) {
            const collection = this._collections[i];

            buffer.WriteOsuString(collection.name);
            buffer.WriteInt32(collection.beatmapsCount);
            
            for (let j = 0; j < collection.beatmapsCount; j++) {
                buffer.WriteOsuString(collection.md5s[j]);
            }
        }

        fs.writeFileSync(fileSrc, buffer.buffer);
    }
};

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }

            resolve(stdout);
        });
    });
}

export default class OsuRouter {

    constructor() {
        this._osuApiClient = osuApiClient;
    }

    _fetchOsuBId(text) {
        const match = text && `${text}`.match(/^http[s]?:\/\/osu\.ppy\.sh\/(?:b|beatmapsets\/.*)\/([0-9]*).*$/);

        return match && match[1];
    }

    _fetchSheetId(sheetUrl) {
        const match = sheetUrl && `${sheetUrl}`.match(/^http[s]?\:\/\/docs\.google\.com\/spreadsheets\/d\/([^\/]*).*/);

        return match && match[1];
    }

    async onMessage(message) {
        const channel = message.channel;
        const params = message.content.split(' ');
        const discordMessage = new DiscordMessage(channel);

        const sheetId = this._fetchSheetId(params[1]);
        const collectionId = params[2];

        const remainParams = params.slice(3).join(' ');
        const match = remainParams.match(/^"([^"]*)"\s*"([^"]*)"$/);

        if (!match) {
            await discordMessage.send(`MISMATCH PARAMS ${params}`);
            return;
        }

        const sheetRange = match[1];
        const collectionName = match[2];

        try {
            const { data } = await sheets.spreadsheets.get({
                spreadsheetId: sheetId,
                ranges: sheetRange,
                fields: "sheets/data/rowData/values/hyperlink",
            });
            const sheetData = data.sheets[0].data;
            const rowData = sheetData[0].rowData;

            const bIds = rowData.map((row) => {
                if (row.values) {
                    const links = row.values
                        .map((value) => (this._fetchOsuBId(value.hyperlink)))
                        .filter((val) => (val));

                    return links;
                } else {
                    return [];
                } 
            });

            const uniqueBids = R.uniq(R.flatten(bIds));
            (new DiscordMessage(channel)).send(`Received BIDs: ${uniqueBids}`);
    
            const fetchedBidInfos = [];
            discordMessage.send(`Fetched: (0 / ${uniqueBids.length})`);;

            await Promise.each(uniqueBids, async (bid) => {
                const mapData = (await this._osuApiClient.get('get_beatmaps', { b: bid }))[0];
                const sid = mapData['beatmapset_id'];

                fetchedBidInfos.push({ bid, sid, name: `${mapData.artist} - ${mapData.title}`  });

                const { data } = await axios.get(`https://txy1.sayobot.cn/beatmaps/download/full/${sid}?server=0`, { responseType: 'stream' });
                // const { data } = await axios.get(`https://bloodcat.com/osu/s/${sid}`, { responseType: 'stream' });

                await (new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(`../storage/osz/${sid}.osz`);

                    data.on('error', (err) => { console.error('Failed to save stream', err); reject(err); });
                    data.on('end', () => { resolve(); });

                    data.pipe(writeStream);
                }));

                const message = fetchedBidInfos.map(({bid, sid, name}) => (`${bid} ==> ${sid} ==> ${name}`)).join('\n');

                await discordMessage.modify(`Fetched: (${fetchedBidInfos.length} / ${uniqueBids.length})\n${message}`);
            });

            const progressMessage = new DiscordMessage(channel);

            progressMessage.send('Zipping...');

            const zipId = Date.now();
            const command = `zip ../storage/zip/${zipId}.zip `.concat(fetchedBidInfos.map(({ sid }) => `../storage/osz/${sid}.osz`).join(' '));

            await execPromise(command);

            progressMessage.modify(`Zipped https://142.93.195.94/public/zip/${zipId}.zip`);

            const collectionMessage = new DiscordMessage(channel);

            collectionMessage.send(`Injecting... ${collectionName}`);

            const md5s = await Promise.mapSeries(uniqueBids, async (bid) => {
                const { data } = await axios.get(`https://osu.ppy.sh/osu/${bid}`);

                return md5(data);
            });
            const parser = new CollectionDbParser();
            const osuBuffer = new OsuBuffer(fs.readFileSync(`../storage/collection/collection.db-${collectionId}`));
            const newCollectionName = `collection.db-${Date.now()}`;

            parser.parse(osuBuffer);
            parser.injectCollection(collectionName, md5s);
            parser.write(`../storage/collection/${newCollectionName}`);

            collectionMessage.modify(`Injected ${collectionName} https://142.93.195.94/public/collection/${newCollectionName}`);
        } catch (err) {
            console.error('Failed to fetch osu details', err);

            await (new DiscordMessage(channel)).send('ERR');      
            
            throw err;      
        } 
    }
};

