// scripts/add-delays.ts
import * as fs from 'fs';

const FILE_PATH = process.argv[2] || './recordings/playback.spec.ts';
const DELAY_LINE = '  await page.waitForTimeout(1000);\n';
const FINAL_DELAY_LINE = '  await page.waitForTimeout(10000);\n';
const TIMEOUT_LINE = "\ntest.setTimeout(3 * 60 * 1000);";

function addDelaysToSpec(): void {
  let content = fs.readFileSync(FILE_PATH, 'utf8');
  const lines = content.split('\n');
  const newLines: string[] = [];
  const actionIndices: number[] = [];

  // 第一遍：找出所有需要加 1s 延迟的操作行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('await ') &&
      (
        line.includes('.click()') ||
        line.includes('.goto(') ||
        line.includes('.fill(') ||
        line.includes('.check(') ||
        line.includes('.uncheck(') ||
        line.includes('.hover(') ||
        line.includes('.selectOption(')
      )
    ) {
      actionIndices.push(i);
    }
  }

  // 第二遍：构建新内容
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newLines.push(line);

    // 在第一个 import 行之后插入 setTimeout（只插一次）
    if (line.trim().startsWith('import ') && !newLines.some(l => l === TIMEOUT_LINE)) {
      newLines.push(TIMEOUT_LINE);
    }

    // 在每个操作后加 1s 延迟
    if (actionIndices.includes(i)) {
      newLines.push(DELAY_LINE);

      // 如果是最后一个操作，再加 10s 延迟
      if (i === actionIndices[actionIndices.length - 1]) {
        newLines.push(FINAL_DELAY_LINE);
      }
    }
  }

  const outputFilePath = FILE_PATH.replace(/\.spec\.ts$/, '.with-delays.spec.ts');
  fs.writeFileSync(outputFilePath, newLines.join('\n'), 'utf8');
  console.log(`✅ 已生成: ${outputFilePath}`);
}

addDelaysToSpec();