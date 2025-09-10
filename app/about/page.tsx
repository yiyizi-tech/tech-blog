import Link from "next/link";

export default function AboutPage() {
  const skills = [
    "JavaScript/TypeScript",
    "React/Next.js",
    "Node.js",
    "Python",
    "Docker",
    "AWS",
    "Git",
    "Linux"
  ];

  return (
    <>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            关于我
          </h1>
          <p className="text-xl text-gray-300">
            充满热情的开发者，分享知识和经验
          </p>
        </div>

        {/* About Content */}
        <div className="space-y-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">
              你好，我是一名开发者
            </h2>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
                我是一名充满热情的软件开发者，热衷于创建创新解决方案并与开发者社区分享知识。
                凭借多年的 Web 开发经验，我参与过从初创公司到企业级应用的各种项目。
              </p>
              <p>
                这个博客是我分享所学知识、记录我的旅程、并帮助可能面临类似挑战的人的平台。
                我相信社区和开源协作的力量。
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                我的工作
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  使用 React 和 Next.js 构建现代化 Web 应用
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  开发 RESTful API 和微服务
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  使用云技术和 DevOps
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  为开源项目做贡献
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  撰写技术文章和教程
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                我的技能
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              这个博客
            </h3>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
                我开始写这个博客是为了记录我的学习历程，并与其他开发者分享见解。
                在这里你会找到教程、最佳实践、代码片段以及对软件开发最新趋势的思考。
              </p>
              <p>
                我的目标是创建这样的内容：
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <strong>实用:</strong> 真实世界的示例和用例
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <strong>最新:</strong> 跟上最新技术
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <strong>清晰:</strong> 易于理解和跟随
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <strong>全面:</strong> 深入覆盖主题
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 mr-4"
            >
              联系我
            </Link>
            <Link 
              href="/posts" 
              className="border-2 border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
              阅读文章
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}