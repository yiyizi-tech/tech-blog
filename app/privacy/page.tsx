export default function PrivacyPage() {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            隐私政策
          </h1>
          <p className="text-xl text-gray-300">
            我们致力于保护您的隐私和个人信息
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-12">
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">信息收集</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                我们致力于保护您的隐私。本隐私政策说明我们如何收集、使用和保护您的个人信息。
              </p>
              <p>
                我们可能会收集以下类型的信息：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>您主动提供的信息（如评论、联系方式）</li>
                <li>网站使用数据（如访问日志、浏览行为）</li>
                <li>技术信息（如IP地址、浏览器类型、设备信息）</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">信息使用</h2>
            <div className="text-gray-300 space-y-4">
              <p>我们使用收集的信息用于：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>改进网站内容和用户体验</li>
                <li>回复您的咨询和评论</li>
                <li>分析网站使用情况以优化服务</li>
                <li>防止欺诈和滥用行为</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">信息保护</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或泄露。
              </p>
              <p>
                我们不会将您的个人信息出售、租赁或交易给第三方。仅在法律要求或获得您明确同意的情况下才会共享相关信息。
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Cookie使用</h2>
            <p className="text-gray-300">
              本网站可能使用cookie来改善用户体验。您可以通过浏览器设置管理cookie偏好设置。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">第三方服务</h2>
            <p className="text-gray-300">
              我们的网站可能包含指向第三方网站的链接。本隐私政策不适用于这些第三方网站的做法。我们建议您查看这些网站的隐私政策。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">政策更新</h2>
            <p className="text-gray-300">
              我们可能会不时更新本隐私政策。所有更改将在本页面上发布，修订日期将相应更新。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">联系我们</h2>
            <p className="text-gray-300">
              如果您对本隐私政策有任何疑问，请通过我们的联系方式与我们联系。
            </p>
          </section>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <p className="text-sm text-gray-400">
              最后更新：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}