#!/usr/bin/env node

import program from "commander";

program
  .command('create', 'Creates project templates', {executableFile: 'create'});

program.parse(process.argv);
