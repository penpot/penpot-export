import { FontFamily, FontWeights, FontsSummary } from '../types'

const createGoogleFontLink = (
  fontFamily: FontFamily,
  fontWeights: FontWeights,
) => {
  const family = encodeURIComponent(fontFamily)
  const weights = fontWeights.join(',')

  return `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${family}:${weights}">`
}

export const describeFontsRequirements = (
  fontSummary: FontsSummary,
): string[] => {
  const userFontsCount = Object.keys(fontSummary.userCustomFonts).length
  const googleFontsCount = Object.keys(fontSummary.googleFonts).length
  return [
    'These generated typography declarations rely on the given font being already available in your front end code.',
    `There are ${userFontsCount} custom fonts and ${googleFontsCount} fonts from Google Fonts.`,
    `You can choose to load the latter from the Google Fonts CSS API in a HTML document using:`,
    ...Object.entries(fontSummary.googleFonts).map(([family, weights]) =>
      createGoogleFontLink(family, weights),
    ),
  ]
}
