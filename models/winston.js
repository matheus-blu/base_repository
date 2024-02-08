const winston = require("winston");

const root_folder = "..//logs"

const updateSuccessLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/updateSuccessLog.log`,
      level: "info",
    }),
  ],
});

const updateErrorLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/updateErrorLog.log`,
      level: "error",
    }),
  ],
});

const createSuccessLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/createSuccessLog.log`,
      level: "info",
    }),
  ],
});

const createErrorLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/createErrorLog.log`,
      level: "error",
    }),
  ],
});

const deleteSuccessLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/deleteSuccessLog.log`,
      level: "info",
    }),
  ],
});

const deleteErrorLog = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${root_folder}/deleteErrorLog.log`,
      level: "error",
    }),
  ],
});

module.exports = {
  updateSuccessLog,
  updateErrorLog,
  createSuccessLog,
  createErrorLog,
  deleteSuccessLog,
  deleteErrorLog
};
