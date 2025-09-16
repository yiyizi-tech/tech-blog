export default function TermsPage() {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            使用条款
          </h1>
          <p className="text-xl text-gray-300">
            请仔细阅读以下使用条款
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-12">
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">接受条款</h2>
            <p className="text-gray-300">
              通过访问和使用本网站，您同意受本使用条款的约束。如果您不同意这些条款，请不要使用本网站。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">网站内容</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                本网站提供技术博客文章和相关内容。所有内容仅供信息参考，不构成专业建议。
              </p>
              <p>
                我们保留随时修改、更新或删除网站内容的权利，恕不另行通知。
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">用户行为</h2>
            <div className="text-gray-300 space-y-4">
              <p>使用本网站时，您同意：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>不发布违法、有害、威胁、侮辱、诽谤或其他不当内容</li>
                <li>不侵犯他人的知识产权、隐私权或其他权利</li>
                <li>不使用自动化工具抓取或挖掘网站数据</li>
                <li>不干扰网站的正常运行或安全</li>
                <li>不试图未经授权访问网站的其他部分或相关系统</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">知识产权</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                本网站的所有内容，包括但不限于文章、图像、标识、设计等，均受版权法和其他知识产权法的保护。
              </p>
              <p>
                未经事先书面许可，您不得复制、分发、修改、展示或使用本网站的任何内容。
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">评论和互动</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                您可能可以在本网站上发布评论或参与其他互动活动。您保留对您提交内容的知识产权，但同时授予我们非独占的、可转让的、全球性的许可，以使用、复制、修改和展示您提交的内容。
              </p>
              <p>
                我们保留删除不当评论或内容的权利，但不承担主动监控用户生成内容的义务。
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">第三方链接</h2>
            <p className="text-gray-300">
              本网站可能包含指向第三方网站的链接。这些链接不代表我们认可这些第三方网站的内容或做法。我们对第三方网站的内容、隐私政策或做法不承担任何责任。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">免责声明</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                本网站按"现状"提供，不提供任何明示或暗示的保证。我们不保证：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>网站内容的准确性、完整性或可靠性</li>
                <li>网站的无干扰运行或错误修复</li>
                <li>网站无病毒或其他有害组件</li>
              </ul>
              <p className="pt-4">
                在法律允许的最大范围内，我们对因使用或无法使用本网站而产生的任何直接、间接、偶然、特殊或后果性损害不承担责任。
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">赔偿条款</h2>
            <p className="text-gray-300">
              您同意赔偿我们及其关联公司、员工和代理人，使其免受因您违反本使用条款或侵犯他人权利而产生的任何索赔、责任、损害赔偿、损失和费用（包括合理的律师费）。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">条款修改</h2>
            <p className="text-gray-300">
              我们保留随时修改本使用条款的权利。修改后的条款将在网站上发布时生效。继续使用本网站表示您接受修改后的条款。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">终止条款</h2>
            <p className="text-gray-300">
              我们保留因违反本使用条款而在任何时候终止或暂停您访问本网站的权利，无需事先通知。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">管辖法律</h2>
            <p className="text-gray-300">
              本使用条款受中华人民共和国法律管辖，不考虑其法律冲突原则。任何因本使用条款产生的争议应通过友好协商解决，协商不成的，应提交有管辖权的法院解决。
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">联系我们</h2>
            <p className="text-gray-300">
              如果您对本使用条款有任何疑问，请通过我们的联系方式与我们联系。
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