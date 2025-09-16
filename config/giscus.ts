// Giscus 配置文件
// 请替换以下值为你的实际配置

export const giscusConfig = {
  // 你的 GitHub 仓库 (格式: username/repo)
  repo: 'your-username/your-repo',
  
  // 仓库 ID (在 giscus.app 获取)
  repoId: 'your-repo-id',
  
  // 讨论分类
  category: 'Announcements',
  
  // 分类 ID (在 giscus.app 获取)
  categoryId: 'your-category-id',
  
  // 页面映射方式
  mapping: 'pathname' as const,
  
  // 严格模式
  strict: true,
  
  // 启用反应
  reactionsEnabled: true,
  
  // 发送元数据
  emitMetadata: false,
  
  // 输入框位置
  inputPosition: 'top' as const,
  
  // 主题设置
  theme: 'transparent_dark' as const,
  
  // 语言设置
  lang: 'zh-CN' as const,
  
  // 加载方式
  loading: 'lazy' as const,
};

// 如何获取 Giscus 配置：
// 1. 访问 https://giscus.app/
// 2. 输入你的 GitHub 仓库
// 3. 启用仓库的 Discussions 功能
// 4. 安装 giscus 应用
// 5. 选择配置选项并复制生成的配置