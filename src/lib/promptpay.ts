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
