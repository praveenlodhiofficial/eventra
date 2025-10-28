import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="mt-16 h-full">
         <Navbar />
         {children}
      </div>
   );
}
