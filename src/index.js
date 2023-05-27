#!/usr/bin/env node
const { findEmptyPort, openBrowser, infoLog } = require('./utils');
const startServer = require('./server/server');
const DEFAULT_PORT = 3000;

async function run() {
    try {
        console.log('\x1b[41;37m%s\x1b[0m', 'PORTF');

        let port = await findEmptyPort(DEFAULT_PORT);
        startServer(port, openBrowser);
        infoLog('Portf UI is running on your browser.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

run();
