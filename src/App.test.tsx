import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App'

describe('App', () => {
  it('renders and exists', () => {
    render(<App />)
    const appElement = screen.getByTestId('app')
    expect(appElement).toBeInTheDocument()
  })
})
