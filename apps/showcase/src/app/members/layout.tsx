export default function MembersLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen pt-14">
      <main className="flex-1 p-6 pt-0 space-y-6 w-full">{children}</main>
    </div>
  );
}
