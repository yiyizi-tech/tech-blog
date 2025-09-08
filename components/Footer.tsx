export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} 壹壹零壹Blog. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex space-x-6">
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
            <a 
              href="/rss.xml" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              RSS 订阅
            </a>
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