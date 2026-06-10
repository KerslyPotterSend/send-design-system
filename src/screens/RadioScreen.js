import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Radio from '../components/Radio';
import DevModeToggle from '../components/DevModeToggle';
import { Dropdown, ModeToggleBar, ScreenControls, SwitchRow, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const SIZES = [
  { key: 'default', label: 'Default · 24×24' },
  { key: 'small', label: 'Small · 20×20' },
];

const STATE_OPTIONS = [
  { value: 'unchecked', label: 'Unchecked' },
  { value: 'checked', label: 'Checked' },
];

export default function RadioScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [state, setState] = useState('checked');
  const [disabled, setDisabled] = useState(false);
  const [hasLabel, setHasLabel] = useState(true);
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
      <SwitchRow mode={mode} label="Disabled" value={disabled} onChange={setDisabled} />
      <SwitchRow mode={mode} label="Has Label" value={hasLabel} onChange={setHasLabel} isLast />
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
          <View style={[styles.section, styles.demoColumn, { backgroundColor: t.cardBg }]}>
            <View style={[styles.columns, isNarrow && styles.columnsNarrow]}>
              {SIZES.map((sz) => (
                <View key={sz.key} style={styles.cell}>
                  <Text style={[styles.cellLabel, { color: t.subColor }]}>{sz.label}</Text>
                  <Radio
                    mode={mode}
                    size={sz.key}
                    state={state}
                    onChange={setState}
                    disabled={disabled}
                    hasLabel={hasLabel}
                    label="Label"
                    devMode={devMode}
                  />
                </View>
              ))}
            </View>
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
    width: '100%',
  },
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  columns: {
    flexDirection: 'row',
    gap: 32,
  },
  columnsNarrow: {
    flexDirection: 'column',
    gap: spacing.mobile.XL, // 24
  },
  cell: {
    flex: 1,
    gap: spacing.mobile.M, // 12
    minWidth: 140,
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
