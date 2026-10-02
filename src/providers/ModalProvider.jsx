'use client'

import React, { createContext, useState, useContext } from 'react'
import { getLenis } from '@/providers/LenisProvider'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const initialState = {
    isOpen: false,
    modalId: null,
    modalData: undefined
  }

  const [state, setState] = useState(initialState)
  const openModal = (id, data) => {
    getLenis()?.stop()
    setState({ isOpen: true, modalId: id, modalData: data })
  }

  const closeModal = () => {
    getLenis()?.start()
    setState({ isOpen: false, modalId: null, modalData: undefined })
  }

  const contextValue = {
    ...state,
    openModal,
    closeModal
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}

const defaultContextValue = {
  isOpen: false,
  modalId: null,
  modalData: undefined,
  openModal: () => {},
  closeModal: () => {}
}

export function useModal() {
  return useContext(ModalContext) ?? defaultContextValue
}