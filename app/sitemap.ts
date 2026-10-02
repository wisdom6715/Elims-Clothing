import { MetadataRoute } from "next";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
    return[
        {
            url: 'https://www.elimsclothings.com',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.com/category/men',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.com/category/women',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.com/about',
            lastModified: new Date()
        },
        {
            url: 'https://www.elimsclothings.com/products/all',
            lastModified: new Date()
        }
    ]

}