const { exec } = require('child_process');
const { dialog } = require('electron');
const { getPythonExePath, getPythonScriptPath } = require('./path.to.python');

class PythonScript {
  // 执行 Python 脚本的通用方法
  runPythonScript(scriptName, event, successMessage) {
    try {
      const scriptPath = getPythonScriptPath(scriptName);
      console.log('Python 脚本路径:', scriptPath); // 调试日志

      // 构建执行命令
      const command = `"python" "${scriptPath}"`;

      // 使用 exec 执行命令，并确保命令窗口可见
      exec(command, { windowsHide: false, encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 ${scriptName} 失败:`, stderr); // 调试日志
          event.reply(`${scriptName}-output`, 'Error: ' + stderr);
          dialog.showMessageBox({
            type: 'error',
            title: '操作失败',
            message: `执行 ${scriptName} 失败，请检查权限或重试。`,
          });
        } else {
          console.log(`执行 ${scriptName} 成功:`, stdout); // 调试日志
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
    } catch (error) {
      console.error('获取 Python 脚本路径失败:', error);
      dialog.showMessageBox({
        type: 'error',
        title: '操作失败',
        message: `未找到 Python 脚本: ${scriptName}`,
      });
    }
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