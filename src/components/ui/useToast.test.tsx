import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ToastProvider, useToast } from './useToast'

describe('useToast', () => {
  it('should add a toast and dismiss it', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    )

    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.toast({ title: 'Test Toast' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Test Toast')

    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.dismiss(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
