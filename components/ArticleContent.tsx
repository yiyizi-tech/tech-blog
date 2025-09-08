interface ArticleContentProps {
  content: string;
}

function processCodeBlocks(content: string): string {
  return content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang = 'text', code) => {
      const cleanCode = code.trim();
      
      return `<div class="code-block-wrapper my-6">
        <div class="code-header flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg border border-gray-700">
          <span class="text-sm text-gray-400 font-medium">${lang}</span>
          <button class="copy-button text-gray-400 hover:text-white transition-colors" onclick="copyCode(this)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div class="code-content bg-gray-900 rounded-b-lg overflow-hidden">
          <pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-gray-300">${cleanCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      </div>`;
    }
  );
}

function processInlineCode(content: string): string {
  return content.replace(/`([^`]+)`/g, '<code class="inline-code bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
}

function processHeaders(content: string): string {
  return content
    .replace(/^# ([^\n]+)/gm, '<h1 class="text-4xl font-bold mt-8 mb-6 text-white">$1</h1>')
    .replace(/^## ([^\n]+)/gm, '<h2 class="text-3xl font-bold mt-8 mb-6 text-white">$1</h2>')
    .replace(/^### ([^\n]+)/gm, '<h3 class="text-2xl font-semibold mt-6 mb-4 text-white">$1</h3>')
    .replace(/^#### ([^\n]+)/gm, '<h4 class="text-xl font-semibold mt-5 mb-3 text-white">$1</h4>');
}

function processLists(content: string): string {
  return content
    .replace(/^[\s]*-[\s]+(.*$)/gm, '<li class="ml-6 mb-2">• $1</li>')
    .replace(/^[\s]*\d+\.[\s]+(.*$)/gm, '<li class="ml-6 mb-2">1. $1</li>');
}

function processBlockquotes(content: string): string {
  return content.replace(/^> ([^\n]+)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-300">$1</blockquote>');
}

function processLinks(content: string): string {
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors">$1</a>');
}

function processImages(content: string): string {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-6 shadow-lg" />');
}

function processParagraphs(content: string): string {
  // 分割内容为块
  const blocks = content.split('\n\n');
  
  return blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    
    // 跳过已经处理的 HTML 块
    if (block.startsWith('<')) return block;
    
    // 处理段落
    return `<p class="mb-6 text-gray-300 leading-relaxed">${block}</p>`;
  }).join('\n');
}

export default async function ArticleContent({ content }: ArticleContentProps) {
  let processedContent = content;
  
  // 应用所有处理步骤
  processedContent = processCodeBlocks(processedContent);
  processedContent = processInlineCode(processedContent);
  processedContent = processHeaders(processedContent);
  processedContent = processLists(processedContent);
  processedContent = processBlockquotes(processedContent);
  processedContent = processLinks(processedContent);
  processedContent = processImages(processedContent);
  processedContent = processParagraphs(processedContent);
  
  return (
    <>
      <div 
        className="prose prose-lg prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      {/* 添加复制代码的脚本 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function copyCode(button) {
              const codeBlock = button.closest('.code-block-wrapper');
              const codeContent = codeBlock.querySelector('code').textContent;
              
              navigator.clipboard.writeText(codeContent).then(() => {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                button.classList.add('text-green-400');
                
                setTimeout(() => {
                  button.innerHTML = originalHTML;
                  button.classList.remove('text-green-400');
                }, 2000);
              }).catch(err => {
                console.error('Failed to copy code:', err);
              });
            }
          `,
        }}
      />
    </>
  );
}