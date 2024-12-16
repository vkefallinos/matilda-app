import { useCallback } from 'react'
import Form, { IChangeEvent } from '@rjsf/core'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

interface SchemaFormProps {
  schema: RJSFSchema
  uiSchema: UiSchema
  formData?: any
  onSubmit: (formData: any) => void
  onError?: (errors: any[]) => void
  submitText?: string
  loading?: boolean
  className?: string
}

export default function SchemaForm({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onError,
  submitText = 'Submit',
  loading = false,
  className,
}: SchemaFormProps) {
  const handleSubmit = useCallback(
    (data: IChangeEvent<any, any, any>) => {
      if (data.formData) {
        onSubmit(data.formData)
      }
    },
    [onSubmit]
  )

  const handleError = useCallback(
    (errors: any[]) => {
      onError?.(errors)
    },
    [onError]
  )

  return (
    <Form
      schema={schema}
      uiSchema={{
        ...uiSchema,
        'ui:disabled': loading,
        'ui:submitButtonOptions': {
          submitText: loading ? 'Submitting...' : submitText,
          props: {
            className: 'btn-primary w-full mt-4',
            disabled: loading,
          },
        },
      }}
      validator={validator}
      formData={formData}
      onSubmit={handleSubmit}
      onError={handleError}
      className={className || "rjsf-form"}
    />
  )
}
