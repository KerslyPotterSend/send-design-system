import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ColorSwatch from '../components/ColorSwatch';
import { base, brand, brandTokens, content, error, layerTokens } from '../theme/colors';
import { proposedTextStyle } from '../theme/typography';

const PALETTES = [
  { id: 'base', title: 'Base', description: 'Figma neutral / dark primitives', exportName: 'base', data: base },
  { id: 'brand', title: 'Brand', description: 'Brand green scale', exportName: 'brand', data: brand },
  { id: 'error', title: 'Error', description: 'Error / destructive red scale', exportName: 'error', data: error },
  { id: 'layer', title: 'Layer tokens', description: 'Resolved background / border tokens by layer', exportName: 'layerTokens', data: layerTokens },
  { id: 'brandTokens', title: 'Brand tokens', description: 'Resolved brand interactive tokens', exportName: 'brandTokens', data: brandTokens },
  { id: 'content', title: 'Content', description: 'Foreground text tokens', exportName: 'content', data: content },
];

const MODES = ['light', 'dark'];
const isWeb = Platform.OS === 'web';

export default function ColorsScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0 }) {
  const [internalMode, setInternalMode] = useState('light');
  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;
  const isDark = mode === 'dark';

  const layer = layerTokens[mode];
  const contentTokens = content[mode];
  const baseTokens = base[mode];

  const pageBg = layer.layer1Background;
  const cardBg = layer.layer2Background;
  const cardBorder = isDark ? baseTokens.base6 : baseTokens.base3;
  const titleColor = contentTokens.contentPrimary;
  const subColor = contentTokens.contentSecondary;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: (isWeb ? 24 : 20) + topInset }]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {!isControlled && (
          <View style={[styles.toggleBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {MODES.map((m) => (
              <ToggleButton
                key={m}
                label={m}
                active={mode === m}
                isDark={isDark}
                onPress={() => setMode(m)}
              />
            ))}
          </View>
        )}

        {PALETTES.map((palette) => {
          const tokens = palette.data[mode];
          const groups = palette.id === 'layer' ? groupByLayer(tokens) : null;
          return (
            <View
              key={palette.id}
              style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}
            >
              <Text style={[styles.sectionTitle, { color: titleColor }]}>{palette.title}</Text>
              <Text style={[styles.sectionSubtitle, { color: subColor }]}>{palette.description}</Text>
              <Text style={[styles.sectionExport, { color: subColor }]}>
                {`import { ${palette.exportName} } from 'theme/colors'`}
              </Text>

              {groups ? (
                groups.map((group) => (
                  <View key={group.label} style={styles.layerGroup}>
                    <Text style={[styles.layerGroupLabel, { color: subColor }]}>
                      {group.label}
                    </Text>
                    <View style={isWeb ? styles.swatchGrid : styles.swatchList}>
                      {group.entries.map(([key, hex]) => (
                        <View key={key} style={isWeb ? styles.swatchGridItem : null}>
                          <ColorSwatch
                            name={`${palette.exportName}.${mode}.${key}`}
                            hex={hex}
                            onSurface={isDark ? 'dark' : 'light'}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <View style={isWeb ? styles.swatchGrid : styles.swatchList}>
                  {Object.entries(tokens).map(([key, hex]) => (
                    <View key={key} style={isWeb ? styles.swatchGridItem : null}>
                      <ColorSwatch
                        name={`${palette.exportName}.${mode}.${key}`}
                        hex={hex}
                        onSurface={isDark ? 'dark' : 'light'}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function groupByLayer(tokens) {
  const buckets = new Map();
  for (const [key, hex] of Object.entries(tokens)) {
    const match = key.match(/^layer(\d+)/);
    const n = match ? match[1] : 'other';
    if (!buckets.has(n)) buckets.set(n, []);
    buckets.get(n).push([key, hex]);
  }
  return Array.from(buckets.entries()).map(([n, entries]) => ({
    label: n === 'other' ? 'Other' : `Layer ${n}`,
    entries,
  }));
}

function ToggleButton({ label, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);
  const mode = isDark ? 'dark' : 'light';
  const activeBg = isDark ? base.dark.base6 : content.light.contentPrimary;
  const hoverBg = layerTokens[mode].layer1BackgroundHover;
  const idleColor = content[mode].contentSecondary;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.toggleButton,
        active && { backgroundColor: activeBg },
        !active && hover && { backgroundColor: hoverBg },
        isWeb && { cursor: 'pointer' },
      ]}
    >
      <Text
        style={[
          styles.toggleLabel,
          { color: active ? '#FFFFFF' : idleColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isWeb ? 40 : 20,
    paddingBottom: 40,
    gap: 16,
    maxWidth: isWeb ? 1200 : undefined,
    width: '100%',
    alignSelf: isWeb ? 'center' : 'stretch',
  },
  toggleBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  toggleLabel: {
    ...proposedTextStyle('body-medium', 'semiBold'),
    textTransform: 'capitalize',
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: isWeb ? 24 : 16,
  },
  sectionTitle: {
    ...proposedTextStyle('title-large', 'bold'),
  },
  sectionSubtitle: {
    ...proposedTextStyle('body-medium', 'regular'),
    marginTop: 4,
  },
  sectionExport: {
    fontFamily: 'Menlo',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 12,
  },
  swatchList: {
    marginTop: 4,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginHorizontal: -8,
  },
  swatchGridItem: {
    width: '33.333%',
    paddingHorizontal: 8,
  },
  layerGroup: {
    marginTop: 20,
  },
  layerGroupLabel: {
    ...proposedTextStyle('label', 'semiBold'),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingBottom: 8,
    marginBottom: 4,
  },
});
