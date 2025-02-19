import React from "react";
import award from "@/public/images/award.png";
import yogamat from "@/public/images/yoga-mat.png";
import equipmentgym from "@/public/images/equipment-gym.png";
import boxingglove from "@/public/images/boxing-glove.png";
import Image from "next/image";
import Rectangle1 from "@/public/images/Rectangle1.png";
import Rectangle2 from "@/public/images/Rectangle2.png";
import Rectangle3 from "@/public/images/Rectangle3.png";

export default function WhyChoseUs() {
  const cards_data = [
    {
      title: "lorem",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      avatar: equipmentgym,
    },
    {
      title: "lorem",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      avatar: award,
    },
    {
      title: "lorem",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      avatar: boxingglove,
    },
    {
      title: "lorem",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      avatar: yogamat,
    },
  ];
  return (
    <div className="w-full h-screen bg-white flex items-center flex-col">
      {/* Headings */}
      <div className="flex justify-center flex-col gap-2 mt-20 items-center">
        <h1 className="font-extrabold text-5xl font-RubikFont text-[#424242]">
          Why Choose Us
        </h1>
        <p className="text-lg font-RubikFont text-gray-400 text-center w-[600px] leading-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et
        </p>
      </div>
      {/* cards section */}
      <div className="flex flex-1 px-10 items-center gap-2">
        {/* content cards */}
        <div className="grid grid-cols-2 gap-10">
          {/* indivisual card */}
          {cards_data.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* card avatar */}
              <div className="size-10 rounded-full flex items-center justify-center bg-[#424242] overflow-hidden">
                <Image src={item.avatar} className="h-6 w-6" />
              </div>
              <div>
                {/* card content */}
                <h1 className="font-RubikFont text-2xl font-semibold text-[#424242]">
                  {item.title}
                </h1>
                {/* card description */}
                <p className="text-[#9E9E9E] text-lg font-normal w-80">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* grid cards */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Image src={Rectangle1} className="h-[250px] " />
            <Image src={Rectangle2} className="h-[250px]" />
          </div>
          {/* big rectangle */}
          <Image src={Rectangle3} className="h-[500px]" />
        </div>
      </div>
    </div>
  );
}
