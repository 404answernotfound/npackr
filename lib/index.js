const fs = require("fs/promises");
const process = require("process");
const spawn = require("child_process").spawn;
const path = require("path");
const inquirer = require("inquirer");
const entryFiles = require("../config/entryFiles.js");

module.exports = (cli, configs) => {
  const currentDirectory = process.cwd();
  const flow = cli.input;

  switch (flow[0]) {
    case undefined:
      fs.readdir(currentDirectory)
        .then((artifacts) => {
          const foundPackageJson = artifacts.filter((artifact) => {
            return artifact === configs.default.entryFile;
          });
          if (foundPackageJson !== [] && foundPackageJson.length === 1) {
            fs.readFile(path.resolve(process.cwd(), "package.json"))
              .then((file) => {
                const parsed = JSON.parse(file);
                const commands = Object.keys(
                  parsed[configs.default.entryCommand]
                ).map((script) => {
                  return script;
                });
                // command reader
                if (!cli.flags.read && !cli.flags.explain) {
                  console.log(`Commands in ${configs.default.entryFile}\n`);
                  for (command in commands) {
                    console.log(
                      `${commands[command]} - ${
                        parsed[configs.default.entryCommand][commands[command]]
                      }`
                    );
                  }
                  return;
                }

                if (cli.flags.read === true && !cli.flags.explain) {
                  console.log(`Commands in ${configs.default.entryFile}\n`);
                  for (command in commands) {
                    console.log(`${commands[command]}`);
                  }
                  return;
                }

                if (cli.flags.read === true && cli.flags.explain === true) {
                  console.log(`Commands in ${configs.default.entryFile}\n`);
                  for (command in commands) {
                    console.log(
                      `${commands[command]} - ${
                        parsed[configs.default.entryCommand][commands[command]]
                      }`
                    );
                  }
                  return;
                }

                // command runner
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "npackr",
                      message:
                        "Which command would you like to run? (--read for only reading the commands)",
                      // package.json commands found
                      choices: [
                        new inquirer.Separator(),
                        ...commands,
                        new inquirer.Separator(),
                        "Go to https://404answernotfound.eu if you want to discuss this package",
                      ],
                    },
                  ])
                  .then((answers) => {
                    const spawnedProcess = spawn(`npm`, [
                      `run`,
                      answers.npackr,
                    ]);
                    spawnedProcess.stdout.on("data", function (data) {
                      console.log("stdout: " + data.toString());
                    });
                    if (cli.flags.error === true) {
                      spawnedProcess.stderr.on("data", function (data) {
                        console.log("stderr: " + data.toString());
                      });
                      spawnedProcess.on("exit", function (code) {
                        console.log(
                          "child process exited with code " + code.toString()
                        );
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    return;
                  });
              })
              .catch((err) => {
                throw new Error("Error while reading file", err);
              });
          }
        })
        .catch((err) => {
          throw new Error("cwd not read", err);
        });
      return;
      break;
    case "config":
      const commands = entryFiles;
      inquirer
        .prompt([
          {
            type: "list",
            name: "npackr_config",
            message:
              "The default configuration for this package is defaults to `package.json`. Would you like other files to be read?\n",
            default: "package.json",
            choices: [
              new inquirer.Separator(),
              ...commands,
              new inquirer.Separator(),
              "Go to https://404answernotfound.eu if you want to discuss this package",
            ],
          },
          {
            type: "input",
            name: "npackr_config_name",
            message:
              "The default configuration for this package is defaults to `scripts`. If you want to change it, write it:\n",
            default: "scripts",
          },
        ])
        .then((answers) => {
          const _configuration = {
            default: {
              entryFile: answers.npackr_config,
              entryCommand: answers.npackr_config_name,
            },
          };

          fs.writeFile(
            path.resolve(process.cwd(), "config", "generatedByUser.json"),
            JSON.stringify(_configuration),
            { flags: "w+" }
          )
            .then((file) => {
              console.log(
                "Configuration was successful. Rerun the script with `npackr [--flags]` to use it"
              );
            })
            .catch((error) => {
              console.log(error);
              return;
            });
        })
        .catch((error) => {
          console.log(error);
          return;
        });
      break;
    default:
      console.log("default");
      break;
  }
};
