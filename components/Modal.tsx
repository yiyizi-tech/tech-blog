'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  lockBodyScroll?: boolean;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', lockBodyScroll = true }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      if (lockBodyScroll) {
        // 锁定整个页面滚动
        document.body.style.overflow = 'hidden';
      } else {
        // 只锁定编辑器内容区域（如果存在）
        const editorContent = document.querySelector('.editor-content-wrapper');
        if (editorContent) {
          (editorContent as HTMLElement).style.overflow = 'hidden';
        }
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      
      if (lockBodyScroll) {
        // 恢复整个页面滚动
        document.body.style.overflow = 'unset';
      } else {
        // 恢复编辑器内容区域滚动
        const editorContent = document.querySelector('.editor-content-wrapper');
        if (editorContent) {
          (editorContent as HTMLElement).style.overflow = 'auto';
        }
      }
    };
  }, [isOpen, onClose, lockBodyScroll]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className={`relative w-full ${sizeClasses[size]} bg-gray-800 rounded-lg shadow-xl border border-gray-700`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export function AlertModal({ isOpen, onClose, type, title, message }: AlertModalProps) {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
    error: <AlertCircle className="w-6 h-6 text-red-400" />,
    info: <AlertCircle className="w-6 h-6 text-blue-400" />
  };

  const colors = {
    success: 'border-green-500/20 bg-green-500/10',
    error: 'border-red-500/20 bg-red-500/10',
    info: 'border-blue-500/20 bg-blue-500/10'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className={`flex items-start space-x-3 p-4 rounded-lg ${colors[type]} border`}>
        {icons[type]}
        <p className="text-white text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          确定
        </button>
      </div>
    </Modal>
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-red-400" />,
    warning: <HelpCircle className="w-6 h-6 text-yellow-400" />,
    info: <AlertCircle className="w-6 h-6 text-blue-400" />
  };

  const colors = {
    danger: 'border-red-500/20 bg-red-500/10',
    warning: 'border-yellow-500/20 bg-yellow-500/10',
    info: 'border-blue-500/20 bg-blue-500/10'
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className={`flex items-start space-x-3 p-4 rounded-lg ${colors[type]} border`}>
        {icons[type]}
        <p className="text-white text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${buttonColors[type]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'url' | 'password';
}

export function PromptModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  placeholder = '',
  defaultValue = '',
  inputType = 'text'
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      onClose();
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-300 text-sm">{message}</p>
        <input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        >
          取消
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          确定
        </button>
      </div>
    </Modal>
  );
}