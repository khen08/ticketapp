"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

type Technician = {
  id: number;
  name: string;
  ticketCount: number;
};

const TopCarousel = () => {
  const [topTechnicians, setTopTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchTopTechnicians = async () => {
      const response = await fetch("/api/users");
      const data: Technician[] = await response.json();
      setTopTechnicians(data);
    };

    fetchTopTechnicians();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <Trophy className="text-yellow-500" />
            Top Technicians <Trophy className="text-yellow-500" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Carousel>
            <div className="absolute left-9 top-1/2 transform -translate-y-1/2 z-10">
              <CarouselPrevious />
            </div>
            <CarouselContent>
              {topTechnicians.map((technician) => (
                <CarouselItem key={technician.id}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-rose-600 text-white">
                          {technician.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-center w-full justify-center mt-2 font-bold">
                      {technician.name}
                    </div>
                    <p className="flex items-center justify-center mt-2">
                      Tickets Assigned: {technician.ticketCount}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute right-9 top-1/2 transform -translate-y-1/2 z-10">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCarousel;
