'use client'
import { useRef, useState, useEffect } from 'react'
import { trackLinkedInConversion, LI_CONVERSION_CALL_BOOKED } from '@/libs/analytics/linkedinTracking'

function embedGlobalInit(defaultEmbedUrl = 'https://app.cal.com/embed/embed.js') {
  let win = window
  let pushToQueue = function (calObj, args) {
    calObj.q.push(args)
  }
  let doc = win.document
  
  win.Cal = win.Cal || function () {
    let cal = win.Cal
    let args = arguments
    
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      doc.head.appendChild(doc.createElement('script')).src = defaultEmbedUrl
      cal.loaded = true
    }
    
    if (args[0] === 'init') {
      let api = function () {
        pushToQueue(api, arguments)
      }
      let namespace = args[1]
      api.q = api.q || []
      
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api
        pushToQueue(cal.ns[namespace], args)
        pushToQueue(cal, ['initNamespace', namespace])
      } else {
        pushToQueue(cal, args)
      }
      return
    }
    pushToQueue(cal, args)
  }
  return win.Cal
}
embedGlobalInit.toString()

const Cal = function (props) {
  let {
    calLink,
    calOrigin,
    namespace = '',
    config,
    initConfig = {},
    embedJsUrl,
    ...rest
  } = props

  if (!calLink) throw Error('calLink is required')
  
  let isInitialized = useRef(false)
  
  let calApi = (function (url) {
    let [api, setApi] = useState()
    useEffect(() => {
      setApi(() => embedGlobalInit(url))
    }, [])
    return api
  })(embedJsUrl)
  
  let containerRef = useRef(null)

  useEffect(() => {
    if (!calApi || isInitialized.current || !containerRef.current) return
    isInitialized.current = true
    
    let element = containerRef.current
    if (namespace) {
      calApi('init', namespace, { ...initConfig, origin: calOrigin })
      calApi.ns[namespace]('inline', {
        elementOrSelector: element,
        calLink: calLink,
        config: config
      })
    } else {
      calApi('init', { ...initConfig, origin: calOrigin })
      calApi('inline', {
        elementOrSelector: element,
        calLink: calLink,
        config: config
      })
    }
  }, [calApi, calLink, config, namespace, calOrigin, initConfig])

  return calApi ? <div ref={containerRef} {...rest} /> : null
}

async function getCalApi(opts) {
  let { namespace = '', embedJsUrl } = typeof opts === 'string' ? { embedJsUrl: opts } : (opts ?? {})
  
  return new Promise(function checkApi(resolve) {
    let api = embedGlobalInit(embedJsUrl)
    api('init', namespace)
    let nsApi = namespace ? api.ns[namespace] : api
    
    if (nsApi) {
      resolve(nsApi)
    } else {
      setTimeout(() => {
        checkApi(resolve)
      }, 50)
    }
  })
}

export function CalBookingModal({ visible = true }) {
  useEffect(() => {
    ;(async () => {
      let cal = await getCalApi({ namespace: 'intro' })
      cal('ui', { theme: 'dark', hideEventTypeDetails: false, layout: 'month_view' })
      
      if (visible) {
        cal('on', { action: 'bookingSuccessful', callback: onBookingSuccessful })
      }
    })()
  }, [visible])

  const visibility = visible ? 'visible' : 'hidden'
  const position = visible ? 'relative' : 'absolute'
  const pointerEvents = visible ? 'auto' : 'none'

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    visibility,
    position,
    pointerEvents
  }

  return (
    <div style={containerStyle}>
      <Cal
        namespace="intro"
        calLink="good-fella/discovery-call"
        calOrigin="https://cal.eu"
        embedJsUrl="https://cal.eu/embed/embed.js"
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view', theme: 'dark' }}
      />
    </div>
  )
}

function onBookingSuccessful() {
  trackLinkedInConversion(LI_CONVERSION_CALL_BOOKED)
}
