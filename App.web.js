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
    ready: true,
    children: [
      {
        id: 'buttons',
        label: 'Buttons',
        subtitle: 'Primary, sizes, states',
        component: ButtonsScreen,
        ready: true,
      },
    ],
  },
];

function flattenSections(sections) {
  const flat = [];
  for (const s of sections) {
    flat.push(s);
    if (s.children) flat.push(...s.children);
  }
  return flat;
}

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

  const allSections = flattenSections(SECTIONS);
  const active = allSections.find((s) => s.id === activeId && s.component) ?? allSections.find((s) => s.component);
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
            {SECTIONS.map((s) => {
              const childActive = s.children?.some((c) => c.id === activeId);
              return (
                <View key={s.id}>
                  <NavItem
                    label={s.label}
                    subtitle={s.subtitle}
                    ready={s.ready}
                    active={s.id === activeId || childActive}
                    isDark={isDark}
                    onPress={() => {
                      if (s.component) setActiveId(s.id);
                      else if (s.children?.[0]) setActiveId(s.children[0].id);
                    }}
                    hasChildren={!!s.children}
                    childActive={childActive}
                  />
                  {s.children && (
                    <View style={styles.subNav}>
                      {s.children.map((child) => (
                        <SubNavItem
                          key={child.id}
                          label={child.label}
                          ready={child.ready}
                          active={child.id === activeId}
                          isDark={isDark}
                          accent={isDark ? brand.dark.brand5 : brand.light.brand6}
                          onPress={() => setActiveId(child.id)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
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

function NavItem({ label, subtitle, ready, active, isDark, onPress, nested = false, hasChildren = false, childActive = false }) {
  const [hover, setHover] = useState(false);

  const labelColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDark ? '#71797B' : '#808080';
  const idleHoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const activeBg = isDark ? 'rgba(255,255,255,0.10)' : '#1A1A1A';
  const activeLabelColor = '#FFFFFF';
  const activeSubtitleColor = isDark ? '#A1A5A7' : '#B2B2B2';
  const badgeBg = isDark ? 'rgba(255,255,255,0.06)' : '#F2F2F2';
  const badgeColor = isDark ? '#A1A5A7' : '#808080';

  const showActiveBg = active && !hasChildren;
  const bodyShift = hover && ready && !showActiveBg ? 4 : 0;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      disabled={!ready}
      style={[
        styles.navItem,
        nested && { paddingLeft: 22 },
        {
          backgroundColor: showActiveBg ? activeBg : hover && ready ? idleHoverBg : 'transparent',
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
              color: showActiveBg ? activeLabelColor : labelColor,
              transitionProperty: 'color',
              transitionDuration: '180ms',
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {hasChildren && (
        <Text
          style={[
            styles.navItemChevron,
            {
              color: showActiveBg ? activeLabelColor : subtitleColor,
              transform: [{ rotate: childActive ? '90deg' : '0deg' }],
              transitionProperty: 'transform, color',
              transitionDuration: '180ms',
            },
          ]}
        >
          ›
        </Text>
      )}

      {!ready && !hasChildren && (
        <Text style={[styles.navItemBadge, { backgroundColor: badgeBg, color: badgeColor }]}>Soon</Text>
      )}
    </Pressable>
  );
}

function SubNavItem({ label, ready, active, isDark, accent, onPress }) {
  const [hover, setHover] = useState(false);

  const idleColor = isDark ? '#A1A5A7' : '#666666';
  const hoverColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const labelColor = active ? accent : hover ? hoverColor : idleColor;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      disabled={!ready}
      style={[
        styles.subNavItem,
        {
          opacity: ready ? 1 : 0.55,
          cursor: ready ? 'pointer' : 'default',
        },
      ]}
    >
      <View
        style={[
          styles.subNavAccent,
          {
            backgroundColor: active ? accent : 'transparent',
            transitionProperty: 'background-color',
            transitionDuration: '180ms',
          },
        ]}
      />
      <Text
        style={[
          styles.subNavItemLabel,
          {
            color: labelColor,
            transitionProperty: 'color',
            transitionDuration: '180ms',
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
  const trackBg = isDark ? base.dark.base5 : base.light.base3;
  const trackBorder = isDark ? base.dark.base6 : base.light.base3;
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
  navItemChevron: {
    fontSize: 18,
    marginLeft: 8,
    lineHeight: 18,
  },
  subNav: {
    marginLeft: 18,
    marginTop: 2,
    marginBottom: 4,
    paddingLeft: 14,
    gap: 2,
  },
  subNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 8,
    position: 'relative',
  },
  subNavAccent: {
    position: 'absolute',
    left: -15,
    top: 8,
    bottom: 8,
    width: 2,
    borderRadius: 1,
  },
  subNavItemLabel: {
    ...proposedTextStyle('body-medium', 'medium'),
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
    borderWidth: 1,
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
    ...proposedTextStyle('body-small', 'medium'),
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
