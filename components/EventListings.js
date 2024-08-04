import React, { startTransition } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function EventListings(props) {
  const [apiUpcomingEvents, setApiUpcomingEvents] = useState([]);
  useEffect(() => {
    fetch("/api/get/events")
      .then((response) => response.json())
      .then((data) => {
        startTransition(() => {
          const events = data.map((event) => {
            const startDate = new Date(event.start_date);
            return {
              ...event,
              display_date: {
                month: startDate.toLocaleString("default", { month: "short" }),
                day: startDate.getUTCDate(),
                time: startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            };
          });
          setApiUpcomingEvents(events);
        });
      });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-8">
        {apiUpcomingEvents.map((event) => {
          return (
            <Link key={event.uuid} href={event.source_url}>
              <div className="flex flex-col w-full bg-white rounded shadow-lg hover:shadow-cyan-800 place-self-start mb-8 h-full hover:shadow-cyan">
                <div className="w-full h-56 bg-top bg-cover rounded-t">
                  <Image
                    src={event.image_url}
                    className="object-cover w-full h-full rounded-t"
                    alt="image of the venue for the event"
                    height="300"
                    width="300"
                  />
                </div>
                <div className="flex flex-col w-full h-full md:flex-row">
                  <div className="flex flex-row justify-around p-4 font-bold leading-none text-gray-800 uppercase bg-gray-400 rounded-bl md:flex-col md:items-center md:justify-center md:w-1/4 ">
                    <div className="md:text-3xl">
                      {event.display_date.month}
                    </div>
                    <div className="md:text-6xl">{event.display_date.day}</div>
                    <div className="md:text-xl text-center">
                      {event.display_date.time}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-4 font-normal text-gray-800 md:w-3/4">
                    <h1 className="text-4xl font-bold leading-none tracking-tight text-gray-800">
                      {event.name}
                    </h1>
                    <p className="leading-normal h-40 overflow-scroll">
                      {event.description}
                    </p>
                    <div className="flex flex-row items-center text-gray-700">
                      <div className=" font-bold">{event.venue.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}