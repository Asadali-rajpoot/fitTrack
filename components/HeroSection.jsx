import React from "react";
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa";

export default function HeroSection() {
  return (
    <div className="h-screen relative w-screen bg-hero-bg flex flex-col bg-cover bg-black px-10">
      <Navbar />
      {/* hero content */}
      <div className="w-[520px] absolute top-1/2 -translate-y-1/2 flex flex-col gap-10 "> 
        {/* hero heading */}
        <h1 className="text-[#e0e0e0] font-RubikFont font-bold text-7xl">Elevate your workout</h1>
        {/* hero paragraph */}
        <p className="font-RubikFont text-xl font-normal text-[#bdbdbd]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas non
          consequuntur vitae rerum.
        </p>
        {/* hero button */}
        <Button className="bg-white hover:bg-white/80 text-[#212121] font-RubikFont font-semibold text-sm py-6 px-8 w-fit">Get Started</Button>
        <div className="flex items-center gap-5">
          {[<FaLinkedin />, <FaFacebook />, <AiFillInstagram />].map((item, index) => (
            <div key={index} className="text-white text-2xl">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
