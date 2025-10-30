"use client";

import "@/styles/swiper.style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import { getFeaturedEvents } from "@/features/event";
import { Event } from "@/generated/prisma";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

export default function EventCarousel() {
   const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

   useEffect(() => {
      const fetchFeaturedEvents = async () => {
         const { data, success } = await getFeaturedEvents();
         if (success) {
            setFeaturedEvents(data || []);
         }
      };

      fetchFeaturedEvents();
   }, []);

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         weekday: "short",
         day: "numeric",
         month: "short",
         hour: "numeric",
         minute: "2-digit",
         hour12: true,
      }).format(new Date(date));
   };

   return (
      <div className="relative h-[60vh] w-full md:h-[70vh] lg:h-[85vh]">
         <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
               delay: 4000,
               disableOnInteraction: false,
            }}
            pagination={{
               clickable: true,
               bulletClass: "swiper-pagination-bullet !w-3 !h-3 !mx-1 !bg-gray-300 !opacity-100",
               bulletActiveClass: "swiper-pagination-bullet-active !bg-black",
            }}
            navigation={{
               nextEl: ".swiper-button-next-custom",
               prevEl: ".swiper-button-prev-custom",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper h-full"
         >
            {featuredEvents?.map((event) => (
               <SwiperSlide
                  key={event.id}
                  className="flex h-full w-full items-center justify-center px-8 md:px-16 lg:px-24"
               >
                  <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 pt-25 lg:grid-cols-2 lg:gap-12">
                     {/* Left Section - Event Details */}
                     <div className="space-y-6 text-center lg:text-left">
                        {/* Date */}
                        <div className="text-base font-medium text-gray-700">
                           {formatDate(event.startDate)}
                        </div>

                        {/* Event Name */}
                        <h2 className="text-xl leading-tight font-bold text-black md:text-2xl lg:text-4xl">
                           {event.name}
                        </h2>

                        {/* Venue */}
                        <div className="text-xl font-medium text-gray-700">{event.location}</div>

                        {/* Price */}
                        <div className="text-base font-medium text-gray-700">
                           {event.ticketType === "FREE" ? "Free Event" : "₹3000 onwards"}
                        </div>

                        {/* Book Tickets Button */}
                        <Link href={`/events/${event.slug}`}>
                           <Button
                              size="lg"
                              className="mx-auto w-fit cursor-pointer rounded-lg bg-black px-8 py-7 text-lg font-semibold text-white hover:bg-gray-800 lg:mx-0"
                           >
                              Book tickets
                           </Button>
                        </Link>
                     </div>

                     {/* Right Section - Event Poster */}
                     <div className="flex h-full justify-center lg:justify-end">
                        <Image
                           src={event.coverImageUrl || "/placeholder-image.jpg"}
                           alt={event.name || "Event Image"}
                           height={1000}
                           width={1000}
                           className="max-w-sm rounded-3xl border object-cover shadow-2xl"
                        />
                     </div>
                  </div>

                  <div className="absolute top-0 left-0 -z-1">
                     <Image
                        src={event.coverImageUrl || "/placeholder-image.jpg"}
                        alt={event.name || "Event Image"}
                        height={1000}
                        width={1000}
                        quality={100}
                        className="absolute top-0 left-0 opacity-40"
                     />
                     <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-white" />
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>

         {/* Custom Navigation Arrows */}
         <button className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 md:left-8">
            <ChevronLeft className="size-6 text-black transition-all duration-200 hover:size-9" />
         </button>

         <button className="swiper-button-next-custom absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 md:right-8">
            <ChevronRight className="size-6 text-black transition-all duration-200 hover:size-9" />
         </button>
      </div>
   );
}
