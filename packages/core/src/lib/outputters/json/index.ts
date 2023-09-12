import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  PenpotExportAssets,
} from '../../types'

import { PenpotExportInvalidAssetsError } from '../errors'
import { OutputterFunction } from '../types'

import { textToTokenName } from './syntax'

const transformCssCustomPropertyToColorTokenEntry = (
  color: CSSCustomPropertyDefinition,
): [string, ColorToken] => {
  const key = textToTokenName(color.name)
  const value: ColorToken = {
    $description: color.name,
    $type: 'color',
    $value: color.value as ColorToken['$value'],
  }
  return [key, value]
}

const transformCssClassDefinitionToTypographyCompositeTokenEntry = (
  typography: CSSClassDefinition,
): [string, TypographyCompositeToken] => {
  const key = textToTokenName(typography.name)
  const unsupportedPropNames: string[] = []
  const value = Object.entries(typography.cssProps).reduce<
    TypographyCompositeToken['$value']
  >((tokens, [propName, propValue]) => {
    switch (propName) {
      case 'fontFamily': {
        tokens.fontFamily = JSON.parse(propValue)
        break
      }
      case 'fontSize': {
        tokens.fontSize = propValue as DimensionToken['$value']
        break
      }
      case 'fontWeight': {
        tokens.fontWeight = parseInt(propValue, 10)
        break
      }
      case 'letterSpacing': {
        tokens.letterSpacing = propValue as DimensionToken['$value']
        break
      }
      case 'lineHeight': {
        tokens.lineHeight = parseFloat(propValue)
        break
      }
      default: {
        unsupportedPropNames.push(propName)
      }
    }

    return tokens
  }, {} as any)

  console.error(
    `Unsupported CSS properties: ${unsupportedPropNames.join(', ')}`,
  )
  return [
    key,
    {
      $description: typography.name,
      $type: 'typography',
      $value: value,
    },
  ]
}

const composeTokensEntries = ({
  colors,
  typographies,
}: PenpotExportAssets):
  | [string, ColorToken][]
  | [string, TypographyCompositeToken][] => {
  if (colors) {
    return colors.map(transformCssCustomPropertyToColorTokenEntry)
  } else if (typographies) {
    return typographies.map(
      transformCssClassDefinitionToTypographyCompositeTokenEntry,
    )
  }

  throw new PenpotExportInvalidAssetsError()
}

const serializeJson: OutputterFunction = (
  assets: PenpotExportAssets,
): string => {
  const tokensEntries = composeTokensEntries(assets)

  const content: object = {
    $description: assets.scope,
    ...Object.fromEntries(tokensEntries),
  }
  return JSON.stringify(content, null, 2)
}

export default serializeJson
