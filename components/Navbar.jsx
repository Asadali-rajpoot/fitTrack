import { Button } from "./ui/button";
import logo from "@/public/images/logo.png"
import Image from "next/image";

export default function Navbar(props) {
  return (
    <div className="flex justify-between bg-transparent py-8 ">
      {/* logo */}
      <Image src={logo} alt="logo" className="h-8" quality={100} />
      {/* nav menu */}
      <ul className="flex items-center gap-5 *:font-RubikFont font-medium text-[#9e9e9e]">
        {/* individual items */}
        <li className="text-white">Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
      </ul>
      {/* join now button */}
      <Button className="bg-white text-[#212121] font-RubikFont font-semibold text-sm hover:bg-white/80">Join now</Button>
    </div>
  )
}
