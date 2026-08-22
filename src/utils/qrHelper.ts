import QRCode from 'qrcode';

/**
 * Generates an SVG string for a given text/URL to be embedded cleanly in HTML prints and PDFs.
 */
export function generateQRCodeSvgSync(text: string, size = 64): string {
  try {
    // Generate simple SVG data URL or inline SVG
    let svgOutput = '';
    QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 0,
      color: {
        dark: '#064e3b', // Deep emerald tone
        light: '#ffffff'
      }
    }, (err, string) => {
      if (!err && string) {
        svgOutput = string;
      }
    });
    if (svgOutput) return svgOutput;
  } catch (e) {
    console.warn('QR Code generation error:', e);
  }

  // Fallback visual QR emblem if synchronous call fails
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#064e3b" stroke-width="2">
    <rect x="2" y="2" width="8" height="8" rx="1" />
    <rect x="14" y="2" width="8" height="8" rx="1" />
    <rect x="2" y="14" width="8" height="8" rx="1" />
    <circle cx="18" cy="18" r="3" fill="#064e3b" />
  </svg>`;
}

/**
 * Async generation returning Data URL for image elements.
 */
export async function generateQRCodeDataUrl(text: string, size = 120): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff'
      }
    });
  } catch (e) {
    console.error('Failed to generate QR Data URL:', e);
    return '';
  }
}
