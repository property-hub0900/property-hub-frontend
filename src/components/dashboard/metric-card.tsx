export function MetricCard({ value, label, icon }) {
    return (
        <div className="border border-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-3xl font-bold mb-1">{value}</div>
                    <div className="text-sm text-gray-500">{label}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-full">{icon}</div>
            </div>
        </div>
    )
}
