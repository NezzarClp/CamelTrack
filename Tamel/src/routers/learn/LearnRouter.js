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
            default:
                break;
        }
    }
}
