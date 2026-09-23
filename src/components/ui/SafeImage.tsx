"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
  listingName?: string;
}

function getLocalImage(name?: string): string | null {
  if (!name) return null;
  const n = name.toLowerCase().trim();
  
  if (n.includes("mahavir")) return "/images/mahavir-mandir.jpeg";
  if (n.includes("iskcon")) return "/images/iskcon-patna.jpeg";
  if (n.includes("takht") || n.includes("sahib")) return "/images/patna-sahib.jpeg";
  if (n.includes("golghar")) return "/images/golghar.jpeg";
  if (n.includes("bihar museum")) return "/images/bihar-museum.jpeg";
  if (n.includes("gandhi ghat")) return "/images/gandhi-ghat.jpeg";
  if (n.includes("michaels") || n.includes("michael's")) return "/images/st-michaels.jpeg";
  if (n.includes("notre dame")) return "/images/notre-dame.jpeg";
  if (n.includes("delhi public") || n.includes("dps")) return "/images/dps-patna.jpeg";
  if (n.includes("gold") && n.includes("gym")) return "/images/golds-gym.jpeg";
  if (n.includes("anytime")) return "/images/anytime-fitness.jpeg";
  if (n.includes("talwalkar")) return "/images/talwalkars.jpeg";
  if (n.includes("central mall")) return "/images/patna-central.jpeg";
  if (n.includes("p&m") || n.includes("p & m")) return "/images/pm-mall.jpeg";
  if (n.includes("hathwa")) return "/images/hathwa-market.jpeg";
  
  if (n === "patna") return "/images/patna.jpeg";
  
  return null;
}

function getCategoryFallback(cat?: string) {
  const catLower = cat?.toLowerCase() || "";
  if (catLower.includes("temple")) return "/images/mahavir-mandir.jpeg"; 
  if (catLower.includes("school")) return "/images/st-michaels.jpeg";
  if (catLower.includes("shop") || catLower.includes("mall")) return "/images/pm-mall.jpeg";
  if (catLower.includes("gym") || catLower.includes("fitness")) return "/images/golds-gym.jpeg";
  if (catLower.includes("famous") || catLower.includes("landmark")) return "/images/golghar.jpeg";
  return "/images/patna.jpeg"; 
}

export function SafeImage({ src, fallbackSrc, category, listingName, className, alt, ...props }: SafeImageProps) {
  
  // Robust checking for local image override based on the listing name
  const localSrc = getLocalImage(listingName) || getLocalImage(alt);
  
  // Only use original `src` if it's NOT a remote Unsplash/Wiki URL, OR if we didn't find a local map
  // But to be completely safe and avoid remote broken URLs, we prefer the local map.
  let initialSrc = localSrc;
  if (!initialSrc) {
    if (typeof src === "string" && (src.includes("unsplash") || src.includes("wikimedia"))) {
      initialSrc = getCategoryFallback(category);
    } else {
      initialSrc = (src as string) || getCategoryFallback(category);
    }
  }

  // Reset hasError if the computed source changes (e.g. during client-side navigation)
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(initialSrc);
  if (initialSrc !== prevSrc) {
    setPrevSrc(initialSrc);
    setHasError(false);
  }

  const finalSrc = hasError ? getCategoryFallback(category) : initialSrc;

  return (
    <div className={cn("relative overflow-hidden bg-zinc-800", className)}>
      <img
        src={finalSrc}
        alt={alt || listingName || category || "Image"}
        className={cn(
          "w-full h-full object-cover",
          className
        )}
        onError={() => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Failed to load image: ${initialSrc}`);
          }
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
