#!/usr/bin/env node
import { program } from 'commander'
import { create } from './command/create.js'
import { generate } from './command/generate.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const pkgMainPath = fileURLToPath(import.meta.url)
const pkgPath = dirname(pkgMainPath)
const pkg = JSON.parse(readFileSync(`${pkgPath}/package.json`, 'utf-8'))
program
  .name('vml')
  .description('专注于Vue的微前端模块生成器')
  .option('-h, --help', '查看帮助')
  .version(pkg.version, '-v, --version', '查看版本号')
program
  .command('create')
  .alias('c')
  .description('创建一个新项目')
  .argument('[projectName]', '项目名称。', 'vue-module')
  .action(create)
program
  .command('generate')
  .alias('g')
  .description('生成模板文件。')
  .argument('<moduleName>', '模块名称，支持相对路径方式。')
  .option('-t, --type <stype>', '模块类型，可选app或module，默认为app', 'app')
  .option('-s, --source [source]', '自定义的模板源地址')
  .action(generate)
program.parseAsync()
