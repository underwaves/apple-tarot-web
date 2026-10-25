import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('screenshots');
const artifactDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\16913964-e529-44b0-9c61-584428cc8679';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const shots = [
  {
    name: 'express_32_01_catalog.png',
    url: 'http://localhost:3001',
    width: 1280,
    height: 900,
    time: 3000,
  },
  {
    name: 'express_32_02_checkout.png',
    url: 'http://localhost:3001/?preview=checkout_express',
    width: 1280,
    height: 920,
    time: 3000,
  },
  {
    name: 'express_32_03_payment.png',
    url: 'http://localhost:3001/?preview=payment_express',
    width: 1280,
    height: 900,
    time: 3000,
  },
  {
    name: 'express_32_04_mobile_checkout.png',
    url: 'http://localhost:3001/?preview=checkout_express',
    width: 393,
    height: 852,
    time: 3000,
  },
  {
    name: 'express_32_05_mobile_payment.png',
    url: 'http://localhost:3001/?preview=payment_express',
    width: 393,
    height: 852,
    time: 3000,
  },
];

async function capture(item) {
  const filePath = path.join(outputDir, item.name);
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--window-size=${item.width},${item.height}`,
    `--virtual-time-budget=${item.time}`,
    `--screenshot=${filePath}`,
    item.url,
  ];

  return new Promise((resolve, reject) => {
    execFile(chromePath, args, (err) => {
      if (err) {
        console.error(`Error capturing ${item.name}:`, err);
        return reject(err);
      }
      console.log(`Saved screenshot: ${item.name}`);
      
      // Copy to artifact directory
      const targetArtifactPath = path.join(artifactDir, item.name);
      fs.copyFileSync(filePath, targetArtifactPath);
      console.log(`Copied to artifact: ${targetArtifactPath}`);
      resolve();
    });
  });
}

async function run() {
  for (const shot of shots) {
    try {
      await capture(shot);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('All express 32 screenshots captured and copied successfully!');
}

run();
