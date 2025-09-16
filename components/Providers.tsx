"use client";

// 暂时注释掉next-auth，让网站先正常运行
// import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // return <SessionProvider>{children}</SessionProvider>;
  return <>{children}</>;
}