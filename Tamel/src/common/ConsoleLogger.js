export default class ConsoleLogger {
    constructor(console) {
        this._console = console;
    }

    info(msg) {
        this._console.log(msg);
    }
}
