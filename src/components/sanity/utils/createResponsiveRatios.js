import theme from '@/libs/constants/screens'
import { parseResponsiveValues } from '@/components/sanity/utils/parseResponsiveValues'

export function parseAspectRatio(value) {
  if (typeof value === 'number') return value

  const [width = 1, height = 1] = value.split(/[:/]/).map(Number)
  return width / height
}

export function createResponsiveRatios(value) {
  const responsiveValues = parseResponsiveValues(String(value))
  const screens = Object.keys(theme.screens)
  const styles = {}

  const defaultRatio = parseAspectRatio(responsiveValues.DEFAULT?.value)
  styles['--mx-ratio-DEFAULT'] = String(defaultRatio)

  let currentRatio = defaultRatio
  for (const screen of screens) {
    const ratio = parseAspectRatio(responsiveValues[screen]?.value || currentRatio)
    styles[`--mx-ratio-${screen}`] = String(ratio)
    currentRatio = ratio
  }

  return {
    styles,
    className: [
      'aspect-[var(--mx-ratio)]',
      '[--mx-ratio:var(--mx-ratio-DEFAULT)]',
      'sm:[--mx-ratio:var(--mx-ratio-sm)]',
      'md:[--mx-ratio:var(--mx-ratio-md)]',
      'lg:[--mx-ratio:var(--mx-ratio-lg)]',
      'xl:[--mx-ratio:var(--mx-ratio-xl)]',
      '2xl:[--mx-ratio:var(--mx-ratio-2xl)]'
    ]
  }
}