import { SellerApp } from "@/features/seller/seller-app";
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  return <SellerApp path={path} />;
}
