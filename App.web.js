import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Logo from './src/components/Logo';
import ColorsScreen from './src/screens/ColorsScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import TypographyScreen from './src/screens/TypographyScreen';
import { base, brand, content, layerTokens } from './src/theme/colors';
import { proposedTextStyle } from './src/theme/typography';
const HEADER_HEIGHT = 72;
const SIDEBAR_WIDTH = 260;

const SECTIONS = [
  { id: 'colors', label: 'Colors', subtitle: 'Tokens', component: ColorsScreen, ready: true },
  {
    id: 'typography',
    label: 'Typography',
    subtitle: 'Type scale',
    component: TypographyScreen,
    ready: true,
  },
  {
    id: 'components',
    label: 'Components',
    subtitle: 'Buttons, inputs, cards',
    component: ComingSoonScreen,
    params: { title: 'Components' },
    ready: false,
  },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const [activeId, setActiveId] = useState('colors');
  const [mode, setMode] = useState('light');
  const [scrollY, setScrollY] = useState(0);

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];
  const ActiveComponent = active.component;
  const isDark = mode === 'dark';
  const isScrolled = scrollY > 4;

  useEffect(() => {
    setScrollY(0);
  }, [activeId]);

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

  const sidebarBg = isDark ? baseTokens.base2 : baseTokens.base1;
  const sidebarBorder = chromeBorder;
  const sidebarHeaderBorder = layer.layer1Background;
  const sidebarMutedColor = contentTokens.contentSecondary;
  const sidebarFooterColor = contentTokens.contentTertiary;

  return (
    <SafeAreaProvider>
      <View style={styles.shell}>
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
            <Text style={[styles.brandSub, { color: sidebarMutedColor, marginTop: 8 }]}>design system</Text>
          </View>

          <Text style={[styles.navSectionLabel, { color: sidebarMutedColor }]}>Foundations</Text>
          <View style={styles.nav}>
            {SECTIONS.map((s) => (
              <NavItem
                key={s.id}
                label={s.label}
                subtitle={s.subtitle}
                ready={s.ready}
                active={s.id === activeId}
                isDark={isDark}
                onPress={() => setActiveId(s.id)}
              />
            ))}
          </View>

          <View style={styles.sidebarFooter}>
            <Text style={[styles.footerText, { color: sidebarFooterColor }]}>v0.1.0 · early</Text>
          </View>
        </View>

        <View style={[styles.contentArea, { backgroundColor: pageBg }]}>
          <ActiveComponent
            mode={mode}
            onModeChange={setMode}
            onScroll={(e) => setScrollY(e?.nativeEvent?.contentOffset?.y ?? 0)}
            topInset={HEADER_HEIGHT}
            route={{ params: active.params }}
          />

          <View
            style={[
              styles.contentHeader,
              {
                backgroundColor: headerBg,
                borderBottomColor: headerBorder,
              },
              headerWebStyles,
            ]}
          >
            <Text style={[styles.contentTitle, { color: titleColor }]}>{active.label}</Text>
            <ModeToggle mode={mode} onChange={setMode} isDark={isDark} />
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

function NavItem({ label, subtitle, ready, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);

  const labelColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDark ? '#71797B' : '#808080';
  const idleHoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const activeBg = isDark ? 'rgba(255,255,255,0.10)' : '#1A1A1A';
  const activeLabelColor = '#FFFFFF';
  const activeSubtitleColor = isDark ? '#A1A5A7' : '#B2B2B2';
  const badgeBg = isDark ? 'rgba(255,255,255,0.06)' : '#F2F2F2';
  const badgeColor = isDark ? '#A1A5A7' : '#808080';

  const bodyShift = hover && ready && !active ? 4 : 0;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      disabled={!ready}
      style={[
        styles.navItem,
        {
          backgroundColor: active ? activeBg : hover && ready ? idleHoverBg : 'transparent',
          opacity: ready ? 1 : 0.55,
          cursor: ready ? 'pointer' : 'default',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
      ]}
    >
      <View
        style={[
          styles.navItemBody,
          {
            transform: [{ translateX: bodyShift }],
            transitionProperty: 'transform',
            transitionDuration: '260ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        ]}
      >
        <Text
          style={[
            styles.navItemLabel,
            {
              color: active ? activeLabelColor : labelColor,
              transitionProperty: 'color',
              transitionDuration: '180ms',
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.navItemSubtitle,
            { color: active ? activeSubtitleColor : subtitleColor },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {!ready && (
        <Text style={[styles.navItemBadge, { backgroundColor: badgeBg, color: badgeColor }]}>Soon</Text>
      )}
    </Pressable>
  );
}

function ModeToggle({ mode, onChange, isDark }) {
  return (
    <View
      style={[
        styles.modeToggle,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          borderColor: isDark ? '#2A3639' : '#E5E5E5',
        },
      ]}
    >
      {['light', 'dark'].map((m) => (
        <ModeToggleButton
          key={m}
          label={m}
          active={mode === m}
          isDark={isDark}
          onPress={() => onChange(m)}
        />
      ))}
    </View>
  );
}

function ModeToggleButton({ label, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);
  const activeBg = isDark ? '#FFFFFF' : '#1A1A1A';
  const activeColor = isDark ? '#0E1A1C' : '#FFFFFF';
  const idleColor = isDark ? '#A1A5A7' : '#666666';
  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.modeToggleButton,
        active && { backgroundColor: activeBg },
        !active && hover && { backgroundColor: hoverBg },
        { cursor: 'pointer' },
      ]}
    >
      <Text
        style={[
          styles.modeToggleLabel,
          { color: active ? activeColor : idleColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100vh',
    backgroundColor: '#F7F7F7',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sidebarHeader: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  brandSub: {
    ...proposedTextStyle('body-small', 'regular'),
  },
  navSectionLabel: {
    ...proposedTextStyle('label', 'semiBold'),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  nav: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  navItemBody: {
    flex: 1,
  },
  navItemLabel: {
    ...proposedTextStyle('body-medium', 'semiBold'),
  },
  navItemSubtitle: {
    ...proposedTextStyle('label', 'regular'),
    marginTop: 2,
  },
  navItemBadge: {
    ...proposedTextStyle('label', 'bold'),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  footerText: {
    ...proposedTextStyle('label', 'regular'),
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
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  contentTitle: {
    ...proposedTextStyle('headline-small', 'bold'),
  },
  modeToggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  modeToggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 9,
    alignItems: 'center',
    minWidth: 88,
  },
  modeToggleLabel: {
    ...proposedTextStyle('body-medium', 'semiBold'),
    textTransform: 'capitalize',
  },
});
