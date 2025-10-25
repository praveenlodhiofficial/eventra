"use client";

import { getUpcomingEvents } from "@/features/event/event.action";
import { Event } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "@/styles/swiper.style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface EventWithUser extends Event {
   user: {
      name: string;
      email: string;
   };
}

export default function EventCarousel() {
   const progressCircle = useRef<SVGSVGElement>(null);
   const progressContent = useRef<HTMLSpanElement>(null);
   const [events, setEvents] = useState<EventWithUser[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            const result = await getUpcomingEvents(5);
            if (result.success && result.data) {
               setEvents(result.data);
            }
         } catch (error) {
            console.error("Failed to fetch events:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchEvents();
   }, []);

   const onAutoplayTimeLeft = (s: unknown, time: number, progress: number) => {
      if (progressCircle.current) {
         progressCircle.current.style.setProperty("--progress", String(1 - progress));
      }
      if (progressContent.current) {
         progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
      }
   };


   if (loading) {
      return (
         <div className="flex h-[70vh] w-full items-center justify-center">
            <div className="text-center">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
               <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
         </div>
      );
   }

   if (events.length === 0) {
      return (
         <div className="flex h-[70vh] w-full items-center justify-center">
            <div className="text-center">
               <h3 className="text-xl font-semibold text-gray-800">No Upcoming Events</h3>
               <p className="mt-2 text-gray-600">Check back later for new events!</p>
            </div>
         </div>
      );
   }

   return (
      <div className="h-[70vh] w-full">
         <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
               delay: 4000,
               disableOnInteraction: false,
            }}
            pagination={{
               clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper h-full"
         >
            {events.map((event) => (
               <SwiperSlide key={event.id}>
                  <div className="flex h-full w-full bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl overflow-hidden shadow-2xl">
                     {/* Left Panel - Event Information */}
                     <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
                        {/* Date and Time */}
                        <div className="text-sm text-gray-600 font-medium">
                           {new Date(event.startDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                           })}
                        </div>

                        {/* Event Title */}
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                           {event.name}
                        </h2>

                        {/* Location */}
                        <div className="text-lg text-gray-700">
                           {event.location}
                        </div>

                        {/* Price */}
                        <div className="text-xl font-semibold text-gray-900">
                           {event.ticketType === 'FREE' ? 'Free' : 'Paid Event'}
                        </div>

                        {/* Book Tickets Button */}
                        <Link 
                           href={`/events/${event.id}`}
                           className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors w-fit"
                        >
                           Book tickets
                        </Link>
                     </div>

                     {/* Right Panel - Event Image */}
                     <div className="flex-1 relative">
                        {event.coverImageUrl ? (
                           <Image
                              src={event.coverImageUrl}
                              alt={event.name}
                              fill
                              className="object-cover"
                              priority
                           />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                              <div className="text-center text-white p-8">
                                 <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                                 <p className="text-lg opacity-90">No image available</p>
                              </div>
                           </div>
                        )}
                        
                        {/* Image Overlay Text */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-6">
                           <div className="text-white">
                              <div className="text-sm font-medium opacity-90">{event.user.name}</div>
                              <div className="text-2xl font-bold mt-1">{event.name.toUpperCase()}</div>
                           </div>
                           <div className="text-white">
                              <div className="text-lg font-semibold">{event.eventType}</div>
                              <div className="text-sm opacity-90">{event.location.toUpperCase()}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </SwiperSlide>
            ))}
            
            <div className="autoplay-progress" slot="container-end">
               <svg viewBox="0 0 48 48" ref={progressCircle}>
                  <circle cx="24" cy="24" r="20"></circle>
               </svg>
               <span ref={progressContent}></span>
            </div>
         </Swiper>
      </div>
   );
}
