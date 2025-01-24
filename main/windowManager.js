const { BrowserWindow, Menu } = require('electron');

function createMainWindow() {
  let mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false, // 禁用开发者工具
    },
    show: true, // 确保窗口默认显示
  });

  mainWindow.loadFile('index.html'); // 确保加载的 HTML 文件路径正确

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 移除菜单栏
  Menu.setApplicationMenu(null);

  // 禁用右键菜单
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  return mainWindow; // 返回创建的窗口对象
}

module.exports = { createMainWindow };