/**
 * Admin shell. Access control is enforced by middleware.ts (which redirects
 * unauthenticated visitors to /admin/login), so this layout is just a
 * passthrough. Each admin page renders <AdminHeader /> itself.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
