import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Token from '../components/Token';
import DevModeToggle from '../components/DevModeToggle';
import { ModeToggleBar, ScreenControls, useControlTokens } from '../components/Controls';
import { layerTokens } from '../theme/colors';
import { spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', icon: require('../../assets/chains/usdc.png') },
  { symbol: 'ETH', name: 'Ethereum', icon: require('../../assets/chains/eth.png') },
  { symbol: 'SEND', name: 'Send', icon: require('../../assets/chains/send.png') },
];

export default function TokensScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [active, setActive] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;

  const t = useControlTokens(mode);
  const pageBg = layerTokens[mode].layer1Background;

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
          A token chip shows the selected asset's chain icon and symbol. The dropdown variant is
          selectable — tap to pick a different token.
        </Text>

        {!isControlled && <ModeToggleBar mode={mode} onModeChange={setMode} />}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            <View style={[styles.section, { backgroundColor: t.cardBg }]}>
              <View style={styles.typesRow}>
                <View style={styles.cell}>
                  <Text style={[styles.cellLabel, { color: t.subColor }]}>Selected</Text>
                  <View style={styles.stage}>
                    <Token mode={mode} type="selected" tokens={TOKENS} value={active} onChange={setActive} devMode={devMode} />
                  </View>
                </View>

                <View style={styles.cell}>
                  <Text style={[styles.cellLabel, { color: t.subColor }]}>Fixed</Text>
                  <View style={styles.stage}>
                    <Token mode={mode} type="fixed" tokens={TOKENS} value={active} onChange={setActive} devMode={devMode} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {!isNarrow && (
            <ScreenControls mode={mode} isNarrow={false} badge="Token">
              <View style={styles.controlNote}>
                <Text style={[styles.controlNoteText, { color: t.subColor }]}>
                  Selected: {TOKENS[active].symbol}
                </Text>
              </View>
            </ScreenControls>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <ScreenControls mode={mode} isNarrow badge="Token" open={controlsOpen} setOpen={setControlsOpen}>
          <View style={styles.controlNote}>
            <Text style={[styles.controlNoteText, { color: t.subColor }]}>
              Selected: {TOKENS[active].symbol}
            </Text>
          </View>
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
    zIndex: 1, // keep dev tooltips / the open menu above the sticky controls column
    width: '100%',
    gap: 16,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 32,
  },
  cell: {
    gap: spacing.mobile.L, // 16 — label ↔ demo
    minWidth: 160,
  },
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  stage: {
    alignItems: 'flex-start',
    paddingVertical: spacing.mobile.S,
  },
  cellLabel: {
    ...currentTextStyle('2', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  controlNote: {
    paddingVertical: 14,
  },
  controlNoteText: {
    ...currentTextStyle('3', 'regular'),
  },
});
