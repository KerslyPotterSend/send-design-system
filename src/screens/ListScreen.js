import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ListItem, { List } from '../components/List';
import DevModeToggle from '../components/DevModeToggle';
import { Dropdown, ModeToggleBar, ScreenControls, SwitchRow, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const LAYERS = [1, 2, 3];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'press', label: 'Press' },
  { value: 'disabled', label: 'Disabled' },
];

const COUNT_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export default function ListScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [state, setState] = useState('default');
  const [count, setCount] = useState(3);
  const [hasDivider, setHasDivider] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;

  const t = useControlTokens(mode);
  const pageBg = layerTokens[mode].layer1Background;

  const controls = (
    <>
      <Dropdown mode={mode} label="State" options={STATE_OPTIONS} value={state} onChange={setState} />
      <Dropdown mode={mode} label="Count" options={COUNT_OPTIONS} value={count} onChange={setCount} />
      <SwitchRow mode={mode} label="Has Divider" value={hasDivider} onChange={setHasDivider} />
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

        <Text style={[styles.description, { color: t.subColor }]}>
          A list item is an interactive row. Its background tracks the surface layer and the
          default / hover / press / disabled states.
        </Text>

        {!isControlled && <ModeToggleBar mode={mode} onModeChange={setMode} />}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            {LAYERS.map((layer) => (
              <View
                key={layer}
                style={[
                  styles.section,
                  // Layer 3 sits inside a layer-2 card like other component containers;
                  // layers 1 & 2 use a plain bordered frame so their fills read against it.
                  layer === 3
                    ? { backgroundColor: t.cardBg }
                    : { borderWidth: 1, borderColor: t.dividerColor },
                ]}
              >
                <Text style={[styles.cellLabel, { color: t.subColor }]}>{`Layer ${layer}`}</Text>
                <List mode={mode} layer={layer} divider={hasDivider}>
                  {Array.from({ length: count }, (_, i) => (
                    <ListItem
                      key={i}
                      mode={mode}
                      layer={layer}
                      // Preview the chosen state on the first row only; the rest stay
                      // interactive so hover happens on the row you point at, not all.
                      state={i === 0 ? state : 'default'}
                      label={`List item ${i + 1}`}
                      devMode={devMode}
                    />
                  ))}
                </List>
              </View>
            ))}
          </View>

          {!isNarrow && (
            <ScreenControls mode={mode} isNarrow={false} badge="List item">
              {controls}
            </ScreenControls>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <ScreenControls mode={mode} isNarrow badge="List item" open={controlsOpen} setOpen={setControlsOpen}>
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
    marginTop: spacing.mobile.XL, // 24
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
    borderRadius: 12,
    padding: isWeb ? 16 : 12,
    gap: spacing.mobile.M, // 12 — label ↔ item
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
