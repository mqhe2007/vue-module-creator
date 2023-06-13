#!/usr/bin/env node
import { program } from 'commander'
import { create } from '../command/create.js'
import { generate } from '../command/generate.js'
program.name('vml').description('专注于Vue的微前端模块生成器').version('2.0.0')
program.command('create').description('创建一个新项目').action(create)
program
  .command('g')
  .description('g是generate的简写，代表生成命令，当前仅支持生成模块。')
  .argument('<moduleName>', '模块名称，支持相对路径方式。')
  .action(generate)
if (!process.argv.slice(2).length) {
  program.help()
}
program.parse(process.argv)
