import { useState } from 'react'
import api from '../api/client'

interface RecommendationResult {
    recommended_car: {
        id: number
        make: string
        model: string
        variant: string
        body_type: string
        fuel_type: string
        transmission: string
        seating_capacity: number
        price_lakh: number
        mileage_kmpl: number
        engine_cc: number
        power_bhp: number
        safety_rating: number
        boot_space_liters: number
        score: number
        reviews: Array<{
            rating: number
            review_text: string
        }>
    }
    alternatives: Array<{
        id: number
        make: string
        model: string
        variant: string
        price_lakh: number
        fuel_type: string
        body_type: string
        score: number
        reviews: Array<{
            rating: number
            review_text: string
        }>
    }>
    ai_summary: string
}

const bodyTypes = ['SUV', 'Sedan', 'Hatchback']
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const seatingOptions = ['4', '5', '6', '7']
const usageOptions = ['City', 'Highway', 'Family', 'Mixed']
const priorityOptions = ['Safety', 'Mileage', 'Performance', 'Family']
const transmissionOptions = ['Automatic', 'Manual']

export default function RecommendPage() {
    const [budget, setBudget] = useState('')
    const [bodyType, setBodyType] = useState('SUV')
    const [fuelType, setFuelType] = useState('Petrol')
    const [seating, setSeating] = useState('4')
    const [usage, setUsage] = useState('')
    const [transmission, setTransmission] = useState('Manual')
    const [priorities, setPriorities] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState<RecommendationResult | null>(null)

    const togglePriority = (priority: string) => {
        setPriorities((prev) =>
            prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        const sessionId = localStorage.getItem("session_id");
        if(!sessionId) {
            localStorage.setItem("session_id", crypto.randomUUID());
        }
        e.preventDefault()
        setError('')

        if (!budget) {
            setError('Please fill in all required fields')
            return
        }

        setLoading(true)

        const payload = {
            session_id: localStorage.getItem("session_id"),
            budget: parseFloat(budget),
            body_type: bodyType,
            fuel_type: fuelType,
            seating_capacity: parseInt(seating),
            usage,
            priorities,
            transmission
        }
        console.log('Submitting preferences:', payload)
        try {
            const response = await api.post('/cars/recommend', payload);
            console.log("response: ", response.data);
            if (!response.data || !response.data.recommended_car) {
                setError('No cars found matching your preferences. Please try adjusting your criteria.');
                setResult(null);
                return;
            }
            setResult(response.data);
        } catch (err) {
            console.error("Error fetching recommendation: ", err);
            setError('Failed to fetch recommendation. Please try again later.');
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Car Recommendation Engine</h1>
                    <p className="text-lg text-slate-600">
                        Find your perfect car based on your preferences and budget
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT: Form Panel */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Preferences</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget (in lakhs)</label>
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        min={8}
                                        placeholder="Enter budget in lakhs"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Body Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Body Type
                                    </label>
                                    <select
                                        value={bodyType}
                                        onChange={(e) => setBodyType(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select body type</option>
                                        {bodyTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Fuel Type
                                    </label>
                                    <select
                                        value={fuelType}
                                        onChange={(e) => setFuelType(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select fuel type</option>
                                        {fuelTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Seating Capacity */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Seating Capacity
                                    </label>
                                    <select
                                        value={seating}
                                        onChange={(e) => setSeating(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select seating</option>
                                        {seatingOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option} Seater
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transmission */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Transmission
                                    </label>
                                    <select
                                        value={transmission}
                                        onChange={(e) => setTransmission(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select transmission</option>
                                        {transmissionOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Usage */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Usage</label>
                                    <select
                                        value={usage}
                                        onChange={(e) => setUsage(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select usage</option>
                                        {usageOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priorities */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Priorities
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {priorityOptions.map((priority) => (
                                            <button
                                                key={priority}
                                                type="button"
                                                onClick={() => togglePriority(priority)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priorities.includes(priority)
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400'
                                                    }`}
                                            >
                                                {priority}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-6 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Finding your car...
                                        </>
                                    ) : (
                                        'Get Recommendation'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Results Panel */}
                    <div className="lg:col-span-3">
                        {result ? (
                            <div className="space-y-6">
                                {/* AI Summary Card */}
                                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                                    <h3 className="text-sm font-semibold text-blue-900 mb-2">AI Summary</h3>
                                    <p className="text-lg text-blue-900 leading-relaxed">{result.ai_summary}</p>
                                </div>

                                {/* Main Recommendation Card */}
                                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6 bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-900">
                                                    {result.recommended_car.make} {result.recommended_car.model}
                                                </h2>
                                                <p className="text-slate-600 text-lg">
                                                    {result.recommended_car.variant}
                                                </p>
                                            </div>
                                            <div className="bg-blue-600 text-white rounded-full px-4 py-2 text-center">
                                                <div className="text-2xl font-bold">{result.recommended_car.score}</div>
                                                <div className="text-xs">Score</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Price */}
                                        <div className="border-b border-slate-200 pb-6">
                                            <p className="text-slate-600 text-sm mb-1">Starting Price</p>
                                            <p className="text-4xl font-bold text-slate-900">
                                                ₹{result.recommended_car.price_lakh}L
                                            </p>
                                        </div>

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Fuel Type</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.fuel_type}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Transmission</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.transmission}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Mileage</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.mileage_kmpl} km/l
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Safety Rating</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {'⭐'.repeat(result.recommended_car.safety_rating)}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Seating</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.seating_capacity} Seater
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Boot Space</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.boot_space_liters}L
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Engine</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.engine_cc}cc
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-slate-600 text-sm mb-1">Power</p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {result.recommended_car.power_bhp} bhp
                                                </p>
                                            </div>
                                        </div>

                                        {/* Body Type */}
                                        <div className="pt-4">
                                            <span className="inline-block bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
                                                {result.recommended_car.body_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                {result.recommended_car.reviews.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">Owner Reviews</h3>
                                        <div className="space-y-3">
                                            {result.recommended_car.reviews.map((review, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <span className="text-sm font-medium text-slate-700">
                                                            {'⭐'.repeat(review.rating)}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{review.review_text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Alternatives Section */}
                                {result.alternatives.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">Alternative Options</h3>
                                        <div className="space-y-4">
                                            {result.alternatives.map((car) => (
                                                <div
                                                    key={car.id}
                                                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">
                                                                {car.make} {car.model}
                                                            </h4>
                                                            <p className="text-sm text-slate-600">{car.variant}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-slate-900">₹{car.price_lakh}L</p>
                                                            <p className="text-sm text-slate-600">Score: {car.score}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded">
                                                            {car.fuel_type}
                                                        </span>
                                                        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded">
                                                            {car.body_type}
                                                        </span>
                                                    </div>

                                                    {car.reviews.length > 0 && (
                                                        <p className="text-xs text-slate-600 mt-3 italic">
                                                            &quot;{car.reviews[0].review_text}&quot;
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <svg
                                    className="mx-auto h-16 w-16 text-slate-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    Fill in your preferences
                                </h3>
                                <p className="text-slate-600">
                                    Complete the form on the left to get personalized car recommendations
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}