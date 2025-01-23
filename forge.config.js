module.exports = {
  packagerConfig: {
    name: "Windows Tools",
    executableName: "windows-tools",
    icon: "asset/resources/windows.ico", // 应用图标
    extraResources: [ // 注意：这里是 extraResources，不是 extraResource
      {
        from: "asset/resources/python/python-3.13.1-amd64.exe",
        to: "python-installer.exe",
      },
      {
        from: "asset/resources/python/**", // 复制所有 Python 脚本
        to: "python",
      },
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel", // Windows 平台的打包工具
      config: {
        name: "windows-tools",
        authors: "Windows Tools Team",
        description: "A collection of tools for Windows",
        iconUrl: "https://example.com/icon.ico", // 图标 URL
        setupIcon: "asset/resources/windows.ico", // 安装程序图标
      },
    },
  ],
};