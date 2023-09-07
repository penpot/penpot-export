import { CSSClassDefinition, CSSCustomPropertyDefinition } from '../types'

import { OutputterFunction } from './types'

const serializeJson: OutputterFunction = (
  cssClassDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
): string => {
  return JSON.stringify(cssClassDefinitions, null, 2)
}

export default serializeJson
