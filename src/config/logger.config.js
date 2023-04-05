const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, printf, colorize, json } = format;

const customPrint = printf(({ level, message, timestamp }) => {
  return `[${level}] [${timestamp}] ${message}`;
});

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

const logger = createLogger({
  levels: customLevels,
  format: combine(
    timestamp({
      format: "YY-MM-DD HH:mm:ss",
    }),
    json()
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(
        colorize({
          colors: {
            error: "red",
            warn: "yellow",
            info: "green",
            http: "cyan",
            verbose: "blue",
            debug: "grey",
          },
        }),
        timestamp({
          format: "YY-MM-DD HH:mm:ss",
        }),
        customPrint
      ),
    }),
    new DailyRotateFile({
      filename: "src/logs/debug/debug.%DATE%.log",
      datePattern: "DD-MM-YYYY",
      zippedArchive: true,
      maxSize: "35m",
      maxFiles: "14d",
      level: "debug",
    }),
    new DailyRotateFile({
      filename: "src/logs/error/error.%DATE%.log",
      datePattern: "DD-MM-YYYY",
      zippedArchive: true,
      maxSize: "35m",
      maxFiles: "14d",
      level: "error",
    }),
  ],
});

module.exports = { logger };
