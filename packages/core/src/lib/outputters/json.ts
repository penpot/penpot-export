import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  ColorAssets,
  PageComponentAssets,
  TypographyAssets,
} from '../types'

import { PenpotExportInvalidAssetsError } from './errors'
import { OutputterFunction } from './types'

interface JSONCustomPropertyDefinition extends CSSCustomPropertyDefinition {
  scope: string
}

interface JSONClassDefinition extends CSSClassDefinition {
  scope: string
}

const appendScopeToCustomProperties = (
  cssCustomPropertiesDefinitions: CSSCustomPropertyDefinition[],
  scope: string,
): JSONCustomPropertyDefinition[] => {
  return cssCustomPropertiesDefinitions.map<JSONCustomPropertyDefinition>(
    (customProperty) => {
      return {
        scope,
        ...customProperty,
      }
    },
  )
}

const appendScopeToClasses = (
  cssClassDefinition: CSSClassDefinition[],
  scope: string,
): JSONClassDefinition[] => {
  return cssClassDefinition.map<JSONClassDefinition>((classDefinition) => {
    return {
      scope,
      ...classDefinition,
    }
  })
}

const serializeJson: OutputterFunction = ({
  scope,
  colors,
  typographies,
  pageComponents,
}: ColorAssets | TypographyAssets | PageComponentAssets): string => {
  if (colors) {
    const scopedColors = appendScopeToCustomProperties(colors, scope)
    return JSON.stringify(scopedColors, null, 2)
  } else if (typographies || pageComponents) {
    const scopedAssets = appendScopeToClasses(
      typographies ?? pageComponents,
      scope,
    )
    return JSON.stringify(scopedAssets, null, 2)
  }

  throw new PenpotExportInvalidAssetsError()
}

export default serializeJson
