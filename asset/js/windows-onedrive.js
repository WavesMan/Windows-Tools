const { ipcRenderer } = require('electron');

// 获取按钮和输出元素
const disableonedriveButton = document.getElementById('disable-onedrive');
const enableonedriveButton = document.getElementById('enable-onedrive');
const outputElement = document.getElementById('output');

// 绑定“禁用”按钮点击事件
disableonedriveButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('disable-onedrive');
});

// 绑定“启用”按钮点击事件
enableonedriveButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('enable-onedrive');
});

// 监听“禁用”操作的输出
ipcRenderer.on('disable-onedrive-output', (event, data) => {
    outputElement.innerText = data;
});

// 监听“启用”操作的输出
ipcRenderer.on('enable-onedrive-output', (event, data) => {
    outputElement.innerText = data;
});