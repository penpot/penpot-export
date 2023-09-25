import { CSSClassDefinition, FontsSummary, TypographyAssets } from '../../types'

import { compareByName } from '../helpers'
import { PenpotApiTypography, CssTextProperty, PenpotApiFile } from '../types'

const mapTypographyAssetCssProps = (
  typography: PenpotApiTypography,
): Record<CssTextProperty, string> => {
  return {
    lineHeight: typography.lineHeight,
    fontStyle: typography.fontStyle,
    textTransform: typography.textTransform,
    fontWeight: typography.fontWeight,
    fontSize: `${typography.fontSize}px`,
    letterSpacing: `${typography.letterSpacing}px`,
    fontFamily: `"${typography.fontFamily}"`,
  }
}

const adaptTypographiesToCssClassDefinitions = (
  typographies: PenpotApiTypography[],
): CSSClassDefinition[] => {
  const cssClassDefinitions = typographies.map<CSSClassDefinition>(
    (typography) => {
      const cssProps = mapTypographyAssetCssProps(typography)

      return {
        name: typography.name,
        cssProps,
      }
    },
  )

  return cssClassDefinitions
}

const summarizeTypographies = (
  typographies: PenpotApiTypography[],
): FontsSummary => {
  const separator = '|>'
  const dedupedFontsKeys = Array.from(
    typographies.reduce((set, typography) => {
      const { fontId, fontFamily, fontWeight } = typography
      const typographyKey = [fontId, fontFamily, fontWeight].join(separator)

      set.add(typographyKey)
      return set
    }, new Set<string>()),
  )

  const fontsSummary = dedupedFontsKeys.reduce<FontsSummary>(
    (summary, typographyKey) => {
      const [fontId, fontFamily, fontWeight] = typographyKey.split(separator)
      const fontSource = fontId.startsWith('gfont-')
        ? 'googleFonts'
        : 'userCustomFonts'

      summary[fontSource][fontFamily] ??= []
      summary[fontSource][fontFamily].push(fontWeight)

      return summary
    },
    { googleFonts: {}, userCustomFonts: {} },
  )

  return fontsSummary
}

const adaptTypographies = (penpotFile: PenpotApiFile): TypographyAssets => {
  const fileName = penpotFile.name
  const typographies = Object.values(penpotFile.data.typographies ?? {})
    .slice()
    .sort(compareByName)

  return {
    scope: fileName,
    typographies: adaptTypographiesToCssClassDefinitions(typographies),
    typographiesSummary: summarizeTypographies(typographies),
  }
}

export default adaptTypographies
