  export default function StatCard({ value, label }) {
    return (
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    )
  }
  