const { join } = require('path');
const fs = require('fs');
const { infoLog } = require('../utils');
const { createProject } = require('../cli');

const LAYOUT_FILE_PATH = join(__dirname, '../views/layout.html');
const INDEX_FILE_PATH = join(__dirname, '../views/landing.html');
const LOGO_FILE_PATH = join(__dirname, '../assets/logo.png');
const FAVICON_PATH = join(__dirname, '../assets/favicon.ico');
const DETAIL_FILE_PATH = join(__dirname, '../views/details.html');
const CONFIG_FILE_PATH = join(__dirname, '../temp/config.temp.json');
const FORM_JSON_PATH = join(__dirname, '../lib/form.json');

function routes(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        const layoutStream = fs.createReadStream(LAYOUT_FILE_PATH);
        const indexFileStream = fs.createReadStream(INDEX_FILE_PATH);

        layoutStream.pipe(res);

        indexFileStream.on('data', (chunk) => {
            res.write(chunk);
        });

        indexFileStream.on('end', () => {
            res.end();
        });
    } else if (req.method === 'GET' && req.url === '/logo.png') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        const fileStream = fs.createReadStream(LOGO_FILE_PATH);
        fileStream.pipe(res);
    } else if (req.method === 'GET' && req.url === '/favicon.ico') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        const fileStream = fs.createReadStream(FAVICON_PATH);
        fileStream.pipe(res);
    } else if (req.method === 'GET' && req.url === '/form.json') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const fileStream = fs.createReadStream(FORM_JSON_PATH);
        fileStream.pipe(res);
    } else if (req.method === 'GET' && req.url === '/details') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        const layoutStream = fs.createReadStream(LAYOUT_FILE_PATH);
        const detailsFileStream = fs.createReadStream(DETAIL_FILE_PATH);

        layoutStream.pipe(res);

        detailsFileStream.on('data', (chunk) => {
            res.write(chunk);
        });

        detailsFileStream.on('end', () => {
            res.end();
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });
        req.on('end', () => {
            createProject()
                .then(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'ok' }));
                    infoLog('Form submitted!');
                    infoLog('Config file created:', CONFIG_FILE_PATH);
                })
                .catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'error', message: error.message }));
                    console.error('Error creating project:', error);
                });
        });
    } else if (req.method === 'GET' && req.url === '/config') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        try {
            if (fs.existsSync(CONFIG_FILE_PATH)) {
                const fileData = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
                res.end(fileData);
                infoLog('Config file sent: ' + CONFIG_FILE_PATH);
            } else {
                res.end('{}'); // Boş bir JSON nesnesi döndür
                infoLog('Config file does not exist');
            }
        } catch (error) {
            console.error('Error reading config file:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
}

module.exports = routes;
