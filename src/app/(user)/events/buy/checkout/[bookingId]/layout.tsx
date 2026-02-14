export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background no-scrollbar fixed top-0 left-0 z-50 h-full w-full overflow-y-auto">
      {children}
    </div>
  );
}
