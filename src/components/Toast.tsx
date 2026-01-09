'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ 
  toasts, 
  onRemove 
}: { 
  toasts: Toast[]; 
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-up',
        'bg-white dark:bg-gray-800',
        bgColors[toast.type]
      )}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {toast.message}
      </span>
      <button 
        onClick={() => onRemove(toast.id)}
        className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export default ToastProvider;
