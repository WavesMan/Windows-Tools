const { build } = require("esbuild");

build({
  entryPoints: ["./main/main.js"], // 主进程入口文件
  bundle: true,
  outfile: "./dist/main.js", // 输出文件路径
  platform: "node", // 平台设置为 node
  target: "node16", // 目标 Node.js 版本
  minify: true, // 启用代码压缩
  sourcemap: true, // 生成 sourcemap
}).catch(() => process.exit(1));