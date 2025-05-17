  
  export default function FeatureCard({ number, title, description }) {
    return (
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
            {number}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    )
  }
  