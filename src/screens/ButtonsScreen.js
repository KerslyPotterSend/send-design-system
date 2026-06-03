import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { base, brandTokens, content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];
const PILL_TRACK_W = 36;
const PILL_TRACK_H = 20;
const PILL_PAD = 2;
const PILL_THUMB = PILL_TRACK_H - PILL_PAD * 2;
const PILL_TRAVEL = PILL_TRACK_W - PILL_PAD * 2 - PILL_THUMB;

const SIZES = ['L', 'M', 'S'];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'pressed', label: 'Press' },
  { value: 'disabled', label: 'Disabled' },
];

export default function ButtonsScreen({
  mode: modeProp,
  onModeChange,
  onScroll,
  topInset = 0,
}) {
  const [internalMode, setInternalMode] = useState('dark');
  const [state, setState] = useState('default');
  const [rounded, setRounded] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  const [hasIcon, setHasIcon] = useState(false);

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

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: (isWeb ? 24 : 20) + topInset }]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {!isControlled && (
          <View style={[styles.toggleBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {MODES.map((m) => (
              <ModeToggleButton
                key={m}
                label={m}
                active={mode === m}
                isDark={isDark}
                onPress={() => setMode(m)}
              />
            ))}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Primary</Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Drive every Figma variant from the controls below.
          </Text>

          <View style={styles.demoStage}>
            {SIZES.map((s) => (
              <View key={s} style={styles.demoSlot}>
                <Text style={[styles.demoLabel, { color: subColor }]}>{s}</Text>
                <Button
                  mode={mode}
                  size={s}
                  state={state}
                  rounded={rounded}
                  iconOnly={iconOnly}
                  hasIcon={hasIcon}
                >
                  Send money
                </Button>
              </View>
            ))}
          </View>

          <View style={styles.controls}>
            <Segmented
              label="State"
              options={STATE_OPTIONS}
              value={state}
              onChange={setState}
              labelColor={subColor}
              chipIdleBg={chipIdleBg}
              chipIdleColor={titleColor}
              chipActiveBg={chipActiveBg}
              chipActiveColor={chipActiveColor}
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
            />
            <SwitchRow
              label="Has Icon"
              value={hasIcon}
              onChange={setHasIcon}
              labelColor={subColor}
              valueColor={titleColor}
              dividerColor={dividerColor}
              trackOn={switchOnBg}
              trackOff={switchOffBg}
              thumbOn={switchThumbOn}
              thumbOff={switchThumbOff}
            />
            <SwitchRow
              label="Icon Only"
              value={iconOnly}
              onChange={setIconOnly}
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
      </ScrollView>
    </View>
  );
}

function Segmented({ label, options, value, onChange, labelColor, chipIdleBg, chipIdleColor, chipActiveBg, chipActiveColor, dividerColor }) {
  return (
    <View style={[styles.controlRow, { borderBottomColor: dividerColor }]}>
      <Text style={[styles.controlLabel, { color: labelColor }]}>{label}</Text>
      <View style={styles.chipGroup}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? chipActiveBg : chipIdleBg,
                },
                isWeb && { cursor: 'pointer' },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: active ? chipActiveColor : chipIdleColor },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SwitchRow({
  label,
  value,
  onChange,
  labelColor,
  valueColor,
  dividerColor,
  trackOn,
  trackOff,
  thumbOn,
  thumbOff,
  isLast,
}) {
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
        {
          backgroundColor: value ? trackOn : trackOff,
        },
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
        styles.modeToggleButton,
        active && { backgroundColor: activeBg },
        !active && hover && { backgroundColor: hoverBg },
        isWeb && { cursor: 'pointer' },
      ]}
    >
      <Text style={[styles.modeToggleLabel, { color: active ? '#FFFFFF' : idleColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: isWeb ? 40 : 20,
    paddingBottom: 60,
    gap: 16,
    maxWidth: isWeb ? 1200 : undefined,
    width: '100%',
    alignSelf: isWeb ? 'center' : 'stretch',
  },
  toggleBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  modeToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  modeToggleLabel: {
    ...currentTextStyle('3', 'semiBold'),
    textTransform: 'capitalize',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 32,
    paddingVertical: 32,
  },
  demoSlot: {
    alignItems: 'flex-start',
    gap: 10,
  },
  demoLabel: {
    ...currentTextStyle('1', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
    minWidth: 120,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipLabel: {
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
