"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LoadingState } from "@/components/dashboard/design/loading-spinner";
import { authAPI } from "@/lib/api";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/auth/")) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        await authAPI.getCurrentUser();
        setAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Please log in to continue");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingState message="Verifying authentication..." />
      </div>
    );
  }

  if (pathname.startsWith("/auth/") || authenticated) {
    return children;
  }

  return null;
}