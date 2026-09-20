import { MetadataRoute } from "next";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
    return[
        {
            url: 'https://www.elimsclothings.store',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.store/category/men',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.store/category/women',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.store/about',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.store/products/all',
            lastModified: new Date()
        }
    ]

}