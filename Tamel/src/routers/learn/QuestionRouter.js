import DiscordMessage from '../../common/DiscordMessage';

const DEFAULT_FETCH_PERIOD_SEC = 60 * 60; // 1 Hour
const DEFAULT_TIME_SCAN_SEC = 60 * 60 * 24 * 15; // 15 Days

export default class QuestionRouter {
    constructor(client, wordDao, questionDao, fetchPeriodSec = DEFAULT_FETCH_PERIOD_SEC, scanTimestampSec = DEFAULT_TIME_SCAN_SEC) {
        this._client = client;
        this._wordDao = wordDao;
        this._questionDao = questionDao;
        this._fetchPeriodSec = fetchPeriodSec;
        this._scanTimestampSec = scanTimestampSec;
    }

    async _genQuestions() {
        const wordIds = await this._wordDao.getAllIds();
    }

    async _insertQuestion() {
        const rows = (await this._questionDao.getLatestQuestion());
        let shouldInsert = false;

        if (rows && rows.length) {
            const { created_dt } = rows[0];
            const timestamp = (new Date(created_dt)).getTime();

            console.log('diff', Date.now() - timestamp);

            shouldInsert = (Date.now() - timestamp >= this._fetchPeriodSec * 1000);
        } else {
            shouldInsert = true;
        }

        if (shouldInsert) {
            const chatChannel = this._client.channels.cache.find((channel) => { return channel.name === "bot-chats" });
            const debugChannel = this._client.channels.cache.find((channel) => { return channel.name === "bot-logs" });
            const message = new DiscordMessage(chatChannel);

            const row = (await this._wordDao.getRandomWord(1));
            const { id: wordId, kanji } = row[0];

            const questionId = await this._questionDao.insert({ wordId });
            const currentTimestamp = (new Date());
            const currentTime = currentTimestamp.toISOString();
            const fetchTimestamp = currentTimestamp / 1000 -  this._scanTimestampSec;
            const data = await this._questionDao.getByTimestamp(fetchTimestamp);
            const debugText = JSON.stringify(data).slice(0, 200);

            (new DiscordMessage(debugChannel)).send(debugText);

            await this._genQuestions();

            const text = `==========\nQuestion Id: ${questionId}, kanji: ${kanji}\nTime: ${currentTime}\n=========`;
            message.send(text, { imageUrl: 'hamster/question.png' });
        }

        setTimeout(() => {
            this._insertQuestion();
        }, (this._fetchPeriodSec + 10) * 1000);
    }

    async onStart() {
        await this._insertQuestion();
    }

    async onMessage(message) {
        const content = message.content;
        const params = content.split(' ');
    
        const id = parseInt(params[1], 10);
        const answer = params[2];

        const discordMessage = new DiscordMessage(message.channel);

        const { result, wordId } = (await this._questionDao.getById(id))[0];
        const { romaji, kanji, 'english_meaning': en } = (await this._wordDao.getById(wordId))[0];

        const correct = (romaji === answer);
        const imageUrl = (correct ? 'hamster/yes.png' : 'hamster/no.png');

        discordMessage.send(`Kanji: ${kanji}\nMeaning: ${en}\nYour answer: ${answer}\nActual answer: ${romaji}`, { imageUrl });
 
        const newStatus = (correct ? 'true' : 'false');

        await this._questionDao.updateStatus(id, newStatus);

        if (!correct) {
            await this._wordDao.pingByIds([wordId]);
        }
    }
}
