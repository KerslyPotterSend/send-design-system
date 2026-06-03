import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Logo from './src/components/Logo';
import ButtonsScreen from './src/screens/ButtonsScreen';
import ColorsScreen from './src/screens/ColorsScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import SizesScreen from './src/screens/SizesScreen';
import TypographyScreen from './src/screens/TypographyScreen';
import { base, brand, brandTokens, content, layerTokens } from './src/theme/colors';
import { currentTextStyle } from './src/theme/typography';
const HEADER_HEIGHT = 72;
const SIDEBAR_WIDTH = 260;
const isWeb = Platform.OS === 'web';

const SIDEBAR_GROUPS = [
  {
    id: 'branding',
    label: 'Branding',
    items: [
      { id: 'colors', label: 'Colors', component: ColorsScreen },
      { id: 'typography', label: 'Typography', component: TypographyScreen },
      { id: 'sizes', label: 'Sizes', component: SizesScreen },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      { id: 'buttons', label: 'Buttons', component: ButtonsScreen },
    ],
  },
];

const ALL_SIDEBAR_ITEMS = SIDEBAR_GROUPS.flatMap((g) => g.items);

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const [activeId, setActiveId] = useState('colors');
  const [mode, setMode] = useState('dark');
  const [scrollY, setScrollY] = useState(0);

  const active = ALL_SIDEBAR_ITEMS.find((s) => s.id === activeId) ?? ALL_SIDEBAR_ITEMS[0];
  const ActiveComponent = active.component;
  const isDark = mode === 'dark';
  const isScrolled = scrollY > 4;

  useEffect(() => {
    setScrollY(0);
  }, [activeId]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const bg = layerTokens[mode].layer1Background;
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;
  }, [mode]);

  if (!fontsLoaded) return null;

  const baseTokens = base[mode];
  const layer = layerTokens[mode];
  const contentTokens = content[mode];

  const pageBg = layer.layer1Background;
  const headerBg = isScrolled
    ? isDark
      ? 'rgba(14, 26, 28, 0.72)'
      : 'rgba(242, 242, 242, 0.72)'
    : 'transparent';
  const chromeBorder = isDark ? baseTokens.base6 : baseTokens.base3;
  const headerBorder = isScrolled ? chromeBorder : 'transparent';
  const titleColor = contentTokens.contentPrimary;

  const headerWebStyles = {
    backdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
    transitionProperty: 'background-color, border-color, backdrop-filter, -webkit-backdrop-filter',
    transitionDuration: '220ms',
    transitionTimingFunction: 'ease',
  };

  const sidebarBg = layer.layer2Background;
  const sidebarBorder = chromeBorder;
  const sidebarHeaderBorder = layer.layer1Background;
  const sidebarMutedColor = contentTokens.contentSecondary;
  const sidebarFooterColor = contentTokens.contentTertiary;

  return (
    <SafeAreaProvider>
      <View style={[styles.shell, { backgroundColor: pageBg }]}>
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: sidebarBg,
              borderRightColor: sidebarBorder,
              transitionProperty: 'background-color, border-color',
              transitionDuration: '220ms',
              transitionTimingFunction: 'ease',
            },
          ]}
        >
          <View style={[styles.sidebarHeader, { borderBottomColor: sidebarHeaderBorder }]}>
            <Logo color={isDark ? brand.dark.brand5 : base.light.base12} />
            <Text style={[styles.brandSub, { color: sidebarMutedColor, marginTop: 8, marginLeft: 12 }]}>Design System</Text>
          </View>

          <View style={styles.nav}>
            {SIDEBAR_GROUPS.map((group, gIdx) => (
              <View key={group.id} style={[styles.navGroup, gIdx > 0 && { marginTop: 24 }]}>
                <Text style={[styles.navGroupLabel, { color: contentTokens.contentTertiary }]}>{group.label}</Text>
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    label={item.label}
                    active={activeId === item.id}
                    isDark={isDark}
                    onPress={() => setActiveId(item.id)}
                  />
                ))}
              </View>
            ))}
          </View>

          <View style={styles.sidebarFooter}>
            <DarkModeRow isDark={isDark} onChange={(next) => setMode(next ? 'dark' : 'light')} />
          </View>
        </View>

        <View style={[styles.contentArea, { backgroundColor: pageBg }]}>
          <ActiveComponent
            mode={mode}
            onModeChange={setMode}
            onScroll={(e) => setScrollY(e?.nativeEvent?.contentOffset?.y ?? 0)}
            topInset={16}
            pageTitle={active.label}
            route={{ params: active.params }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

function DarkModeRow({ isDark, onChange }) {
  const mode = isDark ? 'dark' : 'light';
  const tokens = content[mode];
  const btokens = brandTokens[mode];
  const layer = layerTokens[mode];
  return (
    <Pressable
      onPress={() => onChange(!isDark)}
      style={[styles.darkModeRow, isWeb && { cursor: 'pointer' }]}
    >
      <Text style={[currentTextStyle('3', 'regular'), { color: tokens.contentSecondary }]}>Dark Mode</Text>
      <PillSwitch
        value={isDark}
        onChange={onChange}
        trackOn={btokens.brandBackground}
        trackOff={isDark ? base.dark.base6 : base.light.base4}
        thumbOn={btokens.brandColor}
        thumbOff={isDark ? base.dark.base9 : base.light.base1}
      />
    </Pressable>
  );
}

const PILL_TRACK_W = 36;
const PILL_TRACK_H = 20;
const PILL_PAD = 2;
const PILL_THUMB = PILL_TRACK_H - PILL_PAD * 2;
const PILL_TRAVEL = PILL_TRACK_W - PILL_PAD * 2 - PILL_THUMB;

function PillSwitch({ value, onChange, trackOn, trackOff, thumbOn, thumbOff }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={[
        styles.pillTrack,
        { backgroundColor: value ? trackOn : trackOff },
        isWeb && {
          cursor: 'pointer',
          transitionProperty: 'background-color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      <View
        style={[
          styles.pillThumb,
          {
            backgroundColor: value ? thumbOn : thumbOff,
            transform: [{ translateX: value ? PILL_TRAVEL : 0 }],
          },
          isWeb && {
            transitionProperty: 'transform, background-color',
            transitionDuration: '180ms',
            transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          },
        ]}
      />
    </Pressable>
  );
}

function SidebarItem({ label, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);
  const mode = isDark ? 'dark' : 'light';
  const tokens = content[mode];

  const idleColor = tokens.contentSecondary;
  const primaryColor = tokens.contentPrimary;
  const brandColor = tokens.contentBrand;
  const labelColor = active ? brandColor : hover ? primaryColor : idleColor;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.sidebarItem,
        isWeb && {
          cursor: 'pointer',
          transitionProperty: 'color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      <Text
        style={[
          currentTextStyle('3', active || hover ? 'medium' : 'regular'),
          { color: labelColor },
          isWeb && {
            transitionProperty: 'color',
            transitionDuration: '180ms',
            transitionTimingFunction: 'ease-out',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ModeToggle({ mode, onChange, isDark }) {
  const [hover, setHover] = useState(false);
  const mode_ = isDark ? 'dark' : 'light';
  const trackBg = layerTokens[mode_].layer2Background;
  const trackBorder = layerTokens[mode_].layer2BorderColor;
  const knobBg = isDark ? base.dark.base12 : base.light.base11;
  const idleIconColor = isDark ? base.dark.base8 : base.light.base6;
  const activeIconColor = isDark ? base.dark.base1 : base.light.base1;
  const tooltipBg = isDark ? base.dark.base12 : base.light.base11;
  const tooltipColor = isDark ? base.dark.base1 : base.light.base1;
  const tooltipLabel = isDark ? 'Dark Mode' : 'Light Mode';

  return (
    <View
      style={styles.modeToggleWrap}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: isDark }}
        accessibilityLabel={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        onPress={() => onChange(isDark ? 'light' : 'dark')}
        style={[
          styles.modeToggle,
          { backgroundColor: trackBg, borderColor: trackBorder },
        ]}
      >
        <View style={styles.modeToggleIconSlot}>
          <Ionicons name="sunny" size={18} color={idleIconColor} />
        </View>
        <View style={styles.modeToggleIconSlot}>
          <Ionicons name="moon" size={18} color={idleIconColor} />
        </View>
        <View
          style={[
            styles.modeToggleKnob,
            {
              backgroundColor: knobBg,
              transform: [{ translateX: isDark ? 44 : 0 }],
              transitionProperty: 'transform, background-color',
              transitionDuration: '260ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
          ]}
        >
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={activeIconColor} />
        </View>
      </Pressable>
      <View
        pointerEvents="none"
        style={[
          styles.modeTooltip,
          {
            backgroundColor: tooltipBg,
            opacity: hover ? 1 : 0,
            transform: [{ translateY: hover ? 0 : -4 }],
            transitionProperty: 'opacity, transform',
            transitionDuration: '160ms',
            transitionTimingFunction: 'ease-out',
          },
        ]}
      >
        <Text style={[styles.modeTooltipLabel, { color: tooltipColor }]}>{tooltipLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100vh',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginVertical: 16,
    marginLeft: 16,
    marginRight: 8,
    borderRadius: 16, // Corner Radius / L
  },
  sidebarFooterRow: {
    alignItems: 'flex-start',
  },
  sidebarHeader: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    marginBottom: 8,
  },
  brandSub: {
    ...currentTextStyle('2', 'regular'),
  },
  nav: {
    marginTop: 32,
  },
  navGroup: {
    // first group: no top margin; subsequent groups add their own
  },
  navGroupLabel: {
    ...currentTextStyle('1', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingLeft: 12,
    marginBottom: 8,
  },
  sidebarItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingHorizontal: 10,
  },
  darkModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  pillTrack: {
    width: PILL_TRACK_W,
    height: PILL_TRACK_H,
    borderRadius: PILL_TRACK_H / 2,
    padding: PILL_PAD,
    justifyContent: 'center',
  },
  pillThumb: {
    width: PILL_THUMB,
    height: PILL_THUMB,
    borderRadius: PILL_THUMB / 2,
  },
  footerText: {
    ...currentTextStyle('1', 'regular'),
  },
  contentArea: {
    flex: 1,
    position: 'relative',
  },
  contentHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
  contentHeaderInner: {
    width: '100%',
    maxWidth: 1200,
    height: '100%',
    paddingHorizontal: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentTitle: {
    ...currentTextStyle('6', 'medium'),
  },
  modeToggleWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 84,
    height: 40,
    borderRadius: 999,
    padding: 4,
    position: 'relative',
    cursor: 'pointer',
  },
  modeTooltip: {
    position: 'absolute',
    top: 48,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    pointerEvents: 'none',
  },
  modeTooltipLabel: {
    ...currentTextStyle('2', 'medium'),
    whiteSpace: 'nowrap',
  },
  modeToggleIconSlot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modeToggleKnob: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
