'use client';

import React, { useMemo } from 'react';
import { StoreSettings } from '@/types';
import { resolveThemeColors, generateThemeCSS } from '@/lib/theme';

interface ThemeInjectorProps {
  settings?: StoreSettings;
}

export default function ThemeInjector({ settings }: ThemeInjectorProps) {
  const css = useMemo(() => {
    const { colors, isDark } = resolveThemeColors(settings);
    return generateThemeCSS(colors, isDark);
  }, [settings]);

  return <style id="shop-dynamic-theme" dangerouslySetInnerHTML={{ __html: css }} />;
}
