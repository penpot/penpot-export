import { PenpotApiFile } from '../../api'
import { FontsSummary } from '../../types'

export const summarizeTypographies = (
  penpotFile: PenpotApiFile,
): FontsSummary => {
  const typographies = Object.values(penpotFile.data.typographies ?? {})

  const separator = '|>'
  const dedupedFontsKeys = Array.from(
    typographies.reduce((set, typography) => {
      const { fontId, fontFamily, fontWeight } = typography
      const typographyKey = [fontId, fontFamily, fontWeight].join(separator)

      set.add(typographyKey)
      return set
    }, new Set<string>()),
  )

  const fontsSummary = dedupedFontsKeys.reduce<FontsSummary>(
    (summary, typographyKey) => {
      const [fontId, fontFamily, fontWeight] = typographyKey.split(separator)
      const fontSource = fontId.startsWith('gfont-')
        ? 'googleFonts'
        : 'userCustomFonts'

      summary[fontSource][fontFamily] ??= []
      summary[fontSource][fontFamily].push(fontWeight)

      return summary
    },
    { googleFonts: {}, userCustomFonts: {} },
  )

  return fontsSummary
}
