import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { base, brand, content, layerTokens } from '../theme/colors';
import {
  dmSans,
  fontPacks,
  headingDefaults,
  paragraphDefaults,
  proposedScale,
  proposedTextStyle,
  stylisticSets,
  weights,
} from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];

const SIZE_KEYS = Object.keys(fontPacks);
const ALL_STYLISTIC_VARIANTS = stylisticSets.map((s) => s.name);
const ALL_STYLISTIC_FEATURES = stylisticSets.map((s) => `"${s.otFeature}"`).join(', ');
const WEIGHT_ENTRIES = [
  { key: 'regular', label: 'Regular', token: '$regular', value: weights.regular, family: dmSans.regular },
  { key: 'medium', label: 'Medium', token: '$medium', value: weights.medium, family: dmSans.medium },
  { key: 'semiBold', label: 'Semi Bold', token: '$semiBold', value: weights.semiBold, family: dmSans.semiBold },
];

export default function TypographyScreen({
  mode: modeProp,
  onModeChange,
  onScroll,
  topInset = 0,
}) {
  const [internalMode, setInternalMode] = useState('light');
  const [view, setView] = useState('current');
  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;
  const isDark = mode === 'dark';

  const layer = layerTokens[mode];
  const contentTokens = content[mode];
  const brandPalette = brand[mode];
  const baseTokens = base[mode];

  const pageBg = layer.layer1Background;
  const cardBg = layer.layer2Background;
  const cardBorder = isDark ? baseTokens.base6 : baseTokens.base3;
  const primary = contentTokens.contentPrimary;
  const secondary = contentTokens.contentSecondary;
  const tertiary = contentTokens.contentTertiary;
  const codeColor = isDark ? brandPalette.brand7 : brandPalette.brand8;
  const dividerColor = layer.layer1Background;

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: (isWeb ? 24 : 20) + topInset },
        ]}
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

        {/* Current vs Proposed tab control */}
        <View style={[styles.tabBar, { borderBottomColor: cardBorder }]}>
          <TabButton
            label="Current"
            active={view === 'current'}
            isDark={isDark}
            onPress={() => setView('current')}
          />
          <TabButton
            label="Proposed"
            active={view === 'proposed'}
            isDark={isDark}
            onPress={() => setView('proposed')}
          />
        </View>

        {view === 'proposed' ? (
          <>
            <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
              <SectionHeader
                title="Proposed scale"
                description="Semantic role names · negative letter-spacing at display sizes"
                code="import { proposedScale } from 'theme/typography'"
                primary={primary}
                secondary={secondary}
              />
              <View style={styles.list}>
                {proposedScale.map((entry, i) => (
                  <ProposedRow
                    key={entry.name}
                    entry={entry}
                    isLast={i === proposedScale.length - 1}
                    primary={primary}
                    secondary={secondary}
                    tertiary={tertiary}
                    dividerColor={dividerColor}
                  />
                ))}
              </View>
            </SectionCard>

            <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
              <SectionHeader
                title="Stylistic alternates"
                description="DM Sans OpenType stylistic sets — letterform swaps available via fontVariant"
                code="fontVariant: ['stylistic-one'] // → font-feature-settings: 'ss01'"
                primary={primary}
                secondary={secondary}
              />

              <View style={[styles.stylisticHeader, { borderBottomColor: dividerColor }]}>
                <Text style={[styles.stylisticHeaderCell, styles.stylisticCol1, { color: tertiary }]}>CSS / Tamagui</Text>
                <Text style={[styles.stylisticHeaderCell, styles.stylisticCol2, { color: tertiary }]}>OT feature</Text>
                <Text style={[styles.stylisticHeaderCell, styles.stylisticCol3, { color: tertiary }]}>Figma label</Text>
                <Text style={[styles.stylisticHeaderCell, styles.stylisticCol4, { color: tertiary }]}>default → alternate</Text>
              </View>

              {stylisticSets.map((entry, i) => (
                <StylisticRow
                  key={entry.name}
                  entry={entry}
                  isLast={i === stylisticSets.length - 1}
                  primary={primary}
                  secondary={secondary}
                  tertiary={tertiary}
                  codeColor={codeColor}
                  dividerColor={dividerColor}
                />
              ))}
            </SectionCard>
          </>
        ) : (
          <>

        {/* Size scale */}
        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Size scale"
            description="fontPacks — keyed string sizes 1 → 11"
            code="import { fontPacks } from 'theme/typography'"
            primary={primary}
            secondary={secondary}
          />
          <View style={styles.list}>
            {SIZE_KEYS.map((key, i) => {
              const pack = fontPacks[key];
              return (
                <View
                  key={key}
                  style={[
                    styles.sizeRow,
                    i < SIZE_KEYS.length - 1 && { borderBottomColor: dividerColor, borderBottomWidth: 1 },
                  ]}
                >
                  <View style={styles.sizeMetaRow}>
                    <Text style={[styles.sizeBadge, { color: codeColor }]}>{`size="${key}"`}</Text>
                    <Text style={[styles.sizeMeta, { color: tertiary }]}>
                      {`${pack.fontSize} / ${pack.lineHeight}  ·  ls ${pack.letterSpacing}`}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.sample,
                      {
                        color: primary,
                        fontSize: pack.fontSize,
                        lineHeight: pack.lineHeight,
                        letterSpacing: pack.letterSpacing,
                      },
                    ]}
                  >
                    The quick brown fox
                  </Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        {/* Heading vs Paragraph */}
        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Heading & Paragraph"
            description="Defaults applied when no override is passed"
            code="import { Heading, Paragraph } from '@my/ui/components/Texts/Text'"
            primary={primary}
            secondary={secondary}
          />

          <View style={[styles.defaultRow, { borderColor: dividerColor }]}>
            <View style={styles.defaultMeta}>
              <Text style={[styles.componentName, { color: primary }]}>Heading</Text>
              <Meta label="tag" value={headingDefaults.tag} primary={primary} secondary={secondary} />
              <Meta label="family" value="$heading" primary={primary} secondary={secondary} />
              <Meta label="size default" value={`"${headingDefaults.size}"`} primary={primary} secondary={secondary} />
              <Meta label="weight default" value="$medium" primary={primary} secondary={secondary} />
              <Meta label="role" value="heading" primary={primary} secondary={secondary} />
            </View>
            <Text
              style={[
                styles.sample,
                {
                  color: primary,
                  fontFamily: dmSans.semiBold,
                  fontSize: fontPacks['7'].fontSize,
                  lineHeight: fontPacks['7'].lineHeight,
                  letterSpacing: fontPacks['7'].letterSpacing,
                  marginTop: 12,
                },
              ]}
            >
              Section heading
            </Text>
            <Text style={[styles.callout, { color: secondary }]}>
              {`<Heading size="7" fontWeight="$semiBold">Section heading</Heading>`}
            </Text>
          </View>

          <View style={[styles.defaultRow]}>
            <View style={styles.defaultMeta}>
              <Text style={[styles.componentName, { color: primary }]}>Paragraph</Text>
              <Meta label="tag" value={paragraphDefaults.tag} primary={primary} secondary={secondary} />
              <Meta label="family" value="$body" primary={primary} secondary={secondary} />
              <Meta label="size default" value={`"${paragraphDefaults.size}"`} primary={primary} secondary={secondary} />
              <Meta label="weight default" value="(must be set)" primary={primary} secondary={secondary} />
              <Meta label="selectable" value="userSelect: auto" primary={primary} secondary={secondary} />
            </View>
            <Text
              style={[
                styles.sample,
                {
                  color: primary,
                  fontFamily: dmSans.regular,
                  fontSize: fontPacks['4'].fontSize,
                  lineHeight: fontPacks['4'].lineHeight,
                  letterSpacing: fontPacks['4'].letterSpacing,
                  marginTop: 12,
                },
              ]}
            >
              Body text — the size‑4 default. The quick brown fox jumps over the lazy dog. 0123456789.
            </Text>
            <Text style={[styles.callout, { color: secondary }]}>
              {`<Paragraph size="4" fontWeight="$regular">Body text…</Paragraph>`}
            </Text>
          </View>
        </SectionCard>

        {/* Weights */}
        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Weights"
            description="Always set fontWeight explicitly. No implicit defaults."
            code="fontWeight: '$regular' | '$medium' | '$semiBold'"
            primary={primary}
            secondary={secondary}
          />
          <View style={styles.list}>
            {WEIGHT_ENTRIES.map((w, i) => (
              <View
                key={w.key}
                style={[
                  styles.weightRow,
                  i < WEIGHT_ENTRIES.length - 1 && { borderBottomColor: dividerColor, borderBottomWidth: 1 },
                ]}
              >
                <View style={styles.weightMeta}>
                  <Text style={[styles.weightLabel, { color: primary }]}>{w.label}</Text>
                  <Text style={[styles.weightToken, { color: codeColor }]}>{w.token}</Text>
                  <Text style={[styles.weightValue, { color: tertiary }]}>{w.value}</Text>
                </View>
                <Text
                  style={[
                    styles.weightSample,
                    {
                      color: primary,
                      fontFamily: w.family,
                    },
                  ]}
                >
                  Aa Bb Cc 123
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>

        {/* Tokens & OpenType */}
        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Tokens & OpenType"
            description="How the spec composes underneath"
            primary={primary}
            secondary={secondary}
          />
          <View style={styles.notesList}>
            <NoteRow
              label="$heading / $body"
              value="Font family tokens resolved from Tamagui theme config."
              primary={primary}
              secondary={secondary}
            />
            <NoteRow
              label="$regular / $medium / $semiBold"
              value="Weight tokens — 400 / 500 / 600 respectively."
              primary={primary}
              secondary={secondary}
            />
            <NoteRow
              label="fontVariant"
              value="Enables OpenType ss01–ss07 (stylistic sets baked into the typeface)."
              primary={primary}
              secondary={secondary}
            />
            <NoteRow
              label="accessibilityRole / role"
              value="Heading carries heading semantics; Paragraph stays as a <p>."
              primary={primary}
              secondary={secondary}
            />
          </View>
        </SectionCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SectionCard({ children, cardBg, cardBorder }) {
  return <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>{children}</View>;
}

function SectionHeader({ title, description, code, primary, secondary }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: primary }]}>{title}</Text>
      <Text style={[styles.sectionSubtitle, { color: secondary }]}>{description}</Text>
      {code && <Text style={[styles.sectionExport, { color: secondary }]}>{code}</Text>}
    </View>
  );
}

function Meta({ label, value, primary, secondary }) {
  return (
    <View style={styles.metaRow}>
      <Text style={[styles.metaLabel, { color: secondary }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: primary }]}>{value}</Text>
    </View>
  );
}

function NoteRow({ label, value, primary, secondary }) {
  return (
    <View style={styles.noteRow}>
      <Text style={[styles.noteLabel, { color: primary }]}>{label}</Text>
      <Text style={[styles.noteValue, { color: secondary }]}>{value}</Text>
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
      <Text style={[styles.toggleLabel, { color: active ? '#FFFFFF' : idleColor }]}>{label}</Text>
    </Pressable>
  );
}

function TabButton({ label, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);
  const mode = isDark ? 'dark' : 'light';
  const primary = content[mode].contentPrimary;
  const secondary = content[mode].contentTertiary;
  const accent = content[mode].contentBrand;

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
            color: active || hover ? primary : secondary,
            ...(isWeb && { transitionProperty: 'color', transitionDuration: '180ms' }),
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StylisticRow({ entry, isLast, primary, tertiary, codeColor, dividerColor }) {
  return (
    <View
      style={[
        styles.stylisticRow,
        !isLast && { borderBottomColor: dividerColor, borderBottomWidth: 1 },
      ]}
    >
      <View style={styles.stylisticCol1}>
        <Text style={[styles.stylisticCode, { color: codeColor }]}>{entry.name}</Text>
      </View>
      <View style={styles.stylisticCol2}>
        <Text style={[styles.stylisticCode, { color: codeColor }]}>{entry.otFeature}</Text>
      </View>
      <View style={styles.stylisticCol3}>
        <Text style={[styles.stylisticFigmaLabel, { color: primary }]}>{entry.label}</Text>
      </View>
      <View style={styles.stylisticCol4}>
        <View style={styles.stylisticDemoBlock}>
          <Text style={[styles.stylisticDemoTag, { color: tertiary }]}>default</Text>
          <Text style={[styles.stylisticDemoSample, { color: primary, fontFamily: dmSans.regular }]}>
            {entry.sample}
          </Text>
        </View>
        <Text style={[styles.stylisticArrow, { color: tertiary }]}>→</Text>
        <View style={styles.stylisticDemoBlock}>
          <Text style={[styles.stylisticDemoTag, { color: tertiary }]}>{entry.otFeature}</Text>
          <Text
            style={[
              styles.stylisticDemoSample,
              { color: primary, fontFamily: dmSans.regular, fontVariant: [entry.name] },
              isWeb && { fontFeatureSettings: `"${entry.otFeature}"` },
            ]}
          >
            {entry.sample}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ProposedRow({ entry, isLast, primary, secondary, tertiary, dividerColor }) {
  const lsLabel = entry.letterSpacing === 0 ? '0' : `${entry.letterSpacing}px`;
  return (
    <View
      style={[
        styles.proposedRow,
        !isLast && { borderBottomColor: dividerColor, borderBottomWidth: 1 },
      ]}
    >
      <View style={styles.proposedLeft}>
        <Text style={[styles.proposedName, { color: primary }]}>{entry.name}</Text>
      </View>
      <View style={styles.proposedMeta}>
        <Text style={[styles.proposedMetaText, { color: tertiary }]}>
          {`${entry.scaleSize}   ${entry.fontSize}/${entry.lineHeight}   ${lsLabel}`}
        </Text>
      </View>
      <View style={styles.proposedRight}>
        {WEIGHT_ENTRIES.map((w) => (
          <View key={w.key} style={styles.proposedWeightRow}>
            <Text style={[styles.proposedWeightLabel, { color: tertiary }]}>
              {`${w.label} / ${w.value}`}
            </Text>
            <Text
              style={[
                styles.proposedSample,
                {
                  color: primary,
                  fontFamily: w.family,
                  fontSize: entry.fontSize,
                  lineHeight: entry.lineHeight,
                  letterSpacing: entry.letterSpacing,
                  fontVariant: ALL_STYLISTIC_VARIANTS,
                },
                isWeb && { fontFeatureSettings: ALL_STYLISTIC_FEATURES },
              ]}
              numberOfLines={1}
            >
              {entry.sample}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isWeb ? 40 : 20,
    paddingBottom: 60,
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
  tabBar: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    marginBottom: -1,
  },
  tabLabel: {
    ...proposedTextStyle('body-medium', 'semiBold'),
  },
  proposedRow: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'flex-start' : 'stretch',
    paddingVertical: 20,
    gap: isWeb ? 0 : 12,
  },
  proposedLeft: {
    width: isWeb ? 150 : undefined,
    paddingRight: 12,
  },
  proposedName: {
    ...proposedTextStyle('label-medium', 'semiBold'),
  },
  proposedMeta: {
    width: isWeb ? 160 : undefined,
    paddingRight: 12,
    paddingTop: isWeb ? 2 : 0,
  },
  proposedMetaText: {
    fontFamily: 'Menlo',
    fontSize: 11,
  },
  proposedRight: {
    flex: isWeb ? 1 : undefined,
    gap: 14,
  },
  proposedWeightRow: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'baseline' : 'flex-start',
    gap: isWeb ? 16 : 4,
  },
  proposedWeightLabel: {
    fontFamily: 'Menlo',
    fontSize: 11,
    width: isWeb ? 130 : undefined,
    paddingTop: isWeb ? 6 : 0,
  },
  proposedSample: {
    flexShrink: 1,
  },
  stylisticHeader: {
    flexDirection: isWeb ? 'row' : 'column',
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginBottom: 4,
    gap: isWeb ? 0 : 6,
  },
  stylisticHeaderCell: {
    fontFamily: 'Menlo',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stylisticRow: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'center' : 'stretch',
    paddingVertical: 16,
    gap: isWeb ? 0 : 8,
  },
  stylisticCol1: {
    width: isWeb ? 150 : undefined,
    paddingRight: 12,
  },
  stylisticCol2: {
    width: isWeb ? 90 : undefined,
    paddingRight: 12,
  },
  stylisticCol3: {
    width: isWeb ? 200 : undefined,
    paddingRight: 12,
  },
  stylisticCol4: {
    flex: isWeb ? 1 : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stylisticCode: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  stylisticFigmaLabel: {
    ...proposedTextStyle('label-medium', 'regular'),
  },
  stylisticDemoBlock: {
    minWidth: 110,
  },
  stylisticDemoTag: {
    fontFamily: 'Menlo',
    fontSize: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stylisticDemoSample: {
    fontSize: 20,
    lineHeight: 26,
  },
  stylisticArrow: {
    fontFamily: dmSans.medium,
    fontSize: 16,
    marginTop: 14,
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
  sectionHeader: {
    marginBottom: 12,
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
  },
  list: {
    marginTop: 4,
  },
  sizeRow: {
    paddingVertical: 16,
  },
  sizeMetaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  sizeBadge: {
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: '700',
  },
  sizeMeta: {
    fontFamily: 'Menlo',
    fontSize: 11,
  },
  sample: {
    fontFamily: dmSans.regular,
  },
  defaultRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  defaultMeta: {
    gap: 4,
  },
  componentName: {
    fontFamily: dmSans.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metaLabel: {
    fontFamily: 'Menlo',
    fontSize: 11,
    minWidth: 120,
  },
  metaValue: {
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: '600',
  },
  callout: {
    fontFamily: 'Menlo',
    fontSize: 11,
    marginTop: 12,
  },
  weightRow: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'center' : 'flex-start',
    paddingVertical: 16,
    gap: isWeb ? 24 : 8,
  },
  weightMeta: {
    minWidth: 200,
    gap: 2,
  },
  weightLabel: {
    fontFamily: dmSans.bold,
    fontSize: 15,
  },
  weightToken: {
    fontFamily: 'Menlo',
    fontSize: 11,
  },
  weightValue: {
    fontFamily: 'Menlo',
    fontSize: 11,
  },
  weightSample: {
    fontFamily: dmSans.regular,
    fontSize: 28,
    lineHeight: 36,
  },
  notesList: {
    gap: 12,
  },
  noteRow: {
    gap: 2,
  },
  noteLabel: {
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: '700',
  },
  noteValue: {
    fontFamily: dmSans.regular,
    fontSize: 13,
  },
});
