import { apiGet } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  image?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  } | null;
  view_count: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

interface BlogResponse {
  success: boolean;
  data: Blog;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await apiGet<BlogResponse>(
      `/api/blogs/slug/${slug}`
    );

    if (!response.success || !response.data) {
      return {
        title: "Blog Bulunamadı - dekoartizan",
      };
    }

    const blog = response.data;

    return {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.title,
        images: blog.image
          ? [
              blog.image.startsWith("http")
                ? blog.image
                : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${blog.image}`,
            ]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Blog Bulunamadı - dekoartizan",
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await apiGet<BlogResponse>(`/api/blogs/slug/${slug}`);

    if (!response.success || !response.data) {
      notFound();
    }

    const blog = response.data;

    const getImageUrl = (url: string | null | undefined): string => {
      if (!url) return "/images/placeholder.jpg";
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      const apiUrl =
        process.env.BACKEND_URL ||
        process.env.API_URL ||
        "http://127.0.0.1:5000";
      return `${apiUrl}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <main className="pb-20 min-h-screen">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          
          <article className="max-w-4xl mx-auto">
            {/* Başlık ve Meta Bilgiler */}
            <header className="mb-8">
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
                {blog.title}
              </h1>
              
              {blog.excerpt && (
                <p className="text-black/60 text-lg md:text-xl mb-6">
                  {blog.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-black/40 mb-6">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black/60">
                      {blog.author.name}
                    </span>
                  </div>
                )}
                <span>•</span>
                <time dateTime={blog.created_at}>
                  {formatDate(blog.created_at)}
                </time>
                {blog.view_count > 0 && (
                  <>
                    <span>•</span>
                    <span>{blog.view_count} görüntüleme</span>
                  </>
                )}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-black/5 rounded-full text-sm text-black/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Blog Resmi */}
            {blog.image && (
              <div className="w-full aspect-video bg-[#F0EEED] rounded-[20px] overflow-hidden mb-8 relative">
                <Image
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                  priority
                />
              </div>
            )}

            {/* Blog İçeriği */}
            <div
              className="prose prose-lg max-w-none text-black/80"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                lineHeight: "1.8",
              }}
            />
          </article>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Blog yazısı yüklenirken hata:", error);
    notFound();
  }
}
