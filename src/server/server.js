const http = require('http');
const routes = require('./routes');
const { infoLog } = require('../utils');

function startServer(PORT, openBrowser) {
    const server = http.createServer((req, res) => {
        routes(req, res);
    });

    server.listen(PORT, () => {
        const url = `http://localhost:${PORT}`;
        openBrowser(url);
        infoLog(`Server started on port ${PORT}`);
    });
}

module.exports = startServer;
