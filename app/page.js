"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PricingCard from "@/components/pricing-card"
import StatCard from "@/components/stat-card"
import FeatureCard from "@/components/feature-card"
import TrainerCard from "@/components/trainer-card"
import heroBackground from "@/public/images/hero_backgound.png"
import { Instagram, Twitter, Facebook, Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen font-RubikFont">
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Dumbbell className="h-6 w-6 text-white" />
              <span className="text-white">FIT</span>
              <span className="text-white">TRACK</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm text-white font-medium hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium  text-white hover:text-gray-300">
              About
            </Link>
            <Link href="/services" className="text-sm font-medium  text-white hover:text-gray-300">
              Services
            </Link>
            <Link href="/contact" className="text-sm font-medium  text-white hover:text-gray-300">
              Contact
            </Link>
          </nav>

          <Button onClick={() => router.push("/auth/register")} className="bg-white text-black hover:bg-gray-200">Join Now</Button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative bg-black text-white ">
        <div className="container mx-auto px-4 flex flex-col justify-center min-h-[600px]">
          <div className="max-w-xl z-10 space-y-8 mt-20 mb-40">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Elevate your workout</h1>
            <p className="text-gray-300 mb-8 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-white text-black hover:bg-gray-200 px-8">Get Started</Button>

            <div className="flex space-x-2 mt-6 *:transition-all *:duration-300">
              <div className="p-2 hover:bg-white hover:text-black bg-gray-600 rounded-full cursor-pointer">
                <Twitter />
              </div>
              <div className="p-2 hover:bg-white hover:text-black bg-gray-600 rounded-full cursor-pointer">
                <Facebook />
              </div>
              <div className="p-2 hover:bg-white hover:text-black bg-gray-600 rounded-full cursor-pointer">
                <Instagram />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute bottom-0 left-0 grid grid-cols-1 md:grid-cols-4 gap-8 bg-[#111] w-full py-8 z-10">
            <StatCard value="8+" label="Years Experience" />
            <StatCard value="10+" label="Professional Trainers" />
            <StatCard value="700+" label="Happy Clients" />
            <StatCard value="99%" label="Success Rate" />
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBackground}
            alt="Fitness training"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid grid-cols-1 gap-6">
              <FeatureCard
                number="01"
                title="Lorem ipsum amet"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec."
              />
              <FeatureCard
                number="02"
                title="Lorem ipsum amet"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/images/Rectangle1.png"
                alt="Gym equipment"
                width={250}
                height={300}
                className="object-cover rounded-xl w-full h-full"
              />
              <Image
                src="/images/Rectangle2.png"
                alt="Fitness training"
                width={250}
                height={300}
                className="object-cover rounded-xl w-full h-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:order-3">
              <Image
                src="/images/Rectangle2.png"
                alt="Gym equipment"
                width={250}
                height={300}
                className="object-cover rounded-xl w-full h-full"
              />
              <Image
                src="/images/Rectangle1.png"
                alt="Fitness training"
                width={250}
                height={300}
                className="object-cover rounded-xl w-full h-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:order-4">
              <FeatureCard
                number="03"
                title="Lorem ipsum amet"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec."
              />
              <FeatureCard
                number="04"
                title="Lorem ipsum amet"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex space-x-4">
              <Image
                src="/images/Frame3.png"
                alt="Coach 1"
                width={300}
                height={400}
                className="object-cover rounded-xl"
              />
              <Image
                src="/images/Frame.png"
                alt="Coach 2"
                width={300}
                height={400}
                className="object-cover mt-8"
              />
            </div>

            <div className="md:w-2/3">
              <span className="text-sm uppercase tracking-wider text-gray-500">PROFESSIONAL & CERTIFIED</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">Coaches</h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,
                pulvinar dapibus leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus
                nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">View More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Trainers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Meet Our Trainers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,
              pulvinar dapibus leo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <TrainerCard imageSrc="/images/Frame.png" />
            <TrainerCard imageSrc="/images/Frame2.png" />
            <TrainerCard imageSrc="/images/Frame3.png" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrainerCard imageSrc="/images/Frame4.png" />
            <TrainerCard imageSrc="/images/Frame5.png" />
            <TrainerCard imageSrc="/images/Frame6.png" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-[#9E9E9E] text-2xl tracking-[0.2px]">Pricing Plan</h1>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">JOIN TODAY</h2>
            <div className="flex items-center space-x-2 shadow-lg border py-2 rounded-xl px-3">
              <span className="text-sm cursor-pointer px-3">Monthly</span>
              <span className="text-sm bg-black text-white rounded-lg py-2 px-4 cursor-pointer">Yearly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              title="Basic"
              price="$10"
              period="/ Month"
              features={[
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
              ]}
              variant="light"
            />

            <PricingCard
              title="Standard"
              price="$15"
              period="/ Month"
              features={[
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
              ]}
              variant="dark"
              recommended
            />

            <PricingCard
              title="Premium"
              price="$20"
              period="/ Month"
              features={[
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
                "Lorem ipsum dolor sit amet",
              ]}
              variant="light"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 bg-black text-white">
        <Image src="/images/Footer-Bg.png" quality={100} alt="Call to action section" className="absolute object-cover inset-0 z-10 h-full w-full" fill />
        <div className="container absolute top-1/2 -translate-y-1/2 tex-white mx-auto z-20 text-center">
          <h2 className="text-xl mb-4">Sign Up Now</h2>
          <p className="text-2xl font-bold">+92 303 9680010</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold mb-4 text-xl">
                <Dumbbell className="h-6 w-6 text-black" />
                <span className="text-black">FIT</span>
                <span className="text-black">TRACK</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="md:col-span-1">
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">123 Street</li>
                <li className="text-gray-600">City, State</li>
                <li className="text-gray-600">info@example.com</li>
                <li className="text-gray-600">+1 234 567 890</li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="font-bold mb-4">Social Media</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
