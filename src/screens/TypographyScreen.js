import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { base, brand, content, layerTokens } from '../theme/colors';
import {
  currentTextStyle,
  dmSans,
  fontPacks,
  headingDefaults,
  paragraphDefaults,
  stylisticSets,
  weights,
} from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];

const SIZE_KEYS = Object.keys(fontPacks);
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
  const [internalMode, setInternalMode] = useState('dark');
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
  const dividerColor = layer.layer2BorderColor;

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

        {/* Size scale */}
        <SectionCard cardBg={cardBg}>
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
                    i < SIZE_KEYS.length - 1 && { borderBottomColor: dividerColor, borderBottomWidth: 0.5 },
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
                    Send money
                  </Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        {/* Heading vs Paragraph */}
        <SectionCard cardBg={cardBg}>
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
              Body text — the size‑4 default. Send money to anyone, anywhere. 0123456789.
            </Text>
            <Text style={[styles.callout, { color: secondary }]}>
              {`<Paragraph size="4" fontWeight="$regular">Body text…</Paragraph>`}
            </Text>
          </View>
        </SectionCard>

        {/* Weights */}
        <SectionCard cardBg={cardBg}>
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
                  i < WEIGHT_ENTRIES.length - 1 && { borderBottomColor: dividerColor, borderBottomWidth: 0.5 },
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

        {/* Stylistic alternates */}
        <SectionCard cardBg={cardBg}>
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

        {/* Tokens & OpenType */}
        <SectionCard cardBg={cardBg}>
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
      </ScrollView>
    </View>
  );
}

function SectionCard({ children, cardBg }) {
  return <View style={[styles.section, { backgroundColor: cardBg }]}>{children}</View>;
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

function StylisticRow({ entry, isLast, primary, tertiary, codeColor, dividerColor }) {
  return (
    <View
      style={[
        styles.stylisticRow,
        !isLast && { borderBottomColor: dividerColor, borderBottomWidth: 0.5 },
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
  stylisticHeader: {
    flexDirection: isWeb ? 'row' : 'column',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
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
    ...currentTextStyle('2', 'regular'),
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
    ...currentTextStyle('3', 'semiBold'),
    textTransform: 'capitalize',
  },
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...currentTextStyle('5', 'medium'),
  },
  sectionSubtitle: {
    ...currentTextStyle('3', 'regular'),
    marginTop: 4,
  },
  sectionExport: {
    ...currentTextStyle('1', 'regular'),
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
    ...currentTextStyle('2', 'bold'),
  },
  sizeMeta: {
    ...currentTextStyle('1', 'regular'),
  },
  sample: {
    ...currentTextStyle('4', 'regular'),
  },
  defaultRow: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  defaultMeta: {
    gap: 4,
  },
  componentName: {
    ...currentTextStyle('5', 'bold'),
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metaLabel: {
    ...currentTextStyle('1', 'regular'),
    minWidth: 120,
  },
  metaValue: {
    ...currentTextStyle('2', 'semiBold'),
  },
  callout: {
    ...currentTextStyle('1', 'regular'),
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
    ...currentTextStyle('4', 'bold'),
  },
  weightToken: {
    ...currentTextStyle('1', 'regular'),
  },
  weightValue: {
    ...currentTextStyle('1', 'regular'),
  },
  weightSample: {
    ...currentTextStyle('6', 'regular'),
  },
  notesList: {
    gap: 12,
  },
  noteRow: {
    gap: 2,
  },
  noteLabel: {
    ...currentTextStyle('2', 'bold'),
  },
  noteValue: {
    ...currentTextStyle('3', 'regular'),
  },
});
