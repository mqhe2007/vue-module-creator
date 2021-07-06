const fs = require('fs')
const program = require('commander')
const inquirer = require('inquirer')
const ora = require('ora')
const download = require('download-git-repo')
const chalk = require('chalk')
const nameOption = program.parse(process.argv).args[0]
const defaultName = 'vue-module'
const repositories = {
  vue2: 'mqhe2007/vue-module',
  vue3: {
    frame: 'mqhe2007/vue-module-frame#main',
    module: 'mqhe2007/vue-module-module#main',
  },
}
const loading = ora('模板下载中，请稍后……')
/**
 * @type {import('inquirer').QuestionCollection}
 */
const questions = [
  {
    type: 'list',
    name: 'version',
    message: '选择适用于vue的版本',
    choices: ['vue2', 'vue3'],
  },
  {
    when: (value) => {
      return value.version === 'vue3'
    },
    type: 'list',
    name: 'project',
    message: '选择要创建的项目',
    choices: ['frame-主框架', 'module-模块'],
  },
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
    default: typeof nameOption === 'string' ? nameOption : defaultName,
    filter: (value) => value.trim(),
    validate: (value) => {
      const validate = value.trim().split(' ').length === 1
      return validate || '项目名称不允许有空格！'
    },
    transformer: (value) => `：${value}`,
  },
  {
    type: 'input',
    name: 'description',
    message: '项目描述',
    default: 'a admincraft project',
    validate: () => {
      return true
    },
    transformer: (value) => `：${value}`,
  },
  {
    type: 'input',
    name: 'author',
    message: '项目作者',
    default: 'unnamed',
    validate(val) {
      return true
    },
    transformer: (value) => `：${value}`,
  },
]
module.exports = inquirer
  .prompt(questions)
  .then(({ version, project, name, description, author }) => {
    loading.start()
    let templateRepository = repositories[version]
    if (version === 'vue3') {
      templateRepository = repositories[version][project.split('-')[0]]
    }
    download(templateRepository, `./${name}`, (err) => {
      if (err) {
        loading.fail('模板下载失败！')
        console.log(chalk.red(err))
        process.exit()
      } else {
        fs.readFile(`./${name}/package.json`, 'utf8', (err, data) => {
          if (err) {
            console.log(chalk.red(err))
            process.exit()
          }
          const packageJson = JSON.parse(data)
          packageJson.name = name
          packageJson.description = description
          packageJson.author = author
          packageString = JSON.stringify(packageJson, null, 2)
          fs.writeFile(
            `./${name}/package.json`,
            packageString,
            'utf8',
            (err) => {
              if (err) {
                console.log(chalk.red(err))
                process.exit()
              }
              loading.succeed('模板准备就绪！请进一步操作。')
              console.log(`
            ${chalk.bgWhite.black('  进一步操作  ')}
            ${chalk.yellow(`cd ${name}`)}
            ${chalk.yellow('yarn 或 npm install')}
            ${chalk.yellow('yarn serve 或 npm run serve')}
          `)
            }
          )
        })
      }
    })
  })
