/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Star, Calendar, Fuel, Zap, Users, Gauge, Shield, Package } from 'lucide-react';
import api from '../api/client';

interface Review {
    review_text: string;
    rating: number;
}

interface RecommendedCar {
    id: number;
    make: string;
    model: string;
    variant: string;
    body_type: string;
    fuel_type: string;
    transmission: string;
    seating_capacity: number;
    price_lakh: number;
    mileage_kmpl: number;
    engine_cc: number;
    power_bhp: number;
    safety_rating: number;
    boot_space_liters: number;
    score: number;
    reviews: Review[];
}

interface Preferences {
    budget: number;
    fuel_type: string;
    body_type: string;
    priorities: string[];
}

interface HistoryEntry {
    id: number;
    session_id: string;
    preferences_json: Preferences;
    ai_summary: string;
    created_at: string;
    recommended_car: RecommendedCar;
}


function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="h-12 bg-slate-100 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-slate-300 mb-4">
                <Package size={48} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No recommendation history yet</h3>
            <p className="text-slate-600 text-center max-w-sm">
                Start exploring and get personalized car recommendations. Your history will appear here.
            </p>
        </div>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium mb-4">Failed to load recommendation history</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
    const car = entry.recommended_car;
    const prefs = entry.preferences_json;
    const date = new Date(entry.created_at);
    const dateStr = date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const avgRating =
        car.reviews.length > 0 ? (car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length).toFixed(1) : 'N/A';

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-slate-600">{car.variant}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                            <Star size={16} className="text-blue-600 fill-blue-600" />
                            <span className="font-semibold text-blue-900">{car.score}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm whitespace-nowrap">
                            <Calendar size={16} />
                            <span>{dateStr}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary */}
            <div className="px-6 py-4 bg-blue-50 border-b border-slate-200">
                <p className="text-slate-700 leading-relaxed">{entry.ai_summary}</p>
            </div>

            {/* Car Details */}
            <div className="px-6 py-5 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-600 text-xs font-medium">₹{car.price_lakh}L</span>
                        </div>
                        <p className="text-xs text-slate-600">Price</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <Fuel size={14} className="text-slate-600" />
                            <span className="text-slate-600 text-xs font-medium">{car.fuel_type}</span>
                        </div>
                        <p className="text-xs text-slate-600">Fuel Type</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <Zap size={14} className="text-slate-600" />
                            <span className="text-slate-600 text-xs font-medium">{car.transmission}</span>
                        </div>
                        <p className="text-xs text-slate-600">Transmission</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <Gauge size={14} className="text-slate-600" />
                            <span className="text-slate-600 text-xs font-medium">{car.mileage_kmpl} km/l</span>
                        </div>
                        <p className="text-xs text-slate-600">Mileage</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <Shield size={14} className="text-slate-600" />
                            <span className="text-slate-600 text-xs font-medium">{car.safety_rating}/5</span>
                        </div>
                        <p className="text-xs text-slate-600">Safety</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-slate-600" />
                            <span className="text-slate-600 text-xs font-medium">{car.seating_capacity}</span>
                        </div>
                        <p className="text-xs text-slate-600">Seats</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-slate-600 text-xs font-medium">{car.boot_space_liters}L</div>
                        <p className="text-xs text-slate-600">Boot Space</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-slate-600 text-xs font-medium">{car.power_bhp} BHP</div>
                        <p className="text-xs text-slate-600">Power</p>
                    </div>
                </div>
            </div>

            {/* User Preferences */}
            <div className="px-6 py-5 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Your Preferences</h4>
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-block text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                            Budget: ₹{prefs.budget}L
                        </span>
                        <span className="inline-block text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                            {prefs.body_type}
                        </span>
                        <span className="inline-block text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                            {prefs.fuel_type}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {prefs.priorities.map((priority) => (
                            <span key={priority} className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                                {priority}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Owner Reviews */}
            {car.reviews.length > 0 && (
                <div className="px-6 py-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Owner Reviews</h4>
                    <div className="space-y-3">
                        {car.reviews.map((review, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm text-slate-700 leading-relaxed flex-1">{review.review_text}</p>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        <Star size={14} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-medium text-slate-900">{review.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {car.reviews.length > 0 && (
                            <p className="text-xs text-slate-600 text-center mt-2">
                                Average rating: <span className="font-semibold">{avgRating}</span>
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        setError(false);
        try {
            // Simulate API call with mock data
            let sessionId = localStorage.getItem('session_id') || '';
            if (!sessionId) {
                localStorage.setItem('session_id', crypto.randomUUID());
            }
            sessionId = localStorage.getItem('session_id') || '';
            const response = await api.get(`/cars/history/${sessionId}`);
            if(response.data.history.length==0) {
                setHistory([]);
                return;
            }
            setHistory(response.data.history);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Recommendation History</h1>
                    <p className="text-slate-600">View your past car recommendations and comparisons</p>
                </div>

                {/* Content */}
                {loading && <LoadingSkeleton />}
                {error && <ErrorState onRetry={fetchHistory} />}
                {!loading && !error && history.length === 0 && <EmptyState />}
                {!loading && !error && history.length > 0 && (
                    <div className="space-y-4">
                        {history.map((entry) => (
                            <HistoryCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
