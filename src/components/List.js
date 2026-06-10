import { Children, Fragment, cloneElement, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import { content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

// Each layer renders the item on a different surface token (Layer 1 / 2 / 3),
// with interactive background states resolved from that layer.
const LAYER_BG = {
  1: { base: 'layer1Background', hover: 'layer1BackgroundHover', press: 'layer1BackgroundPress', disabled: 'layer1BackgroundDisabled' },
  2: { base: 'layer2Background', hover: 'layer2BackgroundHover', press: 'layer2BackgroundPress', disabled: 'layer2BackgroundDisabled' },
  3: { base: 'layer3Background', hover: 'layer3BackgroundHover', press: 'layer3BackgroundPress', disabled: 'layer3BackgroundDisabled' },
};

// ListItem — a single interactive row. Background tracks the layer + state:
//   default / hover / press / disabled, all from the chosen layer's tokens.
export default function ListItem({
  mode = 'dark',
  layer = 1,
  state = 'default', // 'default' | 'hover' | 'press' | 'disabled'
  label = 'List item',
  children,
  onPress,
  devMode = false,
  flush = false, // true when grouped in a List of >1 — drop the corner radius
}) {
  const [hover, setHover] = useState(false); // dev-tooltip hover only

  // Background is driven purely by the state prop — no per-item mouse hover/press,
  // so pointing at the list doesn't light up rows independently.
  const isDisabled = state === 'disabled';
  const isPressed = state === 'press';
  const isHover = state === 'hover';

  const text = content[mode];
  const tokens = LAYER_BG[layer] ?? LAYER_BG[1];

  let bgRef = tokens.base;
  if (isDisabled) bgRef = tokens.disabled;
  else if (isPressed) bgRef = tokens.press;
  else if (isHover) bgRef = tokens.hover;
  const backgroundColor = layerTokens[mode][bgRef];

  const labelColor = isDisabled ? text.contentTertiary : text.contentPrimary;

  const devLines = [
    { prop: 'background', ref: bgRef },
    { prop: 'color', ref: isDisabled ? 'content.contentTertiary' : 'content.contentPrimary' },
    { prop: 'padding', ref: 'spacing.M spacing.L' },
    { prop: 'font', ref: 'typography/4 · regular' },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      // Stay hoverable in dev mode so the tooltip still appears over a disabled row.
      disabled={isDisabled && !devMode}
      onPress={isDisabled ? undefined : onPress}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
      style={[
        styles.item,
        { backgroundColor, borderRadius: flush ? 0 : cornerRadius.mobile.S },
        isWeb && !isDisabled && { cursor: 'pointer' },
        isWeb && {
          transitionProperty: 'background-color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      {children ?? (
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      )}

      {isWeb && devMode && hover && (
        <DevTooltip mode={mode} title={`list item · layer${layer} · ${state}`} lines={devLines} />
      )}
    </Pressable>
  );
}

// List — a vertical stack of ListItems, optionally separated by dividers.
// With more than one item the items go flush (no radius) inside a same-color
// container (layer{N} background) with Spacing-S padding and an L radius.
export function List({ children, mode = 'dark', layer = 1, divider = false, style }) {
  const items = Children.toArray(children);
  const grouped = items.length > 1;
  const dividerColor = layerTokens[mode].layer2BorderColor;

  const rows = items.map((child, i) => (
    <Fragment key={i}>
      {grouped ? cloneElement(child, { flush: true }) : child}
      {divider && i < items.length - 1 && (
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      )}
    </Fragment>
  ));

  if (!grouped) return <View style={[styles.list, style]}>{rows}</View>;

  return (
    <View
      style={[
        styles.group,
        { backgroundColor: layerTokens[mode][`layer${layer}Background`] },
        style,
      ]}
    >
      {rows}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
  },
  group: {
    alignSelf: 'stretch',
    padding: spacing.mobile.S, // 8
    borderRadius: cornerRadius.mobile.L, // 16
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.M, // 12 — leading ↔ content
    paddingVertical: spacing.mobile.M, // 12
    paddingHorizontal: spacing.mobile.L, // 16
    alignSelf: 'stretch',
  },
  label: {
    ...currentTextStyle('4', 'regular'), // Typography 4
  },
});
