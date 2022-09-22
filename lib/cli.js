#!/usr/bin/env node
"use strict";
const meow = require("meow");
const npack = require("./index.js");
const configs = require("../config");

const cli = meow(`
Usage
  $ npackr

Inputs
  config

Options
  --read  Shows stderr from command [Default: false]
  --read   Shows help commands

Examples
  $ npackr [--read, --read]
`);

npack(cli, configs);
