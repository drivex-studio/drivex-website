
import { isValidElement, cloneElement } from 'react'
import { Slot } from '@radix-ui/react-slot'

function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]
    const isHandler = /^on[A-Z]/.test(propName)

    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args)
          slotPropValue(...args)
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue }
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
    }
  }

  return { ...slotProps, ...overrideProps }
}

function renderChildren(props, childData) {
  return typeof props.children === 'function' ? props.children(childData) : props.children
}

export function Slottable(props) {
  const { asChild, child, children, ...restProps } = props

  if (!isValidElement(child)) {
    return asChild ? null : renderChildren(props, child)
  }

  const childProps = child.props

  const resolvedChildren = child.type === Slot || childProps.asChild 
    ? <Slottable asChild={asChild} child={childProps.children}>{children}</Slottable>
    : renderChildren(props, childProps.children)

  return cloneElement(child, mergeProps(childProps, restProps), resolvedChildren)
}