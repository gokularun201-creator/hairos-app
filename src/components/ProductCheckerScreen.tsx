import React, { useState } from 'react';
import { HairScanResult, ProductCheckResult, ShelfProduct } from '../types';
import { checkProductCompatibility } from '../services/planGenerator';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  ShieldCheck, 
  Camera, 
  Plus, 
  Bookmark, 
  BookmarkCheck, 
  HelpCircle, 
  Layers, 
  Check, 
  Info,
  Droplets,
  Search,
  Upload
} from 'lucide-react';

interface ProductCheckerScreenProps {
  scanResult: HairScanResult | null;
  onSaveToShelf?: (product: ShelfProduct) => void;
  onOpenScanModal?: () => void;
}

const PRESET_PRODUCTS = [
  {
    name: 'Rosemary Mint Strengthening Scalp Oil',
    brand: 'Botanical Labs',
    category: 'oil',
    ingredients: 'Glycine Soja Oil, Ricinus Communis Seed Oil, Rosmarinus Officinalis Leaf Oil, Mentha Piperita Oil, Eucalyptus Globulus Leaf Oil, Melaleuca Alternifolia Leaf Oil, Biotin, Tocopheryl Acetate.'
  },
  {
    name: 'Clarifying Apple Cider Vinegar & Tea Tree Cleanser',
    brand: 'Scalp Cleanse',
    category: 'shampoo',
    ingredients: 'Water/Aqua, Sodium C14-16 Olefin Sulfonate, Cocamidopropyl Betaine, Apple Cider Vinegar, Melaleuca Alternifolia Leaf Oil, Salicylic Acid, Glycerin, Phenoxyethanol, Ethylhexylglycerin.'
  },
  {
    name: 'Hydrating Coconut & Shea Butter Deep Mask',
    brand: 'Nourish Botanics',
    category: 'mask',
    ingredients: 'Aqua, Cetearyl Alcohol, Butyrospermum Parkii (Shea) Butter, Cocos Nucifera (Coconut) Oil, Behentrimonium Methosulfate, Dimethicone, Hydrolyzed Wheat Protein, Panthenol, Fragrance.'
  },
  {
    name: 'Silicone Smoothing Keratin Conditioner',
    brand: 'Luxe Salon Care',
    category: 'conditioner',
    ingredients: 'Water, Cetyl Alcohol, Dimethicone, Cyclopentasiloxane, Amodimethicone, Hydrolyzed Keratin, Behentrimonium Chloride, Isopropyl Alcohol, Methylparaben.'
  },
  {
    name: 'Sulfate-Free Amino Acid Daily Shampoo',
    brand: 'Gentle Pure',
    category: 'shampoo',
    ingredients: 'Aqua, Sodium Cocoyl Isethionate, Disodium Laureth Sulfosuccinate, Cocamidopropyl Hydroxysultaine, Polyquaternium-10, Aloe Barbadensis Leaf Juice, Panthenol, Citric Acid.'
  }
];

export const ProductCheckerScreen: React.FC<ProductCheckerScreenProps> = ({
  scanResult,
  onSaveToShelf,
  onOpenScanModal
}) => {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ShelfProduct['category']>('shampoo');
  const [ingredientsText, setIngredientsText] = useState('');
  const [productPhoto, setProductPhoto] = useState<string | null>(null);

  const [checkResult, setCheckResult] = useState<ProductCheckResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fallback scan if user hasn't scanned hair yet
  const effectiveScan: HairScanResult = scanResult || {
    frontPhotoUrl: '',
    topPhotoUrl: '',
    sidePhotoUrl: '',
    scannedAt: 'Default',
    hairType: 'Wavy',
    texture: 'Medium',
    scalpCondition: 'Balanced',
    frizzLevel: 'Moderate',
    flakingLevel: 'None',
    concerns: ['frizz'],
    overallScore: 80
  };

  const handleApplyPreset = (preset: typeof PRESET_PRODUCTS[0]) => {
    setProductName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category as any);
    setIngredientsText(preset.ingredients);
    setCheckResult(null);
    setIsSaved(false);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductPhoto(event.target?.result as string);
        if (!productName) setProductName('Scanned Bottle Formulation');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!ingredientsText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = checkProductCompatibility(
        productName || 'Hair Care Formulation',
        brand || 'Brand',
        category,
        ingredientsText,
        effectiveScan
      );
      setCheckResult(result);
      setIsAnalyzing(false);
      setIsSaved(false);
    }, 700);
  };

  const handleSaveShelf = () => {
    if (!checkResult || !onSaveToShelf) return;

    const newProduct: ShelfProduct = {
      id: `shelf_${Date.now()}`,
      name: checkResult.productName,
      brand: checkResult.brand,
      category: category,
      status: checkResult.matchPercentage >= 70 ? 'in_use' : 'wishlist',
      ingredients: ingredientsText,
      cleanScore: checkResult.matchPercentage,
      notes: `${checkResult.verdict}. Match: ${checkResult.matchPercentage}%`
    };

    onSaveToShelf(newProduct);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-28">
      {/* Header */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Compatibility</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Should I Buy This?
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Snap or paste any shampoo, serum, oil or conditioner. Hair OS calculates an instant compatibility match for your hair profile.
        </p>
      </div>

      {/* ACTIVE PROFILE CONTEXT */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-300 flex items-center justify-center font-bold text-xs">
            🧠
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Matching Against Your Profile
            </div>
            <div className="text-xs font-extrabold text-teal-300">
              {effectiveScan.hairType} • {effectiveScan.texture} • {effectiveScan.scalpCondition} Scalp
            </div>
          </div>
        </div>

        {onOpenScanModal && (
          <button
            onClick={onOpenScanModal}
            className="text-[11px] font-bold text-slate-400 hover:text-white underline"
          >
            {scanResult ? 'Rescan' : 'Set Profile'}
          </button>
        )}
      </div>

      {/* QUICK PRESETS CAROUSEL */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Try Popular Formulations
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {PRESET_PRODUCTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left text-slate-300 transition-all active:scale-95 space-y-0.5 max-w-[210px]"
            >
              <div className="text-xs font-black text-white truncate">{p.name}</div>
              <div className="text-[10px] text-teal-400 font-semibold">{p.category.toUpperCase()} • {p.brand}</div>
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3.5 shadow-xl">
        {/* Category Selector */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Product Category
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(['shampoo', 'conditioner', 'oil', 'serum', 'mask', 'leave_in'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-xl font-bold capitalize transition-colors ${
                  category === cat
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Product & Brand Name */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rosemary Scalp Oil"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Brand (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Botanical Labs"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Photo Upload or Capture Bottle */}
        <div className="flex items-center gap-2">
          <label className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-teal-500/60 cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-300 transition-colors">
            <Camera className="w-4 h-4 text-teal-400" />
            <span>{productPhoto ? 'Photo Attached ✓' : 'Snap Bottle / Label Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoCapture}
            />
          </label>
        </div>

        {/* Ingredients Text Area */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Ingredients List (INCI)
          </label>
          <textarea
            rows={4}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Paste ingredients (e.g. Aqua, Cetearyl Alcohol, Rosemary Oil, Dimethicone...)"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 leading-relaxed font-mono"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!ingredientsText.trim() || isAnalyzing}
          className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform"
        >
          {isAnalyzing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Formulation...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Check Compatibility</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS DISPLAY: "PRODUCT CHECK" */}
      {checkResult && (
        <div className="rounded-3xl bg-slate-900 border border-teal-500/40 p-5 space-y-4 shadow-2xl animate-fadeIn">
          {/* Header & Match Score */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">
                PRODUCT CHECK
              </span>
              <h2 className="text-base font-black text-white">
                {checkResult.productName}
              </h2>
              <p className="text-[11px] text-slate-400">
                {checkResult.brand} • {checkResult.category.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30">
              <span className="text-xl font-black text-teal-300 leading-none">
                {checkResult.matchPercentage}%
              </span>
              <span className="text-[9px] font-bold text-teal-400 tracking-tight mt-0.5">
                MATCH
              </span>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-3 rounded-2xl border text-xs font-black flex items-center gap-2.5 ${
            checkResult.verdictColor === 'emerald'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : checkResult.verdictColor === 'teal'
              ? 'bg-teal-950/40 border-teal-500/40 text-teal-300'
              : checkResult.verdictColor === 'amber'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Verdict: {checkResult.verdict}</span>
          </div>

          {/* Good points */}
          <div className="space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Good Points</span>
            </div>
            <div className="space-y-1.5">
              {checkResult.goodPoints.map((pt, i) => (
                <div key={i} className="text-xs text-slate-200 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Things to consider */}
          <div className="space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Things to Consider</span>
            </div>
            <div className="space-y-1.5">
              {checkResult.thingsToConsider.map((pt, i) => (
                <div key={i} className="text-xs text-slate-200 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-bold">⚠️</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to use */}
          <div className="space-y-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>How to Use in Your Routine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-5">
              {checkResult.howToUse}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            {onSaveToShelf && (
              <button
                onClick={handleSaveShelf}
                disabled={isSaved}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  isSaved
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md active:scale-95'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-teal-400" />
                    <span>Saved to My Shelf</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to My Hair Shelf</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
