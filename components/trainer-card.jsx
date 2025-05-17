import Image from "next/image"


export default function TrainerCard({ imageSrc }) {
  return (
    <div className="overflow-hidden h-[300px] w-[400px] rounded-xl">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt="Trainer"
        width={300}
        height={300}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}
