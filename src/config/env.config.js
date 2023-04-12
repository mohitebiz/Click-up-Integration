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
  HUBSPOT_PRIVATE_APP_TOKEN: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  HUBSPOT_API_URL: process.env.HUBSPOT_API_URL,
  ORIGINAL_FILE_ID: process.env.ORIGINAL_FILE_ID,
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URL: `${process.env.BASE_URL}${process.env.GMAIL_REDIRECT_ROUTE}`,
};

module.exports = envObject;
