import Link from 'next/link';

export default function MobileDiagnosticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl">
          📱
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">移动端诊断页面</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          如果您能看到这个页面，说明网络连接正常。
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h2 className="font-bold text-gray-800 mb-3">访问状态检查：</h2>
          <ul className="text-sm space-y-2">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              SSL证书配置正常
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              网络连接正常
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              页面加载成功
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm">
          <h2 className="font-bold text-blue-800 mb-2">💡 故障排除提示：</h2>
          <ul className="text-blue-700 space-y-1">
            <li>• 如果在微信中能打开但在浏览器中打不开，可能是DNS缓存问题</li>
            <li>• 尝试清除浏览器缓存和Cookie</li>
            <li>• 重启手机网络连接</li>
            <li>• 检查手机系统时间是否正确</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-sm">
          <h2 className="font-bold text-yellow-800 mb-2">⚠️ 关于备案信息：</h2>
          <p className="text-yellow-700">
            如果看到备案信息错误提示，这是正常的。新网站备案完成后，部分移动浏览器需要时间同步信息。
          </p>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            返回主站
          </Link>
        </div>

        <div className="text-gray-500 text-xs mt-6">
          页面生成时间: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>
    </div>
  );
}