import { Platform, StyleSheet, Text, View } from 'react-native';
import { content, layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';

const isWeb = Platform.OS === 'web';
const MONO = isWeb ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'Courier';

// Dev-mode inspector overlay. Given a title and a list of { prop, ref } lines,
// renders a small floating card that names the design-system token (ref) behind
// each property — variable names only, no raw colors/pixels. Surface/border use
// the layer3 tokens for the current mode. Host must be position: 'relative'.
export default function DevTooltip({ title, lines = [], mode = 'dark' }) {
  const layer = layerTokens[mode];
  const text = content[mode];

  return (
    <View
      style={[styles.tooltip, { backgroundColor: layer.layer3Background, borderColor: layer.layer3BorderColor }]}
      pointerEvents="none"
    >
      {title ? <Text style={[styles.title, { color: text.contentBrand }]}>{title}</Text> : null}
      {lines.map((l, i) => (
        <Text key={i} style={styles.line}>
          <Text style={{ color: text.contentSecondary }}>{l.prop}</Text>
          <Text style={{ color: text.contentSecondary }}>: </Text>
          <Text style={{ color: text.contentPrimary }}>{l.ref}</Text>
          <Text style={{ color: text.contentSecondary }}>;</Text>
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 8,
    minWidth: 320,
    maxWidth: 520,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 99999,
    elevation: 99999, // Android stacking
    ...(isWeb && { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }),
  },
  title: {
    fontFamily: MONO,
    fontSize: 12, // Typography 2
    lineHeight: 16,
    marginBottom: spacing.mobile['2XL'], // 40 — gap from title to the variables
  },
  line: { fontFamily: MONO, fontSize: 12, lineHeight: 18 }, // Typography 2
});
