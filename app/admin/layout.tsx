import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio",
  description: "Manage your portfolio content",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
