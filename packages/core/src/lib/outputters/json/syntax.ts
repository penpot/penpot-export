import { textToCssIdentToken } from '../css/syntax'

// REVIEW https://tr.designtokens.org/format/#character-restrictions
export const textToTokenName = (str: string): string => {
  return textToCssIdentToken(str)
}
