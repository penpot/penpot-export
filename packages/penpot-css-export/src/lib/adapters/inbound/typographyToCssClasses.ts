import { textToCssClassSelector } from '../../css/helpers'

import { PenpotApiTypography, CssTextProperty } from '../../api'
import { CSSClassDefinition, PenpotExportFile } from '../../types'

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
  penpotFile: PenpotExportFile,
): CSSClassDefinition[] => {
  const { fileName, typographies } = penpotFile

  const cssClassDefinitions = Object.values(typographies).map((typography) => {
    const cssProps = getTypographyAssetCssProps(typography)
    const selector = textToCssClassSelector(`${fileName}--${typography.name}`)

    return { selector, cssProps }
  })

  return cssClassDefinitions
}
