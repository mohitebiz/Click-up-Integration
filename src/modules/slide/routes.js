const express = require("express");
const { createSlide } = require("./controllers");

const slideRouter = express.Router();

slideRouter.post("/createSlide", createSlide);

module.exports = slideRouter;
