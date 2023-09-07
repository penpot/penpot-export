import { textToCssIdentToken } from '../css/syntax'

/**
 * From: https://sass-lang.com/documentation/variables/
 * Sass variables, like all Sass identifiers, treat hyphens and underscores as identical. This means that $font-size and
 * $font_size both refer to the same variable.
 */
export const textToScssVariableName = (str: string) => {
  // NOTE We can't avoid name clashing in this case, but at least let's make it explicit for a reader.
  const sassIdent = textToCssIdentToken(str.replace(/_/g, '-'))
  return '$' + sassIdent
}
