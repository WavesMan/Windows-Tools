const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow } = require('./windowManager'); // 导入 createMainWindow 函数
const PythonScript = require('./pythonscript'); // 导入 PythonScript 类
const { getPythonDirPath } = require('./path.to.python'); // 导入 getPythonDirPath 函数

// 获取 Python 目录路径
const pythonDirPath = getPythonDirPath();

// 初始化 PythonScript，并传入 Python 目录路径
const pythonScript = new PythonScript(pythonDirPath);

// 设置环境变量
process.env.NODE_OPTIONS = '--max-old-space-size=8192'; // 可选，增加内存限制
process.env.NODE_ENV = 'development'; // 设置环境变量
process.env.LANG = 'en_US.UTF-8'; // 设置语言环境为 UTF-8

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error);
});

app.whenReady().then(() => {
  console.log('Electron 已准备好！');
  const mainWindow = createMainWindow(); // 创建主窗口
  if (!mainWindow) {
    console.error('主窗口创建失败！');
  } else {
    console.log('主窗口创建成功！');
  }

  // 设置 IPC 事件监听
  ipcMain.on('disable-updates', (event) => pythonScript.disableUpdates(event));
  ipcMain.on('enable-updates', (event) => pythonScript.enableUpdates(event));
  ipcMain.on('disable-defender', (event) => pythonScript.disableDefender(event));
  ipcMain.on('enable-defender', (event) => pythonScript.enableDefender(event));
  ipcMain.on('disable-onedrive', (event) => pythonScript.disableOneDrive(event));
  ipcMain.on('enable-onedrive', (event) => pythonScript.enableOneDrive(event));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow(); // 重新创建窗口
  }
});