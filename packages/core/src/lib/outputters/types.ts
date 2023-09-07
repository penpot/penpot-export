import { CSSClassDefinition, CSSCustomPropertyDefinition } from '../types'

export type OutputterFunction = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
) => string
