"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: number;
  className?: string;
}

const WishlistButton = ({ productId, className = "" }: WishlistButtonProps) => {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      checkWishlistStatus();
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, token, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/check/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsInWishlist(data.isInWishlist);
      }
    } catch (error) {
      console.error("Favori kontrol hatası:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      if (isInWishlist) {
        // Favorilerden çıkar
        const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setIsInWishlist(false);
        } else {
          alert(data.error || "Ürün favorilerden çıkarılamadı");
        }
      } else {
        // Favorilere ekle
        const response = await fetch(`${API_URL}/api/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        });

        const data = await response.json();
        if (data.success) {
          setIsInWishlist(true);
        } else {
          alert(data.error || "Ürün favorilere eklenemedi");
        }
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button
        className={`p-2 rounded-full border border-black/10 hover:bg-gray-50 transition-colors ${className}`}
        disabled
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full border border-black/10 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={isInWishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      {isInWishlist ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-500"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;
