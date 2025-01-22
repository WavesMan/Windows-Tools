const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            nodeIntegration: true, // 允许在渲染进程中使用 Node.js
            contextIsolation: false // 禁用上下文隔离
        }
    });

    win.loadFile('index.html'); // 加载 HTML 文件
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 监听前端事件
const { ipcMain } = require('electron');
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows 自动更新管理
    // 禁用 Windows 自动更新
    ipcMain.on('disable-updates', (event) => {
        exec('python ./asset/resources/python/windows-update/disable-windows-update.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-updates-output', 'Error: ' + stderr);
            } else {
                event.reply('disable-updates-output', stdout);
            }
        });
    });

    // 启用 Windows 自动更新
    ipcMain.on('enable-updates', (event) => {
        exec('python ./asset/resources/python/windows-update/enable-windows-update.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-updates-output', 'Error: ' + stderr);
            } else {
                event.reply('enable-updates-output', stdout);
            }
        });
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows Defender 管理
    // 禁用 Windows Defender
    ipcMain.on('disable-defender', (event) => {
        exec('python ./asset/resources/python/windows-defender/disable-windows-defender.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-defender-output', 'Error: ' + stderr);
            } else {
                event.reply('disable-defender-output', stdout);                
            }
        });
    });

    // 启用 Windows Defender
    ipcMain.on('enable-defender', (event) => {
        exec('python ./asset/resources/python/windows-defender/enable-windows-defender.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-defender-output', 'Error: ' + stderr);
            } else {
                event.reply('enable-defender-output', stdout);                
            }
        });
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows OneDrive 管理
    // 禁用 Windows OneDrive
    ipcMain.on('disable-onedrive', (event) => {
        exec('python ./asset/resources/python/windows-onedrive/disable-windows-onedrive.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-onedrive-output', 'Error: ' + stderr);
            } else {
                event.reply('disable-onedrive-output', stdout);                
            }
        });
    });

    // 启用 Windows OneDrive
    ipcMain.on('enable-onedrive', (event) => {
        exec('python ./asset/resources/python/windows-onedrive/enable-windows-onedrive.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-onedrive-output', 'Error: ' + stderr);
            } else {
                event.reply('enable-onedrive-output', stdout);                
            }
        });
    });

