export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background no-scrollbar top-0 left-0 z-50 h-fit w-full md:fixed">
      {children}
    </div>
  );
}
