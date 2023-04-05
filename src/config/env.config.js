const dotenv = require("dotenv");
const path = require("path");

const environment = process.env.NODE_ENV?.trim() || "development";

dotenv.config({
  path: path.resolve(`./.env.${environment}`),
});

const envObject = {
  ENVIRONMENT: environment,
  PORT: Number(process.env.PORT),
  BASE_URL: process.env.BASE_URL,
  WELCOME_MESSAGE: process.env.WELCOME_MESSAGE,
  CLICKUP_API_URL: process.env.CLICKUP_API_URL,
  CLICKUP_API_TOKEN: process.env.CLICKUP_API_TOKEN,
};

module.exports = envObject;
