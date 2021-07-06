#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const resolveCommand = (command) =>
  path.resolve(__dirname, '../command', command)
program.version(require('../package.json').version)
program
  .command('create')
  .description('创建一个新项目')
  .action(() => {
    require(resolveCommand('create'))
  })
if (!process.argv.slice(2).length) {
  program.help()
}
program.parse(process.argv)
