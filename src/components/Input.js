import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { content, feedback, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const ICON_SIZE = 20;

// Each layer renders the field on a different surface token (Layer 1 / 2 / 3).
const LAYER_TOKENS = {
  1: { bg: 'layer1Background', border: 'layer1BorderColor', bgFocus: 'layer1BackgroundFocus', borderFocus: 'layer1BorderColorFocus', bgDisabled: 'layer1BackgroundDisabled', borderDisabled: 'layer1BorderColorDisabled' },
  2: { bg: 'layer2Background', border: 'layer2BorderColor', bgFocus: 'layer2BackgroundFocus', borderFocus: 'layer2BorderColorFocus', bgDisabled: 'layer2BackgroundDisabled', borderDisabled: 'layer2BorderColorDisabled' },
  3: { bg: 'layer3Background', border: 'layer3BorderColor', bgFocus: 'layer3BackgroundFocus', borderFocus: 'layer3BorderColorFocus', bgDisabled: 'layer3BackgroundDisabled', borderDisabled: 'layer3BorderColorDisabled' },
};

export default function Input({
  layer = 1,
  mode = 'dark',
  state = 'default',
  rounded = false,
  label = 'Label',
  placeholder = 'Enter text...',
  helperText = 'Helper text',
  value: valueProp,
  onChangeText,
}) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
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

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <View
        style={[
          styles.field,
          {
            backgroundColor: fieldBg,
            borderColor: fieldBorder,
            borderRadius: rounded ? cornerRadius.mobile.Pill : cornerRadius.mobile.S,
          },
          isWeb && {
            transitionProperty: 'background-color, border-color',
            transitionDuration: '260ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        ]}
      >
        <Ionicons name="search-outline" size={ICON_SIZE} color={iconColor} />

        <TextInput
          style={[styles.input, { color: inputColor }, isWeb && { outlineStyle: 'none' }]}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
        />

        {value.length > 0 && !disabled && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear"
            onPress={() => setValue('')}
            style={isWeb && { cursor: 'pointer' }}
          >
            <Ionicons name="close" size={ICON_SIZE} color={text.contentPrimary} />
          </Pressable>
        )}
      </View>

      {helperText ? (
        <View style={styles.helperRow}>
          <Ionicons name="information-circle-outline" size={ICON_SIZE} color={helperColor} />
          <Text style={[styles.helperText, { color: helperColor }]}>{helperText}</Text>
        </View>
      ) : null}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — icon ↔ text
    paddingHorizontal: spacing.mobile.M, // 12
    paddingVertical: spacing.mobile.S, // 8
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
