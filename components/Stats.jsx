import React from 'react'

export default function Stats() {
    const data = [
        {
            title: "Years of Service",
            value: "5+",
        },
        {
            title: "Certified Trainers",
            value: "10+",
        },
        {
            title: "Happy Members",
            value: "786+",
        },
        {
            title: "Customer Satisfaction",
            value: "95%",
        },
    ]
  return (
    <div className="bg-black text-white w-full flex justify-around py-5">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-RubikFont font-bold">{item.value}</h1>
            <p className="text-sm font-RubikFont font-medium">{item.title}</p>
        </div>
      ))}
    </div>
  )
}
