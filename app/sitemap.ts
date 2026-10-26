import type {MetadataRoute} from "next";
import {canonicalOrigin,publicLaunchEnabled} from "@/lib/release";

export default function sitemap():MetadataRoute.Sitemap {
  if (!publicLaunchEnabled()) return [];
  const origin=canonicalOrigin();
  if (!origin) return [];
  return [
    {url:origin,changeFrequency:"weekly",priority:1},
    {url:`${origin}/methodology`,changeFrequency:"monthly",priority:0.4},
    {url:`${origin}/privacy`,changeFrequency:"monthly",priority:0.2}
  ];
}
