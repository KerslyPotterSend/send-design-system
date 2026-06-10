import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import { brandTokens, content, layerTokens } from '../theme/colors';
import { spacing, unit } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

// Box dimensions per size — matches Checkbox; label stays Typography 3 in both.
// `dot` is the selected indicator (a filled circle) instead of the check icon.
const SIZES = {
  default: { box: unit[24], dot: 10 }, // 24 × 24
  small: { box: unit[20] ?? 20, dot: 8 }, // 20 × 20
};

const BORDER_WIDTH = 1.5; // inside

export default function Radio({
  mode = 'dark',
  size = 'default',
  state: stateProp,
  onChange,
  disabled = false,
  hasLabel = true,
  label = 'Label',
  devMode = false,
}) {
  const [internalState, setInternalState] = useState('unchecked');
  const [hover, setHover] = useState(false);
  const isControlled = stateProp !== undefined;
  const state = isControlled ? stateProp : internalState;

  const dims = SIZES[size] ?? SIZES.default;
  const text = content[mode];
  const brand = brandTokens[mode];
  const checked = state === 'checked';

  // Press selects (toggles checked ↔ unchecked when used standalone).
  const toggle = () => {
    if (disabled) return;
    const next = checked ? 'unchecked' : 'checked';
    if (!isControlled) setInternalState(next);
    onChange?.(next);
  };

  // Unchecked: layer2 border, no fill. Checked: content/brand fill, brand/color dot.
  let boxBg = checked ? text.contentBrand : 'transparent';
  let boxBorder = checked ? text.contentBrand : layerTokens[mode].layer2BorderColor;
  let dotColor = brand.brandColor;
  let labelColor = text.contentPrimary;

  // Disabled checked uses the brand disabled tokens; label drops to secondary.
  if (disabled) {
    labelColor = text.contentSecondary;
    if (checked) {
      boxBg = brand.brandBackgroundDisabled; // background/Disabled
      boxBorder = brand.brandBackgroundDisabled;
      dotColor = brand.brandColorDisabled; // color/Disabled
    }
  }

  const devLines = [
    { prop: 'background', ref: checked ? (disabled ? 'brandBackgroundDisabled' : 'content.contentBrand') : 'transparent' },
    { prop: 'border', ref: checked ? (disabled ? 'brandBackgroundDisabled' : 'content.contentBrand') : 'layer2BorderColor' },
    { prop: 'dot', ref: disabled ? 'brandColorDisabled' : 'brandColor' },
    { prop: 'border-radius', ref: 'circle' },
    { prop: 'label', ref: disabled ? 'content.contentSecondary' : 'content.contentPrimary' },
  ];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      onPress={toggle}
      disabled={disabled}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
      style={[styles.row, isWeb && !disabled && { cursor: 'pointer' }]}
    >
      <View
        style={[
          styles.box,
          {
            width: dims.box,
            height: dims.box,
            borderRadius: dims.box / 2, // circular
            backgroundColor: boxBg,
            borderColor: boxBorder,
          },
          isWeb && {
            transitionProperty: 'background-color, border-color',
            transitionDuration: '160ms',
            transitionTimingFunction: 'ease-out',
          },
        ]}
      >
        {checked && (
          <View
            style={{
              width: dims.dot,
              height: dims.dot,
              borderRadius: dims.dot / 2,
              backgroundColor: dotColor,
            }}
          />
        )}
      </View>

      {hasLabel && <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}

      {isWeb && devMode && hover && (
        <DevTooltip mode={mode} title={`radio · ${state}${disabled ? ' · disabled' : ''}`} lines={devLines} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — circle ↔ label
  },
  box: {
    borderWidth: BORDER_WIDTH, // 1.5, inside
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...currentTextStyle('3', 'regular'), // Typography 3
  },
});
