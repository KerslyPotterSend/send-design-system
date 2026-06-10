import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DevTooltip from './DevTooltip';
import Icon from './Icon';
import { brandTokens, content, layerTokens } from '../theme/colors';
import { border, buttonSize, cornerRadius, spacing } from '../theme/sizes';
import { currentTextStyle } from '../theme/typography';

const isWeb = Platform.OS === 'web';

const SIZE_DIMS = {
  L: {
    paddingHorizontal: spacing.mobile.XL,   // 24
    height: buttonSize.mobile.L,            // 44
    fontSize: '4',                          // 16/24 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 20,
    squareSize: buttonSize.mobile.L,        // 44
  },
  M: {
    paddingHorizontal: spacing.mobile.L,    // 16
    height: buttonSize.mobile.M,            // 32
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.S,    // 8
    iconSize: 16,
    squareSize: buttonSize.mobile.M,        // 32
  },
  S: {
    paddingHorizontal: spacing.mobile.M,    // 12
    height: buttonSize.mobile.S,            // 24
    fontSize: '2',                          // 12/16 medium
    cornerRadius: cornerRadius.mobile.XS,   // 4
    iconSize: 14,
    squareSize: buttonSize.mobile.S,        // 24
  },
};

// Token references (the design-system variable names) paired with each size, so
// dev mode can show where every value comes from rather than a raw pixel.
const SIZE_REFS = {
  L: { padH: 'spacing.XL', height: 'buttonSize.L', font: 'typography/4', radius: 'cornerRadius.S', square: 'buttonSize.L' },
  M: { padH: 'spacing.L', height: 'buttonSize.M', font: 'typography/2', radius: 'cornerRadius.S', square: 'buttonSize.M' },
  S: { padH: 'spacing.M', height: 'buttonSize.S', font: 'typography/2', radius: 'cornerRadius.XS', square: 'buttonSize.S' },
};

// Maps the button's resolved styles back onto design-system tokens for the dev
// inspector. Mirrors the color/size logic below — keep the two in sync.
function describeButton({ variant, size, state, mode, rounded, iconOnly, hasIcon }) {
  const brand = brandTokens[mode];
  const text = content[mode];
  const layer = layerTokens[mode];
  const isSecondary = variant === 'secondary';
  const isTertiary = variant === 'tertiary';
  const isDisabled = state === 'disabled';
  const isPressed = state === 'pressed';
  const isHover = state === 'hover';

  let bgRef = 'transparent';
  let bgVal = 'transparent';
  let colorRef;
  let colorVal;
  let borderRef = null;
  let borderVal = null;

  if (isTertiary) {
    colorRef = 'content.contentPrimary'; colorVal = text.contentPrimary;
    if (isDisabled) { colorRef = 'content.contentTertiary'; colorVal = text.contentTertiary; }
    else if (isPressed) { colorRef = 'content.contentSecondary'; colorVal = text.contentSecondary; }
    else if (isHover) { borderRef = 'layer2BorderColor'; borderVal = layer.layer2BorderColor; }
  } else if (isSecondary) {
    colorRef = 'content.contentPrimary'; colorVal = text.contentPrimary;
    bgRef = 'layer3Background'; bgVal = layer.layer3Background;
    borderRef = 'layer3BorderColor'; borderVal = layer.layer3BorderColor;
    if (isDisabled) {
      bgRef = 'layer3BackgroundDisabled'; bgVal = layer.layer3BackgroundDisabled;
      borderRef = 'layer3BorderColorDisabled'; borderVal = layer.layer3BorderColorDisabled;
      colorRef = 'content.contentTertiary'; colorVal = text.contentTertiary;
    } else if (isPressed) {
      bgRef = 'layer3BackgroundPress'; bgVal = layer.layer3BackgroundPress;
      borderRef = 'layer3BorderColorPress'; borderVal = layer.layer3BorderColorPress;
      colorRef = 'content.contentSecondary'; colorVal = text.contentSecondary;
    } else if (isHover) {
      bgRef = 'layer3BackgroundHover'; bgVal = layer.layer3BackgroundHover;
      borderRef = 'layer3BorderColorHover'; borderVal = layer.layer3BorderColorHover;
    }
  } else {
    bgRef = 'brandBackground'; bgVal = brand.brandBackground;
    colorRef = 'brandColor'; colorVal = brand.brandColor;
    if (isDisabled) {
      bgRef = 'brandBackgroundDisabled'; bgVal = brand.brandBackgroundDisabled;
      colorRef = 'brandColorDisabled'; colorVal = brand.brandColorDisabled;
    } else if (isPressed) {
      bgRef = 'brandBackgroundPress'; bgVal = brand.brandBackgroundPress;
      colorRef = 'brandColorPress'; colorVal = brand.brandColorPress;
    } else if (isHover) {
      bgRef = 'brandBackgroundHover'; bgVal = brand.brandBackgroundHover;
    }
  }

  const dims = SIZE_DIMS[size];
  const refs = SIZE_REFS[size];
  const radiusRef = rounded ? 'cornerRadius.Pill' : refs.radius;
  const radiusVal = rounded ? cornerRadius.mobile.Pill : dims.cornerRadius;

  const lines = [
    { prop: 'background', ref: bgRef, val: bgVal },
    { prop: 'color', ref: colorRef, val: colorVal },
  ];
  if (borderRef) lines.push({ prop: 'border', ref: `border.1 ${borderRef}`, val: `${border.mobile[1]}px ${borderVal}` });
  lines.push({ prop: 'border-radius', ref: radiusRef, val: `${radiusVal}px` });
  if (iconOnly) {
    lines.push({ prop: 'width', ref: refs.square, val: `${dims.squareSize}px` });
    lines.push({ prop: 'height', ref: refs.square, val: `${dims.squareSize}px` });
  } else {
    lines.push({ prop: 'height', ref: refs.height, val: `${dims.height}px` });
    lines.push({ prop: 'padding-inline', ref: refs.padH, val: `${dims.paddingHorizontal}px` });
    lines.push({ prop: 'font', ref: `${refs.font} · medium`, val: `${dims.fontSize === '4' ? 16 : 12}px` });
  }
  if (hasIcon || iconOnly) lines.push({ prop: 'icon-size', ref: 'dims.iconSize', val: `${dims.iconSize}px` });
  lines.push({ prop: 'gap', ref: 'spacing.S', val: '8px' });
  return lines;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'L',
  mode = 'light',
  rounded = false,
  iconOnly = false,
  hasIcon = false,
  icon = null,
  state = 'default',  // 'default' | 'hover' | 'pressed' | 'disabled'
  devMode = false,
  onPress,
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  // In dev mode the button is being inspected, not used — freeze it on the
  // configured state so hovering for the tooltip doesn't flip it to :hover.
  const interactive = state === 'default' && !devMode;
  const isDisabled = state === 'disabled';
  const isPressed = state === 'pressed' || (interactive && pressed);
  const isHover = state === 'hover' || (interactive && hover);

  const isSecondary = variant === 'secondary';
  const isTertiary = variant === 'tertiary';

  let background;
  let labelColor;
  let borderColor;

  if (isTertiary) {
    const text = content[mode];
    background = 'transparent';
    labelColor = text.contentPrimary;
    borderColor = 'transparent';
    if (isDisabled) {
      labelColor = text.contentTertiary;
    } else if (isPressed) {
      labelColor = text.contentSecondary;
    } else if (isHover) {
      borderColor = layerTokens[mode].layer2BorderColor;
    }
  } else if (isSecondary) {
    const layer = layerTokens[mode];
    const text = content[mode];
    labelColor = text.contentPrimary;
    background = layer.layer3Background;
    borderColor = layer.layer3BorderColor;
    if (isDisabled) {
      background = layer.layer3BackgroundDisabled;
      borderColor = layer.layer3BorderColorDisabled;
      labelColor = text.contentTertiary;
    } else if (isPressed) {
      background = layer.layer3BackgroundPress;
      borderColor = layer.layer3BorderColorPress;
      labelColor = text.contentSecondary;
    } else if (isHover) {
      background = layer.layer3BackgroundHover;
      borderColor = layer.layer3BorderColorHover;
    }
  } else {
    const tokens = brandTokens[mode];
    background = tokens.brandBackground;
    labelColor = tokens.brandColor;
    if (isDisabled) {
      background = tokens.brandBackgroundDisabled;
      labelColor = tokens.brandColorDisabled;
    } else if (isPressed) {
      background = tokens.brandBackgroundPress;
      labelColor = tokens.brandColorPress;
    } else if (isHover) {
      background = tokens.brandBackgroundHover;
    }
  }

  const dims = SIZE_DIMS[size];
  const radius = rounded ? cornerRadius.mobile.Pill : dims.cornerRadius;
  const iconName = icon ?? 'arrow_forward';

  const button = (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => {
        setHover(false);
        setPressed(false);
      }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        iconOnly
          ? {
              width: dims.squareSize,
              height: dims.squareSize,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }
          : {
              height: dims.height,
              paddingHorizontal: dims.paddingHorizontal,
            },
        {
          backgroundColor: background,
          borderRadius: radius,
        },
        borderColor && {
          borderWidth: border.mobile[1],
          borderColor,
        },
        isWeb && !isDisabled && { cursor: 'pointer' },
        isWeb && isDisabled && { cursor: 'not-allowed' },
        isWeb && {
          transitionProperty: 'background-color, border-color, color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'ease-out',
        },
      ]}
    >
      {iconOnly ? (
        <Icon name={iconName} size={dims.iconSize} color={labelColor} />
      ) : (
        <>
          {hasIcon && <Icon name={iconName} size={dims.iconSize} color={labelColor} />}
          <Text style={[currentTextStyle(dims.fontSize, 'medium'), { color: labelColor }]}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );

  if (!devMode) return button;

  // Dev mode: wrap so the inspector tooltip can anchor above the button on hover.
  return (
    <View style={styles.devWrap}>
      {button}
      {isWeb && hover && (
        <DevTooltip
          mode={mode}
          title={`button · ${variant} · ${size} · ${state}`}
          lines={describeButton({ variant, size, state, mode, rounded, iconOnly, hasIcon })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  devWrap: {
    position: 'relative',
    alignSelf: 'flex-start', // matches the button's own alignment
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
});
