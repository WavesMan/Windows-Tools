const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow } = require('./windowManager'); // 导入 createMainWindow 函数
const PythonScript = require('./pythonscript'); // 导入 PythonScript 类
const { initializePythonInstallation } = require('./pythonInstaller'); // 导入 Python 安装逻辑

// 初始化应用
async function initializeApp() {
  // 初始化 Python 安装逻辑
  const pythonInstalled = await initializePythonInstallation();
  if (!pythonInstalled) {
    app.quit(); // 如果 Python 未安装或安装失败，退出应用
    return;
  }

  // Python 安装完成后，继续初始化应用
  const mainWindow = createMainWindow();
  if (!mainWindow) {
    console.error('主窗口创建失败！');
  } else {
    console.log('主窗口创建成功！');
  }

  // 设置 IPC 事件监听
  const pythonScript = new PythonScript();
  ipcMain.on('disable-updates', (event) => pythonScript.disableUpdates(event));
  ipcMain.on('enable-updates', (event) => pythonScript.enableUpdates(event));
  ipcMain.on('disable-defender', (event) => pythonScript.disableDefender(event));
  ipcMain.on('enable-defender', (event) => pythonScript.enableDefender(event));
  ipcMain.on('disable-onedrive', (event) => pythonScript.disableOneDrive(event));
  ipcMain.on('enable-onedrive', (event) => pythonScript.enableOneDrive(event));
}

// 应用启动
app.whenReady().then(() => {
  console.log('Electron 已准备好！');
  initializeApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initializeApp();
  }
});

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error);
});