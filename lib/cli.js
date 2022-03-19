#!/usr/bin/env node
"use strict";
const meow = require("meow");
const npack = require("./index.js");
const configs = require("../config");

const cli = meow(`
Usage
  $ npack

Inputs
  config

Options
  --error  Shows stderr from command [Default: false]
  --help   Shows help commands

Examples
  $ npack [hello world [--error, --help]]
`);

npack(cli, configs);
