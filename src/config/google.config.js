const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URL,
} = require("@config/env.config");
const { google } = require("googleapis");
const { logger } = require("@config/logger.config");
const moment = require("moment");
// const Auth = require("../models/auth.models");
const fs = require("fs");
const path = require("path");

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URL
);

// initialize and set OAuth2 credentials
async function initOAuth2Client(portal, thirdPartySettings) {
  const { access_token, refresh_token, expiry_date } = thirdPartySettings;

  oauth2Client.setCredentials({
    access_token,
    refresh_token,
    expiry_date: new Date(expiry_date).getTime(),
  });

  if (await isTokenExpired(access_token)) {
    logger.verbose(`isTokenExpired ${expiry_date} `);
    await getNewAccessToken(refresh_token, access_token, {
      portal,
    });
  }
  return oauth2Client;
}

async function isTokenExpired(accessToken) {
  try {
    logger.verbose("Checking token ", accessToken);
    const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
    return tokenInfo.expiry_date < Date.now();
  } catch (error) {
    // Handle errors
    console.error("Error checking token:", error);
    return true; // Assume the token is expired if there's an error
  }
}

async function getNewAccessToken(refresh_token, access_token, data) {
  try {
    logger.verbose(`token change listener  = data.portal :>> ${data.portal}`);
    await new Promise((resolve, reject) => {
      oauth2Client.refreshAccessToken(async (err, tokens) => {
        console.log(
          "🚀 ~ file: google.config.js:116 ~ oauth2Client.refreshAccessToken ~ tokens:",
          tokens
        );
        if (err) {
          logger.error(
            `error in token change listener - ${data.portal} ${err.message}`
          );
          reject(false);
        }

        fs.writeFileSync(
          path.resolve(`./src/constant/token-${data.portal}.json`),
          JSON.stringify(tokens)
        );

        resolve(true);
      });
    });
    return { access_token, refresh_token };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return false;
  }
}

module.exports = { initOAuth2Client, oauth2Client };
// module.exports.default = oauth2Client;
