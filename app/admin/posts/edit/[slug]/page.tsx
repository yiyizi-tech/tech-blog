import PostEditor from '@/components/admin/PostEditor';

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  return <PostEditor articleId={slug} />;
}