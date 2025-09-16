// 工具函数：处理SQLite中tags字段的JSON字符串格式

export function parseTags(tagsString: string | null | undefined): string[] {
  if (!tagsString) return [];
  try {
    return JSON.parse(tagsString);
  } catch (error) {
    console.warn('Failed to parse tags:', tagsString, error);
    return [];
  }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}

// 类型定义，帮助处理从数据库来的Post类型
export interface PostWithParsedTags {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  tags: string[];  // 解析后的tags
  featured: boolean;
  published: boolean;
  views: number;
  readingTime: number;
  author: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}