import Link from "next/link";
import { 
  Network, 
  Server, 
  Shield, 
  Database, 
  Monitor, 
  Award,
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
  Users,
  Activity
} from 'lucide-react';

export default function AboutPage() {
  const networkingSkills = [
    "思科ACI网络",
    "华为网络设备", 
    "网络安全",
    "VPN管理",
    "负载均衡(LVS+Keepalived)",
    "防火墙配置",
    "弱电施工"
  ];

  const systemSkills = [
    "Linux运维",
    "Shell脚本",
    "Ansible自动化",
    "Docker容器化",
    "Kubernetes(K8s)",
    "VMware vSphere",
    "CI/CD(Jenkins/GitLab)",
    "堡垒机管理"
  ];

  const monitoringTools = [
    "Zabbix监控",
    "Grafana可视化",
    "NetBox网络管理", 
    "Snipe-IT资产管理",
    "告警模板配置",
    "性能监控"
  ];

  const webTech = [
    "Nginx",
    "Apache/Tomcat",
    "MySQL数据库",
    "Web服务器配置",
    "大模型技术(MCP/N8N)",
    "系统集成"
  ];

  return (
    <>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Network className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            徐梁 - 网络工程师
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            专注于企业级网络运维与基础设施管理
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              2002年出生
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              常州中创新航科技集团
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              华为HCIP认证
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-12">
          {/* 个人简介 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-400" />
              关于我
            </h2>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
                我是徐梁，毕业于淮阴工学院网络工程专业。目前在常州中创新航科技集团股份有限公司担任网络工程师，
                负责管理集团基地的网络运维工作，管理约700多台交换机和10几台服务器的大规模网络环境。
              </p>
              <p>
                从弱电施工的网络设计开始，到现在的企业级网络运维，我在网络工程领域积累了丰富的实战经验。
                我热衷于学习新技术，持续关注网络安全、自动化运维和监控技术的发展。
              </p>
            </div>
          </div>

          {/* 工作经历 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-green-400" />
              工作经历
            </h2>
            <div className="space-y-6">
              {/* 当前工作 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">网络工程师</h3>
                  <span className="text-blue-400 text-sm">2025年3月 - 至今</span>
                </div>
                <p className="text-gray-400 mb-3">常州中创新航科技集团股份有限公司</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                    负责集团基地网络运维，管理生产网和办公网日常运维
                  </li>
                  <li className="flex items-start">
                    <Network className="w-4 h-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                    管理700+台交换机和10+台服务器的大规模网络环境
                  </li>
                  <li className="flex items-start">
                    <Database className="w-4 h-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                    维护思科ACI网络及VMware vSphere虚拟机环境
                  </li>
                  <li className="flex items-start">
                    <Monitor className="w-4 h-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                    部署Grafana服务器配合Zabbix进行监控，配置告警模板
                  </li>
                  <li className="flex items-start">
                    <Server className="w-4 h-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                    搭建Snipe-IT资产管理和NetBox网络设备管理系统
                  </li>
                </ul>
              </div>
              
              {/* 之前工作 */}
              <div className="border-l-4 border-gray-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">网络工程师</h3>
                  <span className="text-gray-400 text-sm">2024年8月 - 2025年3月</span>
                </div>
                <p className="text-gray-400 mb-3">苏州苏西网络科技有限公司</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <Network className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    专注弱电施工相关的网络设计工作
                  </li>
                  <li className="flex items-start">
                    <GraduationCap className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    自学Linux运维、Docker、K8s等技术栈
                  </li>
                  <li className="flex items-start">
                    <Award className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    期间考取华为HCIP认证（2025年1月）
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 技能矩阵 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 网络技术 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Network className="w-5 h-5 mr-2 text-blue-400" />
                网络技术
              </h3>
              <div className="flex flex-wrap gap-2">
                {networkingSkills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 系统运维 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Server className="w-5 h-5 mr-2 text-green-400" />
                系统运维
              </h3>
              <div className="flex flex-wrap gap-2">
                {systemSkills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full border border-green-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 监控运维 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-purple-400" />
                监控运维
              </h3>
              <div className="flex flex-wrap gap-2">
                {monitoringTools.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full border border-purple-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Web技术 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-orange-400" />
                Web & 数据库
              </h3>
              <div className="flex flex-wrap gap-2">
                {webTech.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-orange-600/20 text-orange-400 text-sm rounded-full border border-orange-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 专业成就 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-yellow-400" />
              专业成就与规模
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-blue-600/10 rounded-lg p-6 border border-blue-600/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">700+</div>
                <div className="text-gray-300">管理交换机数量</div>
              </div>
              <div className="bg-green-600/10 rounded-lg p-6 border border-green-600/20">
                <div className="text-3xl font-bold text-green-400 mb-2">10+</div>
                <div className="text-gray-300">管理服务器数量</div>
              </div>
              <div className="bg-purple-600/10 rounded-lg p-6 border border-purple-600/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">HCIP</div>
                <div className="text-gray-300">华为认证</div>
              </div>
            </div>
          </div>

          {/* 关于博客 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              关于这个博客
            </h3>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
                在这个博客中，我会分享网络工程、系统运维、监控技术等领域的实践经验和技术心得。
                从日常的网络故障排查到大规模基础设施的自动化管理，从传统网络到云原生架构。
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>实战经验:</strong> 真实生产环境的案例分享
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>技术深度:</strong> 从基础到进阶的系统性内容
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>持续学习:</strong> 跟进最新的运维技术趋势
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>知识分享:</strong> 帮助更多运维工程师成长
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 联系按钮 */}
          <div className="text-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 mr-4 inline-flex items-center"
            >
              <Network className="w-5 h-5 mr-2" />
              联系我
            </Link>
            <Link 
              href="/posts" 
              className="border-2 border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-105 inline-flex items-center"
            >
              <Monitor className="w-5 h-5 mr-2" />
              阅读技术文章
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}