import DevTooltip from './DevTooltip';
import Icon from './Icon';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { content, feedback, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const HELPER_ICON_SIZE = 16; // info icon sized to sit with the 12px helper text
const FIELD_HEIGHT = 96;

// Each layer renders the field on a different surface token (Layer 1 / 2 / 3).
const LAYER_TOKENS = {
  1: { bg: 'layer1Background', border: 'layer1BorderColor', bgFocus: 'layer1BackgroundFocus', borderFocus: 'layer1BorderColorFocus', bgDisabled: 'layer1BackgroundDisabled', borderDisabled: 'layer1BorderColorDisabled' },
  2: { bg: 'layer2Background', border: 'layer2BorderColor', bgFocus: 'layer2BackgroundFocus', borderFocus: 'layer2BorderColorFocus', bgDisabled: 'layer2BackgroundDisabled', borderDisabled: 'layer2BorderColorDisabled' },
  3: { bg: 'layer3Background', border: 'layer3BorderColor', bgFocus: 'layer3BackgroundFocus', borderFocus: 'layer3BorderColorFocus', bgDisabled: 'layer3BackgroundDisabled', borderDisabled: 'layer3BorderColorDisabled' },
};

export default function TextArea({
  layer = 1,
  mode = 'dark',
  state = 'default',
  label = 'Label',
  placeholder = 'Enter text...',
  helperText = 'Helper text',
  value: valueProp,
  onChangeText,
  devMode = false,
}) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const setValue = isControlled ? onChangeText : setInternalValue;

  const text = content[mode];
  const layerToken = LAYER_TOKENS[layer] ?? LAYER_TOKENS[1];

  const disabled = state === 'disabled';
  const showFocus = state === 'focus' || (focused && !disabled);

  let fieldBg = layerTokens[mode][showFocus ? layerToken.bgFocus : layerToken.bg];
  let fieldBorder = layerTokens[mode][showFocus ? layerToken.borderFocus : layerToken.border];
  if (disabled) {
    fieldBg = layerTokens[mode][layerToken.bgDisabled];
    fieldBorder = layerTokens[mode][layerToken.borderDisabled];
  } else if (state === 'error' || state === 'warning') {
    fieldBorder = feedback[mode][state];
  }

  const iconColor = disabled ? text.contentTertiary : text.contentSecondary;
  const inputColor = disabled ? text.contentTertiary : text.contentPrimary;
  const placeholderColor = disabled ? text.contentTertiary : text.contentSecondary;
  const labelColor = disabled ? text.contentTertiary : text.contentSecondary;
  // Error / warning tint the helper icon + text with the matching feedback color.
  const helperColor =
    !disabled && (state === 'error' || state === 'warning') ? feedback[mode][state] : iconColor;

  const bgRef = disabled ? layerToken.bgDisabled : showFocus ? layerToken.bgFocus : layerToken.bg;
  let borderRef = disabled ? layerToken.borderDisabled : showFocus ? layerToken.borderFocus : layerToken.border;
  if (!disabled && (state === 'error' || state === 'warning')) borderRef = `feedback.${state}`;
  const devLines = [
    { prop: 'background', ref: bgRef },
    { prop: 'border', ref: borderRef },
    { prop: 'border-radius', ref: 'cornerRadius.S' },
    { prop: 'color', ref: disabled ? 'content.contentTertiary' : 'content.contentPrimary' },
    { prop: 'label', ref: disabled ? 'content.contentTertiary' : 'content.contentSecondary' },
    { prop: 'padding', ref: 'spacing.M spacing.L' },
    { prop: 'font', ref: 'typography/4 · regular' },
  ];

  const Container = devMode ? Pressable : View;

  return (
    <Container
      style={styles.container}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
    >
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <View
        style={[
          styles.field,
          {
            backgroundColor: fieldBg,
            borderColor: fieldBorder,
            borderRadius: cornerRadius.mobile.S,
          },
          isWeb && {
            transitionProperty: 'background-color, border-color',
            transitionDuration: '260ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: inputColor }, isWeb && { outlineStyle: 'none' }]}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          multiline
          textAlignVertical="top"
        />
      </View>

      {helperText ? (
        <View style={styles.helperRow}>
          <Icon name="info" size={HELPER_ICON_SIZE} color={helperColor} />
          <Text style={[styles.helperText, { color: helperColor }]}>{helperText}</Text>
        </View>
      ) : null}

      {isWeb && devMode && hover && (
        <DevTooltip mode={mode} title={`text area · layer${layer} · ${state}`} lines={devLines} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.mobile.S, // 8 — label / field / helper rhythm
    alignSelf: 'stretch',
  },
  label: {
    ...currentTextStyle('3', 'regular'),
  },
  field: {
    height: FIELD_HEIGHT, // 96
    paddingHorizontal: spacing.mobile.L, // 16
    paddingTop: spacing.mobile.M, // 12
    paddingBottom: spacing.mobile.M, // 12
    borderWidth: 1,
  },
  input: {
    flex: 1,
    ...currentTextStyle('4', 'regular'),
    padding: 0,
    margin: 0,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.XS, // 4 — info icon ↔ helper text
  },
  helperText: {
    ...currentTextStyle('2', 'regular'),
  },
});
