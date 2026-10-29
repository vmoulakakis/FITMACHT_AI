import type {MetadataRoute} from "next";
export default function sitemap():MetadataRoute.Sitemap{
 const origin="https://fitmatch-ai-taupe.vercel.app";
 return [
  {url:origin+"/mikromove",lastModified:new Date("2026-10-29T00:00:00Z"),changeFrequency:"monthly",priority:0.9},
  {url:origin+"/mikromove/guide",lastModified:new Date("2026-10-29T00:00:00Z"),changeFrequency:"monthly",priority:0.75}
 ];
}
