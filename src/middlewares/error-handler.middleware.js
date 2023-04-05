const { logger } = require("@config/logger.config");
const generalResponse = require("@middlewares/general-response.middleware");

const errorHandler = (error, request, response, next) => {
  try {
    logger.error(
      `${JSON.stringify({
        request: request.originalUrl,
        code: error.code,
        status: error.status,
        message: error.message,
        errno: error.errno,
        stack: error.stack,
      })}`
    );
    logger.error(`ERROR MESSAGE :>>  ${error.toString()}`);
    const statusCode = error.status || 500;
    const message = error.message || "Something went wrong";
    return generalResponse({
      response,
      message,
      statusCode,
      responseType: "error",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = errorHandler;
