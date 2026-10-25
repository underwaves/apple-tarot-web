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
    name: '01_home_hero_desktop.png',
    url: 'http://localhost:3001',
    width: 1280,
    height: 820,
    time: 2500,
  },
  {
    name: '01_home_full_desktop.png',
    url: 'http://localhost:3001',
    width: 1280,
    height: 2000,
    time: 2500,
  },
  {
    name: '02_cart_modal.png',
    url: 'http://localhost:3001/?preview=cart',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '03_checkout_fortune.png',
    url: 'http://localhost:3001/?preview=checkout_fortune',
    width: 1280,
    height: 900,
    time: 2000,
  },
  {
    name: '04_checkout_physical.png',
    url: 'http://localhost:3001/?preview=checkout_physical',
    width: 1280,
    height: 950,
    time: 2000,
  },
  {
    name: '05_payment_qr_modal.png',
    url: 'http://localhost:3001/?preview=payment',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '06_order_completed_modal.png',
    url: 'http://localhost:3001/?preview=done',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '07_slip_upload_modal.png',
    url: 'http://localhost:3001/?preview=slip',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '08_public_queue_page.png',
    url: 'http://localhost:3001/queue',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '09_reviews_modal.png',
    url: 'http://localhost:3001/?preview=reviews',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '10_contact_modal.png',
    url: 'http://localhost:3001/?preview=contact',
    width: 1280,
    height: 850,
    time: 2000,
  },
  {
    name: '11_mobile_home.png',
    url: 'http://localhost:3001',
    width: 393,
    height: 852,
    time: 2500,
  },
  {
    name: '12_mobile_checkout_fortune.png',
    url: 'http://localhost:3001/?preview=checkout_fortune',
    width: 393,
    height: 852,
    time: 2000,
  },
  {
    name: '13_mobile_queue.png',
    url: 'http://localhost:3001/queue',
    width: 393,
    height: 852,
    time: 2000,
  },
  {
    name: '14_admin_login.png',
    url: 'http://localhost:3001/?preview=admin',
    width: 1280,
    height: 850,
    time: 2000,
  },
];

async function captureOne(shot) {
  const filePath = path.join(outputDir, shot.name);
  const args = [
    '--headless=new',
    `--screenshot=${filePath}`,
    `--window-size=${shot.width},${shot.height}`,
    `--virtual-time-budget=${shot.time}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    shot.url,
  ];

  await new Promise((resolve, reject) => {
    execFile(chromePath, args, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // Copy to artifacts dir
  if (fs.existsSync(artifactDir) && fs.existsSync(filePath)) {
    const artTarget = path.join(artifactDir, shot.name);
    fs.copyFileSync(filePath, artTarget);
  }

  console.log(`✓ Captured: ${shot.name} (${shot.width}x${shot.height})`);
}

async function run() {
  console.log(`Starting capture of ${shots.length} screenshots...`);
  for (const shot of shots) {
    try {
      await captureOne(shot);
    } catch (err) {
      console.error(`Failed ${shot.name}:`, err.message);
    }
  }
  console.log('All captures complete!');
}

run();
