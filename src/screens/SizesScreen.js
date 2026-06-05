import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { base, content, layerTokens } from '../theme/colors';
import {
  border,
  borderRefs,
  buttonSize,
  buttonSizeRefs,
  cornerRadius,
  cornerRadiusRefs,
  spacing,
  spacingRefs,
} from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';
const MODES = ['light', 'dark'];

const SECTIONS = [
  {
    id: 'cornerRadius',
    title: 'Corner Radius',
    description: 'Roundness applied to surfaces, buttons, inputs.',
    data: cornerRadius,
    refs: cornerRadiusRefs,
    kind: 'radius',
  },
  {
    id: 'spacing',
    title: 'Spacing',
    description: 'Gap & padding scale used across layouts.',
    data: spacing,
    refs: spacingRefs,
    kind: 'spacing',
  },
  {
    id: 'border',
    title: 'Border',
    description: 'Stroke width tokens.',
    data: border,
    refs: borderRefs,
    kind: 'border',
  },
  {
    id: 'buttonSize',
    title: 'Button Size',
    description: 'Height tokens for buttons.',
    data: buttonSize,
    refs: buttonSizeRefs,
    kind: 'buttonHeight',
  },
];

export default function SizesScreen({ mode: modeProp, onModeChange, onScroll, topInset = 0, pageTitle }) {
  const [internalMode, setInternalMode] = useState('dark');
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
  const demoSurface = layer.layer1Background;
  const demoFill = isDark ? base.dark.base8 : base.light.base5;

  const { width } = useWindowDimensions();
  const isNarrow = width > 0 && width < 768;

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

        {SECTIONS.map((section) => (
          <View key={section.id} style={[styles.section, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: titleColor }]}>{section.title}</Text>
            <Text style={[styles.sectionSubtitle, { color: subColor }]}>{section.description}</Text>

            <View style={[styles.tableHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.tableHeaderCell, styles.colName, { color: subColor }]}>Name</Text>
              <Text style={[styles.tableHeaderCell, styles.colDemo, { color: subColor }]}>Preview</Text>
              <Text style={[styles.tableHeaderCell, styles.colMobile, { color: subColor }]}>Mobile</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesktop, { color: subColor }]}>Desktop</Text>
            </View>

            {Object.keys(section.data.mobile).map((name) => {
              const mobileValue = section.data.mobile[name];
              const desktopValue = section.data.desktop[name];
              const mobileRef = section.refs.mobile[name];
              const desktopRef = section.refs.desktop[name];
              return (
                <View
                  key={name}
                  style={[styles.tableRow, { borderBottomColor: dividerColor }]}
                >
                  <View style={styles.colName}>
                    <Text style={[styles.cellName, { color: titleColor }]}>{name}</Text>
                  </View>
                  <View style={styles.colDemo}>
                    <Preview
                      kind={section.kind}
                      value={mobileValue}
                      surface={demoSurface}
                      fill={demoFill}
                      border={dividerColor}
                    />
                  </View>
                  <View style={styles.colMobile}>
                    <Text style={[styles.cellRef, { color: titleColor }]}>{`Unit/${mobileRef}`}</Text>
                  </View>
                  <View style={styles.colDesktop}>
                    <Text style={[styles.cellRef, { color: titleColor }]}>{`Unit/${desktopRef}`}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Preview({ kind, value, surface, fill, border: borderC }) {
  if (kind === 'radius') {
    const size = 32;
    const radius = Math.min(value, size / 2);
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: fill,
        }}
      />
    );
  }
  if (kind === 'spacing') {
    return (
      <View
        style={{
          width: Math.max(value, 1),
          height: 12,
          backgroundColor: fill,
          borderRadius: 2,
        }}
      />
    );
  }
  if (kind === 'buttonHeight') {
    return (
      <View
        style={{
          height: value,
          minWidth: 56,
          paddingHorizontal: 16,
          borderRadius: value / 2,
          backgroundColor: fill,
        }}
      />
    );
  }
  if (kind === 'border') {
    if (value === 0) {
      return (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: surface,
          }}
        />
      );
    }
    return (
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          borderWidth: value,
          borderColor: fill,
          borderStyle: 'solid',
          backgroundColor: surface,
        }}
      />
    );
  }
  return null;
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
  container: {
    flex: 1,
  },
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
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  tableHeaderCell: {
    ...currentTextStyle('1', 'regular'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  colName: {
    flex: 1,
  },
  colDemo: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  colMobile: {
    flex: 1,
  },
  colDesktop: {
    flex: 1,
  },
  cellName: {
    ...currentTextStyle('3', 'regular'),
  },
  cellRef: {
    ...currentTextStyle('3', 'regular'),
  },
});
