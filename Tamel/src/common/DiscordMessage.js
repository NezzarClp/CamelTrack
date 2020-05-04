export default class DiscordMessage {
    constructor(channel) {
        this._channel = channel;
        this._message = null;
        this._newMessageContent = null;
        this._messageSendingPromise = null;
        this._messageId = 0;
    }

    async send(message) {
        this._message = await this._channel.send(message);

        if (this._newMessageContent !== null) {
            this._bar = await this._message.edit(this._newMessageContent);

            this._newMessageContent = null;
        }
    }

    async modify(message) {
        const currentMessageId = (this._messageId + 1);
        this._messageId = currentMessageId;
        this._newMessageContent = message;

        await this._messageSendingPromise;

        if (currentMessageId === this._messageId && this._message) {
            this._messageSendingPromise = this._message.edit(this._newMessageContent);

            await this._messageSendingPromise;
        }
    }

    async delete(message) {
        throw new Error('delete is not implemented');
    }

}
