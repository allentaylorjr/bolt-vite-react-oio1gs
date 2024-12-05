// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Get contrasting text color (black or white)
export function getContrastingTextColor(backgroundColor: string): string {
  if (!backgroundColor || backgroundColor === 'transparent') {
    return '#000000';
  }

  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';

  const bgLuminance = getLuminance(rgb.r, rgb.g, rgb.b);
  const whiteLuminance = getLuminance(255, 255, 255);
  const blackLuminance = getLuminance(0, 0, 0);

  const whiteContrast = getContrastRatio(whiteLuminance, bgLuminance);
  const blackContrast = getContrastRatio(blackLuminance, bgLuminance);

  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

// Get button styles based on background color
export function getButtonStyles(backgroundColor: string) {
  const textColor = getContrastingTextColor(backgroundColor);
  
  return {
    backgroundColor,
    color: textColor,
    border: 'none'
  };
}

// Get outline button styles
export function getOutlineButtonStyles(color: string) {
  return {
    backgroundColor: 'transparent',
    color,
    border: `2px solid ${color}`
  };
}