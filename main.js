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
const { dialog } = require('electron');

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////开发环境中python脚本被标注为"./asset/resources**"起步////////////////////////
//////////////////////封包后需要修改"./asset/resources**"--"resources/resources/**"/////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows 自动更新管理
    // 禁用 Windows 自动更新
    ipcMain.on('disable-updates', (event) => {
        exec('python resources/resources/python/windows-update/disable-windows-update.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-updates-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '禁用 Windows 自动更新失败，请检查权限或重试。',
                });
            } else {
                event.reply('disable-updates-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'Windows 自动更新已成功禁用！',
                    });
                }
            }
        });
    });

    // 启用 Windows 自动更新
    ipcMain.on('enable-updates', (event) => {
        exec('python resources/resources/python/windows-update/enable-windows-update.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-updates-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '启用 Windows 自动更新失败，请检查权限或重试。',
                });
            } else {
                event.reply('enable-updates-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'Windows 自动更新已成功启用！',
                    });
                }
            }
        });
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows Defender 管理
    // 禁用 Windows Defender
    ipcMain.on('disable-defender', (event) => {
        exec('python resources/resources/python/windows-defender/disable-windows-defender.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-defender-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '禁用 Windows Defender 失败，请检查权限或重试。',
                });
            } else {
                event.reply('disable-defender-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'Windows Defender 已成功禁用！',
                    });
                }
            }
        });
    });

    // 启用 Windows Defender
    ipcMain.on('enable-defender', (event) => {
        exec('python resources/resources/python/windows-defender/enable-windows-defender.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-defender-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '启用 Windows Defender 失败，请检查权限或重试。',
                });
            } else {
                event.reply('enable-defender-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'Windows Defender 已成功启用！',
                    });
                }
            }
        });
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Windows OneDrive 管理
    // 禁用 Windows OneDrive
    ipcMain.on('disable-onedrive', (event) => {
        exec('python resources/resources/python/windows-onedrive/disable-windows-onedrive.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('disable-onedrive-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '禁用 OneDrive 失败，请检查权限或重试。',
                });
            } else {
                event.reply('disable-onedrive-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'OneDrive 已成功禁用！',
                    });
                }
            }
        });
    });

    // 启用 Windows OneDrive
    ipcMain.on('enable-onedrive', (event) => {
        exec('python resources/resources/python/windows-onedrive/enable-windows-onedrive.py', (error, stdout, stderr) => {
            if (error) {
                event.reply('enable-onedrive-output', 'Error: ' + stderr);
                dialog.showMessageBox({
                    type: 'error',
                    title: '操作失败',
                    message: '启用 OneDrive 失败，请检查权限或重试。',
                });
            } else {
                event.reply('enable-onedrive-output', stdout);
                if (stdout.includes("成功")) {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '操作成功',
                        message: 'OneDrive 已成功启用！',
                    });
                }
            }
        });
    });