export default class Server {
    constructor(expressApp, routes, port) {
        this._expressApp = expressApp;
        this._routes = routes;
        this._port = port;
    }

    async start() {
        this._routes.forEach(({ route, prefix }) => {
            this._expressApp.use(prefix, route);
        });

        await this._expressApp.listen(this._port);
        console.log('Running server at port ', this._port);
    }
}