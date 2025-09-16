# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development
```bash
npm run dev          # 启动开发服务器（使用Turbopack）
npm run build        # 构建生产版本（使用Turbopack）
npm start            # 启动生产服务器
npm run lint         # 运行ESLint检查
```

## Architecture Overview

### Project Structure
这是一个基于 Next.js 15 的现代化技术博客，采用 **App Router** 架构：

- **前台展示**: `/app/*` - 包含首页、文章页面、关于、联系等
- **后台管理**: `/app/admin/*` - 完整的管理系统，包含仪表板、文章管理、数据统计、系统设置
- **组件库**: `/components/*` - 前台组件和管理后台组件
- **工具函数**: `/utils/*` - Markdown处理、滚动处理等

### Core Technologies
- **Next.js 15** - React全栈框架，使用Turbopack构建
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS v4** - 实用优先的CSS框架
- **TipTap** - 富文本编辑器（基于ProseMirror）
- **Recharts** - 数据可视化图表
- **Zustand** - 状态管理
- **Lucide React** - 图标库

### Key Components

#### 1. Admin System (后台管理系统)
位于 `/app/admin/` 和 `/components/admin/`，提供完整的管理功能：

- **AdminLayout**: 侧边栏导航 + 顶部工具栏，支持响应式设计
- **AdminDashboard**: 核心数据统计和图表展示
- **PostsManagement**: 文章CRUD操作，包含搜索和过滤
- **PostEditor**: 基于TipTap的富文本编辑器
- **AnalyticsPage**: 使用Recharts的数据统计页面
- **SettingsPage**: 系统配置管理

#### 2. Editor System (编辑器)
位于 `/components/Editor.tsx`，功能强大的富文本编辑器：

- 基于 **TipTap** 构建支持Markdown
- 支持标题、粗体、斜体、列表、引用、代码块
- 支持链接插入、表格、图片
- 支持全屏编辑模式
- 支持只读模式
- 集成代码语法高亮（lowlight）

#### 3. Content Processing (内容处理)
位于 `/utils/markdown.ts`，自定义Markdown处理器：

- 将Markdown转换为HTML
- 自动生成标题ID用于目录导航
- 支持代码块、行内代码、粗体、列表等
- 添加Tailwind CSS类名用于样式

### Data Flow Patterns
1. **前端展示**: 使用Server Components渲染静态内容
2. **后台管理**: 使用Client Components实现交互功能
3. **状态管理**: 使用Zustand管理编辑器状态和主题
4. **内容存储**: 当前为演示环境，数据存储在组件状态中

### Styling Conventions
- 使用 **Tailwind CSS v4** 和CSS变量
- 深色主题设计，黑色背景 (`bg-black`)
- 响应式设计，支持移动端和桌面端
- 使用Geist字体作为主字体

### Important Notes
- 项目使用 **Turbopack** 作为构建工具
- 编辑器支持实时预览和保存功能
- 管理后台具有完整的移动端适配
- 所有页面都支持深色主题

在本地 (Windows) 开发：使用 npm run dev 进行开发和调试。确保所有 import 的大小写都正确，并使用 path.join 处理文件路径。之后我将在本地开发的文件上传到我的rocky linux服务器上安装并构建，请注意这些不兼容的地方！
我会自己使用npm run dev进行开启开发服务器，你只需要改你的代码就行