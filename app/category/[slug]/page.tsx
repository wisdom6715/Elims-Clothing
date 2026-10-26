import { redirect } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export default function Page({ params }: PageProps) {
  redirect(`/products/${params.slug}`);
}
