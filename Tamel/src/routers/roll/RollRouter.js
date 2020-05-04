export default class LearnRouter {
    onMessage(message) {
        const content = message.content;
        const params = content.split(' ');

		const rollPoint = parseInt(params[1], 10)
        const num = Math.floor(Math.random() * rollPoint) + 1;

        console.log(`roll ${rollPoint} output ${num}`);
        message.channel.send(`${num}`);
    }
}
