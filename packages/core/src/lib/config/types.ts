import { z } from 'zod'

// Schemas
const accessTokenSchema = z.string({
  required_error: '.accessToken is required',
  invalid_type_error: '.accessToken must be a string',
})
const instanceSchema = z
  .string({
    required_error: '.instance is required',
    invalid_type_error: '.instance must be a string',
  })
  .url({
    message: '.instance must be a valid URL',
  })
const fileIdSchema = z
  .string({
    required_error: '.fileId is required',
    invalid_type_error: '.fileId must be a string',
  })
  .uuid({
    message: '.fileId must be a valid UUID',
  })
const pageIdSchema = z
  .string({
    required_error: '.pageId is required',
    invalid_type_error: '.pageId must be a string',
  })
  .uuid({
    message: '.pageId must be a valid UUID',
  })
const outputPathSchema = z.string({
  required_error: '.output is required',
  invalid_type_error: '.output must be a string',
})
// FIXME Format should be optional for user config, but required for parsed config
const outputFormatSchema = z.union([z.literal('css'), z.literal('json')])

const assetConfigSchema = z.object({
  output: outputPathSchema,
  format: z.optional(outputFormatSchema),
})

const colorsConfigSchema = assetConfigSchema
const typographiesConfigSchema = assetConfigSchema
const pagesConfigSchema = assetConfigSchema.extend({
  pageId: pageIdSchema,
})

const userFileConfigSchema = z
  .object({
    fileId: fileIdSchema,
    colors: z.optional(
      z
        .array(colorsConfigSchema)
        .nonempty({ message: '.colors is required to have at least one item' }),
    ),
    typographies: z.optional(
      z.array(typographiesConfigSchema).nonempty({
        message: '.typographies is required to have at least one item',
      }),
    ),
    pages: z.optional(
      z
        .array(pagesConfigSchema)
        .nonempty({ message: '.pages is required to have at least one item' }),
    ),
  })
  .refine(
    (object) => {
      if ('colors' in object) return true
      if ('typographies' in object) return true
      if ('pages' in object) return true
      return false
    },
    {
      message:
        'Each file in .files is required to have at least one of .colors, .typographies or .pages properties',
    },
  )

const userConfigSchema = z.object({
  accessToken: accessTokenSchema,
  instance: z.optional(instanceSchema),
  files: z
    .array(userFileConfigSchema)
    .nonempty({ message: '.files is required to have at least one item' }),
})

// Types
export type AssetConfig = z.infer<typeof assetConfigSchema>
export type ColorsConfig = z.infer<typeof colorsConfigSchema>
export type TypographiesConfig = z.infer<typeof typographiesConfigSchema>
export type PagesConfig = z.infer<typeof pagesConfigSchema>

export type UserFileConfig = z.infer<typeof userFileConfigSchema>
export type UserConfig = z.infer<typeof userConfigSchema>

export interface FileConfig {
  fileId: string
  colors: ColorsConfig[]
  typographies: TypographiesConfig[]
  pages: PagesConfig[]
}

export interface Config {
  instance: string
  accessToken: string
  files: FileConfig[]
}

// Validators
export const validateUserConfig = (userConfig: object): UserConfig =>
  userConfigSchema.parse(userConfig)
