'use client';

import { useState, useEffect } from 'react';
import { User, Clock, MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string;
  createdAt: string;
  published: boolean;
}

interface CommentsProps {
  postId: number;
  postTitle: string;
}


export default function EnhancedComments({ postId, postTitle }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // 评论表单状态
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    website: '',
    content: ''
  });


  // 获取评论
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}&status=published&limit=50`);
        
        if (response.ok) {
          const data = await response.json();
          const apiComments: Comment[] = data.comments.map((comment: any) => ({
            id: comment.id,
            content: comment.content,
            author: comment.author,
            email: comment.email,
            website: comment.website,
            createdAt: comment.createdAt,
            published: comment.published
          }));
          
          setComments(apiComments);
        } else {
          console.error('获取评论失败:', response.status);
          setComments([]);
        }
      } catch (error) {
        console.error('获取评论失败:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      alert('请填写必填字段');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          postId: postId
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setFormData({ author: '', email: '', website: '', content: '' });
        alert('评论提交成功！评论将在审核通过后显示。');
        
        // 不立即添加到列表中，因为新评论需要审核
        // 如果需要立即显示，可以重新获取评论列表
      } else {
        const data = await response.json();
        alert(`提交评论失败：${data.error || '请重试'}`);
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };


  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1天前';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      return `${Math.ceil(diffDays / 7)}周前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // 渲染评论
  const renderComment = (comment: Comment) => (
    <div
      key={comment.id}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white">
                {comment.website ? (
                  <a
                    href={comment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {comment.author}
                  </a>
                ) : (
                  comment.author
                )}
              </h4>
              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                评论者
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </div>
    </div>
  );

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          评论 ({comments.length})
        </h3>
        <p className="text-gray-400 text-sm">
          欢迎留下您的想法和建议
        </p>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="ml-2 text-gray-400">加载评论中...</span>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">还没有评论，来发表第一个评论吧！</p>
          </div>
        )}
      </div>

      {/* 评论表单 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">发表评论</h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的姓名"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的邮箱"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              网站 (可选)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              评论内容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="写下您的想法..."
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              评论将在审核通过后显示
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  发表评论
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}