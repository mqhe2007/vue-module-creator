import fs from 'fs'
import ora from 'ora'
import chalk from 'chalk'
import axios from 'axios'
import { TextWriter, ZipReader } from '@zip.js/zip.js'
import { Blob } from 'buffer'
import {resolve} from 'path'
export const generate = async (moduleName) => {
  // 判断工作目录中是否存在当前目录
  const modulePath = resolve(process.cwd(), moduleName)
  console.log(modulePath);
  if (fs.existsSync(modulePath)) {
    console.log(chalk.red('当前模块目录已存在，请修改模块名称后重试！'))
    return
  }
  const spinner = ora().start()
  try {
    // 下载模板
    spinner.text = '开始下载模块模板...'
    const res = await axios.get(
      'https://github.com/mqhe2007/vue-module-module/archive/refs/heads/2.0.zip',
      {
        responseType: 'arraybuffer',
      }
    )
    const readableStream = new Blob([res.data]).stream()
    const zipReader = new ZipReader(readableStream)
    const entries = await zipReader.getEntries()
    const pattern = /\/src(\/.+)/
    entries.forEach(async (entry) => {
      if (pattern.test(entry.filename)) {
        const entryName = entry.filename.match(pattern)[1]
        if (entry.directory) {
          fs.mkdirSync(modulePath + entryName, { recursive: true })
        } else {
          const textWriter = new TextWriter('utf-8')
          await entry.getData(textWriter)
          const string = await textWriter.getData()
          fs.writeFileSync(modulePath + entryName, string)
        }
      }
    })
    zipReader.close()
    spinner.succeed('模块创建成功！')
  } catch (error) {
    spinner.fail('下载模块模板出错!')
    console.log(error)
  }
}
