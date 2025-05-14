import React from "react";
import frame1 from "@/public/images/Frame.png";
import frame2 from "@/public/images/Frame2.png";
import frame3 from "@/public/images/Frame3.png";
import frame4 from "@/public/images/Frame4.png";
import frame5 from "@/public/images/Frame5.png";
import frame6 from "@/public/images/Frame6.png";
import Image from "next/image";

export default function MeetOurTrainers() {
  return (
    <>
      <div className="h-screen w-full flex flex-col items-center">
        {/* section heading */}
        <div className="flex flex-col items-center gap-4 justify-center mt-10">
          <h1 className="font-extrabold text-5xl font-RubikFont text-[#424242]">
            Meet Our Trainers
          </h1>
          <p className="font-medium font-RubikFont text-lg leading-7 text-gray-500 text-center w-[600px]">
            Effortless Gym Management – Optimize, Automate, and Grow with
            FitTrack
          </p>
        </div>
        {/* grid layout */}
        <div className="flex flex-col gap-4 mt-5">
          {/* first row */}
          <div className="flex gap-2 h-60">
            <Image src={frame1} alt="frame1" className="h-full" />
            <Image src={frame2} alt="frame2" className="h-full" />
            <Image src={frame3} alt="frame3" className="h-full" />
          </div>
          {/* second row */}
          <div className="flex gap-2 h-60">
            <Image src={frame4} alt="frame4" className="h-full" />
            <Image src={frame5} alt="frame5" className="h-full" />
            <Image src={frame6} alt="frame6" className="h-full" />
          </div>
        </div>
      </div>
    </>
  );
}
