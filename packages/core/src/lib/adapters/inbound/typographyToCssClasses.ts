import { textToCssClassSelector } from '../../css/helpers'

import { PenpotApiTypography, CssTextProperty, PenpotApiFile } from '../../api'
import { CSSClassDefinition } from '../../types'

const getTypographyAssetCssProps = (
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

export const adaptTypographiesToCssClassDefinitions = (
  penpotFile: PenpotApiFile,
): CSSClassDefinition[] => {
  const fileName = penpotFile.name
  const typographies = Object.values(penpotFile.data.typographies ?? {})

  const cssClassDefinitions = typographies.map((typography) => {
    const cssProps = getTypographyAssetCssProps(typography)
    const selector = textToCssClassSelector(`${fileName}--${typography.name}`)

    return { selector, cssProps }
  })

  return cssClassDefinitions
}
