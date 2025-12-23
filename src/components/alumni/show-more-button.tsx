"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface ShowMoreButtonProps {
  cohort: number;
  currentTake: number;
  totalCount: number;
}

export const ShowMoreButton = ({ cohort, currentTake, totalCount }: ShowMoreButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [lastScrollY, setLastScrollY] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && lastScrollY !== null) {
      window.scrollTo({ top: lastScrollY, behavior: "auto" });
      setLastScrollY(null);
    }
  }, [isPending, lastScrollY]);

  const handleClick = () => {
    const currentScroll = window.scrollY;
    setLastScrollY(currentScroll);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("cohort", cohort.toString());
      params.set("take", String(currentTake + 6));
      router.push(`/alumni/profiles?${params.toString()}`, { scroll: false });
    });
  };

  if (currentTake >= totalCount) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <button
        className="rounded-xl border border-stone bg-canvas/pure px-6 py-3 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-canvas hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        显示更多 / Show more
      </button>

      {isPending ? (
        <div className="flex flex-col items-center gap-2 text-xs text-ink/60">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone/30 border-t-primary" />
          <p>加载中 / Loading...</p>
        </div>
      ) : null}
    </div>
  );
};





