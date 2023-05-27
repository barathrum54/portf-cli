const { execSync } = require('child_process');
const net = require('net');

/**
 * Renkli console log yazdıran yardımcı fonksiyon
 * @param {string} message - Yazılacak mesaj
 * @param {string} [textColor='\x1b[37m'] - Mesajın metin rengi kodu (varsayılan: beyaz)
 * @param {string} [arrowColor='\x1b[31m'] - `>` işaretinin rengi kodu (varsayılan: kırmızı)
 */
function infoLog(message, textColor = '\x1b[37m', arrowColor = '\x1b[31m') {
    console.log(arrowColor + '>', textColor + message, '\x1b[0m');
}

/**
 * Belirli bir URL'yi varsayılan tarayıcıda açmak için bir fonksiyon
 * @param {string} url - Açılacak URL
 */
function openBrowser(url) {
    let command;
    const platform = process.platform;
    switch (platform) {
        case 'darwin':
            command = `open ${url}`;
            break;
        case 'win32':
            command = `start ${url}`;
            break;
        default:
            command = `xdg-open ${url}`;
            break;
    }
    execSync(command, { stdio: 'inherit' });
    infoLog('Opening browser:' + url);
}

/**
 * Boş bir port bulan fonksiyon
 * @param {number} startPort - Başlangıç portu
 * @returns {Promise<number>} - Boş port numarası
 */
function findEmptyPort(startPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                resolve(findEmptyPort(startPort + 1));
            } else {
                reject(error);
            }
        });

        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => {
                infoLog('Empty port found:' + port);
                resolve(port);
            });
        });
        infoLog('Finding empty port...');
    });
}

module.exports = {
    openBrowser,
    findEmptyPort,
    infoLog
};
