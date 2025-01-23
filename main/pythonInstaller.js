const { exec } = require('child_process');
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// 检查 Python 是否已安装
function checkPythonInstalled() {
  return new Promise((resolve, reject) => {
    exec('python --version', (error, stdout, stderr) => {
      if (error) {
        reject('Python 未安装');
      } else {
        resolve('Python 已安装');
      }
    });
  });
}

// 启动 Python 安装包
function installPython() {
  return new Promise((resolve, reject) => {
    // 获取 Python 安装包的路径
    const pythonInstallerPath = path.join(process.resourcesPath, 'python-installer.exe');

    // 启动安装包
    const installerProcess = exec(pythonInstallerPath, (error, stdout, stderr) => {
      if (error) {
        reject('Python 安装失败');
      } else {
        resolve('Python 安装成功');
      }
    });

    // 监听安装进程
    installerProcess.on('close', (code) => {
      if (code === 0) {
        resolve('Python 安装成功');
      } else {
        reject('Python 安装失败');
      }
    });
  });
}

// 删除 Python 安装包
function deletePythonInstaller() {
  const pythonInstallerPath = path.join(process.resourcesPath, 'python-installer.exe');

  if (fs.existsSync(pythonInstallerPath)) {
    try {
      fs.unlinkSync(pythonInstallerPath); // 删除文件
      console.log('Python 安装包已删除');
    } catch (error) {
      console.error('删除 Python 安装包失败:', error);
    }
  } else {
    console.log('Python 安装包不存在，无需删除');
  }
}

// 初始化 Python 安装逻辑
async function initializePythonInstallation() {
  try {
    await checkPythonInstalled(); // 检查 Python 是否安装
    console.log('Python 已安装');

    // 删除 Python 安装包
    deletePythonInstaller();
    return true; // Python 已安装
  } catch (error) {
    console.log('Python 未安装，开始安装...');

    const result = await dialog.showMessageBox({
      type: 'info',
      title: '安装 Python',
      message: '需要安装 Python 才能继续使用本应用。是否立即安装？',
      buttons: ['安装', '取消'],
    });

    if (result.response === 0) {
      // 用户选择安装
      try {
        await installPython(); // 启动 Python 安装包
        console.log('Python 安装成功');

        // 安装完成后，删除 Python 安装包
        deletePythonInstaller();
        return true; // Python 安装成功
      } catch (error) {
        dialog.showErrorBox('安装失败', 'Python 安装失败，请手动安装 Python。');
        return false; // Python 安装失败
      }
    } else {
      // 用户取消安装
      dialog.showErrorBox('安装取消', '必须安装 Python 才能使用本应用。');
      return false; // 用户取消安装
    }
  }
}

module.exports = {
  initializePythonInstallation,
};