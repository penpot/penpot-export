interface BaseToken {
  $description?: string
}

interface ColorToken extends BaseToken {
  $type: 'color'
  $value: `#${string}`
}
interface DimensionToken extends BaseToken {
  $type: 'dimension'
  $value: `${number}px` | `${number}rem`
}
interface FontFamilyToken extends BaseToken {
  $type: 'fontFamily'
  $value: string
}
interface FontWeightToken extends BaseToken {
  $type: 'fontWeight'
  $value:
    | number
    | ('thin' | 'hairline')
    | ('extra-light' | 'ultra-light')
    | 'light'
    | ('normal' | 'regular' | 'book')
    | 'medium'
    | ('semi-bold' | 'demi-bold')
    | 'bold'
    | ('extra-bold' | 'ultra-bold')
    | ('black' | 'heavy')
    | ('extra-black' | 'ultra-black')
}
interface NumberToken extends BaseToken {
  $type: 'number'
  $value: number
}
interface TypographyCompositeToken extends BaseToken {
  $type: 'typography'
  $value: {
    fontFamily: FontFamilyToken['$value']
    fontSize: DimensionToken['$value']
    fontWeight: FontWeightToken['$value']
    letterSpacing: DimensionToken['$value']
    lineHeight: NumberToken['$value']
  }
}
