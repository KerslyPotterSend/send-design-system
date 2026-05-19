import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dmSans } from '../theme/typography';

const SECTIONS = [
  { key: 'Colors', subtitle: 'Base, brand, layer & content tokens', ready: true },
  { key: 'Typography', subtitle: 'Type scale, weights, line heights', ready: true },
  { key: 'Components', subtitle: 'Buttons, inputs, cards, etc.', ready: false },
];

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
    backgroundColor: '#F2F2F2',
  },
  content: {
    padding: 20,
    paddingTop: 8,
  },
  title: {
    fontFamily: dmSans.bold,
    fontSize: 28,
    color: '#1A1A1A',
    marginTop: 8,
  },
  subtitle: {
    fontFamily: dmSans.regular,
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  itemPressed: {
    backgroundColor: '#F2F2F2',
  },
  itemDisabled: {
    opacity: 0.6,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: dmSans.semiBold,
    fontSize: 17,
    color: '#1A1A1A',
  },
  itemSubtitle: {
    fontFamily: dmSans.regular,
    fontSize: 13,
    color: '#808080',
    marginTop: 2,
  },
  itemChevron: {
    fontFamily: dmSans.medium,
    fontSize: 20,
    color: '#999999',
  },
});
