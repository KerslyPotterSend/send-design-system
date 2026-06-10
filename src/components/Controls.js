import Icon from './Icon';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { base, brandTokens, content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const PILL_TRACK_W = 36;
const PILL_TRACK_H = 20;
const PILL_PAD = 2;
const PILL_THUMB = PILL_TRACK_H - PILL_PAD * 2;
const PILL_TRAVEL = PILL_TRACK_W - PILL_PAD * 2 - PILL_THUMB;

// Resolves every color the controls UI needs from a single mode value, so each
// screen stops re-deriving the same token bag by hand.
export function useControlTokens(mode) {
  const isDark = mode === 'dark';
  const layer = layerTokens[mode];
  const tokens = content[mode];
  return {
    isDark,
    cardBg: layer.layer2Background,
    dividerColor: layer.layer2BorderColor,
    cardBorder: layer.layer2BorderColor,
    titleColor: tokens.contentPrimary,
    subColor: tokens.contentSecondary,
    chipIdleBg: layer.layer3Background,
    chipActiveBg: brandTokens[mode].brandBackground,
    chipActiveColor: brandTokens[mode].brandColor,
    switchOnBg: brandTokens[mode].brandBackground,
    switchOffBg: isDark ? base.dark.base6 : base.light.base4,
    switchThumbOn: brandTokens[mode].brandColor,
    switchThumbOff: isDark ? base.dark.base9 : base.light.base1,
  };
}

// =============================================================================
// Mode (light / dark) segmented toggle — shown at the top of every screen.
// =============================================================================

export function ModeToggleBar({ mode, onModeChange, modes = ['light', 'dark'] }) {
  const t = useControlTokens(mode);
  return (
    <View style={[styles.toggleBar, { backgroundColor: t.cardBg, borderColor: t.cardBorder }]}>
      {modes.map((m) => (
        <ModeToggleButton
          key={m}
          label={m}
          active={mode === m}
          isDark={t.isDark}
          onPress={() => onModeChange(m)}
        />
      ))}
    </View>
  );
}

function ModeToggleButton({ label, active, isDark, onPress }) {
  const [hover, setHover] = useState(false);
  const mode = isDark ? 'dark' : 'light';
  const activeBg = isDark ? base.dark.base6 : content.light.contentPrimary;
  const hoverBg = layerTokens[mode].layer1BackgroundHover;
  const idleColor = content[mode].contentSecondary;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.toggleButton,
        active && { backgroundColor: activeBg },
        !active && hover && { backgroundColor: hoverBg },
        isWeb && { cursor: 'pointer' },
      ]}
    >
      <Text style={[styles.toggleLabel, { color: active ? '#FFFFFF' : idleColor }]}>{label}</Text>
    </Pressable>
  );
}

// =============================================================================
// Control rows — Dropdown + SwitchRow. Both resolve colors from `mode`.
// =============================================================================

export function Dropdown({ mode, label, options, value, onChange }) {
  const t = useControlTokens(mode);
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View
      style={[
        styles.controlRow,
        { zIndex: open ? 20 : 1 },
        isWeb && { position: 'relative' },
      ]}
    >
      <Text style={[styles.controlLabel, { color: t.subColor }]}>{label}</Text>
      <View style={styles.dropdownWrap}>
        <Pressable
          onPress={() => setOpen((o) => !o)}
          style={[
            styles.dropdownTrigger,
            { backgroundColor: t.chipIdleBg, borderColor: t.dividerColor },
            isWeb && { cursor: 'pointer' },
          ]}
        >
          <Text style={[styles.dropdownValue, { color: t.titleColor }]}>{current?.label}</Text>
          <Icon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={14} color={t.titleColor} />
        </Pressable>

        {open && (
          <View style={[styles.dropdownMenu, { backgroundColor: t.cardBg, borderColor: t.dividerColor }]}>
            {options.map((opt) => (
              <DropdownItem
                key={opt.value}
                label={opt.label}
                active={opt.value === value}
                activeBg={t.chipActiveBg}
                activeColor={t.chipActiveColor}
                valueColor={t.titleColor}
                hoverBg={t.chipIdleBg}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function DropdownItem({ label, active, activeBg, activeColor, valueColor, hoverBg, onPress }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.dropdownItem,
        active ? { backgroundColor: activeBg } : hover && { backgroundColor: hoverBg },
        isWeb && {
          cursor: 'pointer',
          transitionProperty: 'background-color',
          transitionDuration: '120ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      <Text style={[styles.dropdownItemText, { color: active ? activeColor : valueColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SwitchRow({ mode, label, value, onChange }) {
  const t = useControlTokens(mode);
  return (
    <View style={styles.controlRow}>
      <Text style={[styles.controlLabel, { color: t.subColor }]}>{label}</Text>
      <View style={styles.switchRight}>
        <Text style={[styles.switchValue, { color: t.titleColor }]}>{value ? 'true' : 'false'}</Text>
        <PillSwitch
          value={value}
          onChange={onChange}
          trackOn={t.switchOnBg}
          trackOff={t.switchOffBg}
          thumbOn={t.switchThumbOn}
          thumbOff={t.switchThumbOff}
        />
      </View>
    </View>
  );
}

export function PillSwitch({ value, onChange, trackOn, trackOff, thumbOn, thumbOff }) {
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

// =============================================================================
// Panel card — the "Controls" header + a stack of control rows as children.
// =============================================================================

export function ControlPanel({ mode, isNarrow, badge = 'All variants', onClose, children }) {
  const t = useControlTokens(mode);
  return (
    <View style={[styles.controlPanel, { backgroundColor: t.cardBg }]}>
      <View style={[styles.panelHeader, { borderBottomColor: t.dividerColor }]}>
        <Icon name="tune" size={16} color={t.titleColor} />
        <Text style={[styles.panelTitle, { color: t.titleColor }]}>Controls</Text>
        {isNarrow ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close controls"
            onPress={onClose}
            style={isWeb && { cursor: 'pointer' }}
          >
            <Icon name="close" size={20} color={t.subColor} />
          </Pressable>
        ) : (
          <Text style={[styles.panelBadge, { color: t.subColor, borderColor: t.dividerColor }]}>
            {badge}
          </Text>
        )}
      </View>
      <View style={styles.controls}>{children}</View>
    </View>
  );
}

// =============================================================================
// Full responsive controls UX. Drop ONE of these into a screen and pass the
// control rows as children. Renders the sticky side column on desktop and a
// floating FAB + bottom sheet on mobile — identical across every page.
// =============================================================================

export function ScreenControls({ mode, isNarrow, badge, open, setOpen, children }) {
  const t = useControlTokens(mode);

  if (!isNarrow) {
    return (
      <View style={[styles.controlColumn, isWeb && styles.controlColumnSticky]}>
        <ControlPanel mode={mode} isNarrow={false} badge={badge}>
          {children}
        </ControlPanel>
      </View>
    );
  }

  return (
    <>
      {open && (
        <>
          <Pressable style={styles.scrim} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <ControlPanel mode={mode} isNarrow badge={badge} onClose={() => setOpen(false)}>
              {children}
            </ControlPanel>
          </View>
        </>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Controls"
        onPress={() => setOpen((o) => !o)}
        style={[styles.fab, { backgroundColor: t.chipActiveBg }, isWeb && { cursor: 'pointer' }]}
      >
        <Icon name={open ? 'close' : 'tune'} size={24} color={t.chipActiveColor} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  toggleBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  toggleLabel: {
    ...currentTextStyle('3', 'semiBold'),
    textTransform: 'capitalize',
  },
  controlColumn: {
    width: isWeb ? 320 : '100%',
  },
  controlColumnSticky: {
    position: 'sticky',
    top: 24,
  },
  controlPanel: {
    borderRadius: 12,
    padding: isWeb ? 20 : 16,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 14,
    marginBottom: 6,
    borderBottomWidth: 0.5,
  },
  panelTitle: {
    ...currentTextStyle('4', 'medium'),
    flex: 1,
  },
  panelBadge: {
    ...currentTextStyle('1', 'medium'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    borderWidth: 0.5,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  controls: {
    marginTop: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 16,
  },
  controlLabel: {
    ...currentTextStyle('3', 'regular'),
    minWidth: 84,
  },
  dropdownWrap: {
    position: 'relative',
    minWidth: 150,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownValue: {
    ...currentTextStyle('2', 'medium'),
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 4,
    zIndex: 20,
    ...(isWeb && { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.14)' }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    ...currentTextStyle('2', 'medium'),
  },
  switchRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchValue: {
    ...currentTextStyle('3', 'regular'),
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
  fab: {
    position: isWeb ? 'fixed' : 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    ...(isWeb && { boxShadow: '0 3px 14px rgba(15, 23, 42, 0.16)' }),
  },
  scrim: {
    position: isWeb ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 80,
  },
  sheet: {
    position: isWeb ? 'fixed' : 'absolute',
    left: 16,
    right: 16,
    bottom: 92,
    maxHeight: '70%',
    zIndex: 100,
    borderRadius: 16,
    ...(isWeb && { boxShadow: '0 10px 32px rgba(15, 23, 42, 0.26)' }),
  },
});
