import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Plus, X, Sparkles } from 'lucide-react';
import { analyzeFood } from '../lib/ai';
import { addMeal } from '../lib/storage';
import { FoodAnalysis } from '../lib/types';

interface HomePageProps {
  onMealAdded: () => void;
}

export default function HomePage({ onMealAdded }: HomePageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [added, setAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      setResult(null);
      setAdded(false);
      analyzeImage(base64, mimeType);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFood(base64, mimeType);
      setResult(analysis);
    } catch {
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToDiary = () => {
    if (!result) return;
    addMeal(result);
    setAdded(true);
    onMealAdded();
  };

  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    setAdded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-12 pb-4 px-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-accent" />
          <h1 className="text-2xl font-bold text-white">NutriSnap</h1>
        </div>
        <p className="text-sm text-gray-500">Snap a photo, track your nutrition</p>
      </div>

      {/* Upload Area */}
      {!imagePreview && !isAnalyzing && (
        <div className="px-5 mt-4 animate-fade-in-up">
          <label className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed border-white/10 bg-dark-700/50 cursor-pointer hover:border-accent/30 hover:bg-dark-700 transition-all duration-300 group">
            <div className="p-4 rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Camera size={32} className="text-accent" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Take a Photo</p>
              <p className="text-gray-500 text-sm mt-1">or tap to upload from gallery</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-dark-900 font-semibold text-sm">
              <Upload size={14} />
              Choose Photo
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="px-5 mt-4 animate-fade-in-up">
          <div className="relative rounded-2xl overflow-hidden">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Food"
                className="w-full h-56 object-cover rounded-2xl blur-sm opacity-60"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-ring" />
                <Loader2 size={40} className="text-accent animate-spin relative z-10" />
              </div>
              <p className="text-white font-semibold text-lg">Analyzing...</p>
              <p className="text-gray-400 text-sm">AI is identifying your food</p>
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && !isAnalyzing && (
        <div className="px-5 mt-4 animate-fade-in-up">
          <div className="rounded-2xl bg-dark-700 border border-white/5 overflow-hidden">
            {/* Image + Food Name */}
            <div className="relative">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Food"
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/60 to-transparent" />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-dark-900/80 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white font-bold text-xl">{result.foodName}</p>
                <p className="text-gray-400 text-xs mt-0.5">{result.servingSize}</p>
              </div>
            </div>

            {/* Calories */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">{result.calories}</span>
                <span className="text-gray-500 text-sm font-medium">calories</span>
              </div>
            </div>

            {/* Macro Pills */}
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-macro-protein/15 text-macro-protein text-sm font-semibold">
                P: {result.protein}g
              </span>
              <span className="px-3 py-1.5 rounded-full bg-macro-carbs/15 text-macro-carbs text-sm font-semibold">
                C: {result.carbs}g
              </span>
              <span className="px-3 py-1.5 rounded-full bg-macro-fat/15 text-macro-fat text-sm font-semibold">
                F: {result.fat}g
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-gray-400 text-sm font-medium">
                Fiber: {result.fiber}g
              </span>
            </div>

            {/* Add Button */}
            <div className="px-4 pb-4">
              {added ? (
                <div className="w-full py-3 rounded-xl bg-accent/15 text-accent font-semibold text-center text-sm flex items-center justify-center gap-2">
                  <span className="text-lg">✓</span> Added to Diary
                </div>
              ) : (
                <button
                  onClick={handleAddToDiary}
                  className="w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-dark-900 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Add to Diary
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick tip when idle */}
      {!imagePreview && !isAnalyzing && !result && (
        <div className="px-5 mt-6">
          <div className="rounded-2xl bg-dark-700/50 border border-white/5 p-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-accent font-semibold">Tip:</span> Take a clear photo of your meal from above for the most accurate analysis. Single-plate meals work best!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
