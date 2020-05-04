module.exports = function (api) {
    api.cache(true);
    const presets = [
        ["env", {
            "targets": {
                "node": "10",
            },
        }]
    ];
    const plugins = [ ];
    return {
        presets,
        plugins
    };
}
