require("module-alias/register");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {
  BASE_URL,
  ENVIRONMENT,
  PORT,
  WELCOME_MESSAGE,
} = require("@config/env.config");
const { logger } = require("@config/logger.config");
const createHttpError = require("http-errors");
const routes = require("@routes/index.routes");
const errorHandler = require("@middlewares/error-handler.middleware");

const app = express();

/**
 * middlewares
 */
app.use(cors());
// app.use((req, res, next) => {
//   console.log(req.originalUrl);
//   if (req.originalUrl === "/stripe/webhook") {
//     next(); // Do nothing with the body because I need it in a raw state.
//   } else {
//     express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
//   }
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(":remote-addr :remote-user :method :url :status - :response-time ms", {
    stream: { write: (message) => logger.http(message) },
  })
);

/**
 * route handling
 */
app.use(routes);

// # catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createHttpError(404));
});

/**
 * error handling
 */
app.use(errorHandler);

/**
 * listening the connection
 */
app
  .listen(PORT, () => {
    logger.info(`* * * ${WELCOME_MESSAGE} * * *`);
    logger.info(`* * * URL :: ${BASE_URL} :: ${ENVIRONMENT} * * *`);
  })
  .on("error", (error) => {
    logger.error(`* * * Server Error * * *`);
    logger.error(error.message);
  });
