import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { base, content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const SECTIONS = [
  { key: 'Colors', subtitle: 'Base, brand, layer & content tokens', ready: true },
  { key: 'Typography', subtitle: 'Type scale, weights, line heights', ready: true },
  { key: 'Components', subtitle: 'Buttons, inputs, cards, etc.', ready: false },
];

const layer = layerTokens.light;
const baseTokens = base.light;
const contentTokens = content.light;

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>send design system</Text>
      <Text style={styles.subtitle}>A live showcase of the tokens and components used across the app.</Text>

      <View style={styles.list}>
        {SECTIONS.map((section) => (
          <Pressable
            key={section.key}
            style={({ pressed }) => [
              styles.item,
              pressed && section.ready && styles.itemPressed,
              !section.ready && styles.itemDisabled,
            ]}
            disabled={!section.ready}
            onPress={() => navigation.navigate(section.key)}
          >
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{section.key}</Text>
              <Text style={styles.itemSubtitle}>{section.subtitle}</Text>
            </View>
            <Text style={styles.itemChevron}>{section.ready ? '›' : 'Soon'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: layer.layer1Background,
  },
  content: {
    padding: 20,
    paddingTop: 8,
  },
  title: {
    ...currentTextStyle('7', 'bold'),
    color: contentTokens.contentPrimary,
    marginTop: 8,
  },
  subtitle: {
    ...currentTextStyle('3', 'regular'),
    color: contentTokens.contentSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: layer.layer2Background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: baseTokens.base3,
  },
  itemPressed: {
    backgroundColor: layer.layer2BackgroundHover,
  },
  itemDisabled: {
    opacity: 0.6,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    ...currentTextStyle('4', 'semiBold'),
    color: contentTokens.contentPrimary,
  },
  itemSubtitle: {
    ...currentTextStyle('2', 'regular'),
    color: contentTokens.contentSecondary,
    marginTop: 2,
  },
  itemChevron: {
    ...currentTextStyle('5', 'medium'),
    color: contentTokens.contentTertiary,
  },
});
