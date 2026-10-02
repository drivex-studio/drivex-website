import { env } from '@/env'

let posthogInstance = null
let posthogPromise = null
let isInitialized = false

export async function initPostHog(config) {
  let key = config?.key ?? env.NEXT_PUBLIC_POSTHOG_KEY
  let host = config?.host ?? env.NEXT_PUBLIC_POSTHOG_HOST

  if (!key || !host) return null
  if (isInitialized) return posthogInstance

  let instance = await (posthogInstance
    ? Promise.resolve(posthogInstance)
    : (!posthogPromise && (posthogPromise = import('posthog-js').then(mod => {
        posthogInstance = mod.default
        return posthogInstance
      })), posthogPromise))

  if (instance) {
    instance.init(key, {
      api_host: host,
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'memory',
      disable_session_recording: true,
      disable_surveys: true,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      autocapture: false
    })
    isInitialized = true
    return instance
  }
  return null
}

export async function captureEvent(eventName, properties) {
  let instance = await initPostHog()
  if (instance) {
    instance.capture(eventName, properties)
  }
}

function handleIdleInit() {
  initPostHog()
}

export function setupIdleInit() {
  let requestIdle = globalThis.requestIdleCallback
  if (requestIdle) {
    let timerId = requestIdle(handleIdleInit, { timeout: 1500 })
    return () => globalThis.cancelIdleCallback?.(timerId)
  }
  let timerId = globalThis.setTimeout(handleIdleInit, 800)
  return () => globalThis.clearTimeout(timerId)
}
