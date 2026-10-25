import { ThemeColors, StoreSettings } from '@/types';

export interface ThemePreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isDark?: boolean;
  colors: ThemeColors;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'apple',
    name: 'Apple Blossom',
    emoji: '🍏',
    description: 'โทนชมพูหวานละมุนตัดเขียวเซจ อบอุ่นสไตล์คอทเทจ (ดั้งเดิม)',
    isDark: false,
    colors: {
      primary: '#F6B8C6',
      primary_hover: '#F29EAE',
      primary_deep: '#D06D80',
      secondary: '#A8B99A',
      bg_vanilla: '#FFF8EC',
      light_tone: '#FCE4EC',
      accent_tone: '#F6D1B5',
      text_deep: '#543E30',
      text_soft: '#947765',
    },
  },
  {
    id: 'lavender',
    name: 'Mystic Lavender',
    emoji: '💜',
    description: 'โทนม่วงพาสเทลลึกลับ ดั่งมนตราไพ่ทาโรต์และดวงดาว',
    isDark: false,
    colors: {
      primary: '#D8B4F8',
      primary_hover: '#C792EA',
      primary_deep: '#8A4FFF',
      secondary: '#A0C4FF',
      bg_vanilla: '#FAF5FF',
      light_tone: '#F3E8FF',
      accent_tone: '#E9D5FF',
      text_deep: '#3B1E54',
      text_soft: '#7B5294',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Forest',
    emoji: '🍵',
    description: 'โทนเขียวมัทฉะตัดเอิร์ธโทน อบอุ่น สบายตา เรียบหรู',
    isDark: false,
    colors: {
      primary: '#A3C9A8',
      primary_hover: '#8DBA93',
      primary_deep: '#476C44',
      secondary: '#D4A373',
      bg_vanilla: '#F7F9F5',
      light_tone: '#E7EFE5',
      accent_tone: '#E6D5B8',
      text_deep: '#2B3826',
      text_soft: '#5C7053',
    },
  },
  {
    id: 'peach',
    name: 'Sweet Peach',
    emoji: '🍑',
    description: 'โทนสีพีชสดใส น่ารักสดชื่น เติมพลังบวกและความรัก',
    isDark: false,
    colors: {
      primary: '#FFB5A7',
      primary_hover: '#FCA494',
      primary_deep: '#E26D5C',
      secondary: '#FCD5CE',
      bg_vanilla: '#FFF9F5',
      light_tone: '#FFE5DE',
      accent_tone: '#FFDAC1',
      text_deep: '#4A3528',
      text_soft: '#8A6854',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Moonlight',
    emoji: '🌊',
    description: 'โทนฟ้าพาสเทลโปร่งเบา ดั่งผืนน้ำและแสงสะท้อนดวงดาว',
    isDark: false,
    colors: {
      primary: '#90E0EF',
      primary_hover: '#72D3E6',
      primary_deep: '#0077B6',
      secondary: '#A2D2FF',
      bg_vanilla: '#F0F8FF',
      light_tone: '#E0F2FE',
      accent_tone: '#BAE6FD',
      text_deep: '#1B3B52',
      text_soft: '#4A7291',
    },
  },
  {
    id: 'rose_gold',
    name: 'Princess Rose',
    emoji: '🌹',
    description: 'โทนกุหลาบวินเทจหรูหรา อ่อนหวานดั่งเจ้าหญิงในเทพนิยาย',
    isDark: false,
    colors: {
      primary: '#F4ACB7',
      primary_hover: '#EA91A1',
      primary_deep: '#9D4456',
      secondary: '#D8B4E2',
      bg_vanilla: '#FFF7F8',
      light_tone: '#FFE5EB',
      accent_tone: '#F3C5CE',
      text_deep: '#4A2830',
      text_soft: '#855662',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Tarot',
    emoji: '🌙',
    description: 'โทนมืดพรีเมียม ลึกลับ มีมนต์ขลังใต้แสงจันทร์และดวงดาว',
    isDark: true,
    colors: {
      primary: '#C77DFF',
      primary_hover: '#B25BF5',
      primary_deep: '#E0AAFF',
      secondary: '#9D4EDD',
      bg_vanilla: '#181224',
      light_tone: '#281E3B',
      accent_tone: '#3E2A5C',
      text_deep: '#F7EEFF',
      text_soft: '#CBB4DF',
    },
  },
];

export const DEFAULT_THEME_COLORS: ThemeColors = THEME_PRESETS[0].colors;

export function resolveThemeColors(settings?: StoreSettings): {
  colors: ThemeColors;
  isDark: boolean;
  presetId: string;
} {
  const presetId = settings?.theme_preset || 'apple';

  if (presetId === 'custom' && settings?.custom_theme) {
    const custom = settings.custom_theme;
    return {
      presetId: 'custom',
      isDark: false,
      colors: {
        primary: custom.primary || DEFAULT_THEME_COLORS.primary,
        primary_hover: custom.primary_hover || custom.primary || DEFAULT_THEME_COLORS.primary_hover,
        primary_deep: custom.primary_deep || DEFAULT_THEME_COLORS.primary_deep,
        secondary: custom.secondary || DEFAULT_THEME_COLORS.secondary,
        bg_vanilla: custom.bg_vanilla || DEFAULT_THEME_COLORS.bg_vanilla,
        light_tone: custom.light_tone || custom.primary + '22',
        accent_tone: custom.accent_tone || DEFAULT_THEME_COLORS.accent_tone,
        text_deep: custom.text_deep || DEFAULT_THEME_COLORS.text_deep,
        text_soft: custom.text_soft || DEFAULT_THEME_COLORS.text_soft,
      },
    };
  }

  const preset = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
  return {
    presetId: preset.id,
    isDark: !!preset.isDark,
    colors: preset.colors,
  };
}

export function generateThemeCSS(colors: ThemeColors, isDark = false): string {
  const primary = colors.primary;
  const primaryHover = colors.primary_hover || primary;
  const primaryDeep = colors.primary_deep;
  const secondary = colors.secondary;
  const bgVanilla = colors.bg_vanilla;
  const lightTone = colors.light_tone || primary + '25';
  const textDeep = colors.text_deep || (isDark ? '#F7EEFF' : '#543E30');
  const textSoft = colors.text_soft || (isDark ? '#CBB4DF' : '#947765');
  const cardBg = isDark ? '#231A33' : '#FFFEFA';
  const cardBorder = isDark ? primary + '40' : primary + '55';

  return `
    :root {
      --primary: ${primary};
      --primary-hover: ${primaryHover};
      --primary-deep: ${primaryDeep};
      --secondary: ${secondary};
      --bg-vanilla: ${bgVanilla};
      --light-pink: ${lightTone};
      --apple-green: ${secondary};
      --text-deep: ${textDeep};
      --text-soft: ${textSoft};
      --line: ${primary}55;
      --card-bg: ${cardBg};
      --card-border: ${cardBorder};
    }

    body {
      color: ${textDeep} !important;
      background: radial-gradient(
        ellipse 120% 80% at 50% -10%,
        ${lightTone} 0%,
        ${bgVanilla} 45%,
        ${bgVanilla} 100%
      ) fixed !important;
    }

    /* Primary CTA Buttons */
    .cta-btn {
      background: linear-gradient(135deg, ${primary} 0%, ${primaryDeep} 100%) !important;
      border-color: ${lightTone} !important;
      color: ${isDark ? '#FFFFFF' : textDeep} !important;
      box-shadow: 0 6px 18px ${primary}55 !important;
    }

    .cta-btn:hover {
      background: linear-gradient(135deg, ${primaryHover} 0%, ${primaryDeep} 100%) !important;
      box-shadow: 0 8px 24px ${primary}77 !important;
    }

    /* Package Cards */
    .pkg-btn {
      background: ${cardBg} !important;
      color: ${textDeep} !important;
      border-color: ${cardBorder} !important;
    }

    .pkg-btn:hover {
      border-color: ${primary} !important;
      box-shadow: 0 10px 28px ${primary}44 !important;
    }

    .pkg-btn[aria-pressed="true"] {
      border-color: ${primaryDeep} !important;
      background: ${lightTone} !important;
      box-shadow: 0 8px 24px ${primary}44 !important;
    }

    /* Secondary & Quick Action Buttons */
    .secondary-btn, .quick-btn {
      background: ${cardBg} !important;
      color: ${textDeep} !important;
      border-color: ${secondary}88 !important;
    }

    .secondary-btn:hover, .quick-btn:hover {
      background: ${lightTone} !important;
      border-color: ${secondary} !important;
    }

    /* Category Headers */
    .category-header {
      color: ${textDeep} !important;
    }

    .category-header::after {
      background: linear-gradient(90deg, ${primary} 0%, ${secondary} 70%, transparent 100%) !important;
    }

    /* Hero Title Gradient */
    h1.hero-title {
      background: linear-gradient(180deg, ${textDeep} 0%, ${textSoft} 55%, ${primaryDeep} 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      color: transparent !important;
    }

    /* Form Inputs */
    input:focus, select:focus, textarea:focus {
      border-color: ${primary} !important;
      box-shadow: 0 0 0 3px ${primary}35 !important;
    }

    /* Dynamic overrides for shop elements */
    .text-\\[\\#D06D80\\] {
      color: ${primaryDeep} !important;
    }
    .text-\\[\\#543E30\\] {
      color: ${textDeep} !important;
    }
    .text-\\[\\#947765\\] {
      color: ${textSoft} !important;
    }
    .border-\\[\\#F6B8C6\\] {
      border-color: ${primary} !important;
    }
    .bg-\\[\\#FFF8EC\\] {
      background-color: ${bgVanilla} !important;
    }
    .bg-\\[\\#FFFEFA\\] {
      background-color: ${cardBg} !important;
    }
    .bg-\\[\\#FCE4EC\\] {
      background-color: ${lightTone} !important;
    }
    .border-\\[\\#C9DDB8\\] {
      border-color: ${secondary} !important;
    }

    /* Cart Bar */
    .cart-floating-btn {
      background: linear-gradient(135deg, ${primary} 0%, ${primaryDeep} 100%) !important;
      color: ${isDark ? '#FFFFFF' : textDeep} !important;
      box-shadow: 0 8px 25px ${primary}66 !important;
    }
  `;
}
