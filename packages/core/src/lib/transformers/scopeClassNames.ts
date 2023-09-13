import {
  CSSClassDefinition,
  PageComponentAssets,
  TypographyAssets,
} from '../types'

const scopeClassNames = (
  cssClassDefinition: CSSClassDefinition[],
  scope: string,
): CSSClassDefinition[] => {
  return cssClassDefinition.map<CSSClassDefinition>(({ name, cssProps }) => {
    return {
      name: `${scope}--${name}`,
      cssProps,
    }
  })
}

export function scopeTypographiesClassNames(
  assets: TypographyAssets,
): TypographyAssets {
  const scopedTypographies = scopeClassNames(assets.typographies, assets.scope)
  return {
    ...assets,
    typographies: scopedTypographies,
  }
}

export function scopePageComponentsClassNames(
  assets: PageComponentAssets,
): PageComponentAssets {
  const scopedPageComponents = scopeClassNames(
    assets.pageComponents,
    assets.scope,
  )
  return {
    ...assets,
    pageComponents: scopedPageComponents,
  }
}
