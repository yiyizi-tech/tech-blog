import { redirect } from 'next/navigation';

export default function AdminPage() {
  // 重定向到dashboard页面
  redirect('/admin/dashboard');
}