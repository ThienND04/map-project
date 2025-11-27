const app = require("./app");
const logger = require("./config/logger");

const PORT = 4000;

let server = app.listen(PORT, () => {
    logger.info(`Listening to port ${PORT}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
