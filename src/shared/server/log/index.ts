import pino from "pino";

export const log = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      prettyPrint: true,
    },
  },
  formatters: {
    level: (label) => {
      return {
        level: label,
      };
    },
  },
});
