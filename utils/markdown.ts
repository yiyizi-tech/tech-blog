// 生成ID的辅助函数
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 保留中文字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .trim();
}

export function processMarkdownContent(content: string): string {
  let processedContent = content;
  
  // 首先处理代码块，避免里面的内容被其他规则影响
  processedContent = processedContent.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // 处理行内代码
  processedContent = processedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 处理标题（从大到小处理，避免冲突）并添加ID
  processedContent = processedContent.replace(/^### (.*$)/gm, (match, title) => {
    const id = generateId(title);
    return `<h3 id="${id}" class="text-2xl font-bold mt-8 mb-4 text-white scroll-mt-20">${title}</h3>`;
  });
  
  processedContent = processedContent.replace(/^## (.*$)/gm, (match, title) => {
    const id = generateId(title);
    return `<h2 id="${id}" class="text-3xl font-bold mt-8 mb-6 text-white scroll-mt-20">${title}</h2>`;
  });
  
  processedContent = processedContent.replace(/^# (.*$)/gm, (match, title) => {
    const id = generateId(title);
    return `<h1 id="${id}" class="text-4xl font-bold mt-8 mb-6 text-white scroll-mt-20">${title}</h1>`;
  });
  
  // 处理粗体
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  
  // 处理无序列表
  processedContent = processedContent.replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>');
  
  // 将连续的li包装在ul中
  processedContent = processedContent.replace(/(<li[^>]*>.*<\/li>\s*)+/g, (match) => {
    return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
  });
  
  // 处理换行
  processedContent = processedContent.replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">');
  processedContent = processedContent.replace(/\n/g, '<br />');
  
  // 包装段落
  processedContent = processedContent.replace(/^(?!<[h|u|p|pre])(.*$)/gm, '<p class="mb-4 text-gray-300 leading-relaxed">$1</p>');
  
  // 清理空段落
  processedContent = processedContent.replace(/<p class="mb-4 text-gray-300 leading-relaxed"><\/p>/g, '');
  processedContent = processedContent.replace(/<p class="mb-4 text-gray-300 leading-relaxed">\s*<\/p>/g, '');
  
  // 确保代码块样式正确
  processedContent = processedContent.replace(/<pre><code>/g, '<pre class="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-gray-100 font-mono">');
  processedContent = processedContent.replace(/<\/code><\/pre>/g, '</code></pre>');
  
  // 确保行内代码样式正确
  processedContent = processedContent.replace(/<code>/g, '<code class="bg-gray-800 text-red-400 px-2 py-1 rounded text-sm font-mono">');
  processedContent = processedContent.replace(/<\/code>/g, '</code>');
  
  return processedContent;
}

// 导出generateId函数供其他模块使用
export { generateId };