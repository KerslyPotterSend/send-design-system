import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Tabs from '../components/Tabs';
import DevModeToggle from '../components/DevModeToggle';
import { Dropdown, ModeToggleBar, ScreenControls, SwitchRow, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const VARIANTS = [
  { key: 'simple', label: 'Simple' },
  { key: 'underline', label: 'Underline' },
  { key: 'underlineIcons', label: 'Underline + Icons' },
  { key: 'underlineBadge', label: 'Underline + Badge' },
  { key: 'pill', label: 'Pill' },
];

const COUNT_OPTIONS = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const LABELS = ['Home', 'Search', 'Activity', 'Profile', 'Settings'];
const ICONS = ['home', 'search', 'favorite', 'person', 'settings'];
const BADGES = [0, 3, 12, 1, 99];

export default function TabsScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [count, setCount] = useState(3);
  const [fullWidth, setFullWidth] = useState(false);
  const [active, setActive] = useState({}); // active index keyed by variant
  const [devMode, setDevMode] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;

  const t = useControlTokens(mode);
  const pageBg = layerTokens[mode].layer1Background;

  const tabs = Array.from({ length: count }, (_, i) => ({
    label: LABELS[i] ?? `Tab ${i + 1}`,
    icon: ICONS[i % ICONS.length],
    badge: BADGES[i % BADGES.length],
  }));

  const activeFor = (key) => {
    const v = active[key] ?? 0;
    return v < count ? v : 0;
  };
  const selectFor = (key) => (i) => setActive((a) => ({ ...a, [key]: i }));

  const controls = (
    <>
      <Dropdown mode={mode} label="Count" options={COUNT_OPTIONS} value={count} onChange={setCount} />
      <SwitchRow mode={mode} label="Full width" value={fullWidth} onChange={setFullWidth} />
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: (isWeb ? 24 : 20) + topInset },
          isNarrow && styles.contentNarrow,
        ]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.pageHeader, isNarrow && styles.pageHeaderNarrow]}>
          {pageTitle ? (
            <Text style={[styles.pageTitle, isNarrow && styles.pageTitleNarrow, { color: t.titleColor }]}>
              {pageTitle}
            </Text>
          ) : (
            <View />
          )}
          <DevModeToggle mode={mode} value={devMode} onChange={setDevMode} />
        </View>

        {!isControlled && <ModeToggleBar mode={mode} onModeChange={setMode} />}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            {VARIANTS.map((v) => (
              <View key={v.key} style={[styles.section, { backgroundColor: t.cardBg }]}>
                <Text style={[styles.cellLabel, { color: t.subColor }]}>{v.label}</Text>
                <View style={styles.demoStage}>
                  <Tabs
                    mode={mode}
                    variant={v.key}
                    tabs={tabs}
                    value={activeFor(v.key)}
                    onChange={selectFor(v.key)}
                    fullWidth={fullWidth}
                    devMode={devMode}
                  />
                </View>
              </View>
            ))}
          </View>

          {!isNarrow && (
            <ScreenControls mode={mode} isNarrow={false} badge="All variants">
              {controls}
            </ScreenControls>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <ScreenControls
          mode={mode}
          isNarrow
          badge="All variants"
          open={controlsOpen}
          setOpen={setControlsOpen}
        >
          {controls}
        </ScreenControls>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: isWeb ? 40 : 20,
    paddingBottom: 40,
    gap: 16,
    maxWidth: isWeb ? 1200 : undefined,
    width: '100%',
    alignSelf: isWeb ? 'center' : 'stretch',
  },
  contentNarrow: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  pageHeaderNarrow: {
    marginTop: 8,
    marginBottom: 20,
  },
  pageTitle: {
    ...currentTextStyle('11', 'medium'),
  },
  pageTitleNarrow: {
    ...currentTextStyle('8', 'medium'),
  },
  layout: {
    flexDirection: isWeb ? 'row' : 'column-reverse',
    alignItems: 'flex-start',
    gap: 16,
  },
  layoutNarrow: {
    flexDirection: 'column',
  },
  demoColumn: {
    flex: 1,
    zIndex: 1, // keep dev tooltips above the sticky controls column
    gap: 16,
    width: '100%',
  },
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  demoStage: {
    marginTop: 16,
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
