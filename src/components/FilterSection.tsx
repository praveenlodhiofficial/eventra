import { FilterEventsButton } from "@/components/filter.dialog";
import { Button } from "@/components/ui/button";

export default function FilterSection() {
   return (
      <>
         <div className="scrollbar-hide flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1.5 whitespace-nowrap md:gap-3">
               <FilterEventsButton />
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Today
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Tomorrow
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Under 10 km
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Comedy
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Standup
               </Button>
            </div>
         </div>
      </>
   );
}
