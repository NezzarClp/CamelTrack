module.exports = {
    apps: [
        {
            name: 'New discord bot',
            script: 'node',
            watch: true,
            "ignore_watch" : ["node_modules", "temp"],
            cwd: '/root/CamelTrack/Tamel',
            args: 'build/index.js',
        },
        {
            name: 'Track client',
            script: 'npm',
            watch: ["src"],
            cwd: '/root/CamelTrack/client',
            args: 'start',
        },
        {
            name: 'Track server',
            script: 'npm',
            watch: ["src"],
            cwd: '/root/CamelTrack/server',
            args: 'start',
        },
    ],
};
