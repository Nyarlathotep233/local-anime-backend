let path = require('path');

let Service = require('node-windows').Service;

let svc = new Service({
  name: 'api server', // 服务名称
  description: 'api server', // 服务描述
  script: path.resolve('.\\dist\\main.js'),// 项目入口文件
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('uninstall', function () {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

svc.uninstall();