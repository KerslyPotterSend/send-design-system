import { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import Icon from './Icon';
import { brand as brandRamp, brandTokens, content, layerTokens } from '../theme/colors';
import { cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PAD = spacing.mobile.M; // 12 — padding around each tab's content
const UNDERLINE_WIDTH = 2; // border weight for the underline variants
const PRESS_OPACITY = 0.5; // how far the tab fades while pressed

// variant:
//   'simple'         — text only, color shift on active
//   'underline'      — simple + a 2px brand underline under the active tab
//   'underlineIcons' — underline + a leading icon per tab
//   'underlineBadge' — underline + a trailing count badge per tab (tab.badge)
//   'pill'           — active tab sits in a brand pill
export default function Tabs({
  mode = 'dark',
  variant = 'simple',
  tabs = [],
  value: valueProp,
  onChange,
  fullWidth = false,
  devMode = false,
}) {
  const [internal, setInternal] = useState(0);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;

  const text = content[mode];
  const brand = brandTokens[mode];
  const layer = layerTokens[mode];

  const isUnderline =
    variant === 'underline' || variant === 'underlineIcons' || variant === 'underlineBadge';
  const showIcon = variant === 'underlineIcons';
  const showBadge = variant === 'underlineBadge';
  const isPill = variant === 'pill';

  const select = (i) => {
    if (!isControlled) setInternal(i);
    onChange?.(i);
  };

  return (
    <View
      style={[
        styles.row,
        fullWidth ? styles.rowFull : styles.rowHug,
        isPill && styles.rowGap, // only pill tabs sit apart; others are flush
      ]}
    >
      {tabs.map((tab, i) => {
        const active = i === value;
        const label = typeof tab === 'string' ? tab : tab.label;
        const icon = typeof tab === 'object' ? tab.icon : undefined;
        const badge = typeof tab === 'object' ? tab.badge : undefined;

        // Inactive content/secondary; active content/primary on underline & pill,
        // content/brand on the plain 'simple' variant.
        let labelColor = active ? text.contentBrand : text.contentSecondary;
        if ((isUnderline || isPill) && active) labelColor = text.contentPrimary;

        const underlineColor = active ? brand.brandBorderColor : 'transparent';
        const pillBg = active ? layer.layer3Background : 'transparent';

        // Dev inspector: map this tab's resolved styles back to design tokens.
        const colorRef =
          isUnderline || isPill
            ? active ? 'content.contentPrimary' : 'content.contentSecondary'
            : active ? 'content.contentBrand' : 'content.contentSecondary';
        const devLines = [{ prop: 'color', ref: colorRef, val: labelColor }];
        if (isPill) devLines.push({ prop: 'background', ref: active ? 'layer3Background' : 'transparent', val: pillBg });
        if (isUnderline) devLines.push({ prop: 'border-bottom', ref: active ? 'brandBorderColor' : 'transparent' });
        if (isPill) devLines.push({ prop: 'border-radius', ref: 'cornerRadius.Pill', val: `${cornerRadius.mobile.Pill}px` });
        devLines.push({ prop: 'padding', ref: 'spacing.M', val: `${PAD}px` });
        devLines.push({ prop: 'font', ref: 'typography/3 · medium', val: '14px' });
        if (showIcon) devLines.push({ prop: 'icon-size', ref: '16', val: '16px' });
        if (showBadge) {
          devLines.push({ prop: 'badge-bg', ref: 'brand.brand1', val: brandRamp[mode].brand1 });
          devLines.push({ prop: 'badge-color', ref: 'content.contentBrand', val: text.contentBrand });
        }

        return (
          <TabItem
            key={i}
            active={active}
            label={label}
            icon={icon}
            showIcon={showIcon}
            badge={badge}
            showBadge={showBadge}
            isUnderline={isUnderline}
            isPill={isPill}
            fullWidth={fullWidth}
            labelColor={labelColor}
            underlineColor={underlineColor}
            pillBg={pillBg}
            badgeBg={brandRamp[mode].brand1}
            badgeColor={text.contentBrand}
            mode={mode}
            devMode={devMode}
            devTitle={`tab · ${variant} · ${active ? 'active' : 'default'}`}
            devLines={devLines}
            onPress={() => select(i)}
          />
        );
      })}
    </View>
  );
}

function TabItem({
  active,
  label,
  icon,
  showIcon,
  badge,
  showBadge,
  isUnderline,
  isPill,
  fullWidth,
  labelColor,
  underlineColor,
  pillBg,
  badgeBg,
  badgeColor,
  mode,
  devMode,
  devTitle,
  devLines,
  onPress,
}) {
  const [hover, setHover] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const fadeTo = (toValue) =>
    Animated.timing(opacity, {
      toValue,
      duration: 200,
      useNativeDriver: !isWeb,
    }).start();

  const webTransition = isWeb && {
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  };

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      onPressIn={() => fadeTo(PRESS_OPACITY)}
      onPressOut={() => fadeTo(1)}
      onHoverIn={devMode ? () => setHover(true) : undefined}
      onHoverOut={devMode ? () => setHover(false) : undefined}
      style={[
        styles.tab,
        fullWidth && styles.tabFull,
        isUnderline && { paddingBottom: 0 }, // underline sits flush at the bottom
        isPill && { borderRadius: cornerRadius.mobile.Pill, backgroundColor: pillBg },
        { opacity },
        isWeb && { cursor: 'pointer' },
        webTransition,
      ]}
    >
      {/* Inner row hugs the content so the underline matches the text width. */}
      <View
        style={[
          styles.content,
          isUnderline && {
            paddingBottom: PAD, // 12 — space between text and underline
            borderBottomWidth: UNDERLINE_WIDTH,
            borderBottomColor: underlineColor,
          },
          webTransition,
        ]}
      >
        {showIcon && icon && (
          <Icon name={icon} size={16} color={labelColor} style={styles.tabIcon} />
        )}
        <Text style={[styles.label, { color: labelColor }, webTransition]} numberOfLines={1}>
          {label}
        </Text>
        {showBadge && badge != null && (
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]} numberOfLines={1}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      {isWeb && devMode && hover && <DevTooltip mode={mode} title={devTitle} lines={devLines} />}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowGap: {
    gap: spacing.mobile.XS, // 4 — gap between pill tabs
  },
  rowHug: {
    alignSelf: 'flex-start', // width hugs content
  },
  rowFull: {
    alignSelf: 'stretch',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: PAD, // 12
  },
  tabFull: {
    flex: 1, // share the row evenly when full width
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: spacing.mobile.XS, // 4 — icon ↔ label
  },
  label: {
    ...currentTextStyle('3', 'medium'), // Typography 3
  },
  badge: {
    minWidth: 20,
    height: 20,
    marginLeft: spacing.mobile.S, // 8 — label ↔ badge
    paddingHorizontal: spacing.mobile.XS, // 4 — room for 2+ digits
    borderRadius: cornerRadius.mobile.Pill, // circle/pill
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...currentTextStyle('2', 'medium'), // Typography 2 (12/16)
  },
});
