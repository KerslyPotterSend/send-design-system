import { StyleSheet, Text, View } from 'react-native';
import { base, content } from '../theme/colors';
import { proposedTextStyle } from '../theme/typography';

function isLight(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export default function ColorSwatch({ name, hex, onSurface }) {
  const isDark = onSurface === 'dark';
  const mode = isDark ? 'dark' : 'light';
  const borderColor = isLight(hex) ? base.light.base3 : 'transparent';
  const labelColor = content[mode].contentPrimary;
  const subColor = content[mode].contentSecondary;

  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: hex, borderColor }]} />
      <View style={styles.meta}>
        <Text style={[styles.name, { color: labelColor }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.hex, { color: subColor }]}>{hex.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  name: {
    ...proposedTextStyle('body-medium', 'medium'),
  },
  hex: {
    ...proposedTextStyle('body-small', 'regular'),
    marginTop: 2,
  },
});
