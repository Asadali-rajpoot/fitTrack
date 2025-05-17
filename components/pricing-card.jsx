import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PricingCard({
    title,
    price,
    period,
    features,
    variant = "light",
    recommended = false,
}) {
    return (
        <div
            className={`border ${
                variant === "dark"
                    ? "bg-black text-white"
                    : "bg-white text-black"
            } p-6 rounded-xl flex flex-col h-full shadow-xl`}
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="text-sm ml-1 font-bold opacity-70">{period}</span>
                </div>
            </div>

            <p className={`text-[#E0E0E0] font-RubikFont font-normal ${variant === "dark" ? "text-[#E0E0E0]" : "text-[#9E9E9E]"} text-sm mb-6`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt
            </p>

            <ul className="space-y-3 mb-8 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle
                            className={`w-5 h-5 mt-0.5 ${
                                variant === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                className={`mt-auto w-full ${
                    variant === "dark"
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                } rounded-xl`}
            >
                Choose Plan
            </Button>
        </div>
    );
}
