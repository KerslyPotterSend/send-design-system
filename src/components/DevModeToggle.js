import { StyleSheet, Text, View } from 'react-native';
import { PillSwitch } from './Controls';
import Icon from './Icon';
import { base, brandTokens, content } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

// A Figma-style "Dev Mode" switch shown at the top-right of a page: a code icon
// + label + pill toggle. Lights up with the brand color when on. Self-contained
// (resolves its own tokens from `mode`) so any screen can drop it beside a title.
export default function DevModeToggle({ mode = 'dark', value, onChange }) {
  const isDark = mode === 'dark';
  const text = content[mode];
  const brand = brandTokens[mode];

  return (
    <View style={styles.row}>
      <Icon name="code" size={18} color={value ? brand.brandBackground : text.contentSecondary} />
      <Text style={[styles.label, { color: value ? text.contentPrimary : text.contentSecondary }]}>
        Dev Mode
      </Text>
      <PillSwitch
        value={value}
        onChange={onChange}
        trackOn={brand.brandBackground}
        trackOff={isDark ? base.dark.base6 : base.light.base4}
        thumbOn={brand.brandColor}
        thumbOff={isDark ? base.dark.base9 : base.light.base1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mobile.S, // 8 — icon ↔ label ↔ switch
  },
  label: {
    ...currentTextStyle('2', 'medium'), // Typography 2
  },
});
