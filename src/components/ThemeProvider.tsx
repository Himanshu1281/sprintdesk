import * as React from 'react'
import { useThemeStore } from '../store/useThemeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  React.useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
