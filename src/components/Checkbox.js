import DevTooltip from './DevTooltip';
import Icon from './Icon';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { brandTokens, content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing, unit } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

// Box dimensions per size — label stays Typography 3 in both.
const SIZES = {
  default: { box: unit[24], icon: 16 }, // 24 × 24
  small: { box: unit[20] ?? 20, icon: 14 }, // 20 × 20
};

const BORDER_WIDTH = 1.5; // inside

export default function Checkbox({
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
  const filled = state === 'checked' || state === 'intermediate';

  // Press toggles checked ↔ unchecked (intermediate resolves to checked).
  const toggle = () => {
    if (disabled) return;
    const next = state === 'checked' ? 'unchecked' : 'checked';
    if (!isControlled) setInternalState(next);
    onChange?.(next);
  };

  // Unchecked: layer2 border, no fill. Checked/intermediate: content/brand fill.
  let boxBg = filled ? text.contentBrand : 'transparent';
  let boxBorder = filled ? text.contentBrand : layerTokens[mode].layer2BorderColor;
  let iconColor = brand.brandColor;
  let labelColor = text.contentPrimary;

  // Disabled checked/intermediate use the brand disabled tokens; label drops to secondary.
  if (disabled) {
    labelColor = text.contentSecondary;
    if (filled) {
      boxBg = brand.brandBackgroundDisabled; // background/Disabled
      boxBorder = brand.brandBackgroundDisabled;
      iconColor = brand.brandColorDisabled; // color/Disabled
    }
  }

  const devLines = [
    { prop: 'background', ref: filled ? (disabled ? 'brandBackgroundDisabled' : 'content.contentBrand') : 'transparent' },
    { prop: 'border', ref: filled ? (disabled ? 'brandBackgroundDisabled' : 'content.contentBrand') : 'layer2BorderColor' },
    { prop: 'icon', ref: disabled ? 'brandColorDisabled' : 'brandColor' },
    { prop: 'border-radius', ref: 'cornerRadius.XS' },
    { prop: 'label', ref: disabled ? 'content.contentSecondary' : 'content.contentPrimary' },
  ];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: state === 'intermediate' ? 'mixed' : state === 'checked',
        disabled,
      }}
      onPress={toggle}
      disabled={disabled}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
      style={[styles.row, isWeb && !disabled && { cursor: 'pointer' }]}
    >
      <View
        style={[
          styles.box,
          { width: dims.box, height: dims.box, backgroundColor: boxBg, borderColor: boxBorder },
          isWeb && {
            transitionProperty: 'background-color, border-color',
            transitionDuration: '160ms',
            transitionTimingFunction: 'ease-out',
          },
        ]}
      >
        {state === 'checked' && <Icon name="check" size={dims.icon} color={iconColor} />}
        {state === 'intermediate' && <Icon name="remove" size={dims.icon} color={iconColor} />}
      </View>

      {hasLabel && <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}

      {isWeb && devMode && hover && (
        <DevTooltip mode={mode} title={`checkbox · ${state}${disabled ? ' · disabled' : ''}`} lines={devLines} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — box ↔ label
  },
  box: {
    borderRadius: cornerRadius.mobile.XS, // 4
    borderWidth: BORDER_WIDTH, // 1.5, inside
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...currentTextStyle('3', 'regular'), // Typography 3
  },
});
