const express = require("express");
const { WELCOME_MESSAGE } = require("@config/env.config");
const generalResponse = require("@middlewares/general-response.middleware");
const clickupRouter = require("../modules/clickup/routes");
const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    return generalResponse({ response, message: WELCOME_MESSAGE });
  } catch (error) {
    next(error);
  }
});

router.use("/clickup", clickupRouter);

module.exports = router;
