import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../components/Button';
import { base, content, layerTokens } from '../theme/colors';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];

const SIZES = ['L', 'M', 'S'];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'pressed', label: 'Press' },
  { value: 'disabled', label: 'Disabled' },
];

const VARIANT_OPTIONS = [{ value: 'primary', label: 'Primary' }];

export default function ButtonsScreen({
  mode: modeProp,
  onModeChange,
  onScroll,
  topInset = 0,
}) {
  const [internalMode, setInternalMode] = useState('dark');
  const [variant, setVariant] = useState('primary');
  const [state, setState] = useState('default');
  const [rounded, setRounded] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);

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
  const chipActiveBg = isDark ? base.dark.base6 : base.light.base11;
  const chipActiveColor = isDark ? base.dark.base12 : base.light.base1;

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
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Button</Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Drive every Figma variant from the controls below.
          </Text>

          <View style={styles.demoStage}>
            {SIZES.map((s) => (
              <View key={s} style={styles.demoSlot}>
                <Text style={[styles.demoLabel, { color: subColor }]}>{s}</Text>
                <Button
                  mode={mode}
                  variant={variant}
                  size={s}
                  state={state}
                  rounded={rounded}
                  iconOnly={iconOnly}
                >
                  Send money
                </Button>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Current variant</Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Mirrors the Figma component property panel.
          </Text>

          <View style={styles.controls}>
            <Segmented
              label="Variant"
              options={VARIANT_OPTIONS}
              value={variant}
              onChange={setVariant}
              labelColor={subColor}
              chipIdleBg={chipIdleBg}
              chipIdleColor={titleColor}
              chipActiveBg={chipActiveBg}
              chipActiveColor={chipActiveColor}
              dividerColor={dividerColor}
            />
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
            />
            <SwitchRow
              label="Icon Only"
              value={iconOnly}
              onChange={setIconOnly}
              labelColor={subColor}
              valueColor={titleColor}
              dividerColor={dividerColor}
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

function SwitchRow({ label, value, onChange, labelColor, valueColor, dividerColor, isLast }) {
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
        <Switch value={value} onValueChange={onChange} />
      </View>
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
});
