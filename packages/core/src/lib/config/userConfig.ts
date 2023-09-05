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
const outputFormatSchema = z.union([z.literal('css'), z.literal('json')])

const assetConfigSchema = z.object({
  output: outputPathSchema,
  format: z.optional(outputFormatSchema).default('css'),
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

// Parsers
export const parseUserConfig = (
  userConfig: object,
): z.infer<typeof userConfigSchema> => userConfigSchema.parse(userConfig)
