
let path = require('path');
const shell = require('shelljs');



// 执行 npm run build 命令
shell.exec('npm run build', function (code, stdout, stderr) {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
  if (code === 0) {
    console.log('打包成功')
    // do something
    addService()
  } else {
    console.log('失败')
  }
});

function addService() {
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

  console.log('svc: ', svc);
  svc.on('install', function () {
    console.log('install: ');
    svc.start();
  });

  svc.install();

}