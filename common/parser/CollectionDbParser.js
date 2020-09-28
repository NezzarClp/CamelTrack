export default class CollectionDbParser {
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
            throw new Error('No data');
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
            throw new Error('No data');
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


