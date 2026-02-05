// scripts/playback.ts
import { execSync } from 'child_process';
import * as fs from 'fs';

const id = process.argv[2];
if (!id) {
  console.error('❌ 用法: npm run playback -- <id>');
  process.exit(1);
}

const specFile = `recordings/task-${id}.with-delays.spec.ts`;

// 检查文件是否存在
if (!fs.existsSync(specFile)) {
  console.error(`❌ 回放文件不存在: ${specFile}`);
  console.error('请先运行: npm run record -- ', id);
  process.exit(1);
}

console.log(`▶️ 正在回放任务 ${id} ...`);
console.log(`📄 使用文件: ${specFile}`);

// 执行 Playwright 测试命令
try {
  execSync(`npx playwright test "${specFile}" --headed`, {
    stdio: 'inherit' // 将子进程的 stdin/stdout/stderr 连接到当前终端
  });
  console.log(`✅ 任务 ${id} 回放完成`);
} catch (error) {
  console.error(`❌ 任务 ${id} 回放失败`);
  process.exit(1);
}