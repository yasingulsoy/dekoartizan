import React from "react";
import { apiGet } from "@/lib/api";
import BlogCard from "@/components/common/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  created_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  } | null;
  view_count: number;
}

interface BlogListResponse {
  success: boolean;
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const metadata = {
  title: "Blog - dekoartizan",
  description: "Dekoartizan blog yazıları ve haberler",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;

  try {
    const response = await apiGet<BlogListResponse>(
      `/api/blogs?is_published=true&page=${page}&limit=${limit}&locale=tr`
    );

    const blogs = response.success && response.data ? response.data : [];
    const pagination = response.pagination || {
      total: 0,
      page: 1,
      limit: 12,
      pages: 1,
    };

    return (
      <main className="pb-20 min-h-screen">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <div className="mb-8">
            <h1 className="font-bold text-2xl md:text-[32px] mb-2">Blog</h1>
            <p className="text-black/60">
              {pagination.total} blog yazısı bulundu
            </p>
          </div>

          {blogs.length > 0 ? (
            <>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <>
                  <hr className="border-t-black/10 mb-6" />
                  <Pagination className="justify-between">
                    <PaginationPrevious
                      href={
                        page > 1 ? `/blog?page=${page - 1}` : "#"
                      }
                      className={`border border-black/10 ${
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }`}
                    />
                    <PaginationContent>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter((p) => {
                          // İlk sayfa, son sayfa, mevcut sayfa ve yakın sayfaları göster
                          return (
                            p === 1 ||
                            p === pagination.pages ||
                            (p >= page - 1 && p <= page + 1)
                          );
                        })
                        .map((p, index, array) => {
                          // Eksik sayfalar için ellipsis ekle
                          const prevPage = array[index - 1];
                          const showEllipsisBefore = prevPage && p - prevPage > 1;

                          return (
                            <React.Fragment key={p}>
                              {showEllipsisBefore && (
                                <PaginationItem>
                                  <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  href={`/blog?page=${p}`}
                                  className={`text-black/50 font-medium text-sm ${
                                    p === page ? "text-black font-bold" : ""
                                  }`}
                                  isActive={p === page}
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        })}
                    </PaginationContent>
                    <PaginationNext
                      href={
                        page < pagination.pages
                          ? `/blog?page=${page + 1}`
                          : "#"
                      }
                      className={`border border-black/10 ${
                        page >= pagination.pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </Pagination>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-black/60 text-lg">
                Yok
              </p>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Blog yazıları yüklenirken hata:", error);
    return (
      <main className="pb-20 min-h-screen">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <div className="mb-8">
            <h1 className="font-bold text-2xl md:text-[32px] mb-2">Blog</h1>
          </div>
          <div className="text-center py-20">
            <p className="text-black/60 text-lg">
              Yok
            </p>
          </div>
        </div>
      </main>
    );
  }
}
