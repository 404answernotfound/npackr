#!/usr/bin/env node
"use strict";
const meow = require("meow");
const npack = require("./index.js");
const configs = require("../config");

const cli = meow(`
Usage
  $ npackr
  $ # Defaults to --read --explain

Inputs
  config

Options
  --read  Shows commands
  --help   Shows help commands
  --explain Shows commands explanation

Examples
  $ npackr [--read, [--explain]]
`);

npack(cli, configs);
