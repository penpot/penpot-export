import { z } from 'zod'

import { UserConfig } from '../types'

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
const outputSchema = z.string({
  required_error: '.output is required',
  invalid_type_error: '.output must be a string',
})

const userColorsConfigSchema = z.object({
  output: outputSchema,
})
const userTypographiesConfigSchema = z.object({
  output: outputSchema,
})
const userPagesConfigSchema = z.object({
  output: outputSchema,
  pageId: pageIdSchema,
})

const userFileConfigSchema = z
  .object({
    fileId: fileIdSchema,
    colors: z.optional(
      z
        .array(userColorsConfigSchema)
        .nonempty({ message: '.colors is required to have at least one item' }),
    ),
    typographies: z.optional(
      z.array(userTypographiesConfigSchema).nonempty({
        message: '.typographies is required to have at least one item',
      }),
    ),
    pages: z.optional(
      z
        .array(userPagesConfigSchema)
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

export const validateUserConfig = (userConfig: object): UserConfig =>
  userConfigSchema.parse(userConfig)
