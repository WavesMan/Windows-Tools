const { app, dialog, shell } = require('electron'); // 导入 app 模块
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 配置文件路径
const configFilePath = path.join(app.getPath('userData'), 'config.json');
console.log('config.json 路径:', configFilePath); // 调试日志

// 读取配置文件
function readConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取配置文件失败:', error);
  }
  return { pythonInstalled: false }; // 默认值
}

// 写入配置文件
function writeConfig(config) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('写入配置文件失败:', error);
  }
}

// 检查用户是否已选择“已安装 Python”
function hasUserConfirmedPythonInstalled() {
  const config = readConfig();
  return config.pythonInstalled || false; // 从配置文件中获取值
}

// 弹窗提示用户选择是否安装了 Python
async function promptUserForPythonInstallation() {
  const result = await dialog.showMessageBox({
    type: 'question',
    title: 'Python 安装确认',
    message: '请确认是否已安装 Python。',
    detail: '如果您已安装 Python 并确保其已添加到 PATH 环境变量中，请选择“已安装”。否则，请选择“未安装”以继续安装。',
    buttons: ['已安装', '未安装'],
    defaultId: 1, // 默认选中“未安装”
    cancelId: 1, // 取消按钮的索引
  });

  if (result.response === 0) {
    // 用户选择“已安装”
    const config = readConfig();
    config.pythonInstalled = true;
    writeConfig(config); // 将用户选择存储到配置文件
    return true;
  } else {
    // 用户选择“未安装”
    return false;
  }
}

// 启动 Python 安装包（手动安装）
function installPythonManually() {
  return new Promise((resolve, reject) => {
    // 获取 Python 安装包的路径
    const pythonInstallerPath = path.join(process.resourcesPath, 'resources', 'python', 'python-3.13.1-amd64.exe');

    // 显示弹窗，提醒用户勾选“将 Python 添加到 PATH”
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Python 安装提示',
        message: '请确保在安装 Python 时勾选“将 Python 添加到 PATH”选项。',
        detail: '这是确保应用程序正常运行的必要步骤。请仔细阅读安装界面上的选项，并确保勾选“Add Python to PATH”。',
        checkboxLabel: '我已阅读并理解，将在安装时勾选“Add Python to PATH”',
        buttons: ['继续安装', '取消'],
        defaultId: 0, // 默认选中“继续安装”
        cancelId: 1, // 取消按钮的索引
      })
      .then((result) => {
        if (result.response === 0 && result.checkboxChecked) {
          // 用户点击“继续安装”并且勾选了确认框
          console.log('用户已确认，开始运行 Python 安装程序...');

          // 使用 shell.openPath 打开 Python 安装包
          shell.openPath(pythonInstallerPath).then(() => {
            console.log('Python 安装程序已启动');

            // 启动检测机制，检查安装程序是否仍在运行
            const checkInterval = setInterval(async () => {
              const isRunning = await isPythonInstallerRunning();
              if (!isRunning) {
                clearInterval(checkInterval); // 停止检测

                // 安装程序已结束，弹窗询问用户是否已安装 Python
                const result = await dialog.showMessageBox({
                  type: 'question',
                  title: 'Python 安装确认',
                  message: 'Python 安装程序已关闭，是否已成功安装 Python？',
                  buttons: ['已安装', '未安装'],
                  defaultId: 0, // 默认选中“已安装”
                  cancelId: 1, // 取消按钮的索引
                });

                if (result.response === 0) {
                  // 用户选择“已安装”
                  const config = readConfig();
                  config.pythonInstalled = true;
                  writeConfig(config); // 将用户选择存储到配置文件
                  resolve('Python 已安装');
                } else {
                  // 用户选择“未安装”
                  const reinstallResult = await dialog.showMessageBox({
                    type: 'info',
                    title: 'Python 未安装',
                    message: '需要安装 Python 才能继续使用本应用。是否重新安装？',
                    buttons: ['重新安装', '退出'],
                    defaultId: 0, // 默认选中“重新安装”
                    cancelId: 1, // 取消按钮的索引
                  });

                  if (reinstallResult.response === 0) {
                    // 用户选择“重新安装”
                    await installPythonManually(); // 重新执行安装逻辑
                  } else {
                    // 用户选择“退出”
                    reject('用户选择退出');
                  }
                }
              }
            }, 1000); // 每 1 秒检测一次
          });
        } else {
          // 用户取消安装或未勾选确认框
          console.log('用户取消安装或未勾选确认框');
          reject('用户取消安装或未勾选确认框');
        }
      })
      .catch((error) => {
        console.error('弹窗显示失败:', error);
        reject('弹窗显示失败');
      });
  });
}

// 检查 python-3.13.1-amd64.exe 是否仍在运行
function isPythonInstallerRunning() {
  return new Promise((resolve) => {
    exec('tasklist /FI "IMAGENAME eq python-3.13.1-amd64.exe"', (error, stdout) => {
      if (error) {
        resolve(false); // 如果命令执行失败，假设安装程序未运行
      } else {
        // 如果输出中包含 python-3.13.1-amd64.exe，说明安装程序仍在运行
        resolve(stdout.includes('python-3.13.1-amd64.exe'));
      }
    });
  });
}

// 初始化 Python 安装逻辑
async function initializePythonInstallation() {
  try {
    // 如果用户已确认安装 Python，直接返回
    if (hasUserConfirmedPythonInstalled()) {
      console.log('用户已确认安装 Python，跳过安装提示');
      return true;
    }

    // 如果用户未确认，弹出“Python 安装确认”窗口
    const userConfirmed = await promptUserForPythonInstallation();
    if (userConfirmed) {
      console.log('用户已确认安装 Python，跳过安装提示');
      return true;
    }

    // 用户选择“未安装”，启动 Python 安装包（手动安装）
    await installPythonManually();
    return true; // Python 安装程序已启动
  } catch (error) {
    console.error('初始化 Python 安装逻辑失败:', error);
    return false;
  }
}

module.exports = {
  initializePythonInstallation,
};