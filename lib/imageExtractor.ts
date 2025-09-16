/**
 * 从HTML内容中提取第一张图片的URL
 * @param htmlContent HTML内容字符串
 * @returns 第一张图片的URL，如果没有找到图片则返回null
 */
export function extractFirstImageFromHTML(htmlContent: string | null): string | null {
  if (!htmlContent) return null;

  try {
    // 匹配img标签的正则表达式
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const match = htmlContent.match(imgRegex);
    
    if (match && match[1]) {
      const imageSrc = match[1];
      
      // 过滤掉一些不需要的图片（如icon、placeholder等）
      if (
        imageSrc.includes('favicon') ||
        imageSrc.includes('icon') ||
        imageSrc.includes('placeholder') ||
        imageSrc.endsWith('.svg') ||
        imageSrc.includes('data:image') ||
        imageSrc.length < 10
      ) {
        return null;
      }
      
      return imageSrc;
    }
    
    return null;
  } catch (error) {
    console.warn('提取图片失败:', error);
    return null;
  }
}

/**
 * 从Markdown内容中提取第一张图片的URL
 * @param markdownContent Markdown内容字符串
 * @returns 第一张图片的URL，如果没有找到图片则返回null
 */
export function extractFirstImageFromMarkdown(markdownContent: string | null): string | null {
  if (!markdownContent) return null;

  try {
    // 匹配Markdown图片语法的正则表达式: ![alt](src)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const match = markdownContent.match(imgRegex);
    
    if (match && match[2]) {
      const imageSrc = match[2].trim();
      
      // 过滤掉一些不需要的图片
      if (
        imageSrc.includes('favicon') ||
        imageSrc.includes('icon') ||
        imageSrc.includes('placeholder') ||
        imageSrc.endsWith('.svg') ||
        imageSrc.includes('data:image') ||
        imageSrc.length < 10
      ) {
        return null;
      }
      
      return imageSrc;
    }
    
    return null;
  } catch (error) {
    console.warn('提取Markdown图片失败:', error);
    return null;
  }
}

/**
 * 智能提取图片，同时尝试HTML和Markdown格式
 * @param content 内容字符串
 * @returns 第一张图片的URL，如果没有找到图片则返回null
 */
export function extractFirstImage(content: string | null): string | null {
  if (!content) return null;

  // 先尝试提取HTML中的图片
  const htmlImage = extractFirstImageFromHTML(content);
  if (htmlImage) {
    return htmlImage;
  }

  // 如果没有找到，再尝试提取Markdown中的图片
  const markdownImage = extractFirstImageFromMarkdown(content);
  if (markdownImage) {
    return markdownImage;
  }

  return null;
}