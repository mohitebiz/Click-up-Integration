const axios = require("axios");
const {
  CLICKUP_API_URL,
  CLICKUP_API_TOKEN,
  HUBSPOT_API_URL,
  HUBSPOT_PRIVATE_APP_TOKEN,
} = require("../config/env.config");

const axiosClickUp = axios.create({
  baseURL: CLICKUP_API_URL,
  timeout: 3600 * 1000,
  headers: { Authorization: CLICKUP_API_TOKEN },
});

const axiosHubspot = axios.create({
  baseURL: HUBSPOT_API_URL,
  timeout: 3600 * 1000,
  headers: { Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}` },
});

module.exports = {
  axiosClickUp,
  axiosHubspot,
};
