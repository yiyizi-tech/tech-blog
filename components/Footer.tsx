"use client";

import { usePathname } from "next/navigation";
import { RSSButton } from "./RSSSubscription";
import { ShareButtonSimple } from "./SocialShare";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // 如果是admin页面，不显示底部
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} 壹壹零壹Blog. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/privacy" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              隐私政策
            </a>
            <a 
              href="/terms" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              使用条款
            </a>
            <RSSButton />
            <ShareButtonSimple 
              url={`https://your-domain.com${pathname}`}
              title="壹壹零壹Blog - 探索前沿技术，分享编程心得"
              description="专注于现代Web开发技术的个人博客"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-center text-sm text-gray-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
}