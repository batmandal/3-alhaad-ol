module.exports = {
  apps: [
    {
      name: "lost-found-backend",
      script: "src/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
}
