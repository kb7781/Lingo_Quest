"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { LessonDetail, HomeData } from "@/types";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, setUser } = useUser();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user context is empty, fetch it first
    if (!user) {
      api.get<HomeData>("/home").then((res) => setUser(res.data.user));
    }

    api.get<LessonDetail>(`/lesson/${params.id}`).then((res) => {
      setLesson(res.data);
      setLoading(false);
    }).catch(() => {
      router.push("/");
    });
  }, [params.id, user, setUser, router]);

  if (loading || !lesson) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
