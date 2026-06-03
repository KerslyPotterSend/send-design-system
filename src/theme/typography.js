import { Platform } from 'react-native';

// Mirrors the Tamagui font system: fontPacks scale + named weights + family tokens.
// Use these values when building text components so the visualization in the
// design system stays in sync with the source spec.

const IS_WEB = Platform.OS === 'web';

export const fontPacks = {
  '1': { fontSize: 10, lineHeight: 16, letterSpacing: 0.1 },
  '2': { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  '3': { fontSize: 14, lineHeight: 20, letterSpacing: -0.1 },
  '4': { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  '5': { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  '6': { fontSize: 24, lineHeight: 32, letterSpacing: -0.1 },
  '7': { fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  '8': { fontSize: 40, lineHeight: 48, letterSpacing: -1 },
  '9': { fontSize: 48, lineHeight: 56, letterSpacing: -1.1 },
  '10': { fontSize: 56, lineHeight: 64, letterSpacing: -1.4 },
  '11': { fontSize: 64, lineHeight: 72, letterSpacing: -1.5 },
};

export const weights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

// DM Sans font family names — one per weight. RN doesn't reliably pair
// fontFamily with fontWeight for custom fonts, so we always set the
// weight-specific family directly.
export const dmSans = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semiBold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
};

export const families = {
  heading: dmSans.medium,
  body: dmSans.regular,
};

export const headingDefaults = { size: '7', fontWeight: weights.medium, tag: 'h3' };
export const paragraphDefaults = { size: '4', fontWeight: weights.regular, tag: 'p' };

// DM Sans stylistic alternates — each ssXX swaps a letter/punctuation form.
export const stylisticSets = [
  { name: 'stylistic-one',   otFeature: 'ss01', label: 'Alternative Punctuation', sample: 'Hello, "world"!' },
  { name: 'stylistic-two',   otFeature: 'ss02', label: 'Alternative a',           sample: 'abracadabra' },
  { name: 'stylistic-three', otFeature: 'ss03', label: 'Alternative g',           sample: 'gigantic' },
  { name: 'stylistic-four',  otFeature: 'ss04', label: 'Alternative u',           sample: 'unusual' },
  { name: 'stylistic-five',  otFeature: 'ss05', label: 'Alternative y',           sample: 'yummy' },
  { name: 'stylistic-six',   otFeature: 'ss06', label: 'Alternative Q',           sample: 'Quote' },
  { name: 'stylistic-seven', otFeature: 'ss07', label: 'Alternative Numbers',     sample: '0123456789' },
];

export const ALL_STYLISTIC_VARIANTS = stylisticSets.map((s) => s.name);
export const ALL_STYLISTIC_FEATURES = stylisticSets.map((s) => `"${s.otFeature}"`).join(', ');

// Returns a style object for the given current spec size key + weight, with all
// DM Sans stylistic alternates (ss01-ss07) enabled.
export function currentTextStyle(sizeKey, weight = 'regular') {
  const pack = fontPacks[sizeKey];
  if (!pack) throw new Error(`Unknown fontPacks size: ${sizeKey}`);
  return {
    fontFamily: dmSans[weight],
    fontSize: pack.fontSize,
    lineHeight: pack.lineHeight,
    letterSpacing: pack.letterSpacing,
    fontVariant: ALL_STYLISTIC_VARIANTS,
    ...(IS_WEB && { fontFeatureSettings: ALL_STYLISTIC_FEATURES }),
  };
}
