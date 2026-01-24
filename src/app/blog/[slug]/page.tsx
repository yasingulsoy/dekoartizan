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

    // Blog içeriğindeki img src'lerini backend URL'ine çevir
    const processBlogContent = (html: string): string => {
      if (!html) return html;
      const backendUrl =
        process.env.BACKEND_URL ||
        process.env.API_URL ||
        "http://127.0.0.1:5000";
      
      // HTML içindeki img src'lerini bul ve backend URL'ine çevir
      return html.replace(
        /<img([^>]*)\ssrc=["'](\/uploads\/[^"']+)["']([^>]*)>/gi,
        (match, before, src, after) => {
          // Eğer zaten tam URL ise değiştirme
          if (src.startsWith("http://") || src.startsWith("https://")) {
            return match;
          }
          // Relative URL'leri backend URL'ine çevir
          const fullUrl = `${backendUrl}${src}`;
          return `<img${before} src="${fullUrl}"${after}>`;
        }
      );
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
        <div className="max-w-frame mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6 md:mb-8" />
          
          <article className="max-w-4xl mx-auto">
            {/* Başlık ve Meta Bilgiler */}
            <header className="mb-6 sm:mb-8 md:mb-10">
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 md:mb-5 leading-tight">
                {blog.title}
              </h1>
              
              {blog.excerpt && (
                <p className="text-black/60 text-base sm:text-lg md:text-xl mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-black/40 mb-4 sm:mb-5 md:mb-6">
                {blog.author && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black/60">
                        {blog.author.name}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                <time dateTime={blog.created_at}>
                  {formatDate(blog.created_at)}
                </time>
                {blog.view_count > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{blog.view_count} görüntüleme</span>
                  </>
                )}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 md:mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-black/5 rounded-full text-xs sm:text-sm text-black/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Blog Resmi */}
            {blog.image && (
              <div className="w-full aspect-video bg-[#F0EEED] rounded-[13px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden mb-6 sm:mb-8 md:mb-10 relative">
                <Image
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
                  priority
                />
              </div>
            )}

            {/* Blog İçeriği */}
            <div
              className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-black/80 
                prose-headings:font-bold prose-headings:text-black prose-headings:mt-8 prose-headings:mb-4
                prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:font-bold prose-h1:text-black prose-h1:mt-10 prose-h1:mb-6
                prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:font-bold prose-h2:text-black prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:font-bold prose-h3:text-black prose-h3:mt-6 prose-h3:mb-3
                prose-h4:text-lg sm:prose-h4:text-xl md:prose-h4:text-2xl prose-h4:font-bold prose-h4:text-black prose-h4:mt-5 prose-h4:mb-3
                prose-p:mb-4 prose-p:leading-relaxed prose-p:text-black/80
                prose-img:rounded-lg prose-img:w-full prose-img:my-6
                prose-a:text-black prose-a:underline prose-a:font-medium
                prose-strong:font-bold prose-strong:text-black
                prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2 prose-li:text-black/80
                prose-blockquote:border-l-4 prose-blockquote:border-black/20 prose-blockquote:pl-4 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: processBlogContent(blog.content) }}
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
