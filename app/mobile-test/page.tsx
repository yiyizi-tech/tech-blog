'use client';

import { useEffect, useState } from 'react';

export default function MobileTestPage() {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceType: '',
    browser: '',
    os: '',
    screenResolution: '',
    windowSize: '',
    connectionType: '',
    currentTime: ''
  });

  useEffect(() => {
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      let deviceType = '桌面设备';
      let browser = '未知浏览器';
      let os = '未知操作系统';

      // 检测设备类型
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (/iPad|Tablet/i.test(userAgent)) {
          deviceType = '平板设备';
        } else {
          deviceType = '移动设备';
        }
      }

      // 检测浏览器
      if (userAgent.indexOf('Chrome') > -1) {
        browser = 'Chrome';
      } else if (userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
      } else if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
      } else if (userAgent.indexOf('Edge') > -1) {
        browser = 'Edge';
      } else if (userAgent.indexOf('MicroMessenger') > -1) {
        browser = '微信内置浏览器';
      } else if (userAgent.indexOf('MiuiBrowser') > -1) {
        browser = '小米浏览器';
      }

      // 检测操作系统
      if (userAgent.indexOf('Windows') > -1) {
        os = 'Windows';
      } else if (userAgent.indexOf('Mac') > -1) {
        os = 'macOS';
      } else if (userAgent.indexOf('Linux') > -1) {
        os = 'Linux';
      } else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
      } else if (userAgent.indexOf('iOS') > -1) {
        os = 'iOS';
      }

      return { deviceType, browser, os };
    };

    const getConnectionInfo = () => {
      const connection = (navigator as unknown as { connection?: { effectiveType?: string }, mozConnection?: { effectiveType?: string }, webkitConnection?: { effectiveType?: string } }).connection || (navigator as unknown as { connection?: { effectiveType?: string }, mozConnection?: { effectiveType?: string }, webkitConnection?: { effectiveType?: string } }).mozConnection || (navigator as unknown as { connection?: { effectiveType?: string }, mozConnection?: { effectiveType?: string }, webkitConnection?: { effectiveType?: string } }).webkitConnection;
      if (connection) {
        return connection.effectiveType || '未知';
      }
      return '不支持检测';
    };

    const info = getDeviceInfo();
    setDeviceInfo({
      deviceType: info.deviceType,
      browser: info.browser,
      os: info.os,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: getConnectionInfo(),
      currentTime: new Date().toLocaleString('zh-CN')
    });
  }, []);

  const testConnection = (url: string, name: string) => {
    const btn = document.getElementById(`test-${name}`);
    if (btn) {
      btn.textContent = '正在测试...';
      (btn as HTMLButtonElement).disabled = true;
    }

    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (btn) {
          btn.textContent = `✅ ${name}正常 (状态码: ${response.status})`;
          (btn as HTMLButtonElement).className = 'test-btn success';
        }
      })
      .catch(error => {
        if (btn) {
          btn.textContent = `❌ ${name}失败 (${error.message})`;
          (btn as HTMLButtonElement).className = 'test-btn error';
        }
      })
      .finally(() => {
        if (btn) {
          (btn as HTMLButtonElement).disabled = false;
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">连接成功！</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          如果您能看到这个页面，说明您的设备可以正常访问 yiyizi.top 域名。
          这可以帮助我们诊断移动端访问问题。
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left font-mono text-sm">
          <p className="mb-2"><strong className="text-gray-800">设备类型:</strong> {deviceInfo.deviceType}</p>
          <p className="mb-2"><strong className="text-gray-800">浏览器:</strong> {deviceInfo.browser}</p>
          <p className="mb-2"><strong className="text-gray-800">操作系统:</strong> {deviceInfo.os}</p>
          <p className="mb-2"><strong className="text-gray-800">屏幕分辨率:</strong> {deviceInfo.screenResolution}</p>
          <p className="mb-2"><strong className="text-gray-800">窗口大小:</strong> {deviceInfo.windowSize}</p>
          <p className="mb-2"><strong className="text-gray-800">网络类型:</strong> {deviceInfo.connectionType}</p>
          <p><strong className="text-gray-800">当前时间:</strong> {deviceInfo.currentTime}</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            id="test-main"
            onClick={() => testConnection('/', '主页面')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors test-btn"
          >
            测试主页面加载
          </button>
          <button
            id="test-css"
            onClick={() => testConnection('/_next/static/css/app/layout.css', '样式文件')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors test-btn"
          >
            测试样式文件加载
          </button>
          <button
            id="test-js"
            onClick={() => testConnection('/_next/static/chunks/app/posts/page.js', '脚本文件')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors test-btn"
          >
            测试脚本文件加载
          </button>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-6 text-sm">
          <p className="mb-2"><strong className="text-gray-800">📧 联系邮箱:</strong> admin@yiyizi.top</p>
          <p><strong className="text-gray-800">📱 如果问题仍然存在:</strong></p>
          <p>请截图此页面并发送给管理员，感谢您的帮助！</p>
        </div>

        <div className="text-gray-500 text-xs">
          页面生成时间: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      <style>{`
        .test-btn.success {
          background-color: #22c55e !important;
        }
        .test-btn.error {
          background-color: #ef4444 !important;
        }
        @media (max-width: 480px) {
          .container {
            padding: 1rem;
          }
          h1 {
            font-size: 1.5rem;
          }
          .device-info {
            font-size: 0.8rem;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}