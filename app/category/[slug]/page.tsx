import { redirect } from "next/navigation";

export default function CategoryRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  const target = params?.slug ? `/products/${params.slug}` : "/products/all";
  redirect(target);
}
