import { Platform } from 'react-native';

// Mirrors the Tamagui font system: fontPacks scale + named weights + family tokens.
// Use these values when building text components so the visualization in the
// design system stays in sync with the source spec.

const IS_WEB = Platform.OS === 'web';

export const fontPacks = {
  '1': { fontSize: 10, lineHeight: 16, letterSpacing: 0.1 },
  '2': { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  '3': { fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  '4': { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  '5': { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  '6': { fontSize: 24, lineHeight: 32, letterSpacing: 0.1 },
  '7': { fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  '8': { fontSize: 40, lineHeight: 48, letterSpacing: 1 },
  '9': { fontSize: 48, lineHeight: 56, letterSpacing: 1.1 },
  '10': { fontSize: 56, lineHeight: 64, letterSpacing: 1.4 },
  '11': { fontSize: 64, lineHeight: 72, letterSpacing: 1.5 },
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

// Proposed scale — semantic role names mapped onto the size scale.
// Tighter (negative) letter-spacing at large sizes for proper display tracking.
export const proposedScale = [
  { name: 'label',           scaleSize: 1,  fontSize: 10, lineHeight: 16, letterSpacing: 0,    sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'label-medium',    scaleSize: 2,  fontSize: 12, lineHeight: 16, letterSpacing: 0,    sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'body-small',      scaleSize: 2,  fontSize: 12, lineHeight: 16, letterSpacing: 0,    sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'body-medium',     scaleSize: 3,  fontSize: 14, lineHeight: 20, letterSpacing: -0.1, sample: 'The quick brown fox jumps over' },
  { name: 'body-large',      scaleSize: 4,  fontSize: 16, lineHeight: 24, letterSpacing: -0.2, sample: 'Send money to anyone, anywhere' },
  { name: 'title-medium',    scaleSize: 4,  fontSize: 16, lineHeight: 24, letterSpacing: -0.2, sample: 'Send money to anyone, anywhere' },
  { name: 'title-large',     scaleSize: 5,  fontSize: 20, lineHeight: 28, letterSpacing: -0.3, sample: 'Send money to anyone' },
  { name: 'headline-small',  scaleSize: 6,  fontSize: 24, lineHeight: 32, letterSpacing: -0.4, sample: 'Send money' },
  { name: 'headline-medium', scaleSize: 7,  fontSize: 32, lineHeight: 40, letterSpacing: -0.6, sample: 'Send money' },
  { name: 'headline-large',  scaleSize: 8,  fontSize: 40, lineHeight: 48, letterSpacing: -0.8, sample: 'Send money' },
  { name: 'display-small',   scaleSize: 9,  fontSize: 48, lineHeight: 56, letterSpacing: -1,   sample: 'Send money' },
  { name: 'display-medium',  scaleSize: 10, fontSize: 56, lineHeight: 64, letterSpacing: -1.2, sample: 'Send money' },
  { name: 'display-large',   scaleSize: 11, fontSize: 64, lineHeight: 72, letterSpacing: -1.5, sample: 'Send money' },
];

export const ALL_STYLISTIC_VARIANTS = stylisticSets.map((s) => s.name);
export const ALL_STYLISTIC_FEATURES = stylisticSets.map((s) => `"${s.otFeature}"`).join(', ');

const proposedByName = Object.fromEntries(proposedScale.map((s) => [s.name, s]));

// Returns a style object for the given proposed role + weight, with all
// DM Sans stylistic alternates (ss01-ss07) enabled.
export function proposedTextStyle(roleName, weight = 'regular') {
  const role = proposedByName[roleName];
  if (!role) throw new Error(`Unknown proposed role: ${roleName}`);
  return {
    fontFamily: dmSans[weight],
    fontSize: role.fontSize,
    lineHeight: role.lineHeight,
    letterSpacing: role.letterSpacing,
    fontVariant: ALL_STYLISTIC_VARIANTS,
    ...(IS_WEB && { fontFeatureSettings: ALL_STYLISTIC_FEATURES }),
  };
}
