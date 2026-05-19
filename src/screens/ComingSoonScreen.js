import { StyleSheet, Text, View } from 'react-native';
import { dmSans } from '../theme/typography';

export default function ComingSoonScreen({ route, topInset = 0, mode }) {
  const title = route?.params?.title ?? 'Coming soon';
  const isDark = mode === 'dark';
  const bg = isDark ? '#0E1A1C' : '#F2F2F2';
  const titleColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const bodyColor = isDark ? '#A1A5A7' : '#666666';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: topInset }]}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.body, { color: bodyColor }]}>
        This section hasn't been built yet. Colors first — the rest will follow.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontFamily: dmSans.bold,
    fontSize: 22,
    marginBottom: 8,
  },
  body: {
    fontFamily: dmSans.regular,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
});
