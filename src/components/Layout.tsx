import * as React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { NotificationBell } from './NotificationBell'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'
import { Button } from './ui/Button'
import { Moon, Sun, Menu, X } from './ui/Icons'
import { cn } from '../lib/utils'

export function Layout() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavItems = () => (
    <>
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Dashboard
      </NavLink>
      <NavLink 
        to="/board" 
        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Board
      </NavLink>
      <NavLink 
        to="/analytics" 
        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Analytics
      </NavLink>
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <span className="bg-primary text-primary-foreground p-1 rounded-md text-xs">SD</span>
              SprintDesk
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <NavItems />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-sm font-medium">{user?.username || 'User'}</div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <NavItems />
          </nav>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm font-medium">{user?.username || 'User'}</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
