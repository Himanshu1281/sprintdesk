import * as React from "react"
import { cn } from "../../lib/utils"
import { X } from "./Icons"

export type ToastType = "default" | "success" | "error"

interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
  action?: React.ReactNode
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(
    ({ duration = 5000, ...props }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      setToasts((prev) => [...prev, { id, duration, ...props }])
      
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
      }
    },
    []
  )

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map((t) => (
          <ToastComponent key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastComponent({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const variants = {
    default: "bg-background border-border text-foreground",
    success: "bg-primary text-primary-foreground border-primary",
    error: "bg-destructive text-destructive-foreground border-destructive",
  }
  const type = toast.type || "default"

  return (
    <div 
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-right-full mt-4",
        variants[type]
      )}
      role="alert"
    >
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-sm font-semibold">{toast.title}</h3>
        {toast.description && (
          <p className="text-sm opacity-90">{toast.description}</p>
        )}
        {toast.action && (
          <div className="mt-2">{toast.action}</div>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
