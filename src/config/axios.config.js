const axios = require("axios");
const {
  CLICKUP_API_URL,
  CLICKUP_API_TOKEN,
  HUBSPOT_API_URL,
  HUBSPOT_PRIVATE_APP_TOKEN,
} = require("../config/env.config");
const { logger } = require("./logger.config");
const { tokenJson } = require("../constant/clickupToken.constant");
const axiosClickUp = axios.create({
  baseURL: CLICKUP_API_URL,
  timeout: 3600 * 1000,
  // headers: { Authorization: CLICKUP_API_TOKEN },
});
axiosClickUp.interceptors.request.use(
  async (request) => {
    
    logger.verbose(
      `* * * requesting clickup for - portal ${request.portalId}  * * *`
    );
    const clickupToken = tokenJson[request.portalId].clickupToken;
    console.log('clickupToken', clickupToken)

    request.headers["Authorization"] = clickupToken;

    return request;
  },
  (error) => {
    console.log("errorININterceptor>>>", error);
    return Promise.reject(error);
  }
);

const axiosHubspot = axios.create({
  baseURL: HUBSPOT_API_URL,
  timeout: 3600 * 1000,
  headers: { Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}` },
});

module.exports = {
  axiosClickUp,
  axiosHubspot,
};
