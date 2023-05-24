const devConfig = {
  ip: '150.158.82.12',
  port: '22',
  username: 'root',
  password: '******',
  remotePath: '/data/wwwroot/www.kanpon.com/vue/dataportal'
}
const prodConfig = {
  ip: '192.168.1.xx',
  port: '22',
  username: 'huolala',
  password: '123456',
  remotePath: '/home/huolala/dist'
}
module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig
}
