const path = require('path');
const { app } = require('electron'); // 导入 app 模块
const { globSync } = require('glob'); // 导入 globSync 函数

// 定义一个同步函数来查找python.exe文件
function findPythonExeSync() {
  let pythonDirPath;

  if (process.env.NODE_ENV === 'development') {
    // 开发环境：从项目根目录查找
    pythonDirPath = path.join(__dirname, '..', 'asset', 'resources', 'python');
  } else {
    // 封包环境：从资源目录查找
    pythonDirPath = path.join(process.resourcesPath, 'python');
  }

  // 检查 python.exe 是否存在
  const pythonExePath = path.join(pythonDirPath, 'python.exe');
  if (!globSync(pythonExePath).length) {
    throw new Error(`python.exe not found in: ${pythonDirPath}`);
  }

  console.log('Python 目录路径:', pythonDirPath); // 调试日志
  return pythonDirPath;
}

// 获取 Python 目录路径
const pythonDirPath = findPythonExeSync();

// 创建一个函数来返回python.exe所在的目录路径
const getPythonDirPath = () => pythonDirPath;

// 导出 getPythonDirPath 函数
module.exports = { getPythonDirPath };