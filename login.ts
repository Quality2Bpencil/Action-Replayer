// login.ts
import 'dotenv/config'; // 加载 .env
import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL;

if (!TARGET_URL) {
  console.error('❌ 错误: 请在 .env 文件中设置 TARGET_URL');
  process.exit(1);
}

(async () => {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();

  await page.goto(TARGET_URL);

  console.log('请手动完成登录...');
  console.log('登录完成后，在终端按 Enter 键继续...');

  process.stdin.setEncoding('utf8');
  process.stdin.resume();

  await new Promise<void>((resolve) => {
    process.stdin.on('data', (chunk: string) => {
      if (chunk.trim() === '') {
        resolve();
      }
    });
  });

  await page.context().storageState({ path: 'login-state.json' });
  console.log('✅ 登录状态已保存到 login-state.json');

  await browser.close();
  process.exit(0);
})();