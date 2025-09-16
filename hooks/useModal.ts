'use client';

import { useState } from 'react';

export interface AlertOptions {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface PromptOptions {
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'url' | 'password';
}

export function useModal() {
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    options: AlertOptions | null;
  }>({ isOpen: false, options: null });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({ isOpen: false, options: null, resolve: null });

  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean;
    options: PromptOptions | null;
    resolve: ((value: string | null) => void) | null;
  }>({ isOpen: false, options: null, resolve: null });

  // Alert方法 - 替代alert()
  const showAlert = (options: AlertOptions) => {
    setAlertModal({ isOpen: true, options });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, options: null });
  };

  // Confirm方法 - 替代confirm()
  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmModal({ isOpen: true, options, resolve });
    });
  };

  const closeConfirm = (confirmed: boolean = false) => {
    if (confirmModal.resolve) {
      confirmModal.resolve(confirmed);
    }
    setConfirmModal({ isOpen: false, options: null, resolve: null });
  };

  // Prompt方法 - 替代prompt()
  const showPrompt = (options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptModal({ isOpen: true, options, resolve });
    });
  };

  const closePrompt = (value: string | null = null) => {
    if (promptModal.resolve) {
      promptModal.resolve(value);
    }
    setPromptModal({ isOpen: false, options: null, resolve: null });
  };

  // 便捷方法
  const success = (title: string, message: string) => {
    showAlert({ type: 'success', title, message });
  };

  const error = (title: string, message: string) => {
    showAlert({ type: 'error', title, message });
  };

  const info = (title: string, message: string) => {
    showAlert({ type: 'info', title, message });
  };

  const confirm = async (message: string, title: string = '确认操作'): Promise<boolean> => {
    return showConfirm({ title, message });
  };

  const prompt = async (message: string, title: string = '输入信息', placeholder?: string, defaultValue?: string): Promise<string | null> => {
    return showPrompt({ title, message, placeholder, defaultValue });
  };

  return {
    // 模态框状态
    alertModal,
    confirmModal,
    promptModal,
    
    // 控制方法
    showAlert,
    closeAlert,
    showConfirm,
    closeConfirm,
    showPrompt,
    closePrompt,
    
    // 便捷方法
    success,
    error,
    info,
    confirm,
    prompt
  };
}