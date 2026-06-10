import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import { content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

// SegmentedControl — a row of mutually-exclusive options inside a single pill.
// The track sits on layer2; the selected segment is a layer3 pill with a subtle
// layer3 border. Selected text is content/primary, the rest content/secondary.
//   fullWidth — segments share the row evenly; otherwise each hugs its label.
export default function SegmentedControl({
  mode = 'dark',
  segments = [],
  value: valueProp,
  onChange,
  fullWidth = false,
  devMode = false,
}) {
  const [internal, setInternal] = useState(0);
  const [hovered, setHovered] = useState(null);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;

  const text = content[mode];
  const layer = layerTokens[mode];

  const select = (i) => {
    if (!isControlled) setInternal(i);
    onChange?.(i);
  };

  // Dev inspector: map a segment's resolved styles back to design-system tokens.
  const describeSegment = (active) => [
    { prop: 'background', ref: active ? 'layer3Background' : 'transparent', val: active ? layer.layer3Background : 'transparent' },
    { prop: 'color', ref: active ? 'content.contentPrimary' : 'content.contentSecondary', val: active ? text.contentPrimary : text.contentSecondary },
    { prop: 'border-radius', ref: 'cornerRadius.Pill', val: `${cornerRadius.mobile.Pill}px` },
    { prop: 'padding', ref: 'spacing.S spacing.L', val: '8px 16px' },
    { prop: 'font', ref: 'typography/3 · medium', val: '14px' },
  ];

  const webTransition = isWeb && {
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  };

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: layer.layer2Background },
        fullWidth ? styles.trackFull : styles.trackHug,
      ]}
    >
      {segments.map((segment, i) => {
        const active = i === value;
        const label = typeof segment === 'string' ? segment : segment.label;

        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => select(i)}
            onHoverIn={() => setHovered(i)}
            onHoverOut={() => setHovered((h) => (h === i ? null : h))}
            style={[
              styles.segment,
              fullWidth && styles.segmentFull,
              { backgroundColor: active ? layer.layer3Background : 'transparent' },
              isWeb && { cursor: 'pointer' },
              webTransition,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color: active ? text.contentPrimary : text.contentSecondary },
                webTransition,
              ]}
            >
              {label}
            </Text>
            {isWeb && devMode && hovered === i && (
              <DevTooltip mode={mode} title={`segment · ${active ? 'active' : 'default'}`} lines={describeSegment(active)} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.XS, // 4 — gap between segments
    padding: spacing.mobile.XS, // 4 — inset around the segments
    borderRadius: cornerRadius.mobile.Pill,
  },
  trackHug: {
    alignSelf: 'flex-start', // width hugs content
  },
  trackFull: {
    alignSelf: 'stretch',
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.mobile.S, // 8 — up/down
    paddingHorizontal: spacing.mobile.L, // 16 — left/right
    borderRadius: cornerRadius.mobile.Pill,
  },
  segmentFull: {
    flex: 1, // share the row evenly when full width
  },
  label: {
    ...currentTextStyle('3', 'medium'), // Typography 3
  },
});
