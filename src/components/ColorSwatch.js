import { StyleSheet, Text, View } from 'react-native';
import { content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

export default function ColorSwatch({ name, hex, onSurface, subname }) {
  const isDark = onSurface === 'dark';
  const mode = isDark ? 'dark' : 'light';
  const borderColor = layerTokens[mode].layer3BorderColor;
  const labelColor = content[mode].contentPrimary;
  const subColor = content[mode].contentSecondary;

  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: hex, borderColor }]} />
      <View style={styles.meta}>
        <Text style={[styles.name, { color: labelColor }]} numberOfLines={1}>
          {name}
        </Text>
        {subname && (
          <Text style={[styles.subname, { color: subColor }]} numberOfLines={1}>
            {subname}
          </Text>
        )}
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
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  name: {
    ...currentTextStyle('3', 'regular'),
  },
  subname: {
    ...currentTextStyle('1', 'regular'),
    marginTop: 1,
  },
  hex: {
    ...currentTextStyle('1', 'regular'),
    marginTop: 2,
  },
});
