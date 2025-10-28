import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="mt-15 h-full">
         <Navbar />
         {children}
      </div>
   );
}
