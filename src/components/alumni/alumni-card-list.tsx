"use client";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

interface AlumniCard {
  id: number;
  name: string;
  cohort: number | null;
  major: string | null;
  bioZh: string | null;
  photoUrl: string | null;
  websiteUrl: string | null;
}

interface AlumniCardListProps {
  photoCards: AlumniCard[];
  noPhotoCards: Array<{
    id: number;
    name: string;
    cohort: number | null;
    major: string | null;
    bioZh: string | null;
    websiteUrl: string | null;
  }>;
}

const splitBioLines = (bio: string) => {
  return bio
    .split(/\n|；/g)
    .map((line) => line.trim())
    .filter(Boolean);
};

export const AlumniCardList = ({ photoCards, noPhotoCards }: AlumniCardListProps) => {
  if (photoCards.length === 0 && noPhotoCards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone bg-canvas/pure p-6 text-sm text-ink/70">
        暂无数据
      </div>
    );
  }

  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        initial={{ opacity: 0 }}
        key={`cards-${photoCards.map((c) => c.id).join("-")}`}
        transition={{ duration: 0.3 }}
      >
          {photoCards.map((row, index) => {
            const bioLines = splitBioLines(row.bioZh ?? "");
            const previewLines = bioLines.slice(0, 5);
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 overflow-hidden rounded-xl border border-stone bg-canvas/pure shadow-sm sm:flex-row sm:gap-5"
                initial={{ opacity: 0, y: 20 }}
                key={row.id}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="relative h-56 w-full bg-canvas sm:h-[196px] sm:w-[140px] sm:shrink-0">
                  {row.photoUrl ? (
                    <Image alt={`${row.name} 照片 / photo`} className="object-contain" fill sizes="(max-width: 640px) 100vw, 140px" src={row.photoUrl} />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 px-5 pb-5 sm:p-5">
                  <p className="text-xl font-serif font-semibold tracking-wide text-ink">{row.name}</p>
                  <p className="mt-2 text-sm text-ink/70">
                    {row.cohort ? `${row.cohort} 期` : "期数未知"}
                    {row.major ? `  ${row.major}` : ""}
                  </p>

                  <div className="mt-3 space-y-1 text-sm leading-relaxed text-ink/70">
                    {previewLines.length > 0 ? (
                      previewLines.map((line, idx) => (
                        <p key={idx} className="break-words">
                          {line}
                        </p>
                      ))
                    ) : (
                      <p className="text-ink/55">（暂无简介 / No bio）</p>
                    )}
                    {bioLines.length > previewLines.length ? <p className="text-ink/55">……</p> : null}
                  </div>

                  {row.websiteUrl ? (
                    <p className="mt-3 text-sm text-ink/70">
                      个人主页：
                      <a className="ml-2 break-all text-primary hover:underline" href={row.websiteUrl} rel="noreferrer" target="_blank">
                        {row.websiteUrl}
                      </a>
                    </p>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {noPhotoCards.length > 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: photoCards.length * 0.05 + 0.2 }}
        >
          {noPhotoCards.map((row, index) => {
            const bioLines = splitBioLines(row.bioZh ?? "").slice(0, 2);
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-dashed border-stone bg-canvas/pure p-4"
                initial={{ opacity: 0, y: 20 }}
                key={row.id}
                transition={{ duration: 0.4, delay: (photoCards.length + index) * 0.05 + 0.2 }}
              >
                <p className="text-sm font-medium text-ink">{row.name}</p>
                <p className="mt-1 text-xs text-ink/60">
                  {row.cohort ? `第 ${row.cohort} 期` : "期数未知"}
                  {row.major ? ` · ${row.major}` : ""}
                </p>
                {bioLines.length > 0 ? (
                  <div className="mt-2 space-y-1 text-sm leading-relaxed text-ink/70">
                    {bioLines.map((line, idx) => (
                      <p key={idx} className="break-words">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
                {row.websiteUrl ? (
                  <p className="mt-2 text-xs text-ink/70">
                    主页：
                    <a className="ml-2 break-all text-primary hover:underline" href={row.websiteUrl} rel="noreferrer" target="_blank">
                      {row.websiteUrl}
                    </a>
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      ) : null}
    </>
  );
};


