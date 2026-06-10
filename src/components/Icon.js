import { Text } from 'react-native';

// Material Symbols Rounded — the project icon set.
// The bundled TTF is a *pinned static instance* of the variable font at the
// design-system axes: opsz 24, weight 400, grade 0, fill 0 (outlined). Because
// the axes are baked into the file, no fontVariationSettings are needed — the
// same font renders identically on web and native.
export const FONT_FAMILY = 'MaterialSymbolsRounded';
export const MaterialSymbolsRoundedFont = require('../../assets/fonts/MaterialSymbolsRounded.ttf');

// Name → codepoint (hex), from the Material Symbols Rounded codepoints export.
// Keys are the canonical Material Symbols glyph names. Add entries here as new
// icons are needed (look the name + codepoint up at fonts.google.com/icons).
const CODEPOINTS = {
  arrow_forward: 0xe5c8,
  code: 0xe86f,
  tune: 0xe429,
  close: 0xe5cd,
  keyboard_arrow_up: 0xe316,
  keyboard_arrow_down: 0xe313,
  info: 0xe88e,
  check: 0xe668,
  remove: 0xe15b,
  search: 0xef7a,
  menu: 0xe5d2,
  light_mode: 0xe518,
  dark_mode: 0xe51c,
  home: 0xe9b2,
  favorite: 0xe87e,
  person: 0xf0d3,
  settings: 0xe8b8,
};

export default function Icon({ name, size = 24, color, style }) {
  const codepoint = CODEPOINTS[name];
  if (__DEV__ && !codepoint) {
    console.warn(`Icon: unknown Material Symbols glyph "${name}" — add it to CODEPOINTS in Icon.js`);
  }
  const glyph = codepoint ? String.fromCodePoint(codepoint) : '';
  return (
    <Text
      accessibilityRole="image"
      selectable={false}
      allowFontScaling={false}
      style={[{ fontFamily: FONT_FAMILY, fontSize: size, lineHeight: size, color }, style]}
    >
      {glyph}
    </Text>
  );
}
