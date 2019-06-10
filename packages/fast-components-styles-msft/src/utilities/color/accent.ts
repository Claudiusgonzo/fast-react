import { DesignSystem } from "../../design-system";
import { Palette, palette, PaletteType } from "./palette";
import { findClosestSwatchIndex, isDarkMode } from "./palette";
import { contrast, Swatch, SwatchResolver } from "./common";
import { clamp, inRange } from "lodash-es";
import { accentBaseColor } from "../design-system";

/**
 * Returns indexes for accent UI states that are accessible against an input reference color.
 */
export function findAccessibleAccentSwatchIndexes(
    designSystem: DesignSystem,
    contrastTarget: number,
    referenceColor: Swatch,
    stateDeltas: {
        rest: number;
        hover: number;
        active: number;
    }
): {
    rest: number;
    hover: number;
    active: number;
} {
    const accentColor: Swatch = accentBaseColor(designSystem);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
    const darkTheme: boolean = isDarkMode(designSystem);
    const stateDirection: 1 | -1 = darkTheme ? 1 : -1;
    const accessibleTextDirection: 1 | -1 = darkTheme ? -1 : 1;
    const paletteLength: number = accentPalette.length;
    const maxIndex: number = paletteLength - 1;
    let accessibleAccentIndex: number = findClosestSwatchIndex(
        PaletteType.accent,
        accentColor
    )(designSystem);

    while (
        inRange(
            accessibleAccentIndex + stateDirection * stateDeltas.hover,
            0,
            paletteLength
        ) &&
        contrast(
            accentPalette[accessibleAccentIndex + stateDirection * stateDeltas.hover],
            referenceColor
        ) < contrastTarget &&
        inRange(accessibleAccentIndex + accessibleTextDirection, 0, maxIndex)
    ) {
        accessibleAccentIndex += accessibleTextDirection;
    }

    return {
        rest: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.rest,
            0,
            maxIndex
        ),
        hover: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.hover,
            0,
            maxIndex
        ),
        active: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.active,
            0,
            maxIndex
        ),
    };
}
/**
 * @deprecated - please use findAccessibleAccentSwatchIndexes
 */
export const findAccessibleAccentSwatchIndexs: typeof findAccessibleAccentSwatchIndexes = findAccessibleAccentSwatchIndexes;