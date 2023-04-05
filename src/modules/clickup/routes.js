const express = require("express");
const {
  workSpaceData,
  spacesData,
  folderData,
  listData,
  taskData,
  userData,
  statusData,
} = require("./controllers");
const clickupRouter = express.Router();

// stripeRouter.post("/webhook", async (request, response, next) => {
//   try {
//     return generalResponse({ response, message: WELCOME_MESSAGE });
//   } catch (error) {
//     next(error);
//   }
// });
clickupRouter.post("/workSpace", workSpaceData);
clickupRouter.post("/space", spacesData);
clickupRouter.post("/space/status", statusData);
clickupRouter.post("/folder", folderData);
clickupRouter.post("/list", listData);
clickupRouter.post("/createTask", taskData);
clickupRouter.post("/users", userData);

module.exports = clickupRouter;
