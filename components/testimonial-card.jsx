import { Star } from "lucide-react"


export default function TestimonialCard({ name, rating, text }) {
  return (
    <div className="p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">{name}</h3>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-black fill-black" : "text-gray-300"}`} />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  )
}
