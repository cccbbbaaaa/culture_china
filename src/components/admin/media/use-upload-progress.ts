"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export const useUploadProgress = () => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const begin = useCallback(() => {
    stopTimer();
    setStatus("uploading");
    setProgress(8);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          return 85;
        }
        return Math.min(prev + Math.random() * 10 + 5, 90);
      });
    }, 350);
  }, [stopTimer]);

  const complete = useCallback(
    (result: "success" | "error") => {
      stopTimer();
      if (result === "success") {
        setProgress(100);
        setStatus("success");
        setTimeout(() => {
          setProgress(0);
          setStatus("idle");
        }, 1800);
      } else {
        setStatus("error");
        setTimeout(() => {
          setProgress(0);
          setStatus("idle");
        }, 2000);
      }
    },
    [stopTimer],
  );

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    status,
    progress,
    begin,
    complete,
  };
};

