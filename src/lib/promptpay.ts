import QRCode from 'qrcode';

/**
 * PromptPay EMVCo QR Code Payload Generator with CRC16-CCITT Checksum
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xff;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTag(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function generatePromptPayPayload(
  target: string,
  amount?: number | null
): string {
  // Normalize target: remove hyphens, spaces
  const cleanTarget = target.replace(/[^0-9]/g, '');

  let formattedTarget = '';
  if (cleanTarget.length === 10) {
    // Mobile number: 0812345678 -> 0066812345678
    formattedTarget = formatTag('01', `0066${cleanTarget.slice(1)}`);
  } else if (cleanTarget.length === 13) {
    // National ID: 13 digits
    formattedTarget = formatTag('02', cleanTarget);
  } else if (cleanTarget.length === 15) {
    // e-Wallet: 15 digits
    formattedTarget = formatTag('03', cleanTarget);
  } else {
    // Fallback: format as mobile or national ID
    formattedTarget =
      cleanTarget.length > 10
        ? formatTag('02', cleanTarget)
        : formatTag('01', `0066${cleanTarget.replace(/^0/, '')}`);
  }

  // Tag 29: PromptPay Application ID (AID: A000000677010111) + Target
  const tag29Value = `${formatTag('00', 'A000000677010111')}${formattedTarget}`;

  let payload = '';
  payload += formatTag('00', '01'); // Payload Format Indicator
  payload += formatTag('01', amount ? '12' : '11'); // 11=Static, 12=Dynamic with amount
  payload += formatTag('29', tag29Value); // Merchant Account Information
  payload += formatTag('53', '764'); // Currency: THB (764)

  if (amount && amount > 0) {
    payload += formatTag('54', amount.toFixed(2)); // Transaction Amount
  }

  payload += formatTag('58', 'TH'); // Country Code

  // Tag 63: CRC16 Checksum
  const checksumPrefix = '6304';
  const checksum = crc16(payload + checksumPrefix);

  return payload + checksumPrefix + checksum;
}

/**
 * Generate a complete Thai QR Payment card data URL (Canvas) and raw QR data URL
 */
export async function createPromptPayCardDataUrl(
  target: string,
  amount: number,
  options?: {
    accountName?: string;
    orderNo?: string;
  }
): Promise<{ qrDataUrl: string; cardDataUrl: string }> {
  const payload = generatePromptPayPayload(target, amount);

  // 1. Raw QR Code Image
  const qrDataUrl = await QRCode.toDataURL(payload, {
    width: 400,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });

  // 2. Client-side Canvas rendering for official Thai QR Payment card format
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      const width = 600;
      const height = 780;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Card white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Header Background (PromptPay / Thai QR Official Navy Blue)
        ctx.fillStyle = '#002C6C';
        ctx.fillRect(0, 0, width, 115);

        // Header Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('THAI QR PAYMENT', width / 2, 50);

        ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#93C5FD';
        ctx.fillText('พร้อมเพย์ · สแกนจ่ายเงินได้ทุกธนาคาร', width / 2, 85);

        // Load and draw QR code
        const img = new Image();
        img.src = qrDataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const qrSize = 380;
        const qrX = (width - qrSize) / 2;
        const qrY = 140;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

        // Divider line
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(50, 545);
        ctx.lineTo(width - 50, 545);
        ctx.stroke();

        // Merchant / Account Info
        ctx.fillStyle = '#6B7280';
        ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('ชื่อบัญชีรับเงิน', width / 2, 575);

        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(options?.accountName || 'ด.ญ. ณัฐธยาน์ ขันทอง', width / 2, 608);

        // Amount Box
        ctx.fillStyle = '#F0FDF4';
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(50, 630, width - 100, 80, 16);
        } else {
          ctx.fillRect(50, 630, width - 100, 80);
        }
        ctx.fill();

        ctx.strokeStyle = '#86EFAC';
        ctx.lineWidth = 1.5;
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(50, 630, width - 100, 80, 16);
        } else {
          ctx.strokeRect(50, 630, width - 100, 80);
        }
        ctx.stroke();

        // Amount text
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, width / 2, 672);

        ctx.fillStyle = '#15803D';
        ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`🔒 ยอดเงินถูกล็อคอัตโนมัติ ${options?.orderNo ? `(ออเดอร์ #${options.orderNo})` : ''}`, width / 2, 698);

        // Footer Guidance
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('เปิดแอปธนาคารใดก็ได้ แล้วเลือกภาพนี้เพื่อสแกนชำระเงินได้ทันที', width / 2, 745);

        const cardDataUrl = canvas.toDataURL('image/png');
        return { qrDataUrl, cardDataUrl };
      }
    } catch (err) {
      console.warn('Canvas rendering error, using raw QR:', err);
    }
  }

  return { qrDataUrl, cardDataUrl: qrDataUrl };
}
