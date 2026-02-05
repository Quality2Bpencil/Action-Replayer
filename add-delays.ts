import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = './playback.spec.ts'; // 注意：现在默认处理 .ts 文件
const DELAY_LINE = '  await page.waitForTimeout(800);\n';

function addDelaysToSpec(): void {
  let content: string;
  try {
    content = fs.readFileSync(FILE_PATH, 'utf8');
  } catch (error) {
    console.error(`❌ 无法读取文件: ${FILE_PATH}`);
    console.error((error as Error).message);
    process.exit(1);
  }

  const lines: string[] = content.split('\n');
  const newLines: string[] = [];

  for (const line of lines) {
    newLines.push(line);

    const trimmedLine = line.trim();
    if (
      trimmedLine.startsWith('await ') &&
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
      newLines.push(DELAY_LINE);
    }
  }

  const outputFilePath = FILE_PATH.replace(/\.spec.ts$/, '.with-delays.spec.ts');
  fs.writeFileSync(outputFilePath, newLines.join('\n'), 'utf8');

  console.log(`✅ 已生成带延迟的文件: ${outputFilePath}`);
}

addDelaysToSpec();