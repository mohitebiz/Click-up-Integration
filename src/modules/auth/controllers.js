const path = require("path");
const { JWT_SECRET } = require("../../config/env.config");
const { oauth2Client } = require("../../config/google.config");
const { logger } = require("../../config/logger.config");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const handleAuth = async (req, res) => {
  let token = jwt.sign({ portal: req.query.portal }, JWT_SECRET);
  try {
    const scopes = [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.resource",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.appfolder",
      "https://www.googleapis.com/auth/drive.install",
      "https://www.googleapis.com/auth/presentations",
    ]; // gmail.readonly

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: token,
    });
    logger.verbose("url", authUrl);
    res.redirect(`${authUrl}`);
    // https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger&response_type=code&client_id=522039723682-g7eujkfmma25qtqkht5c467bfir960rd.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauthorize-google%2Fcallback
  } catch (error) {
    console.log("error", error);
    logger.error(`Error in authentication :-${error.message}`);
  }
};

const handleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    let { portal } = jwt.verify(state, JWT_SECRET);
    logger.info(
      "🚀 ~ file: controllers.js:44 ~ handleAuthCallback ~ portal:",
      portal
    );
    logger.verbose(`handle callBack ${JSON.stringify(tokens)}`);
    fs.writeFileSync(
      `src/constant/token-${portal}.json`,
      JSON.stringify(tokens)
    );
    // fs.writeFileSync(`token-${portal}.json`, JSON.stringify(tokens));
    // fs.writeFileSync("token.json", JSON.stringify(tokens));
    console.log("File written successfully");
    res.send({ message: "Success" });
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { handleAuthCallback, handleAuth };
