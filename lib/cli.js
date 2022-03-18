#!/usr/bin/env node
'use strict';
const meow = require('meow');
const npack = require('./index.js');

const cli = meow(`
Usage
  $ npack

Options
  --error  Shows stderr from command [Default: false]
  --help   Shows help commands

Examples
  $ npack [--error, --help]
`);

npack(cli)