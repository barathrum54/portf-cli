const { exec } = require('child_process');
const { infoLog } = require('./utils')
const path = require('path');

async function createProject() {
    const repo_url = 'https://github.com/barathrum54/portf';
    const targetDirectory = path.join(process.cwd(), 'portf');

    // Git klonlama komutunu oluşturun
    const gitCloneCommand = `git clone ${repo_url} ${targetDirectory}`;

    // Git klonlama işlemini gerçekleştirin
    exec(gitCloneCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error cloning repository: ${error.message}`);
            return;
        }

        infoLog('Repository cloned successfully.');

        // NPM install komutunu oluşturun
        const npmInstallCommand = 'npm install';

        // NPM install işlemini gerçekleştirin
        exec(npmInstallCommand, { cwd: targetDirectory }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running npm install: ${error.message}`);
                return;
            }

            infoLog('Dependencies installed successfully.');
        });
        infoLog('____________________');
        infoLog('cd portf');
        infoLog('npm run dev');

        process.exit();
    });
}

module.exports = {
    createProject,
};
