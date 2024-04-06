require("dotenv").config();

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_DATABASE
const dbUser = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD

const config = {
  development: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: './seeds',
    },

  },
};

module.exports = config
