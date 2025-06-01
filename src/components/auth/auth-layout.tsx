import React from "react";
import { Outlet } from "react-router-dom";
import { Slider, type Slide } from "../ui/slider";
import image1 from "../../assets/images/1.jpg";
import image2 from "../../assets/images/2.jpg";
import image3 from "../../assets/images/3.jpeg";

const slides: Slide[] = [
  {
    title: "Streamline Your Enterprise Operations",
    description:
      "Manage inventory, track services, and control your business from one central dashboard.",
    image: image1,
  },
  {
    title: "Real-time Analytics and Reporting",
    description:
      "Make data-driven decisions with our comprehensive analytics and reporting tools.",
    image: image2,
  },
  {
    title: "Secure and Scalable Platform",
    description:
      "Enterprise-grade security and scalability to grow with your business needs.",
    image:image3,
  },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Slider Section */}
      <div className="hidden md:block">
        <Slider slides={slides} className="h-full" />
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
