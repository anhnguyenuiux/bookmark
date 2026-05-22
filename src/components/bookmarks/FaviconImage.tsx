"use client";

import { useState } from "react";
import { getFaviconUrl } from "@/lib/favicon";
import { getDomain, getDomainColor } from "@/lib/utils";
import Image from "next/image";

interface FaviconImageProps {
  url: string;
  size?: number;
}

export function FaviconImage({ url, size = 20 }: FaviconImageProps) {
  const [failed, setFailed] = useState(false);
  const domain = getDomain(url);
  const color = getDomainColor(domain);
  const letter = domain.charAt(0).toUpperCase();

  if (failed) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-subtle text-white font-semibold shrink-0"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.5,
          backgroundColor: color,
        }}
      >
        {letter}
      </span>
    );
  }

  return (
    <Image
      src={getFaviconUrl(url)}
      alt={domain}
      width={size}
      height={size}
      className="rounded-subtle shrink-0"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
