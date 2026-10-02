'use client'

import { forwardRef, useRef, useActionState, useState, startTransition, useEffect } from 'react'
import { AnimatedButton } from '@/components/animations/AnimatedButton'
import { cva, cx } from '@/libs/utils/className'
import { FormHoneypot } from '@/components/ui/FormHoneypot'
import { useSpamPrevention } from '@/hooks/useSpamPrevention'
import { subscribeToNewsletter } from '@/libs/actions/subscribeToNewsletter'

const inputVariants = cva({
  base: [
    'flex w-full border border-border bg-surface font-sans text-foreground',
    'file:border-0 file:bg-transparent file:font-medium',
    'placeholder:text-foreground-muted',
    'outline-none transition-colors duration-200 ease-out focus:border-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ],
  variants: {
    size: {
      default: 'h-48 px-16 py-12 text-body file:text-body',
      sm: 'h-40 px-12 py-8 text-body-sm file:text-body-sm'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

const Input = forwardRef(({ className, type, size, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cx(inputVariants({ size }), className)}
    {...props}
  />
))
Input.displayName = 'Input'

export function NewsletterForm(props) {
  const {
    heading,
    description,
    buttonText,
    successMessage = "You're on the list.",
    buttonTheme = "dark",
    className
  } = props

  const formRef = useRef(null)

  const { checkSpam, enhanceFormData, reset } = useSpamPrevention({
    formRef: formRef
  })

  const [state, action, isPending] = useActionState(subscribeToNewsletter, {
    success: false,
    error: ""
  })
  
  const [localError, setLocalError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError(null)
    
    const form = formRef.current
    if (!form) return
    
    const spamCheck = checkSpam(form)
    if (spamCheck.isSpam) {
      setLocalError(spamCheck.message)
      return
    }
    
    const formData = enhanceFormData(new FormData(form))
    
    startTransition(() => {
      action(formData)
    })
  }

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      reset()
    }
  }, [state.success, reset])

  if (state.success) {
    return (
      <div className={className}>
        {heading && (
          <p className="mb-8 font-medium text-body text-foreground">
            {heading}
          </p>
        )}
        <p className="text-body text-foreground-muted">
          {successMessage}
        </p>
      </div>
    )
  }

  const buttonLabel = isPending ? "..." : buttonText === undefined ? "Subscribe" : buttonText
  const hasError = localError || (!state.success && state.error)

  return (
    <div className={className}>
      {heading && (
        <p className="mb-8 font-medium text-body text-foreground">
          {heading}
        </p>
      )}
      {description && (
        <p className="mb-16 text-body-sm text-foreground-muted">
          {description}
        </p>
      )}
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            required={true}
            autoComplete="name"
            size="sm"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required={true}
            autoComplete="email"
            size="sm"
          />
          <AnimatedButton
            type="submit"
            disabled={isPending}
            theme={buttonTheme}
            size="sm"
            className="w-full"
          >
            {buttonLabel}
          </AnimatedButton>
        </div>
        <FormHoneypot />
        <p className="text-body-sm text-foreground-muted opacity-60">
          Unsubscribe anytime.
        </p>
        {hasError && (
          <p className={cx("text-body-sm", buttonTheme === "dark" ? "text-brand" : "text-red-500")}>
            {localError || state.error}
          </p>
        )}
      </form>
    </div>
  )
}