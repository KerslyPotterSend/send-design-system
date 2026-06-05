import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const ICON_SIZE = 20;

// Each layer renders the field on a different surface token (Layer 1 / 2 / 3).
const LAYER_TOKENS = {
  1: { bg: 'layer1Background', border: 'layer1BorderColor', bgFocus: 'layer1BackgroundFocus', borderFocus: 'layer1BorderColorFocus' },
  2: { bg: 'layer2Background', border: 'layer2BorderColor', bgFocus: 'layer2BackgroundFocus', borderFocus: 'layer2BorderColorFocus' },
  3: { bg: 'layer3Background', border: 'layer3BorderColor', bgFocus: 'layer3BackgroundFocus', borderFocus: 'layer3BorderColorFocus' },
};

export default function Input({
  layer = 1,
  mode = 'dark',
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
  const fieldBg = layerTokens[mode][focused ? layerToken.bgFocus : layerToken.bg];
  const fieldBorder = layerTokens[mode][focused ? layerToken.borderFocus : layerToken.border];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: text.contentSecondary }]}>{label}</Text>

      <View
        style={[
          styles.field,
          { backgroundColor: fieldBg, borderColor: fieldBorder },
          isWeb && {
            transitionProperty: 'background-color, border-color',
            transitionDuration: '260ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        ]}
      >
        <Ionicons name="search-outline" size={ICON_SIZE} color={text.contentSecondary} />

        <TextInput
          style={[styles.input, { color: text.contentPrimary }, isWeb && { outlineStyle: 'none' }]}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={text.contentSecondary}
        />

        {value.length > 0 && (
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
          <Ionicons name="information-circle-outline" size={ICON_SIZE} color={text.contentSecondary} />
          <Text style={[styles.helperText, { color: text.contentSecondary }]}>{helperText}</Text>
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
    borderRadius: cornerRadius.mobile.S, // 8
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
