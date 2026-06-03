import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ColorSwatch from '../components/ColorSwatch';
import { base, brand, brandTokens, content, layerTokens, radix } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

// =============================================================================
// Group definitions — primitives vs. semantic tokens.
// =============================================================================

const PRIMITIVE_PALETTES = [
  { id: 'base',  title: 'Base',  description: 'Figma neutral / dark primitives', exportName: 'base',  data: base },
  { id: 'brand', title: 'Brand', description: 'Brand green scale',               exportName: 'brand', data: brand },
];

function pickLayer(n) {
  const prefix = `layer${n}`;
  return {
    light: Object.fromEntries(Object.entries(layerTokens.light).filter(([k]) => k.startsWith(prefix))),
    dark:  Object.fromEntries(Object.entries(layerTokens.dark).filter(([k]) => k.startsWith(prefix))),
  };
}

const SEMANTIC_PALETTES = [
  { id: 'content',     title: 'content', description: 'Foreground text & icon tokens',                exportName: 'content',     groupKey: 'content', keyPrefix: 'content', data: content },
  { id: 'layer1',      title: 'layer1',  description: 'Layer 1 — page background surfaces',           exportName: 'layerTokens', groupKey: 'layer1',  keyPrefix: 'layer1',  data: pickLayer(1) },
  { id: 'layer2',      title: 'layer2',  description: 'Layer 2 — cards & sheets sitting above layer 1', exportName: 'layerTokens', groupKey: 'layer2',  keyPrefix: 'layer2',  data: pickLayer(2) },
  { id: 'layer3',      title: 'layer3',  description: 'Layer 3 — popovers / menus / elevated panels', exportName: 'layerTokens', groupKey: 'layer3',  keyPrefix: 'layer3',  data: pickLayer(3) },
  { id: 'brandTokens', title: 'brand',   description: 'Brand-coloured interactive surfaces',          exportName: 'brandTokens', groupKey: 'brand',   keyPrefix: 'brand',   data: brandTokens },
];

// =============================================================================
// Figma names for the primitive scales.
// =============================================================================

const BASE_LABELS = {
  light: {
    base1: 'Color/Primary/White',
    base2: 'Color/Neutral/50',
    base3: 'Color/Neutral/100',
    base4: 'Color/Neutral/200',
    base5: 'Color/Neutral/300',
    base6: 'Color/Neutral/400',
    base7: 'Color/Neutral/500',
    base8: 'Color/Neutral/600',
    base9: 'Color/Neutral/700',
    base10: 'Color/Neutral/800',
    base11: 'Color/Neutral/900',
    base12: 'Color/Primary/Dark',
  },
  dark: {
    base1: 'Color/Dark/900',
    base2: 'Color/Dark/800',
    base3: 'Color/Dark/700',
    base4: 'Color/Dark/600',
    base5: 'Color/Dark/500',
    base6: 'Color/Dark/400',
    base7: 'Color/Dark/300',
    base8: 'Color/Dark/200',
    base9: 'Color/Dark/100',
    base12: 'Color/Primary/White',
  },
};

const BRAND_LABELS = {
  light: { brand1: 'Color/Brand/100', brand2: 'Color/Brand/200', brand3: 'Color/Brand/300', brand4: 'Color/Brand/400', brand5: 'Color/Brand/500', brand6: 'Color/Brand/600', brand7: 'Color/Brand/700', brand8: 'Color/Brand/800', brand9: 'Color/Brand/900' },
  dark:  { brand1: 'Color/Brand/900', brand2: 'Color/Brand/800', brand3: 'Color/Brand/700', brand4: 'Color/Brand/600', brand5: 'Color/Brand/500', brand6: 'Color/Brand/400', brand7: 'Color/Brand/300', brand8: 'Color/Brand/200', brand9: 'Color/Brand/100' },
};

function primitiveSwatchLabel(paletteId, mode, key) {
  if (paletteId === 'base') return BASE_LABELS[mode][key] ?? key;
  if (paletteId === 'brand') return BRAND_LABELS[mode][key] ?? key;
  return key;
}

// =============================================================================
// Which Figma primitive each semantic token resolves to. Format: "Group/Shade".
// =============================================================================

const TOKEN_REFS = {
  content: {
    light: { primary: 'Neutral/900', secondary: 'Neutral/500', tertiary: 'Neutral/200', brand: 'Brand/600', brandHover: 'Brand/700', brandPress: 'Brand/800' },
    dark:  { primary: 'Primary/White', secondary: 'Neutral/400', tertiary: 'Neutral/700', brand: 'Brand/500', brandHover: 'Brand/400', brandPress: 'Brand/600' },
  },
  layer1: {
    light: { background: 'Neutral/50', backgroundHover: 'Neutral/100', backgroundPress: 'Neutral/200', backgroundFocus: 'Neutral/50', backgroundDisabled: 'Neutral/50', borderColor: 'Neutral/50', borderColorHover: 'Neutral/300', borderColorPress: 'Neutral/100', borderColorFocus: 'Brand/700', borderColorDisabled: 'Neutral/100', outlineColor: 'Brand/700' },
    dark:  { background: 'Dark/700',   backgroundHover: 'Dark/600',    backgroundPress: 'Dark/800',    backgroundFocus: 'Dark/700',   backgroundDisabled: 'Dark/700',   borderColor: 'Dark/700',   borderColorHover: 'Dark/400',    borderColorPress: 'Dark/600',    borderColorFocus: 'Brand/500', borderColorDisabled: 'Dark/600',    outlineColor: 'Brand/500' },
  },
  layer2: {
    light: { background: 'Primary/White', backgroundHover: 'Neutral/50', backgroundPress: 'Neutral/100', backgroundFocus: 'Primary/White', backgroundDisabled: 'Primary/White', borderColor: 'Neutral/200', borderColorHover: 'Neutral/300', borderColorPress: 'Neutral/200', borderColorFocus: 'Brand/700', borderColorDisabled: 'Neutral/100', outlineColor: 'Brand/700' },
    dark:  { background: 'Dark/500',      backgroundHover: 'Dark/400',   backgroundPress: 'Dark/600',    backgroundFocus: 'Dark/500',      backgroundDisabled: 'Dark/500',      borderColor: 'Dark/300',    borderColorHover: 'Dark/200',    borderColorPress: 'Dark/400',    borderColorFocus: 'Brand/500', borderColorDisabled: 'Dark/400',    outlineColor: 'Brand/500' },
  },
  layer3: {
    light: { background: 'Neutral/50', backgroundHover: 'Neutral/100', backgroundPress: 'Neutral/100', backgroundFocus: 'Neutral/50', backgroundDisabled: 'Neutral/50', borderColor: 'Neutral/200', borderColorHover: 'Neutral/200', borderColorPress: 'Neutral/300', borderColorFocus: 'Brand/700', borderColorDisabled: 'Neutral/200', outlineColor: 'Brand/700' },
    dark:  { background: 'Dark/400',   backgroundHover: 'Dark/300',    backgroundPress: 'Dark/500',    backgroundFocus: 'Dark/400',   backgroundDisabled: 'Dark/400',   borderColor: 'Dark/300',    borderColorHover: 'Dark/200',    borderColorPress: 'Dark/400',    borderColorFocus: 'Brand/500', borderColorDisabled: 'Dark/300',    outlineColor: 'Brand/500' },
  },
  brand: {
    light: { background: 'Brand/600', backgroundHover: 'Brand/700', backgroundPress: 'Brand/800', backgroundFocus: 'Brand/600', backgroundDisabled: 'Brand/200', borderColor: 'Brand/600', borderColorHover: 'Brand/700', borderColorPress: 'Brand/800', borderColorFocus: 'Brand/500', borderColorDisabled: 'Brand/200', outlineColor: 'Brand/500', color: 'Primary/White', colorPress: 'Neutral/100', colorDisabled: 'Primary/White' },
    dark:  { background: 'Brand/500', backgroundHover: 'Brand/400', backgroundPress: 'Brand/600', backgroundFocus: 'Brand/500', backgroundDisabled: 'Brand/900', borderColor: 'Brand/500', borderColorHover: 'Brand/400', borderColorPress: 'Brand/600', borderColorFocus: 'Brand/400', borderColorDisabled: 'Brand/900', outlineColor: 'Brand/400', color: 'Dark/500',      colorPress: 'Dark/400',  colorDisabled: 'Dark/300' },
  },
};

const refLabel = (ref) => `Color/${ref}`;

const MODES = ['light', 'dark'];
const isWeb = Platform.OS === 'web';

function isLightHex(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export default function ColorsScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [tab, setTab] = useState('primitives');
  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;
  const isDark = mode === 'dark';

  const layer = layerTokens[mode];
  const contentTokens = content[mode];

  const pageBg = layer.layer1Background;
  const cardBg = layer.layer2Background;
  const cardBorder = layer.layer2BorderColor;
  const titleColor = contentTokens.contentPrimary;
  const subColor = contentTokens.contentSecondary;
  const accentColor = contentTokens.contentBrand;

  const radixScales = radix[mode];

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: (isWeb ? 24 : 20) + topInset }]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {pageTitle && (
          <Text style={[styles.pageTitle, { color: titleColor }]}>{pageTitle}</Text>
        )}
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

        <View style={[styles.tabBar, { borderBottomColor: layer.layer2BorderColor }]}>
          <TabButton
            label="Primitives"
            active={tab === 'primitives'}
            accent={accentColor}
            primary={titleColor}
            muted={subColor}
            onPress={() => setTab('primitives')}
          />
          <TabButton
            label="Tokens"
            active={tab === 'tokens'}
            accent={accentColor}
            primary={titleColor}
            muted={subColor}
            onPress={() => setTab('tokens')}
          />
        </View>

        {tab === 'primitives' ? (
          PRIMITIVE_PALETTES.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              mode={mode}
              isDark={isDark}
              cardBg={cardBg}
              cardBorder={cardBorder}
              titleColor={titleColor}
              subColor={subColor}
              renderSwatch={(key, hex) => (
                <ColorSwatch
                  name={primitiveSwatchLabel(palette.id, mode, key)}
                  hex={hex}
                  onSurface={isDark ? 'dark' : 'light'}
                />
              )}
            />
          ))
        ) : (
          <>
            {SEMANTIC_PALETTES.map((palette) => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                mode={mode}
                isDark={isDark}
                cardBg={cardBg}
                cardBorder={cardBorder}
                titleColor={titleColor}
                subColor={subColor}
                renderSwatch={(key, hex) => (
                  <SemanticSwatch
                    groupKey={palette.groupKey}
                    keyPrefix={palette.keyPrefix}
                    mode={mode}
                    tokenKey={key}
                    hex={hex}
                    onSurface={isDark ? 'dark' : 'light'}
                  />
                )}
              />
            ))}

            <GroupHeader title="Radix Color" subtitle="Radix UI 1–12 scales (one row per palette)." titleColor={titleColor} subColor={subColor} />

            <View style={[styles.section, { backgroundColor: cardBg }]}>
              <View style={styles.radixList}>
                {Object.entries(radixScales).map(([name, shades]) => (
                  <RadixPaletteRow
                    key={name}
                    name={name}
                    shades={shades}
                    labelColor={titleColor}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function TabButton({ label, active, accent, primary, muted, onPress }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.tabButton,
        { borderBottomColor: active ? accent : 'transparent' },
        isWeb && {
          cursor: 'pointer',
          transitionProperty: 'border-color',
          transitionDuration: '180ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      <Text
        style={[
          styles.tabLabel,
          {
            color: active || hover ? primary : muted,
            ...(isWeb && { transitionProperty: 'color', transitionDuration: '180ms' }),
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function GroupHeader({ title, subtitle, titleColor, subColor }) {
  return (
    <View style={styles.groupHeader}>
      <Text style={[styles.groupHeaderTitle, { color: titleColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.groupHeaderSubtitle, { color: subColor }]}>{subtitle}</Text>}
    </View>
  );
}

function PaletteCard({ palette, mode, cardBg, cardBorder, titleColor, subColor, renderSwatch }) {
  const tokens = palette.data[mode];
  return (
    <View style={[styles.section, { backgroundColor: cardBg }]}>
      <Text style={[styles.sectionTitle, { color: titleColor }]}>{palette.title}</Text>
      <Text style={[styles.sectionSubtitle, { color: subColor }]}>{palette.description}</Text>

      <View style={isWeb ? styles.swatchGrid : styles.swatchList}>
        {Object.entries(tokens).map(([key, hex]) => (
          <View key={key} style={isWeb ? styles.swatchGridItem : null}>
            {renderSwatch(key, hex)}
          </View>
        ))}
      </View>
    </View>
  );
}

function SemanticSwatch({ groupKey, keyPrefix, mode, tokenKey, hex, onSurface }) {
  // tokenKey examples: "layer1Background", "contentPrimary", "brandBackgroundHover"
  const stripped = tokenKey.slice(keyPrefix.length);
  const property = stripped ? stripped[0].toLowerCase() + stripped.slice(1) : tokenKey;
  const ref = TOKEN_REFS[groupKey]?.[mode]?.[property];
  const subname = ref ? refLabel(ref) : null;
  return <ColorSwatch name={property} subname={subname} hex={hex} onSurface={onSurface} />;
}

function RadixPaletteRow({ name, shades, labelColor }) {
  return (
    <View style={styles.radixRow}>
      <Text style={[styles.radixRowLabel, { color: labelColor }]}>{name}</Text>
      <View style={styles.radixStrip}>
        {Object.entries(shades).map(([key, hex]) => (
          <View key={key} style={[styles.radixCell, { backgroundColor: hex }]}>
            <Text style={[styles.radixCellLabel, { color: isLightHex(hex) ? '#111' : '#FFF' }]}>
              {key}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
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
  pageTitle: {
    ...currentTextStyle('11', 'medium'),
    marginTop: 24,
    marginBottom: 32,
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
    ...currentTextStyle('3', 'semiBold'),
    textTransform: 'capitalize',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
    marginBottom: 4,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    marginBottom: -0.5,
  },
  tabLabel: {
    ...currentTextStyle('3', 'regular'),
  },
  groupHeader: {
    marginTop: 16,
    marginBottom: -4,
  },
  groupHeaderTitle: {
    ...currentTextStyle('7', 'medium'),
  },
  groupHeaderSubtitle: {
    ...currentTextStyle('3', 'regular'),
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  sectionTitle: {
    ...currentTextStyle('5', 'medium'),
  },
  sectionSubtitle: {
    ...currentTextStyle('3', 'regular'),
    marginTop: 4,
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
  radixList: {
    gap: 12,
    marginTop: 4,
  },
  radixRow: {
    gap: 6,
  },
  radixRowLabel: {
    ...currentTextStyle('2', 'medium'),
  },
  radixStrip: {
    flexDirection: 'row',
    gap: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  radixCell: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radixCellLabel: {
    ...currentTextStyle('1', 'medium'),
  },
});
