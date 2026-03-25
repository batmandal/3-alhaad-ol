export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-[60vh] bg-muted/20">{children}</div>
}
