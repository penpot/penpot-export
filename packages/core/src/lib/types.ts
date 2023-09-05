export interface CSSClassDefinition {
  selector: string
  cssProps: Record<string, string>
}

export const isCssClassDefinition = (
  object: object,
): object is CSSClassDefinition => {
  return 'selector' in object
}

export interface CSSCustomPropertyDefinition {
  name: string
  value: string
}
