module.exports = {
    apps: [
        {
            name: 'New discord bot',
            script: 'npm',
            watch: ["src"],
            cwd: '/root/CamelTrack/Tamel',
            args: 'start',
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
