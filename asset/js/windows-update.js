const { ipcRenderer } = require('electron');

const { exec } = require('child_process');
const path = require('path');
const { app } = require('electron');

// 获取 Python 解释器的路径
const pythonExecutablePath = path.join(
  process.resourcesPath, // 打包后的资源目录
  'python',
  'python.exe' // Windows 上的 Python 解释器
);

// 获取 Python 脚本的路径
const pythonScriptPath = path.join(
  process.resourcesPath, // 打包后的资源目录
  'python',
  'windows-defender',
  'disable-windows-defender.py' // Python 脚本
);

// 调用 Python 解释器执行脚本
exec(`"${pythonExecutablePath}" "${pythonScriptPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});

// 获取按钮和输出元素
const disableUpdatesButton = document.getElementById('disable-updates');
const enableUpdatesButton = document.getElementById('enable-updates');
const outputElement = document.getElementById('output');

// 绑定“禁用”按钮点击事件
disableUpdatesButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('disable-updates');
});

// 绑定“启用”按钮点击事件
enableUpdatesButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('enable-updates');
});

// 监听“禁用”操作的输出
ipcRenderer.on('disable-updates-output', (event, data) => {
    outputElement.innerText = data;
});

// 监听“启用”操作的输出
ipcRenderer.on('enable-updates-output', (event, data) => {
    outputElement.innerText = data;
});