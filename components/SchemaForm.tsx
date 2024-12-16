import { useCallback } from 'react'
import Form from '@rjsf/core'
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
}

export default function SchemaForm({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onError,
  submitText = 'Submit',
  loading = false,
}: SchemaFormProps) {
  const handleSubmit = useCallback(
    ({ formData }: { formData: any }) => {
      onSubmit(formData)
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
      className="rjsf-form"
    />
  )
}
