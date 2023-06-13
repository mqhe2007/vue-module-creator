#!/usr/bin/env node
import { program } from 'commander'
import { create } from '../command/create.js'
import { generate } from '../command/generate.js'
program.name('vml').description('专注于Vue的微前端模块生成器').version('2.0.0')
program
  .command('create')
  .description('创建一个新项目')
  .argument('[projectName]', '项目名称。', 'vue-module')
  .action(create)
program
  .command('g')
  .description('g是generate的简写，代表生成命令。')
  .argument('<moduleName>', '模块名称，支持相对路径方式。')
  .option('-t, --type <stype>', '模块类型，可选app或module，默认为app', 'app')
  .action(generate)
program.parseAsync()
