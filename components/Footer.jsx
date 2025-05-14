import React from "react";
import FooterBg from "@/public/images/Footer-Bg.png";
import Image from "next/image";
import logo from "@/public/images/logo_footer.png";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

export default function Footer() {
  return (
    <div className="mt-20">
      {/* contact */}
      <div className="h-[400px] relative w-full overflow-hidden">
        <Image src={FooterBg} alt="soem" className="size-full object-cover" />
        <div className="absolute flex items-center flex-col gap-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="font-RubikFont text-white text-lg">Call Us</p>
          <h1 className="font-RubikFont text-white text-2xl font-bold">
            +92-837-6465
          </h1>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-16 py-16">
        {/* logo and contact */}
        <div className="flex flex-col gap-4">
          <Image src={logo} alt="logo" className="h-8" quality={100} />
          {/* company description */}
          <p className="w-60">Recusandae quos nesciunt veniam eum quia </p>
          {/* email */}
          <h3>alirjpot8@gmail.com</h3>

          <div className="flex items-center gap-5">
            {[<FaLinkedin />, <FaFacebook />, <AiFillInstagram />].map(
              (item, index) => (
                <div key={index} className="text-black text-2xl">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
        {/* links */}
        <div className="flex items-center gap-16">
          <div>
            <h2>Quick Links</h2>
            {/* list of links */}
            <ul className="flex flex-col gap-2">
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
            </ul>
          </div>
          <div>
            <h2>Quick Links</h2>
            {/* list of links */}
            <ul className="flex flex-col gap-2">
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
            </ul>
          </div>
          <div>
            <h2>Quick Links</h2>
            {/* list of links */}
            <ul className="flex flex-col gap-2">
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
            </ul>
          </div>
          <div>
            <h2>Quick Links</h2>
            {/* list of links */}
            <ul className="flex flex-col gap-2">
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
              <li className="text-md text-gray-300 font-RubikFont">
                lorem or some lins
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
