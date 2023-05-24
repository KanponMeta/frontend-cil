import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * 通过 fs.readdirSync() 遍历目录下的所有文件，所有操作都在循环中进行。
 * 然后判断如果是 git 文件则跳过本次处理。
 * 然后获取遍历项的绝对目录，判断该项是文件还是目录，是文件则更改为 ts 文件，如果是目录则递归调用 preOrderDirectoryTraverse 函数处理子目录下的文件。
 */
export function preOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git') {
      continue
    }
    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      dirCallback(fullpath)
      // in case the dirCallback removes the directory entirely
      if (fs.existsSync(fullpath)) {
        preOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      }
      continue
    }
    fileCallback(fullpath)
  }
}

/**
 *
 *通过 fs.readdirSync() 遍历目录下的所有文件，所有操作都在循环中进行。
 * 然后判断如果是 git 文件则跳过本次处理。
 * 然后获取遍历项的绝对目录，判断该项是文件还是目录，是文件则删除文件，如果是目录则采用深度优先将逐级删除。
 * @param dirCallback
 * @param fileCallback
 */
export function postOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  // fs.readdirSync(): 读取该目录下的所有文件及目录
  for (const filename of fs.readdirSync(dir)) {
    // .git 文件跳过
    if (filename === '.git') {
      continue
    }
    const fullpath = path.resolve(dir, filename)
    // fs.lstatSync(): 返回文件或者目录的信息
    // fs.lstatSync().isDirectory(): 判断是否是目录，是则 true， false
    if (fs.lstatSync(fullpath).isDirectory()) {
      // 对于目录的操作: 递归调用
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      // 删除该目录，fs.rmdirSync() 只能删除一个空文件夹，所以上边先递归，删除最底层的文件夹
      dirCallback(fullpath)
      continue
    }
    // 是文件则删除文件
    fileCallback(fullpath)
  }
}
