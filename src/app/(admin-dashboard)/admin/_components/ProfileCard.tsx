import { useEffect, useState } from "react";
import Image from "next/image";
import person from "../../../../../public/images/profile.jpg";
import { MapPin } from "lucide-react";

export default function ProfileCard() {
  const [location, setLocation] = useState<string>("Loading location...");

  useEffect(() => {
    // Get user's coordinates
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using OpenStreetMap's Nominatim service for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            // Extract city and country from the response
            const city =
              data.address.city || data.address.town || data.address.village;
            const country = data.address.country;
            setLocation(`${city}, ${country}`);
          } catch (error) {
            setLocation("Location unavailable");
          }
        },
        (error) => {
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <div className="flex flex-col divide-y divide-gray-200 rounded-[20px] bg-white text-center h-full">
      <div className="flex flex-1 flex-col p-8">
        <Image
          alt=""
          src={person}
          className="mx-auto size-24 shrink-0 rounded-full"
        />
        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          Mahdi Mohammadi
        </h3>
        <div className="mt-1 flex gap-1 justify-center items-center text-[#A3AED0]">
          <MapPin className="size-4 shrink-0" />
          <span className="text-sm font-medium">{location}</span>
        </div>
      </div>
    </div>
  );
}
