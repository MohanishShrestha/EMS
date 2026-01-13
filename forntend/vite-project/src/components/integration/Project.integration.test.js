import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Project from '../../project'
import { render } from './test-utils'

// Mock child components
jest.mock('../Login', () => {
  return function MockLogin() {
    return <div data-testid="mock-login">Login Component</div>
  }
})

jest.mock('../Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="mock-sidebar">Sidebar</div>
  }
})

jest.mock('../employee/SidebarEmployee', () => {
  return function MockSidebarEmployee() {
    return <div data-testid="mock-sidebar-employee">Employee Sidebar</div>
  }
})

describe('Project Component Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('redirects to login when no token exists', () => {
    const history = createMemoryHistory()
    render(
      <Router location={history.location} navigator={history}>
        <Project />
      </Router>
    )

    expect(screen.getByTestId('mock-login')).toBeInTheDocument()
  })

  test('renders admin layout for admin role', () => {
    localStorage.setItem('token', 'admin-token')
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }))

    const history = createMemoryHistory()
    history.push('/project/admin/dashboard')

    render(
      <Router location={history.location} navigator={history}>
        <Project />
      </Router>
    )

    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument()
  })

  test('renders employee layout for employee role', () => {
    localStorage.setItem('token', 'employee-token')
    localStorage.setItem('user', JSON.stringify({ role: 'employee' }))

    const history = createMemoryHistory()
    history.push('/project/employee/dashboard')

    render(
      <Router location={history.location} navigator={history}>
        <Project />
      </Router>
    )

    expect(screen.getByTestId('mock-sidebar-employee')).toBeInTheDocument()
  })

  test('redirects to login for invalid role access', () => {
    localStorage.setItem('token', 'employee-token')
    localStorage.setItem('user', JSON.stringify({ role: 'employee' }))

    const history = createMemoryHistory()
    history.push('/project/admin/dashboard') // Employee trying to access admin route

    render(
      <Router location={history.location} navigator={history}>
        <Project />
      </Router>
    )

    expect(screen.getByTestId('mock-login')).toBeInTheDocument()
  })
})