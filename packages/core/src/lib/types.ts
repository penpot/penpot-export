export interface CSSClassDefinition {
  scope: string
  name: string
  cssProps: Record<string, string>
}

export const isCssClassDefinition = (
  object: object,
): object is CSSClassDefinition => {
  return 'cssProps' in object
}

export interface CSSCustomPropertyDefinition {
  scope: string
  name: string
  value: string
}
