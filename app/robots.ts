import type {MetadataRoute} from "next";
import {canonicalOrigin,publicLaunchEnabled} from "@/lib/release";

export default function robots():MetadataRoute.Robots {
  if (!publicLaunchEnabled()) {
    return {rules:{userAgent:"*",disallow:"/"}};
  }
  return {rules:{userAgent:"*",allow:"/"},sitemap:`${canonicalOrigin()}/sitemap.xml`};
}
