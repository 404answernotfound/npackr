const fs = require('fs/promises')
const process = require('process')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const path = require('path')
const inquirer = require('inquirer');

module.exports = (cli) => {
    const currentDirectory = process.cwd()

    fs.readdir(currentDirectory)
        .then((artifacts) => {
            const foundPackageJson = artifacts.filter((artifact) => {
                return artifact === 'package.json'
            })
            if(foundPackageJson !== [] && foundPackageJson.length === 1){
                fs.readFile(path.resolve(process.cwd(), 'package.json'))
                    .then((file) => {

                        const parsed = JSON.parse(file)
                        const commands = Object.keys(parsed.scripts).map((script) => {
                            return script
                        })
                        // command reader
                        if(cli.flags.read === true){
                            console.log('Commands in package.json')
                            console.log(commands)
                            return
                        }

                        // command runner
                        inquirer
                        .prompt([
                            {
                              type: 'list',
                              name: 'npack',
                              message: 'Which command would you like to run? (--read for only reading the commands)',
                              // package.json commands found
                              choices: [
                                new inquirer.Separator(),
                                ...commands,
                                new inquirer.Separator(),
                                'Go to https://404answernotfound.eu if you want to discuss this package',
                              ],
                            }
                          ])
                            .then((answers) => {
                                const spawnedProcess = spawn(`npm`, [`run`, answers.npack])
                                spawnedProcess.stdout.on('data', function (data) {
                                    console.log('stdout: ' + data.toString());
                                });
                                if(cli.flags.error === true){
                                    spawnedProcess.stderr.on('data', function (data) {
                                        console.log('stderr: ' + data.toString());
                                    });
                                    spawnedProcess.on('exit', function (code) {
                                        console.log('child process exited with code ' + code.toString());
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                                return
                            });
                    }).catch((err) => {
                        throw new Error('Error while reading file')
                    })
            }
        }).catch(err => {
            throw new Error('cwd not read')
        })
    return
}