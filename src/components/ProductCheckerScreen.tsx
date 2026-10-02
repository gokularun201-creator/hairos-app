import React, { useState } from 'react';
import { HairScanResult, ProductCheckResult, ShelfProduct } from '../types';
import { checkProductCompatibility } from '../services/planGenerator';
import { EXPANDED_PRODUCT_DATABASE, ProductItem } from '../data/productDatabase';
import { parseBottleImage, COMMON_INCI_INGREDIENTS } from '../services/ocrIngredientService';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  ShieldCheck, 
  Camera, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  ScanLine, 
  SlidersHorizontal,
  ChevronDown,
  X,
  Plus,
  Flame,
  Check
} from 'lucide-react';

interface ProductCheckerScreenProps {
  scanResult: HairScanResult | null;
  onSaveToShelf?: (product: ShelfProduct) => void;
  onOpenScanModal?: () => void;
}

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

  // Expanded Product Browser state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Camera OCR State
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [showOcrToast, setShowOcrToast] = useState(false);

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

  const filteredProducts = EXPANDED_PRODUCT_DATABASE.filter((p) => {
    const matchesCategory = selectedFilterCategory === 'all' || p.category === selectedFilterCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (product: ProductItem) => {
    setProductName(product.name);
    setBrand(product.brand);
    setCategory(product.category as any);
    setIngredientsText(product.ingredients);
    setCheckResult(null);
    setIsSaved(false);
    setShowCatalogModal(false);

    // Auto trigger analysis for instant satisfaction
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = checkProductCompatibility(
        product.name,
        product.brand,
        product.category as any,
        product.ingredients,
        effectiveScan
      );
      setCheckResult(result);
      setIsAnalyzing(false);
    }, 450);
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setProductPhoto(dataUrl);
        setIsOcrScanning(true);

        // Run On-Device OCR Analysis
        try {
          const ocrResult = await parseBottleImage(dataUrl);
          setTimeout(() => {
            if (ocrResult.detectedName && !productName) {
              setProductName(ocrResult.detectedName);
            }
            if (ocrResult.detectedBrand && !brand) {
              setBrand(ocrResult.detectedBrand);
            }
            if (ocrResult.matchedProduct) {
              setCategory(ocrResult.matchedProduct.category as any);
            }
            if (ocrResult.rawText) {
              setIngredientsText(ocrResult.rawText);
            }
            setOcrConfidence(ocrResult.confidence);
            setIsOcrScanning(false);
            setShowOcrToast(true);
            setTimeout(() => setShowOcrToast(false), 3500);
          }, 1200);
        } catch {
          setIsOcrScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIngredientChip = (ingredient: string) => {
    const cleanName = ingredient.replace(/\s*\([^)]*\)/g, '').trim();
    if (!ingredientsText) {
      setIngredientsText(cleanName);
    } else if (!ingredientsText.toLowerCase().includes(cleanName.toLowerCase())) {
      setIngredientsText(`${ingredientsText.trim()}, ${cleanName}`);
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
    }, 600);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-32">
      {/* Header */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Formulation Engine</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Should I Buy This?
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Snap bottle label photos or pick from 50+ iconic formulas. Hair OS evaluates chemical compatibility against your exact hair porosity and scalp oiliness.
        </p>
      </div>

      {/* ACTIVE PROFILE CONTEXT */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm border border-teal-500/30">
            🧬
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              Diagnostic Target Profile
            </div>
            <div className="text-xs font-black text-teal-300">
              {effectiveScan.hairType} Pattern • {effectiveScan.texture} • {effectiveScan.scalpCondition} Scalp
            </div>
          </div>
        </div>

        {onOpenScanModal && (
          <button
            onClick={onOpenScanModal}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300 underline"
          >
            {scanResult ? 'Rescan' : 'Calibrate'}
          </button>
        )}
      </div>

      {/* QUICK ACTIONS ROW: OCR SCANNER & EXPANDED BROWSER */}
      <div className="grid grid-cols-2 gap-2.5">
        <label className="p-3 rounded-2xl bg-slate-900 border border-teal-500/40 hover:border-teal-400 cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-md shadow-teal-500/10">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-white">Camera OCR Scanner</div>
            <div className="text-[10px] text-teal-400 font-semibold">Snap bottle label photo</div>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoCapture}
          />
        </label>

        <button
          onClick={() => setShowCatalogModal(true)}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-95 shadow-md"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-white">50+ Iconic Library</div>
            <div className="text-[10px] text-slate-400 font-semibold">Olaplex, K18, Minimalist...</div>
          </div>
        </button>
      </div>

      {/* OCR SCANNING HUD OVERLAY */}
      {isOcrScanning && (
        <div className="rounded-2xl bg-slate-900 border border-teal-500/50 p-4 space-y-3 relative overflow-hidden animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center animate-spin">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">On-Device OCR Processing...</div>
              <div className="text-[11px] text-teal-400 font-semibold">Extracting INCI ingredients & bottle markers</div>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* OCR SUCCESS TOAST */}
      {showOcrToast && ocrConfidence && (
        <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/50 flex items-center justify-between text-xs text-teal-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="font-bold">OCR Analyzed ({ocrConfidence}% Confidence)</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Ingredients Auto-Filled ✓</span>
        </div>
      )}

      {/* POPULAR QUICK PICK PILLS */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Quick Formulations
          </span>
          <button
            onClick={() => setShowCatalogModal(true)}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300"
          >
            View All ({EXPANDED_PRODUCT_DATABASE.length}) →
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {EXPANDED_PRODUCT_DATABASE.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProduct(p)}
              className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left text-slate-300 transition-all active:scale-95 space-y-0.5 max-w-[190px]"
            >
              <div className="text-xs font-black text-white truncate">{p.name}</div>
              <div className="text-[10px] text-teal-400 font-semibold">{p.category.toUpperCase()} • {p.brand}</div>
            </button>
          ))}
        </div>
      </div>

      {/* FORM INPUTS */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3.5 shadow-xl">
        {/* Category Selector */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Product Category
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(['shampoo', 'conditioner', 'oil', 'serum', 'mask', 'styling'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-xl font-bold capitalize transition-colors ${
                  category === cat
                    ? 'bg-teal-500 text-slate-950 shadow-sm font-black'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
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
              placeholder="e.g. Olaplex No. 3"
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
              placeholder="e.g. Olaplex"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Ingredients Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold text-slate-400">
              Ingredients List (INCI)
            </label>
            {ingredientsText && (
              <button
                onClick={() => setIngredientsText('')}
                className="text-[10px] text-slate-500 hover:text-rose-400"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            rows={4}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Paste ingredients (e.g. Aqua, Cetearyl Alcohol, Rosemary Oil, Dimethicone, Argan Oil...)"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 leading-relaxed font-mono"
          />
        </div>

        {/* Quick INCI Ingredient Chips */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            + Quick Add Common Actives:
          </span>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
            {COMMON_INCI_INGREDIENTS.slice(0, 14).map((ing, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddIngredientChip(ing)}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-teal-950 border border-slate-800 hover:border-teal-500/50 text-[10px] text-slate-300 hover:text-teal-300 font-semibold transition-colors flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-2.5 h-2.5 text-teal-400" />
                <span>{ing.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!ingredientsText.trim() || isAnalyzing}
          className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform"
        >
          {isAnalyzing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
              <span className="text-slate-950">Analyzing Formulation...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="text-slate-950">Check Compatibility Match</span>
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

          {/* Good Points */}
          {checkResult.goodPoints.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Good Points</span>
              </div>
              <ul className="space-y-1">
                {checkResult.goodPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Things to Consider */}
          {checkResult.thingsToConsider.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Things to Consider</span>
              </div>
              <ul className="space-y-1">
                {checkResult.thingsToConsider.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to use in your routine */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>How to Use It In Your Routine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-5">
              {checkResult.howToUse}
            </p>
          </div>

          {/* Save to Shelf Action */}
          {onSaveToShelf && (
            <button
              onClick={handleSaveShelf}
              disabled={isSaved}
              className={`w-full py-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white active:scale-95'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-teal-400" />
                  <span>Saved to Vanity Shelf ✓</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save to My Vanity Shelf</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* 50+ PRODUCT CATALOG MODAL */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                  Product Database
                </span>
                <h3 className="text-base font-black text-white">
                  50+ Iconic Hair Care Formulations
                </h3>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="pt-3 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search brand, name, or concern..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All (50+)' },
                { id: 'shampoo', label: 'Shampoos' },
                { id: 'conditioner', label: 'Conditioners' },
                { id: 'mask', label: 'Bond & Masks' },
                { id: 'serum', label: 'Serums' },
                { id: 'oil', label: 'Oils' },
                { id: 'styling', label: 'Styling' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilterCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-[11px] transition-colors ${
                    selectedFilterCategory === tab.id
                      ? 'bg-teal-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching formulations found. Try another keyword.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="w-full p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-left transition-all active:scale-[0.98] space-y-1 block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-teal-400">
                        {p.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400">
                        ★ {p.popularRating}
                      </span>
                    </div>
                    <div className="text-xs font-black text-white">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.brand} • <span className="text-slate-300">{p.targetHair}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
