const { exec } = require('child_process'); // 导入 exec 函数
const { dialog } = require('electron'); // 导入 dialog 模块
const path = require('path'); // 导入 path 模块
const { getPythonDirPath } = require('./path.to.python'); // 导入 getPythonDirPath 函数

class PythonScript {
  constructor() {
    // 获取 Python 目录路径
    this.pythonDirPath = getPythonDirPath();
    console.log('Python 目录路径:', this.pythonDirPath); // 调试日志
  }

  // 执行 Python 脚本的通用方法
  runPythonScript(scriptName, event, successMessage) {
    const scriptPath = path.join(this.pythonDirPath, scriptName);
    console.log('Python 脚本路径:', scriptPath); // 调试日志

    const command = process.platform === 'win32' 
      ? `cmd.exe /c python "${scriptPath}"` // Windows 下以交互模式运行
      : `python3 "${scriptPath}"`; // macOS/Linux 下直接运行

    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        event.reply(`${scriptName}-output`, 'Error: ' + stderr);
        dialog.showMessageBox({
          type: 'error',
          title: '操作失败',
          message: `执行 ${scriptName} 失败，请检查权限或重试。`,
        });
      } else {
        event.reply(`${scriptName}-output`, stdout);
        if (stdout.includes("成功")) {
          dialog.showMessageBox({
            type: 'info',
            title: '操作成功',
            message: successMessage,
          });
        }
      }
    });
  }

  // Windows 自动更新管理
  disableUpdates(event) {
    this.runPythonScript(
      'windows-update/disable-windows-update.py',
      event,
      'Windows 自动更新已成功禁用！'
    );
  }

  enableUpdates(event) {
    this.runPythonScript(
      'windows-update/enable-windows-update.py',
      event,
      'Windows 自动更新已成功启用！'
    );
  }

  // Windows Defender 管理
  disableDefender(event) {
    this.runPythonScript(
      'windows-defender/disable-windows-defender.py',
      event,
      'Windows Defender 已成功禁用！'
    );
  }

  enableDefender(event) {
    this.runPythonScript(
      'windows-defender/enable-windows-defender.py',
      event,
      'Windows Defender 已成功启用！'
    );
  }

  // Windows OneDrive 管理
  disableOneDrive(event) {
    this.runPythonScript(
      'windows-onedrive/disable-windows-onedrive.py',
      event,
      'OneDrive 已成功禁用！'
    );
  }

  enableOneDrive(event) {
    this.runPythonScript(
      'windows-onedrive/enable-windows-onedrive.py',
      event,
      'OneDrive 已成功启用！'
    );
  }
}

module.exports = PythonScript;