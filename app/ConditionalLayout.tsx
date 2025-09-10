'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 检查是否在管理后台路径下
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <>
      {/* 只在非管理后台路径下显示前端导航栏 */}
      {!isAdminPath && <Navbar />}
      {children}
      {/* 只在非管理后台路径下显示页脚 */}
      {!isAdminPath && <Footer />}
    </>
  );
}