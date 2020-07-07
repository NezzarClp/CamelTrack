import Promise from 'bluebird';
import DiscordMessage from '../../common/DiscordMessage';

function getRandomElement(list, numElement) {
    let arr = list.slice(0);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, numElement);
}

export default class LearnRouter {
    constructor(wordDao) {
        this._wordDao = wordDao;
    }

    async _handleInsert(message) {
        const channel = message.channel;
        const discordMessage = new DiscordMessage(channel);
        await discordMessage.send('Inserting word...');

        const { content } = message;
        const args = content.split(' ').slice(2).join(' ');
    
        const [romaji, kanji, english] = args.split('#').map(entry => entry.trim());

        const rows = await this._wordDao.getByKanji(kanji);

        if (rows && rows.length > 0) {
            await discordMessage.modify('Word already exist; Updated date');

            await this._wordDao.pingByIds(rows.map(row => parseInt(row.id, 10)));
        } else {
            const record = { romaji, kanji, english };        

            await this._wordDao.insert(record);
            await discordMessage.modify('Inserted');
        }

        const count = await this._wordDao.wordCount();
        const countMessage = new DiscordMessage(channel);
        await countMessage.send(`Current num. of word: ${count}`);
    }

    async _handleList(message) {
        
    }

    async _handleFind(message) {
        const channel = message.channel;
        const discordMessage = new DiscordMessage(channel);
        await discordMessage.send('Searching word...');

        const { content } = message;
        const kanji = content.split(' ')[2];

        const rows = await this._wordDao.getByKanji(kanji);

        if (rows && rows.length > 0) {
            const words = rows.map((row) => JSON.stringify(row)).join('\n');
            await discordMessage.modify(`Word found:\n${words}`);
        } else {
            await discordMessage.modify('No such word');
        }
    }

    async _handleDelete(message) {
        const channel = message.channel;
        const discordMessage = new DiscordMessage(channel);
        await discordMessage.send('Searching word...');

        const { content } = message;
        const id = content.split(' ')[2];

        const rows = await this._wordDao.getById(id);

        if (rows && rows.length > 0) {
            const words = rows.map((row) => JSON.stringify(row)).join('\n');
            await discordMessage.modify(`Going to delete word\n${words}`);

            const deleteConfirmMessage = new DiscordMessage(channel);
            await this._wordDao.delete(id);
            await deleteConfirmMessage.send(`Deleted word\n${words}`);
        } else {
            await discordMessage.modify('No such word');
        }
    }


    async onMessage(message) {
        const content = message.content;
        const params = content.split(' ');
        const command = params[1];

        console.log('command', command);

        switch (command) {
            case 'insert':
                await this._handleInsert(message);
                break;
            case 'list':
                await this._handleList(message);
                break;
            case 'find':
                await this._handleFind(message);
                break;
            case 'delete':
                await this._handleDelete(message);
                break;
            default:
                break;
        }
    }
}
