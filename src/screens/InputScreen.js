import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Input from '../components/Input';
import { base, brandTokens, content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];
const PILL_TRACK_W = 36;
const PILL_TRACK_H = 20;
const PILL_PAD = 2;
const PILL_THUMB = PILL_TRACK_H - PILL_PAD * 2;
const PILL_TRAVEL = PILL_TRACK_W - PILL_PAD * 2 - PILL_THUMB;

const LAYERS = [
  { layer: 2, title: 'Layer 2', description: 'Input on the Layer 2 surface.' },
  { layer: 3, title: 'Layer 3', description: 'Input on the Layer 3 surface.' },
];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'focus', label: 'Focus' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
  { value: 'disabled', label: 'Disabled' },
];

export default function InputScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
  const [state, setState] = useState('default');
  const [rounded, setRounded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

  const isControlled = modeProp !== undefined;
  const mode = isControlled ? modeProp : internalMode;
  const setMode = isControlled ? onModeChange : setInternalMode;
  const isDark = mode === 'dark';

  const layer = layerTokens[mode];
  const tokens = content[mode];

  const pageBg = layer.layer1Background;
  const cardBg = layer.layer2Background;
  const cardBorder = layer.layer2BorderColor;
  const dividerColor = layer.layer2BorderColor;
  const titleColor = tokens.contentPrimary;
  const subColor = tokens.contentSecondary;
  const chipIdleBg = layer.layer3Background;
  const chipActiveBg = brandTokens[mode].brandBackground;
  const chipActiveColor = brandTokens[mode].brandColor;
  const switchOnBg = brandTokens[mode].brandBackground;
  const switchOffBg = isDark ? base.dark.base6 : base.light.base4;
  const switchThumbOn = brandTokens[mode].brandColor;
  const switchThumbOff = isDark ? base.dark.base9 : base.light.base1;

  const controlPanel = (
    <View style={[styles.controlPanel, { backgroundColor: cardBg }]}>
      <View style={[styles.panelHeader, { borderBottomColor: dividerColor }]}>
        <Ionicons name="options-outline" size={16} color={titleColor} />
        <Text style={[styles.panelTitle, { color: titleColor }]}>Controls</Text>
        {isNarrow ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close controls"
            onPress={() => setControlsOpen(false)}
            style={isWeb && { cursor: 'pointer' }}
          >
            <Ionicons name="close" size={20} color={subColor} />
          </Pressable>
        ) : (
          <Text style={[styles.panelBadge, { color: subColor, borderColor: dividerColor }]}>
            All layers
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        <Dropdown
          label="State"
          options={STATE_OPTIONS}
          value={state}
          onChange={setState}
          labelColor={subColor}
          valueColor={titleColor}
          triggerBg={chipIdleBg}
          menuBg={cardBg}
          activeBg={chipActiveBg}
          activeColor={chipActiveColor}
          dividerColor={dividerColor}
        />
        <SwitchRow
          label="Rounded"
          value={rounded}
          onChange={setRounded}
          labelColor={subColor}
          valueColor={titleColor}
          dividerColor={dividerColor}
          trackOn={switchOnBg}
          trackOff={switchOffBg}
          thumbOn={switchThumbOn}
          thumbOff={switchThumbOff}
          isLast
        />
      </View>
    </View>
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
        {pageTitle && (
          <Text style={[styles.pageTitle, isNarrow && styles.pageTitleNarrow, { color: titleColor }]}>
            {pageTitle}
          </Text>
        )}

        {!isControlled && (
          <View style={[styles.toggleBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {MODES.map((m) => (
              <ToggleButton
                key={m}
                label={m}
                active={mode === m}
                isDark={isDark}
                onPress={() => setMode(m)}
              />
            ))}
          </View>
        )}

        <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
          <View style={styles.demoColumn}>
            {LAYERS.map((item) => (
              <View
                key={item.layer}
                style={[
                  styles.section,
                  { backgroundColor: item.layer === 2 ? 'transparent' : cardBg },
                  item.layer === 2 && { borderWidth: 1, borderColor: cardBorder },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: titleColor }]}>{item.title}</Text>
                <Text style={[styles.sectionSubtitle, { color: subColor }]}>{item.description}</Text>

                <View style={styles.demoStage}>
                  <Input layer={item.layer} mode={mode} state={state} rounded={rounded} />
                </View>
              </View>
            ))}
          </View>

          {!isNarrow && (
            <View style={[styles.controlColumn, isWeb && styles.controlColumnSticky]}>
              {controlPanel}
            </View>
          )}
        </View>
      </ScrollView>

      {isNarrow && (
        <>
          {controlsOpen && (
            <>
              <Pressable style={styles.scrim} onPress={() => setControlsOpen(false)} />
              <View style={styles.sheet}>{controlPanel}</View>
            </>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Controls"
            onPress={() => setControlsOpen((o) => !o)}
            style={[
              styles.fab,
              { backgroundColor: chipActiveBg },
              isWeb && { cursor: 'pointer' },
            ]}
          >
            <Ionicons name={controlsOpen ? 'close' : 'options-outline'} size={24} color={chipActiveColor} />
          </Pressable>
        </>
      )}
    </View>
  );
}

function Dropdown({ label, options, value, onChange, labelColor, valueColor, triggerBg, menuBg, activeBg, activeColor, dividerColor }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View
      style={[
        styles.controlRow,
        { borderBottomColor: dividerColor, zIndex: open ? 20 : 1 },
        isWeb && { position: 'relative' },
      ]}
    >
      <Text style={[styles.controlLabel, { color: labelColor }]}>{label}</Text>
      <View style={styles.dropdownWrap}>
        <Pressable
          onPress={() => setOpen((o) => !o)}
          style={[
            styles.dropdownTrigger,
            { backgroundColor: triggerBg, borderColor: dividerColor },
            isWeb && { cursor: 'pointer' },
          ]}
        >
          <Text style={[styles.dropdownValue, { color: valueColor }]}>{current?.label}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={valueColor} />
        </Pressable>

        {open && (
          <View style={[styles.dropdownMenu, { backgroundColor: menuBg, borderColor: dividerColor }]}>
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    active && { backgroundColor: activeBg },
                    isWeb && { cursor: 'pointer' },
                  ]}
                >
                  <Text style={[styles.dropdownItemText, { color: active ? activeColor : valueColor }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

function SwitchRow({ label, value, onChange, labelColor, valueColor, dividerColor, trackOn, trackOff, thumbOn, thumbOff, isLast }) {
  return (
    <View
      style={[
        styles.controlRow,
        !isLast && { borderBottomColor: dividerColor, borderBottomWidth: 0.5 },
      ]}
    >
      <Text style={[styles.controlLabel, { color: labelColor }]}>{label}</Text>
      <View style={styles.switchRight}>
        <Text style={[styles.switchValue, { color: valueColor }]}>{value ? 'true' : 'false'}</Text>
        <PillSwitch
          value={value}
          onChange={onChange}
          trackOn={trackOn}
          trackOff={trackOff}
          thumbOn={thumbOn}
          thumbOff={thumbOff}
        />
      </View>
    </View>
  );
}

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

function ToggleButton({ label, active, isDark, onPress }) {
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
  pageTitle: {
    ...currentTextStyle('11', 'medium'),
    marginTop: 24,
    marginBottom: 32,
  },
  pageTitleNarrow: {
    ...currentTextStyle('8', 'medium'),
    marginTop: 8,
    marginBottom: 20,
  },
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
  contentNarrow: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  layout: {
    flexDirection: isWeb ? 'row' : 'column-reverse',
    alignItems: 'flex-start',
    gap: 16,
  },
  layoutNarrow: {
    flexDirection: 'column',
  },
  controlColumnNarrow: {
    width: '100%',
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
  demoColumn: {
    flex: 1,
    gap: 16,
    width: '100%',
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
  section: {
    borderRadius: 12,
    padding: isWeb ? 24 : 16,
  },
  sectionTitle: {
    ...currentTextStyle('5', 'medium'),
  },
  sectionSubtitle: {
    ...currentTextStyle('3', 'regular'),
    marginTop: 4,
    marginBottom: 16,
  },
  demoStage: {
    paddingVertical: 12,
    maxWidth: 520,
  },
  controls: {
    marginTop: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
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
});
