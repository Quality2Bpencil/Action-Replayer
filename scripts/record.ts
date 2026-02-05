// scripts/record-by-id.ts
import { execSync } from 'child_process';
import * as fs from 'fs';

const id = process.argv[2];
if (!id) {
  console.error('❌ 用法: npm run record -- <id>');
  process.exit(1);
}

// 1. 从 tasks.json 获取 URL
const tasks = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
const task = tasks.find((t: any) => t.id === id);
if (!task) {
  console.error(`❌ 未找到 ID 为 ${id} 的任务`);
  process.exit(1);
}

const rawSpec = `recordings/task-${id}.spec.ts`;
const delayedSpec = `recordings/task-${id}.with-delays.spec.ts`;

// 2. 执行录制
console.log(`▶️ 开始录制任务 ${id}: ${task.url}`);
execSync(
  `npx playwright codegen ` +
  `--load-storage=auth/login-state.json ` +
  `--output="${rawSpec}" ` +
  `"${task.url}"`,
  { stdio: 'inherit' }
);

// 3. 检查录制文件是否生成
if (!fs.existsSync(rawSpec)) {
  console.error(`❌ 录制失败：未生成 ${rawSpec}`);
  process.exit(1);
}

// 4. 自动添加延迟
console.log(`⏳ 自动添加延迟...`);
execSync(`npx ts-node scripts/add-delays.ts "${rawSpec}"`, {
  stdio: 'inherit'
});

// 5. 验证延迟文件是否生成
if (fs.existsSync(delayedSpec)) {
  console.log(`✅ 完成！回放文件: ${delayedSpec}`);
  console.log(`💡 使用命令回放: npm run playback -- ${id}`);
} else {
  console.error(`❌ 延迟处理失败：未生成 ${delayedSpec}`);
  process.exit(1);
}