import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  FontsSummary,
} from '../types'

export type OutputterFunction = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
  metadata?: FontsSummary,
) => string
