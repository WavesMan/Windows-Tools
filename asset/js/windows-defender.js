const { ipcRenderer } = require('electron');

// 获取按钮和输出元素
const disabledefenderButton = document.getElementById('disable-defender');
const enabledefenderButton = document.getElementById('enable-defender');
const outputElement = document.getElementById('output');

// 绑定“禁用”按钮点击事件
disabledefenderButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('disable-defender');
});

// 绑定“启用”按钮点击事件
enabledefenderButton.addEventListener('click', function() {
    // 发送事件到主进程
    ipcRenderer.send('enable-defender');
});

// 监听“禁用”操作的输出
ipcRenderer.on('disable-defender-output', (event, data) => {
    outputElement.innerText = data;
});

// 监听“启用”操作的输出
ipcRenderer.on('enable-defender-output', (event, data) => {
    outputElement.innerText = data;
});