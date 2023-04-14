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

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URL
);

const setToken = async () => {
  try {
    const extist = fs.existsSync("./token.json");
    if (extist) {
      const record = await fs.readFileSync("./token.json", "utf-8");

      if (record) {
        const recordData = await JSON.parse(record);
        oauth2Client.setCredentials({
          access_token: recordData.access_token,
          refresh_token: recordData.refresh_token,
          expiry_date: recordData.expiry_date,
        });
      }
    }
  } catch (error) {
    console.log(error);
    logger.error(`* * * error in setting token :: ${error} * * *`);
  }
};
setToken();

oauth2Client.on("tokens", async (tokens) => {
  const oldRecord = await fs.readFileSync("./token.json", "utf-8");
  const jsonData = JSON.parse(oldRecord);

  logger.verbose(`main ${JSON.stringify(tokens)}`);

  const tokensdata = { ...tokens, refresh_token: jsonData.refresh_token };

  fs.writeFileSync("token.json", JSON.stringify(tokensdata));
  console.log("File written successfully");
});

module.exports = oauth2Client;
