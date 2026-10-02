'use client'
import { useState, useMemo, useEffect, useRef, Fragment } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { easings } from '@/libs/constants/easings'
import { AnimatedButton } from '@/components/animations/AnimatedButton'

import { 
  trackAuditFormSubmitted,
  trackBookingFlowStarted,
  trackCalBookingOpened 
} from '@/libs/analytics/events'
import { FormHoneypot } from '@/components/ui/FormHoneypot'
import { useSpamPrevention } from '@/hooks/useSpamPrevention'
import { trackLinkedInConversion, LI_CONVERSION_CTA_CLICK } from '@/libs/analytics/linkedinTracking'
import { CalBookingModal } from '@/components/ui/CalBookingModal'
import { useModal } from '@/providers/ModalProvider'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const inputClass = 'w-full border-0 border-b border-foreground/20 bg-transparent px-0 py-12 text-body text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none transition-colors'

function validateField(name, value) {
  switch (name) {
    case 'firstName':
      return '' === value.trim() ? 'First name is required' : undefined
    case 'lastName':
      return '' === value.trim() ? 'Last name is required' : undefined
    case 'email':
      if ('' === value.trim()) return 'Email is required'
      if (!emailRegex.test(value)) return 'Please enter a valid email'
      return
    case 'company':
      return '' === value.trim() ? 'Company is required' : undefined
    case 'websiteUrl':
      if ('' === value.trim()) return 'Website URL is required'
      try {
        new URL(value)
        return
      } catch {
        return 'Please enter a valid URL (e.g. https://example.com)'
      }
    default:
      return
  }
}

function AuditForm() {
  const { checkSpam, enhanceFormData } = useSpamPrevention()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    websiteUrl: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [spamMessage, setSpamMessage] = useState(null)

  const isValid = useMemo(() => 
    '' !== formData.firstName.trim() && 
    '' !== formData.lastName.trim() && 
    '' !== formData.email.trim() && 
    emailRegex.test(formData.email) && 
    '' !== formData.company.trim() && 
    '' !== formData.websiteUrl.trim() && 
    (() => {
      try {
        return new URL(formData.websiteUrl), true
      } catch {
        return false
      }
    })(), 
  [formData])

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const currentErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      company: validateField('company', formData.company),
      websiteUrl: validateField('websiteUrl', formData.websiteUrl)
    }

    setErrors(currentErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      websiteUrl: true
    })

    if (Object.values(currentErrors).some(error => error !== undefined)) return

    const formElement = e.target
    const spamResult = checkSpam(formElement)
    
    if (spamResult.isSpam) {
      return void setSpamMessage(spamResult.message)
    }

    setSpamMessage(null)
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const rawFormData = new FormData(formElement)
      const enhancedData = enhanceFormData(rawFormData)
      const response = await fetch('/api/audit', {
        method: 'POST',
        body: enhancedData
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        trackAuditFormSubmitted({ source: 'modal' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Audit form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if ('success' === submitStatus) {
    return (
      <div className="flex flex-col gap-16">
        <p className="text-accent-sm text-brand">Request received</p>
        <h3 className="text-h4">Thank you!</h3>
        <p className="text-body text-foreground/60">We'll review your website and send your free audit shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-24">
      <FormHoneypot />
      {spamMessage && (
        <div className="text-body-sm text-brand">{spamMessage}</div>
      )}
      
      <div className="relative">
        <input
          type="text"
          id="audit-firstName"
          name="firstName"
          placeholder="First Name*"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClass} ${touched.firstName && errors.firstName ? 'border-red-500' : ''}`}
        />
        {touched.firstName && errors.firstName && (
          <p className="absolute top-full mt-4 text-body-sm text-brand">{errors.firstName}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          id="audit-lastName"
          name="lastName"
          placeholder="Last Name*"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClass} ${touched.lastName && errors.lastName ? 'border-red-500' : ''}`}
        />
        {touched.lastName && errors.lastName && (
          <p className="absolute top-full mt-4 text-body-sm text-brand">{errors.lastName}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="email"
          id="audit-email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClass} ${touched.email && errors.email ? 'border-red-500' : ''}`}
        />
        {touched.email && errors.email && (
          <p className="absolute top-full mt-4 text-body-sm text-brand">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          id="audit-company"
          name="company"
          placeholder="Company*"
          value={formData.company}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClass} ${touched.company && errors.company ? 'border-red-500' : ''}`}
        />
        {touched.company && errors.company && (
          <p className="absolute top-full mt-4 text-body-sm text-brand">{errors.company}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="url"
          id="audit-websiteUrl"
          name="websiteUrl"
          placeholder="Website URL* (e.g. https://example.com)"
          value={formData.websiteUrl}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClass} ${touched.websiteUrl && errors.websiteUrl ? 'border-red-500' : ''}`}
        />
        {touched.websiteUrl && errors.websiteUrl && (
          <p className="absolute top-full mt-4 text-body-sm text-brand">{errors.websiteUrl}</p>
        )}
      </div>

      <AnimatedButton
        type="submit"
        disabled={!isValid || isSubmitting}
        theme="brand"
        className="mt-16 w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Get Free Audit'}
      </AnimatedButton>

      {'error' === submitStatus && (
        <p className="text-body-sm text-brand">Failed to submit. Please try again.</p>
      )}
    </form>
  )
}

function BookingComponent({ variant }) {
  useEffect(trackBookingEvents, [])

  return <CalBookingModal visible={true} />
}

function trackBookingEvents() {
  trackBookingFlowStarted()
  trackCalBookingOpened()
  trackLinkedInConversion(LI_CONVERSION_CTA_CLICK)
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
const bookingVariants = {
  'cal-booking': 'default',
  'cal-booking-startup': 'startup'
}

function CalPreloader({ onReady }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
      onReady()
    }, 200)
    return () => clearTimeout(timer)
  }, [onReady])

  if (isReady) {
    return createPortal(
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: '900px',
          height: '80vh',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <CalBookingModal visible={false} />
      </div>,
      document.body
    )
  }

  return null
}

export function ModalOverlay() {
  const { isOpen, modalId, closeModal } = useModal()
  const [isMounted, setIsMounted] = useState(false)
  const [calPreloaded, setCalPreloaded] = useState(false)
  const modalRef = useRef(null)
  const [isHoveringClose, setIsHoveringClose] = useState(false)
  const [closeRotation, setCloseRotation] = useState(0)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    
    previousFocusRef.current = document.activeElement
    const firstFocusable = modalRef.current.querySelectorAll(focusableSelector)[0]

    function handleKeyDown(e) {
      if ('Tab' !== e.key || !modalRef.current) return
      
      const focusableElements = modalRef.current.querySelectorAll(focusableSelector)
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (first && last) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    
    firstFocusable?.focus()
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, modalRef])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCalReady = () => {
    setCalPreloaded(true)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e) => {
      if ('Escape' === e.key) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeModal])

  const handleCloseMouseEnter = () => {
    setIsHoveringClose(true)
    setCloseRotation(getNextRotation)
  }

  const handleCloseMouseLeave = () => {
    setIsHoveringClose(false)
  }

  const preloaderNode = !calPreloaded && <CalPreloader onReady={handleCalReady} />

  const modalContent = isOpen && (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[9998]"
    >
      <motion.button
        type="button"
        aria-label="Close modal"
        onClick={closeModal}
        className="absolute inset-0 cursor-pointer border-none bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: easings.power2Out }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-16 lg:p-32">
        <motion.div
          className={`pointer-events-auto relative flex w-full flex-col bg-background ${'site-audit' === modalId ? 'max-h-[95vh] max-w-[600px]' : 'h-full max-h-[95vh] max-w-[1000px] lg:max-h-[65vh]'}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: easings.power3Out }}
          data-theme="dark"
        >
          <div className="px-24 pt-24">
            <div className="flex items-start justify-between">
              <h2 id="modal-title" className="text-h3">
                {'site-audit' === modalId ? 'Free Site Audit' : 'Book a Call'}
              </h2>
              <motion.button
                type="button"
                onClick={closeModal}
                onMouseEnter={handleCloseMouseEnter}
                onMouseLeave={handleCloseMouseLeave}
                aria-label="Close modal"
                className="flex size-40 shrink-0 cursor-pointer items-center justify-center border-none bg-foreground text-background"
                animate={{ scale: isHoveringClose ? 0.9 : 1 }}
                transition={{ duration: 0.3, ease: easings.power2Out }}
              >
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  animate={{ rotate: closeRotation }}
                  transition={{ duration: 0.3, ease: easings.power2Out }}
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </motion.svg>
              </motion.button>
            </div>
            {'site-audit' === modalId && (
              <p className="mt-8 text-body text-foreground-muted">
                Enter your details and we'll send you a free audit of your website shortly.
              </p>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-24 py-24">
            {'site-audit' === modalId && <AuditForm />}
            {modalId && modalId in bookingVariants && (
              <BookingComponent variant={bookingVariants[modalId]} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )

  if (!isMounted) return null

  const portalNode = createPortal(
    <AnimatePresence>
      {modalContent}
    </AnimatePresence>,
    document.body
  )

  return (
    <Fragment>
      {preloaderNode}
      {portalNode}
    </Fragment>
  )
}

function getNextRotation(current) {
  return current + 90
}