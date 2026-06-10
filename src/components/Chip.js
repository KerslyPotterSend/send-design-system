import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import { content, layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

// Chip — a compact, rounded label used for tagging / categorizing content.
// Has two states only: 'default' and 'active' (e.g. a selected filter).
//   default — content/secondary text on a layer2 background
//   active  — content/primary text on a layer3 background
// Wrap multiple chips in <ChipGroup> to get the Spacing-S gap between them.
export default function Chip({
  children,
  label,
  mode = 'light',
  active = false,
  devMode = false,
  onPress,
}) {
  const [hover, setHover] = useState(false);
  const text = content[mode];
  const layer = layerTokens[mode];

  const backgroundColor = active ? layer.layer3Background : layer.layer2Background;
  const color = active ? text.contentPrimary : text.contentSecondary;

  // In dev mode render a Pressable even without onPress, so hover events fire.
  const Container = onPress || devMode ? Pressable : View;

  const describeChip = () => [
    { prop: 'background', ref: active ? 'layer3Background' : 'layer2Background', val: backgroundColor },
    { prop: 'color', ref: active ? 'content.contentPrimary' : 'content.contentSecondary', val: color },
    { prop: 'border-radius', ref: '100', val: '100px' },
    { prop: 'padding', ref: 'spacing.S spacing.M', val: '8px 12px' },
    { prop: 'font', ref: 'typography/2 · medium', val: '12px' },
  ];

  return (
    <Container
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected: active } : undefined}
      onPress={onPress}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
      style={[
        styles.chip,
        { backgroundColor },
        isWeb && onPress && { cursor: 'pointer' },
        isWeb && {
          transitionProperty: 'background-color, color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label ?? children}
      </Text>
      {isWeb && devMode && hover && (
        <DevTooltip mode={mode} title={`chip · ${active ? 'active' : 'default'}`} lines={describeChip()} />
      )}
    </Container>
  );
}

// Lays chips out in a wrapping row with the Spacing-S gap between them.
export function ChipGroup({ children, style }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.mobile.M, // 12 — left/right
    paddingVertical: spacing.mobile.S, //   8 — up/down
    borderRadius: 100,
  },
  label: {
    ...currentTextStyle('2', 'medium'), // Typography 2 (12/16)
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — gap between chips
  },
});
