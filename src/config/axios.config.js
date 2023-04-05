const axios = require("axios");
const { CLICKUP_API_URL, CLICKUP_API_TOKEN } = require("../config/env.config");

const axiosClickUp = axios.create({
  baseURL: CLICKUP_API_URL,
  timeout: 3600 * 1000,
  headers: { Authorization: CLICKUP_API_TOKEN },
});

module.exports = {
  axiosClickUp,
};
