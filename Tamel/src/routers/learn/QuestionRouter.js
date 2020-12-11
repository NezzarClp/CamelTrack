import DiscordMessage from '../../common/DiscordMessage';
import Promise from 'bluebird';

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

    _calculateScore(trueCount, falseCount, totalQuestions) {
        const ratioScore = falseCount / (trueCount + falseCount + 1); 
        const attemptScore = Math.sqrt(4) * Math.sqrt(Math.log(totalQuestions) / (trueCount + falseCount + 1));

        return ratioScore + attemptScore;
    }

    async _genQuestions(channel) {
        const wordIds = await this._wordDao.getAllIds();
        const sudoMessage = new DiscordMessage(channel);

        sudoMessage.send(`Length: ${wordIds.length}`);
        
        const questionCount = await this._questionDao.getCount();
        const weights = await Promise.map(wordIds, async ({ id }) => {
            const questions = await this._questionDao.getByWordId(id);
            const total = questions.length;
            const trueCount = questions.filter((question) => question.result === "true").length;
            const falseCount = questions.filter((question) => question.result === "false").length; 
            const word = await this._wordDao.getById(id);
            
            const score = this._calculateScore(trueCount, falseCount, questionCount);

            return score;
        }, { concurrency: 10 });

        const totalWeight = weights.reduce((accum, cur) => (accum + cur), 0);
        sudoMessage.send(`total weight ${totalWeight}`);
    }

    async _insertQuestion() {
        const rows = (await this._questionDao.getLatestQuestion());
        let shouldInsert = false;

        if (rows && rows.length) {
            const { created_dt } = rows[0];
            const timestamp = (new Date(created_dt)).getTime();

            shouldInsert = (Date.now() - timestamp >= this._fetchPeriodSec * 1000);
        } else {
            shouldInsert = true;
        }
            const debugChannel = this._client.channels.cache.find((channel) => { return channel.name === "bot-logs" });
            await this._genQuestions(debugChannel);

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
