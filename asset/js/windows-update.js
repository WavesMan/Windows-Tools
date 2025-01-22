const { ipcRenderer } = require('electron');

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