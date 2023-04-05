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
  ENDPOINTSECRET: process.env.ENDPOINTSECRET,
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  HUBSPOT_PRIVATE_APP_TOKEN: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  HUBSPOT_API_URL: process.env.HUBSPOT_API_URL,
  CLICKUP_API_URL: process.env.CLICKUP_API_URL,
  CLICKUP_API_TOKEN: process.env.CLICKUP_API_TOKEN,
};

module.exports = envObject;
