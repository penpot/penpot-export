export function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** From: https://www.w3.org/TR/css-syntax-3/#escaping
 * Any Unicode code point can be included in an ident sequence or quoted string by escaping it. CSS escape sequences
 * start with a backslash (\), and continue with:
 * - Any Unicode code point that is not a hex digits or a newline. The escape sequence is replaced by that code point.
 * - Or one to six hex digits, followed by an optional whitespace. The escape sequence is replaced by the Unicode code
 *   point whose value is given by the hexadecimal digits. This optional whitespace allow hexadecimal escape sequences
 *   to be followed by "real" hex digits.
 */
function escapeCssCharacter(char: string) {
  return '\\' + char
}

/** From: https://www.w3.org/TR/css-syntax-3/#syntax-description:
 * Property names and at-rule names are always ident sequences, which have to start with an ident-start code point,
 * two hyphens, or a hyphen followed by an ident-start code point, and then can contain zero or more ident code points.
 * You can include any code point at all, even ones that CSS uses in its syntax, by escaping it.
 *
 * Railroad diagram: https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
 *
 * ident-start code point:  A letter, a non-ASCII code point, or U+005F LOW LINE (_).
 * ident code point:        An ident-start code point, a digit, or U+002D HYPHEN-MINUS (-).
 * digit:                   A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9) inclusive.
 * letter:                  An uppercase letter or a lowercase letter.
 * non-ASCII code point:    A code point with a value equal to or greater than U+0080 <control>.
 */
export function textToCssIdentToken(str: string) {
  const normalizedString = str.trim().replace(/\s/g, '_')

  const escapedString = normalizedString
    .replace(
      // NOTE All ASCII printable characters except -, 0-9, A-Z, _, a-z
      /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g,
      escapeCssCharacter,
    )
    .replace(
      /^(-?)([0-9])/,
      (match: string, dashGroup: string, numberGroup: string) =>
        dashGroup + escapeCssCharacter(numberGroup),
    )

  return escapedString
}

/** From: https://www.w3.org/TR/selectors-3/#w3cselgrammar
 * class
 * : '.' IDENT
 * ;
 *
 * Tokenizer (Flex notation)
 * ident     [-]?{nmstart}{nmchar}*
 * nmstart   [_a-z]|{nonascii}|{escape}
 * nmchar    [_a-z0-9-]|{nonascii}|{escape}
 * nonascii  [^\0-\177]
 */
export function textToCssClassSelector(str: string) {
  const ident = textToCssIdentToken(str)
  return '.' + ident
}

/** From: https://www.w3.org/TR/css-variables-1/#custom-property
 * A custom property is any property whose name starts with two dashes (U+002D HYPHEN-MINUS), like --foo. The
 * <custom-property-name> production corresponds to this: it’s defined as any <dashed-ident> (a valid identifier that
 * starts with two dashes), except -- itself, which is reserved for future use by CSS.
 *
 * The <dashed-ident> production is a <custom-ident>, with all the case-sensitivity that implies, with the additional
 * restriction that it must start with two dashes (U+002D HYPHEN-MINUS).
 *
 * 	This generic data type is denoted by <custom-ident>, and represents any valid CSS identifier that would not be
 * misinterpreted as a pre-defined keyword in that property’s value definition. Such identifiers are fully
 * case-sensitive (meaning they’re compared using the "identical to" operation), even in the ASCII range (e.g. example
 * and EXAMPLE are two different, unrelated user-defined identifiers).
 */
export function textToCssCustomPropertyName(str: string) {
  const unescapedDashedIdentifier = '--' + str.trimStart()
  return textToCssIdentToken(unescapedDashedIdentifier)
}
