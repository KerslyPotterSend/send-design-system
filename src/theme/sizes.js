// Source of truth: Figma variable export (Unit + Semantic: Size).
// Mobile and Desktop modes currently resolve to identical Unit references,
// but the structure mirrors Figma so the two can diverge later.

// =============================================================================
// PRIMITIVES — Figma "Unit"
// =============================================================================

export const unit = {
  0: 0,
  1: 1,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  56: 56,
  64: 64,
  72: 72,
  80: 80,
  88: 88,
  96: 96,
  104: 104,
  112: 112,
  120: 120,
  128: 128,
  999: 999,
};

// =============================================================================
// SEMANTIC TOKENS — Figma "Semantic: Size"
// =============================================================================

export const cornerRadius = {
  mobile:  { 0: unit[0], XS: unit[4], S: unit[8], L: unit[16], Pill: unit[999] },
  desktop: { 0: unit[0], XS: unit[4], S: unit[8], L: unit[16], Pill: unit[999] },
};

export const spacing = {
  mobile:  { 0: unit[0], XS: unit[4], S: unit[8], M: unit[12], L: unit[16], XL: unit[24], '2XL': unit[40] },
  desktop: { 0: unit[0], XS: unit[4], S: unit[8], M: unit[12], L: unit[16], XL: unit[24], '2XL': unit[40] },
};

export const border = {
  mobile:  { 0: unit[0], 1: unit[1] },
  desktop: { 0: unit[0], 1: unit[1] },
};

// Refs back to the Unit primitive name, used for display (`Unit/4`, `Unit/999`).
export const cornerRadiusRefs = {
  mobile:  { 0: '0', XS: '4', S: '8', L: '16', Pill: '999' },
  desktop: { 0: '0', XS: '4', S: '8', L: '16', Pill: '999' },
};

export const spacingRefs = {
  mobile:  { 0: '0', XS: '4', S: '8', M: '12', L: '16', XL: '24', '2XL': '40' },
  desktop: { 0: '0', XS: '4', S: '8', M: '12', L: '16', XL: '24', '2XL': '40' },
};

export const borderRefs = {
  mobile:  { 0: '0', 1: '1' },
  desktop: { 0: '0', 1: '1' },
};
