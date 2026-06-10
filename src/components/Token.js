import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import Icon from './Icon';
import { content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const ICON = 20; // chain icon + chevron are both 20×20

// Token — a selectable token chip. Shows the active token's chain icon + symbol
// and an arrow; tapping opens a menu to pick another token.
//   tokens: [{ symbol, name, icon }]  (icon = a require()'d image source)
//   type:  'selected' — sits in a layer3 background pill (default)
//          'fixed'    — no background, just icon + symbol + arrow
export default function Token({
  mode = 'dark',
  type = 'selected',
  tokens = [],
  value: valueProp,
  onChange,
  devMode = false,
}) {
  const [internal, setInternal] = useState(0);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const isControlled = valueProp !== undefined;
  const index = isControlled ? valueProp : internal;

  const text = content[mode];
  const layer = layerTokens[mode];
  const selected = tokens[index] ?? tokens[0];
  const isFixed = type === 'fixed';
  const triggerBg = isFixed ? 'transparent' : layer.layer3Background;

  const select = (i) => {
    if (!isControlled) setInternal(i);
    onChange?.(i);
    setOpen(false);
  };

  const devLines = [
    { prop: 'background', ref: isFixed ? 'transparent' : 'layer3Background' },
    { prop: 'color', ref: 'content.contentPrimary' },
    { prop: 'border-radius', ref: 'cornerRadius.Pill' },
    { prop: 'padding', ref: 'spacing.S' },
    { prop: 'gap', ref: 'spacing.S' },
    { prop: 'icon-size', ref: '20' },
    { prop: 'font', ref: 'typography/3 · medium' },
  ];

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole={isFixed ? 'text' : 'button'}
        accessibilityState={isFixed ? undefined : { expanded: open }}
        onPress={isFixed ? undefined : () => setOpen((o) => !o)}
        onHoverIn={devMode ? () => setHover(true) : undefined}
        onHoverOut={devMode ? () => setHover(false) : undefined}
        style={[
          styles.trigger,
          { backgroundColor: triggerBg },
          isWeb && !isFixed && { cursor: 'pointer' },
        ]}
      >
        {selected?.icon && <Image source={selected.icon} style={styles.coin} resizeMode="contain" />}
        <Text style={[styles.label, { color: text.contentPrimary }]} numberOfLines={1}>
          {selected?.symbol}
        </Text>
        {!isFixed && (
          <Icon
            name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            size={ICON}
            color={text.contentPrimary}
          />
        )}

        {isWeb && devMode && hover && (
          <DevTooltip mode={mode} title={`token · ${type}`} lines={devLines} />
        )}
      </Pressable>

      {open && !isFixed && (
        <View style={[styles.menu, { backgroundColor: layer.layer3Background }]}>
          {tokens.map((tk, i) => (
            <Pressable
              key={tk.symbol}
              accessibilityRole="button"
              accessibilityState={{ selected: i === index }}
              onPress={() => select(i)}
              style={({ hovered }) => [
                styles.item,
                (hovered || i === index) && { backgroundColor: layer.layer3BackgroundHover },
                isWeb && { cursor: 'pointer' },
              ]}
            >
              {tk.icon && <Image source={tk.icon} style={styles.coin} resizeMode="contain" />}
              <Text style={[styles.label, { color: text.contentPrimary }]} numberOfLines={1}>
                {tk.symbol}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start', // hugs content
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — icon ↔ label ↔ chevron
    padding: spacing.mobile.S, // 8 — all sides
    borderRadius: cornerRadius.mobile.Pill,
  },
  coin: {
    width: ICON,
    height: ICON,
    borderRadius: ICON / 2,
  },
  label: {
    ...currentTextStyle('3', 'medium'), // Typography 3
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: spacing.mobile.XS, // 4
    minWidth: '100%',
    borderRadius: cornerRadius.mobile.L, // 16 — menu container
    padding: spacing.mobile.S, // 8
    gap: spacing.mobile.XS, // 4
    zIndex: 99998, // 2nd to the dev tooltip (99999), above everything else
    elevation: 99998,
    ...(isWeb && { boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8
    padding: spacing.mobile.S, // 8
    borderRadius: cornerRadius.mobile.S, // 8 — hover/selected highlight
  },
});
