import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import SegmentedControl from '../components/SegmentedControl';
import DevModeToggle from '../components/DevModeToggle';
import { Dropdown, ModeToggleBar, ScreenControls, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const COUNT_OPTIONS = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const LAYOUTS = [
  { key: 'full', label: 'Full width', fullWidth: true },
  { key: 'hug', label: 'Hug', fullWidth: false },
];

export default function SegmentedControlScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [count, setCount] = useState(3);
  const [active, setActive] = useState({}); // active index keyed by layout
  const [devMode, setDevMode] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;

  const t = useControlTokens(mode);
  const pageBg = layerTokens[mode].layer1Background;

  const segments = Array.from({ length: count }, (_, i) => `Tab ${i + 1}`);
  const activeFor = (key) => active[key] ?? 0;
  const selectFor = (key) => (i) => setActive((prev) => ({ ...prev, [key]: i }));

  const controls = (
    <Dropdown
      mode={mode}
      label="Segments"
      options={COUNT_OPTIONS}
      value={count}
      onChange={setCount}
    />
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

        <Text style={[styles.description, { color: t.subColor }]}>
          A segmented control lets people pick one option from a small, mutually-exclusive set. The
          selected segment sits in a raised pill on the track.
        </Text>

        {!isControlled && <ModeToggleBar mode={mode} onModeChange={setMode} />}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            {LAYOUTS.map((l) => (
              <View key={l.key} style={styles.section}>
                <Text style={[styles.cellLabel, { color: t.subColor }]}>{l.label}</Text>
                <SegmentedControl
                  mode={mode}
                  segments={segments}
                  fullWidth={l.fullWidth}
                  value={activeFor(l.key)}
                  onChange={selectFor(l.key)}
                  devMode={devMode}
                />
              </View>
            ))}
          </View>

          {!isNarrow && (
            <ScreenControls mode={mode} isNarrow={false} badge="Segmented control">
              {controls}
            </ScreenControls>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <ScreenControls
          mode={mode}
          isNarrow
          badge="Segmented control"
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
    marginBottom: 8,
  },
  pageHeaderNarrow: {
    marginTop: 8,
    marginBottom: 4,
  },
  pageTitle: {
    ...currentTextStyle('11', 'medium'),
  },
  pageTitleNarrow: {
    ...currentTextStyle('8', 'medium'),
  },
  description: {
    ...currentTextStyle('4', 'regular'),
    maxWidth: 560,
  },
  layout: {
    flexDirection: isWeb ? 'row' : 'column-reverse',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: spacing.mobile['2XL'], // 40 — extra space below the description
  },
  layoutNarrow: {
    flexDirection: 'column',
  },
  demoColumn: {
    flex: 1,
    zIndex: 1, // keep dev tooltips above the sticky controls column
    width: '100%',
    gap: 16,
  },
  section: {
    gap: spacing.mobile.M, // 12 — label ↔ control
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
