import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { base, content, layerTokens } from '../theme/colors';
import { proposedTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];

const SPEC_ROWS = [
  ['Variant', 'Primary'],
  ['Size', 'L'],
  ['Height', '44 px'],
  ['Padding', '16 horizontal · 8 vertical'],
  ['Corner radius', '8 px'],
  ['Background', 'brandTokens.brandBackground'],
  ['Label color', 'brandTokens.brandColor'],
  ['Label typography', 'body-large · medium'],
];

export default function ButtonsScreen({
  mode: modeProp,
  onModeChange,
  onScroll,
  topInset = 0,
}) {
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
  const primary = contentTokens.contentPrimary;
  const secondary = contentTokens.contentSecondary;
  const tertiary = contentTokens.contentTertiary;

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

        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Primary · L · Default"
            description="The primary call-to-action button. Hugs content horizontally, fixed 44px height."
            code={`<Button variant="primary" size="L">Send money</Button>`}
            primary={primary}
            secondary={secondary}
          />

          <View style={[styles.demoStage, { borderColor: cardBorder, backgroundColor: pageBg }]}>
            <Button mode={mode}>Send money</Button>
          </View>
        </SectionCard>

        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="States"
            description="Hover, press, and disabled — driven by brandTokens.brandBackground* tokens."
            primary={primary}
            secondary={secondary}
          />

          <View style={styles.stateGrid}>
            <StateCell label="Default" cardBorder={cardBorder} pageBg={pageBg} tertiary={tertiary}>
              <Button mode={mode}>Send money</Button>
            </StateCell>
            <StateCell label="Hover (try it)" cardBorder={cardBorder} pageBg={pageBg} tertiary={tertiary}>
              <Button mode={mode}>Send money</Button>
            </StateCell>
            <StateCell label="Disabled" cardBorder={cardBorder} pageBg={pageBg} tertiary={tertiary}>
              <Button mode={mode} disabled>Send money</Button>
            </StateCell>
          </View>
        </SectionCard>

        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Sizes"
            description="L is the default. M and S follow the same vertical rhythm but step down padding + label size."
            primary={primary}
            secondary={secondary}
          />

          <View style={styles.sizeRow}>
            <SizeCell label="L · 44" tertiary={tertiary}>
              <Button mode={mode} size="L">Send money</Button>
            </SizeCell>
            <SizeCell label="M · 32" tertiary={tertiary}>
              <Button mode={mode} size="M">Send money</Button>
            </SizeCell>
            <SizeCell label="S · 24" tertiary={tertiary}>
              <Button mode={mode} size="S">Send money</Button>
            </SizeCell>
          </View>
        </SectionCard>

        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Rounded"
            description="When `rounded` is true, corner radius equals height / 2 — a pill."
            primary={primary}
            secondary={secondary}
          />

          <View style={styles.demoStage}>
            <Button mode={mode} rounded>Send money</Button>
          </View>
        </SectionCard>

        <SectionCard cardBg={cardBg} cardBorder={cardBorder}>
          <SectionHeader
            title="Spec"
            description="Property mapping from the Figma component."
            primary={primary}
            secondary={secondary}
          />

          <View style={styles.specList}>
            {SPEC_ROWS.map(([label, value], i) => (
              <View
                key={label}
                style={[
                  styles.specRow,
                  i < SPEC_ROWS.length - 1 && { borderBottomColor: cardBorder, borderBottomWidth: 1 },
                ]}
              >
                <Text style={[styles.specLabel, { color: secondary }]}>{label}</Text>
                <Text style={[styles.specValue, { color: primary }]}>{value}</Text>
              </View>
            ))}
          </View>
        </SectionCard>
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

function StateCell({ label, children, cardBorder, pageBg, tertiary }) {
  return (
    <View style={[styles.stateCell, { borderColor: cardBorder, backgroundColor: pageBg }]}>
      <Text style={[styles.stateCellLabel, { color: tertiary }]}>{label}</Text>
      {children}
    </View>
  );
}

function SizeCell({ label, children, tertiary }) {
  return (
    <View style={styles.sizeCell}>
      <Text style={[styles.sizeCellLabel, { color: tertiary }]}>{label}</Text>
      {children}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  sectionHeader: { marginBottom: 16 },
  sectionTitle: {
    ...proposedTextStyle('title-large', 'bold'),
  },
  sectionSubtitle: {
    ...proposedTextStyle('body-medium', 'regular'),
    marginTop: 4,
  },
  sectionExport: {
    ...proposedTextStyle('label', 'regular'),
    marginTop: 8,
  },
  demoStage: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'flex-start',
  },
  stateGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 12,
    flexWrap: 'wrap',
  },
  stateCell: {
    flex: isWeb ? 1 : undefined,
    minWidth: isWeb ? 220 : undefined,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  stateCellLabel: {
    ...proposedTextStyle('label-medium', 'semiBold'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sizeRow: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 24,
    flexWrap: 'wrap',
    alignItems: isWeb ? 'flex-end' : 'flex-start',
  },
  sizeCell: { gap: 8, alignItems: 'flex-start' },
  sizeCellLabel: {
    ...proposedTextStyle('label-medium', 'semiBold'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  specList: { marginTop: 4 },
  specRow: {
    flexDirection: isWeb ? 'row' : 'column',
    paddingVertical: 12,
    gap: isWeb ? 24 : 4,
  },
  specLabel: {
    ...proposedTextStyle('body-small', 'regular'),
    width: isWeb ? 160 : undefined,
  },
  specValue: {
    ...proposedTextStyle('body-small', 'semiBold'),
    flex: isWeb ? 1 : undefined,
  },
});
