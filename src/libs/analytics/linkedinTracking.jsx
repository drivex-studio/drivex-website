// MODULE: 342094

import Script from 'next/script'
import { useState, useEffect, Fragment } from 'react'

const CONSENT_KEY = 'consent:marketing'

export const LI_CONVERSION_CALL_BOOKED = 0x195bd49;
export const LI_CONVERSION_CTA_CLICK = 0x195bd51;

export function trackLinkedInConversion(conversionId) {
  if (window.lintrk && conversionId) {
    window.lintrk('track', { conversion_id: conversionId })
  }
}

export function LinkedInConsent() {
  const [consentStatus, setConsentStatus] = useState(undefined)

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY)
    if (storedConsent === 'true') {
      setConsentStatus(true)
    } else if (storedConsent === 'false') {
      setConsentStatus(false)
    } else {
      setConsentStatus(null)
    }
  }, [])

  const acceptConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true')
    setConsentStatus(true)
  }

  const declineConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'false')
    setConsentStatus(false)
  }

  if (consentStatus === undefined) {
    return null
  }

  return (
    <Fragment>
      {consentStatus === true && (
        <Fragment>
          <Script id="li-partner" strategy="afterInteractive">
            {`
              _linkedin_partner_id = "9621769";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `}
          </Script>
          <Script 
            id="li-insight" 
            strategy="afterInteractive" 
            src="https://snap.licdn.com/li.lms-analytics/insight.min.js" 
          />
        </Fragment>
      )}
      {consentStatus === null && (
        <div className="fixed bottom-24 left-24 z-50 max-w-[300px] border border-border bg-surface p-16">
          <p className="font-mono text-foreground/70 text-xs">
            We use cookies to measure ad performance.
          </p>
          <div className="mt-12 flex items-center gap-12">
            <button
              type="button"
              onClick={declineConsent}
              className="cursor-pointer font-mono text-foreground/50 text-xs transition-colors duration-200 ease-out hover:text-foreground"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={acceptConsent}
              className="cursor-pointer font-mono text-brand text-xs transition-colors duration-200 ease-out hover:text-brand/80"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </Fragment>
  )
}
