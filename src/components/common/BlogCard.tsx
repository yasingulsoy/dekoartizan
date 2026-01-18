import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    image?: string | null;
    created_at: string;
    author?: {
      name: string;
    } | null;
    view_count?: number;
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/images/placeholder.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const apiUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_BACKEND_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000"
        : process.env.BACKEND_URL ||
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
    <Link
      href={`/blog/${blog.slug}`}
      className="flex flex-col items-start bg-white border border-black/10 rounded-[13px] lg:rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="w-full aspect-video bg-[#F0EEED] overflow-hidden relative">
        <Image
          src={getImageUrl(blog.image)}
          alt={blog.title}
          fill
          className="object-cover hover:scale-110 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 lg:p-6 w-full">
        <h3 className="font-bold text-black text-lg xl:text-xl mb-2 line-clamp-2">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-black/60 text-sm mb-4 line-clamp-3">
            {blog.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-black/40">
          <div className="flex items-center gap-2">
            {blog.author && (
              <span className="font-medium">{blog.author.name}</span>
            )}
            <span>•</span>
            <span>{formatDate(blog.created_at)}</span>
          </div>
          {blog.view_count !== undefined && (
            <span>{blog.view_count} görüntüleme</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
