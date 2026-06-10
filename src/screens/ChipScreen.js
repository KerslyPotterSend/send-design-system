import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Chip, { ChipGroup } from '../components/Chip';
import DevModeToggle from '../components/DevModeToggle';
import { Dropdown, ModeToggleBar, ScreenControls, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const GROUP_LABELS = ['All', 'Unread', 'Flagged', 'Archived', 'Snoozed'];
const GROUP_OPTIONS = GROUP_LABELS.map((label, value) => ({ value, label }));

export default function ChipScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [activeIndex, setActiveIndex] = useState(0);
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
    <Dropdown
      mode={mode}
      label="Active chip"
      options={GROUP_OPTIONS}
      value={activeIndex}
      onChange={setActiveIndex}
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
          Chips are compact, rounded labels for tagging and categorizing content. They have two
          states: default and active (e.g. a selected filter).
        </Text>

        {!isControlled && <ModeToggleBar mode={mode} onModeChange={setMode} />}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            {/* Group — gap of Spacing S, selectable */}
            <View style={[styles.section, { backgroundColor: t.cardBg }]}>
              <Text style={[styles.cellLabel, { color: t.subColor }]}>Group</Text>
              <ChipGroup>
                {GROUP_LABELS.map((label, i) => (
                  <Chip
                    key={label}
                    mode={mode}
                    active={i === activeIndex}
                    label={label}
                    devMode={devMode}
                    onPress={() => setActiveIndex(i)}
                  />
                ))}
              </ChipGroup>
            </View>
          </View>

          {!isNarrow && (
            <ScreenControls mode={mode} isNarrow={false} badge="Chip">
              {controls}
            </ScreenControls>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <ScreenControls
          mode={mode}
          isNarrow
          badge="Chip"
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
    padding: isWeb ? 24 : 16,
    gap: spacing.mobile.L, // 16 — label ↔ demo
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
