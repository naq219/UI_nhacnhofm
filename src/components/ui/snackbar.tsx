import { useEffect, useState } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface SnackbarProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  duration?: number;
}

export function Snackbar({
  open,
  message,
  onConfirm,
  onCancel,
  duration = 6000,
}: SnackbarProps) {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    
    if (open) {
      const timer = setTimeout(() => {
        onCancel();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, onCancel]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
      <div className="bg-white text-slate-800 border border-slate-200 rounded-lg shadow-lg p-4 min-w-80 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">Xác nhận</p>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-slate-600 border-slate-300 hover:bg-slate-100"
          >
            Huỷ
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Xoá
          </Button>
        </div>
      </div>
    </div>
  );
}