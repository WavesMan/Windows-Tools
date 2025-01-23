const path = require('path');
const fs = require('fs');

// 获取 Python 目录路径
function getPythonDirPath() {
  // 假设 Python 安装在系统的默认路径
  const pythonDir = process.env.PYTHON_DIR || 'C:\\Python39'; // 默认路径，可以根据实际情况修改
  return pythonDir;
}

// 获取 Python 解释器路径
function getPythonExePath() {
  const pythonDir = getPythonDirPath();
  const pythonExe = path.join(pythonDir, 'python.exe'); // Windows 下为 python.exe
  return pythonExe;
}

// 获取 Python 脚本路径
function getPythonScriptPath(scriptName) {
  // 开发环境下，使用项目根目录的相对路径
  const devPath = path.join(__dirname, '..', 'asset', 'resources', 'python', scriptName);

  // 打包后，使用 process.resourcesPath 获取资源路径
  const prodPath = path.join(process.resourcesPath, 'resources', 'python', scriptName);

  // 检查路径是否存在
  if (fs.existsSync(devPath)) {
    return devPath;
  } else if (fs.existsSync(prodPath)) {
    return prodPath;
  } else {
    throw new Error(`未找到 Python 脚本: ${scriptName}`);
  }
}

// 获取 Python 安装程序路径
function getPythonInstallerPath() {
  // 开发环境下，使用项目根目录的相对路径
  const devPath = path.join(__dirname, '..', 'asset', 'resources', 'python', 'python-3.13.1-amd64.exe');

  // 打包后，使用 process.resourcesPath 获取资源路径
  const prodPath = path.join(process.resourcesPath, 'resources', 'python', 'python-3.13.1-amd64.exe');

  // 检查路径是否存在
  if (fs.existsSync(devPath)) {
    return devPath;
  } else if (fs.existsSync(prodPath)) {
    return prodPath;
  } else {
    throw new Error('未找到 Python 安装程序');
  }
}

module.exports = {
  getPythonDirPath,
  getPythonExePath,
  getPythonScriptPath,
  getPythonInstallerPath,
};