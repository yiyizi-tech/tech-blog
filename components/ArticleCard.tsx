import Link from "next/link";
import LazyImage from "./LazyImage";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage?: string;
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  date,
  readTime,
  tags,
  coverImage
}: ArticleCardProps) {
  // Generate a deterministic gradient based on the article id
  const gradients = [
    'from-blue-600/20 to-purple-600/20',
    'from-purple-600/20 to-pink-600/20',
    'from-green-600/20 to-blue-600/20',
    'from-orange-600/20 to-red-600/20',
    'from-teal-600/20 to-blue-600/20',
    'from-indigo-600/20 to-purple-600/20'
  ];
  
  const gradientIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
  const selectedGradient = gradients[gradientIndex];

  return (
    <article className="group bg-gray-800 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl h-full flex flex-col">
      {/* Cover Image */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${selectedGradient}`}>
        {coverImage && coverImage.trim() !== '' ? (
          <LazyImage
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Reading progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full w-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <time className="text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(date).toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </time>
          <span className="text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 leading-tight">
          <Link href={`/posts/${id}`} className="line-clamp-2 text-gray-100 hover:text-blue-300 transition-colors duration-200">
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed text-sm flex-1">
          {excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Read More Link */}
        <div className="mt-auto">
          <Link 
            href={`/posts/${id}`} 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors group-hover:translate-x-1 transition-transform text-sm"
          >
            阅读更多
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}