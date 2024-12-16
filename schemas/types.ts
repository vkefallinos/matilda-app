import { RJSFSchema, UiSchema } from '@rjsf/utils'

export interface FormSchema {
  schema: RJSFSchema
  uiSchema: UiSchema
}

export interface ValidationError {
  message: string
  path: string[]
}
