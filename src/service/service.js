'use strict';

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`./constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

const hasUserArguments = userArguments.length !== 0;
const hasUserCommand = !!Cli[userCommand];

if (!hasUserArguments || !hasUserCommand) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.OK);
}

Cli[userCommand].run(userArguments.slice(1));
