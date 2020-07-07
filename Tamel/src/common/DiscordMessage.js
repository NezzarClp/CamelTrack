import Discord from 'discord.js';

export default class DiscordMessage {
    constructor(channel) {
        this._channel = channel;
        this._message = null;
        this._newMessageContent = null;
        this._messageSendingPromise = null;
        this._messageId = 0;
    }

    _formatMessage(message, options) {
        let formattedMessage = (new Discord.MessageEmbed())
            .setColor('#8900ff')
            .setDescription(message);

        if (options.imageUrl) {
            const fullUrl = `http://142.93.195.94/public/${options.imageUrl}`;

            formattedMessage = formattedMessage.setThumbnail(fullUrl);
        }

        return formattedMessage;
    }

    async send(message, options = {}) {
        this._message = await this._channel.send(this._formatMessage(message, options));

        if (this._newMessageContent !== null) {
            this._bar = await this._message.edit(this._newMessageContent);

            this._newMessageContent = null;
        }
    }

    async modify(message, options = {}) {
        const currentMessageId = (this._messageId + 1);
        this._messageId = currentMessageId;
        this._newMessageContent = this._formatMessage(message, options);

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
