import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GlobalVariableContext } from './App'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Custom render function with providers
const AllTheProviders = ({ children, token = null, setToken = jest.fn() }) => {
  return (
    <GlobalVariableContext.Provider value={{ token, setToken }}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </GlobalVariableContext.Provider>
  )
}

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: ({ children }) => AllTheProviders({ children, ...options }), ...options })

export * from '@testing-library/react'
export { customRender as render }