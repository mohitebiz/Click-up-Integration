const express = require("express");
const { WELCOME_MESSAGE } = require("@config/env.config");
const generalResponse = require("@middlewares/general-response.middleware");
const clickupRouter = require("../modules/clickup/routes");
const slideRouter = require("../modules/slide/routes");
const {
  handleAuth,
  handleAuthCallback,
} = require("../modules/auth/controllers");
const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    return generalResponse({ response, message: WELCOME_MESSAGE });
  } catch (error) {
    next(error);
  }
});
router.get(`/googleAuth`, handleAuth);

router.get(`/authorize/google-callback`, handleAuthCallback);

router.use("/clickup", clickupRouter);
router.use("/slide", slideRouter);

module.exports = router;
