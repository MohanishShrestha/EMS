import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import Login from '../Login'
import { render } from './test-utils'

const mockedAxios = axios

describe('Login Component Integration', () => {
  const mockSetToken = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    
    // Mock navigate function
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => ({ state: { from: { pathname: '/previous-page' } } })
    }))
  })

  test('successful login redirects to correct dashboard', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'test-token-123',
        data: { role: 'admin', name: 'Test User' }
      }
    })

    render(<Login />, { setToken: mockSetToken })

    // Fill out the form
    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'testpass')
    await user.click(screen.getByLabelText(/role/i))
    await user.click(screen.getByRole('option', { name: /admin/i }))

    // Submit the form
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Verify API call
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/employee/login'),
        {
          name: 'testuser',
          password: 'testpass',
          role: 'admin'
        }
      )
    })

    // Verify token storage and navigation
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token-123')
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ role: 'admin', name: 'Test User' }))
      expect(mockSetToken).toHaveBeenCalledWith('test-token-123')
    })
  })

  test('shows error message on login failure', async () => {
    const user = userEvent.setup()
    
    // Mock API error
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    })

    render(<Login />, { setToken: mockSetToken })

    // Fill out the form
    await user.type(screen.getByLabelText(/username/i), 'wronguser')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByLabelText(/role/i))
    await user.click(screen.getByRole('option', { name: /employee/i }))

    // Submit the form
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(<Login />, { setToken: mockSetToken })

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })
})