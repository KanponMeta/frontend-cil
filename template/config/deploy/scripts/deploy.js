const { devConfig, prodConfig } = require('./deployConfig')
const shell = require('shelljs')
const path = require('path')
const Client = require('ssh2-sftp-client')
// 打包 npm run build
const compileDist = async () => {
  if (shell.exec(`pnpm build`).code === 0) {
    console.log('打包成功')
  }
}

async function connectSSh() {
  const args = process.argv.slice(2)
  let config = {}
  if (args[0]=='dev') {
    config = devConfig
  } else if (args[0] == 'prod') {
    config = prodConfig
  }
  const sftp = new Client()
  sftp
    .connect({
      host: config?.ip, // 服务器 IP
      port: config?.port,
      username: config?.username,
      password: config?.password
    })
    .then(() => {
      return sftp.exists(config?.remotePath)
    })
    .then((data) => {
      if (data) {
        console.log('先执行删除服务器文件')
      return sftp.rmdir(config?.remotePath, true)
      }
    })
    .then(() => {
      // 上传文件
      console.log('删除成功，开始上传')
      return sftp.uploadDir(path.resolve(__dirname, '../dist'), config?.remotePath)
    })
    .then(() => {
      console.log('上传完成,开始拷贝至运行目录')
    })
    .catch((err) => {
      console.log(err, '失败')
    })
    .finally(() => {
      sftp.end()
    })
}
async function runTask() {
  await compileDist() // 打包完成
  await connectSSh() // 提交上传至个人目录
}
runTask()
