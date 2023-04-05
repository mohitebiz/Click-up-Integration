const axios = require("axios");
const {
  HUBSPOT_API_URL,
  HUBSPOT_PRIVATE_APP_TOKEN,
  PAYMENT_URL,
  CLICKUP_API_URL,
  CLICKUP_API_TOKEN,
} = require("../config/env.config");
const { logger } = require("../config/logger.config");
// const { sleep } = require("../helpers/utils");
// const { SF_URL } = require("./env.config");

const axiosClickUp = axios.create({
  baseURL: CLICKUP_API_URL,
  timeout: 3600 * 1000,
  headers: { Authorization: CLICKUP_API_TOKEN },
});

module.exports = {
  axiosClickUp,
};
