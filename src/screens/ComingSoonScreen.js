import { StyleSheet, Text, View } from 'react-native';
import { content, layerTokens } from '../theme/colors';
import { proposedTextStyle } from '../theme/typography';

export default function ComingSoonScreen({ route, topInset = 0, mode = 'light' }) {
  const title = route?.params?.title ?? 'Coming soon';
  const layer = layerTokens[mode];
  const contentTokens = content[mode];

  return (
    <View style={[styles.container, { backgroundColor: layer.layer1Background, paddingTop: topInset }]}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={[styles.title, { color: contentTokens.contentPrimary }]}>{title}</Text>
      <Text style={[styles.body, { color: contentTokens.contentSecondary }]}>
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
    ...proposedTextStyle('headline-small', 'bold'),
    marginBottom: 8,
  },
  body: {
    ...proposedTextStyle('body-medium', 'regular'),
    textAlign: 'center',
    maxWidth: 280,
  },
});
