import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Droplet, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Plus,
  Trash2,
  Package,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Sun,
  Wind,
  FileText,
  Activity,
  Heart,
  Ban
} from 'lucide-react';
import { 
  analyzeIngredients, 
  PRESET_PRODUCTS, 
  AnalysisResult 
} from '../services/ingredientAnalyzer';
import { HairCalculators, HardWaterResult, DilutionCalculation } from '../services/hairCalculators';
import { HAIR_OIL_DATABASE, getRecommendedOilCombination } from '../services/oilMatrixData';
import { UserProfile, ShelfProduct, ScalpCheck } from '../types';

interface HairLabScreenProps {
  profile: UserProfile;
  shelfProducts: ShelfProduct[];
  onSaveShelfProducts: (products: ShelfProduct[]) => void;
  scalpChecks?: ScalpCheck[];
  onOpenShowerCompanion?: () => void;
  onOpenScalpMassage?: () => void;
}

export const HairLabScreen: React.FC<HairLabScreenProps> = ({ 
  profile, 
  shelfProducts, 
  onSaveShelfProducts,
  scalpChecks = [],
  onOpenShowerCompanion,
  onOpenScalpMassage
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'decoder' | 'shelf' | 'oils' | 'water' | 'diy' | 'shedding' | 'myths'>('decoder');

  // Ingredient Analyzer State
  const [ingredientText, setIngredientText] = useState(PRESET_PRODUCTS[1].ingredients);
  const [analysis, setAnalysis] = useState<AnalysisResult>(() => 
    analyzeIngredients(PRESET_PRODUCTS[1].ingredients, profile.scalpType)
  );
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});

  // Hard Water State
  const [waterSource, setWaterSource] = useState<'borewell' | 'municipal' | 'ro_filtered' | 'tanker'>('municipal');
  const [waterAssessment, setWaterAssessment] = useState<HardWaterResult>(() => 
    HairCalculators.assessHardWater('municipal')
  );

  // Humidity & Weather Frizz State
  const [humidityLevel, setHumidityLevel] = useState<'high' | 'moderate' | 'dry'>('high');

  // Rosemary Dilution State
  const [carrierMl, setCarrierMl] = useState<number>(30);
  const [dilutionPercent, setDilutionPercent] = useState<number>(2);
  const [dilutionResult, setDilutionResult] = useState<DilutionCalculation>(() => 
    HairCalculators.calculateRosemaryDilution(30, 2)
  );

  // Microneedle State
  const [needleDepth, setNeedleDepth] = useState<'0.25' | '0.5' | '1.0'>('0.5');

  // Porosity Quiz State
  const [porosityAnswer, setPorosityAnswer] = useState<'sinks_fast' | 'floats_top' | 'slow_sink' | null>(null);

  // Shedding Bulb Test State
  const [bulbTestAnswer, setBulbTestAnswer] = useState<'white_bulb' | 'no_bulb' | null>(null);

  // Add Product to Shelf Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ShelfProduct['category']>('shampoo');
  const [newProductIngredients, setNewProductIngredients] = useState('');
  const [newProductNotes, setNewProductNotes] = useState('');

  // Dermatologist Summary Modal
  const [showDermSummary, setShowDermSummary] = useState(false);

  // Handle ingredient text change
  const handleAnalyze = (text: string) => {
    setIngredientText(text);
    const result = analyzeIngredients(text, profile.scalpType);
    setAnalysis(result);
  };

  const handleSelectPreset = (presetText: string) => {
    setIngredientText(presetText);
    const result = analyzeIngredients(presetText, profile.scalpType);
    setAnalysis(result);
  };

  const toggleMatchExpanded = (name: string) => {
    setExpandedMatches(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleWaterSourceChange = (src: 'borewell' | 'municipal' | 'ro_filtered' | 'tanker') => {
    setWaterSource(src);
    setWaterAssessment(HairCalculators.assessHardWater(src));
  };

  const handleCarrierChange = (ml: number) => {
    setCarrierMl(ml);
    setDilutionResult(HairCalculators.calculateRosemaryDilution(ml, dilutionPercent));
  };

  const handlePercentChange = (pct: number) => {
    setDilutionPercent(pct);
    setDilutionResult(HairCalculators.calculateRosemaryDilution(carrierMl, pct));
  };

  // Add Product to Shelf
  const handleAddProduct = () => {
    if (!newProductName.trim()) return;
    const analyzed = analyzeIngredients(newProductIngredients, profile.scalpType);
    const newProd: ShelfProduct = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      brand: newProductBrand.trim() || 'General',
      category: newProductCategory,
      status: 'in_use',
      ingredients: newProductIngredients.trim(),
      cleanScore: analyzed.cleanScore,
      notes: newProductNotes.trim()
    };
    onSaveShelfProducts([...shelfProducts, newProd]);
    setIsAddingProduct(false);
    setNewProductName('');
    setNewProductBrand('');
    setNewProductIngredients('');
    setNewProductNotes('');
  };

  const handleDeleteProduct = (id: string) => {
    onSaveShelfProducts(shelfProducts.filter(p => p.id !== id));
  };

  const handleToggleProductStatus = (id: string, status: ShelfProduct['status']) => {
    onSaveShelfProducts(
      shelfProducts.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  // Calculate Shelf Regimen Balance
  const inUseProducts = shelfProducts.filter(p => p.status === 'in_use');
  const hasShampoo = inUseProducts.some(p => p.category === 'shampoo');
  const hasConditioner = inUseProducts.some(p => p.category === 'conditioner');
  const hasOilOrSerum = inUseProducts.some(p => p.category === 'oil' || p.category === 'serum');
  
  // Detect potential protein overload across shelf
  let proteinCount = 0;
  let siliconeCount = 0;
  for (const prod of inUseProducts) {
    if (prod.ingredients) {
      if (/hydrolyzed|keratin|amino\s+acid|wheat\s+protein/i.test(prod.ingredients)) proteinCount++;
      if (/dimethicone|amodimethicone/i.test(prod.ingredients)) siliconeCount++;
    }
  }

  const microneedleProtocol = HairCalculators.getMicroneedleProtocol(needleDepth);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-teal-400 border-teal-500/40 bg-teal-500/10';
    if (score >= 45) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-28 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black tracking-wider uppercase border border-teal-500/30">
              Pro Clinic Lab
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">100% Offline</span>
          </div>
          <h1 className="text-2xl font-black text-slate-50 tracking-tight mt-1 flex items-center gap-2">
            Hair Lab <FlaskConical className="w-5 h-5 text-teal-400" />
          </h1>
        </div>

        {/* Lifetime Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-slate-900 border border-teal-500/30 shadow-lg">
          <Award className="w-4 h-4 text-teal-400" />
          <div className="text-right">
            <p className="text-[10px] font-black text-teal-300 leading-tight">PRO ₹10</p>
            <p className="text-[9px] text-slate-400 leading-tight">No Ads</p>
          </div>
        </div>
      </div>

      {/* Quick Interactive Tools */}
      {(onOpenShowerCompanion || onOpenScalpMassage) && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {onOpenShowerCompanion && (
            <button
              onClick={onOpenShowerCompanion}
              className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-slate-900 border border-cyan-500/30 text-left flex items-center gap-2.5 active:scale-95 transition-all shadow-md group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                🚿
              </div>
              <div>
                <div className="text-xs font-black text-white group-hover:text-cyan-300">Shower Coach</div>
                <div className="text-[10px] text-slate-400">Step-by-step timer</div>
              </div>
            </button>
          )}

          {onOpenScalpMassage && (
            <button
              onClick={onOpenScalpMassage}
              className="p-3 rounded-2xl bg-gradient-to-br from-teal-950/50 to-slate-900 border border-teal-500/30 text-left flex items-center gap-2.5 active:scale-95 transition-all shadow-md group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                💆
              </div>
              <div>
                <div className="text-xs font-black text-white group-hover:text-teal-300">Scalp Massage</div>
                <div className="text-[10px] text-slate-400">4-min galea relief</div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 mb-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'decoder', label: 'Decoder' },
          { id: 'shelf', label: 'My Shelf' },
          { id: 'oils', label: 'Oil Matrix' },
          { id: 'water', label: 'Water & Weather' },
          { id: 'diy', label: 'DIY Formulator' },
          { id: 'shedding', label: 'Shedding & Scalp' },
          { id: 'myths', label: 'Myth Buster' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-2 px-2.5 text-center rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-1 ${
              activeSubTab === tab.id
                ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: INGREDIENT DECODER                                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'decoder' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Test Examples:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_PRODUCTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.ingredients)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 whitespace-nowrap hover:border-teal-500/40 active:scale-95 transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Paste Product Ingredients:
              </label>
              <button
                onClick={() => handleAnalyze('')}
                className="text-[10px] text-slate-400 hover:text-slate-200 font-medium underline"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={3}
              value={ingredientText}
              onChange={(e) => handleAnalyze(e.target.value)}
              placeholder="e.g. Water, Sodium Laureth Sulfate, Dimethicone, Cetyl Alcohol, Fragrance..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono leading-relaxed resize-none"
            />
          </div>

          {/* Clean Score Card */}
          <div className={`p-4 rounded-3xl border ${getScoreColor(analysis.cleanScore)} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-80">
                  Clean Formula Score
                </p>
                <h3 className="text-2xl font-black tracking-tight">{analysis.verdict}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-current flex flex-col items-center justify-center font-black">
                <span className="text-lg leading-none">{analysis.cleanScore}</span>
                <span className="text-[9px] opacity-70">/100</span>
              </div>
            </div>

            {/* Summary Progress Bar */}
            <div className="w-full bg-slate-950/50 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500" 
                style={{ width: `${analysis.cleanScore}%` }}
              />
            </div>

            {/* Personalized Context */}
            <div className="space-y-1.5 text-[11px] bg-slate-950/40 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-200 shrink-0">Your Scalp ({profile.scalpType}):</span>
                <span className="text-slate-300">{analysis.scalpVerdict}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                <span className="font-bold text-slate-200 shrink-0">Porosity Fit:</span>
                <span className="text-slate-300">{analysis.porosityVerdict}</span>
              </div>
            </div>
          </div>

          {/* Categorized Badges */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-2xl border ${analysis.sulfatesFound.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Sulfates</span>
              {analysis.sulfatesFound.length > 0 ? (
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {analysis.sulfatesFound.length} Harsh Cleanser(s)
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sulfate-Free
                </span>
              )}
            </div>

            <div className={`p-3 rounded-2xl border ${analysis.siliconesFound.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Silicones</span>
              {analysis.siliconesFound.length > 0 ? (
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {analysis.siliconesFound.length} Detected
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Silicone-Free
                </span>
              )}
            </div>

            <div className={`p-3 rounded-2xl border ${analysis.dryingAlcoholsFound.length > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Drying Alcohol</span>
              {analysis.dryingAlcoholsFound.length > 0 ? (
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  {analysis.dryingAlcoholsFound.length} Stripping Agent
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Alcohol-Safe
                </span>
              )}
            </div>

            <div className={`p-3 rounded-2xl border ${analysis.poreCloggersFound.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Scalp Clogging</span>
              {analysis.poreCloggersFound.length > 0 ? (
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {analysis.poreCloggersFound.length} Comedogenic
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Non-Comedogenic
                </span>
              )}
            </div>
          </div>

          {/* Detailed Ingredient Matches */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Identified Bio-Compounds ({analysis.matches.length}):
            </h4>

            {analysis.matches.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                No known cosmetic flag ingredients detected.
              </div>
            ) : (
              analysis.matches.map((item) => {
                const isExpanded = !!expandedMatches[item.name];
                return (
                  <div
                    key={item.name}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => toggleMatchExpanded(item.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.severity === 'safe' && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {item.severity === 'caution' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                        {item.severity === 'warning' && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />}
                        <div>
                          <p className="text-xs font-bold text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{item.categoryLabel}</p>
                        </div>
                      </div>
                      <button className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl">
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: MY SHELF & REGIMEN BALANCE                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'shelf' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Regimen Balance Meter Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                  Regimen Health Check
                </span>
                <h3 className="text-base font-extrabold text-slate-100">
                  Active Routine Balance
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {inUseProducts.length} Products Active
              </span>
            </div>

            {/* Checklist of Essential Steps */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className={`p-2 rounded-xl border text-center ${hasShampoo ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <p className="font-bold">Cleanser</p>
                <p className="text-[9px] mt-0.5">{hasShampoo ? '✓ Present' : 'Missing'}</p>
              </div>
              <div className={`p-2 rounded-xl border text-center ${hasConditioner ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <p className="font-bold">Conditioner</p>
                <p className="text-[9px] mt-0.5">{hasConditioner ? '✓ Present' : 'Missing'}</p>
              </div>
              <div className={`p-2 rounded-xl border text-center ${hasOilOrSerum ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <p className="font-bold">Oil / Serum</p>
                <p className="text-[9px] mt-0.5">{hasOilOrSerum ? '✓ Present' : 'Optional'}</p>
              </div>
            </div>

            {/* Regimen Warnings */}
            {proteinCount >= 2 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                ⚠️ <strong>High Protein Alert:</strong> {proteinCount} of your active products contain hydrolyzed proteins. Watch out for brittle, straw-like hair (protein overload). Balance with moisturizing leave-ins.
              </div>
            )}
            {siliconeCount >= 2 && !inUseProducts.some(p => /sulfate|olefin/i.test(p.ingredients)) && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-200">
                💧 <strong>Clarifying Recommendation:</strong> You use silicones with gentle cleansers. Use an ACV rinse or clarifying shampoo every 2-3 weeks to avoid dull buildup.
              </div>
            )}
          </div>

          {/* Product Shelf List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                My Vanity Shelf ({shelfProducts.length})
              </h4>
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="py-1.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-teal-500/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Add Product Modal/Form */}
            {isAddingProduct && (
              <div className="p-4 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-extrabold text-teal-300">Add New Hair Product:</h4>
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Product Name (e.g. Scalp Balancing Shampoo)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    placeholder="Brand (e.g. Minimalist / Wow / L'Oréal)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <div className="flex gap-2">
                    {(['shampoo', 'conditioner', 'oil', 'serum', 'mask'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewProductCategory(cat)}
                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                          newProductCategory === cat
                            ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={newProductIngredients}
                    onChange={(e) => setNewProductIngredients(e.target.value)}
                    placeholder="Paste ingredient list (Optional, for instant toxicity score)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none font-mono"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Save to Shelf
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* List of Shelf Products */}
            {shelfProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-teal-400 uppercase tracking-wider">
                      {prod.category} • {prod.brand}
                    </span>
                    <h5 className="text-xs font-bold text-slate-100">{prod.name}</h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {prod.cleanScore !== undefined && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-950 border border-teal-500/30 text-teal-300">
                        {prod.cleanScore}/100
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {prod.notes && (
                  <p className="text-[11px] text-slate-400">{prod.notes}</p>
                )}

                {/* Status Selector */}
                <div className="flex gap-1.5 pt-1">
                  {[
                    { id: 'in_use', label: 'Active In Routine' },
                    { id: 'loved', label: 'Loved' },
                    { id: 'irritating', label: 'Irritated Scalp' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleToggleProductStatus(prod.id, st.id as any)}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                        prod.status === st.id
                          ? st.id === 'irritating' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: OIL CHEMISTRY MATRIX (PENETRATING VS SEALING)                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'oils' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Science Overview Banner */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-extrabold text-slate-100">
                Lipid Chemistry: Penetrating vs Sealing Oils
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Not all oils do the same job! Only oils rich in <strong>Lauric Acid</strong> with tiny linear triglycerides can enter the hair cortex. Larger branched oils stay on the surface as cuticle sealants.
            </p>
          </div>

          {/* User's Personalized Recommendation Card */}
          {(() => {
            const oilRec = getRecommendedOilCombination(profile.scalpType, porosityAnswer || 'medium');
            return (
              <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/40 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                  Your Custom Oil Regimen (Scalp: {profile.scalpType})
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="text-teal-400 font-bold shrink-0">Pre-Wash:</span>
                    <span className="text-slate-200">{oilRec.preWash}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="text-teal-400 font-bold shrink-0">Scalp Carrier:</span>
                    <span className="text-slate-200">{oilRec.carrierForScalp}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                    <span className="text-teal-400 font-bold shrink-0">Ends Sealant:</span>
                    <span className="text-slate-200">{oilRec.postWashSealant}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">Avoid:</span>
                    <span>{oilRec.avoid}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* All Oils Database Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Trichology Oil Encyclopedia ({HAIR_OIL_DATABASE.length}):
            </h4>

            {HAIR_OIL_DATABASE.map((oil) => (
              <div
                key={oil.id}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">
                      {oil.botanicalName}
                    </span>
                    <h5 className="text-sm font-extrabold text-slate-100">{oil.name}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    oil.type === 'penetrating'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : oil.type === 'active_essential'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  }`}>
                    {oil.typeLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Key Fatty Acid:</span>
                    <span className="text-slate-200 font-semibold">{oil.primaryFattyAcid}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Molecular Action:</span>
                    <span className="text-slate-200 font-semibold">{oil.molecularWeight}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p>👉 <strong className="text-slate-200">How to Apply:</strong> {oil.howToUse}</p>
                </div>

                <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200/90 leading-relaxed">
                  <p>🔬 <strong className="text-teal-300">Clinical Data:</strong> {oil.clinicalFact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: WATER & WEATHER SHIELD                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'water' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Water Source Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              1. Shower Water Source (Hard Water Shield):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'borewell', label: 'Borewell / Ground', desc: 'High Mineral / Hard' },
                { id: 'tanker', label: 'Tanker Water', desc: 'Hard Water Supply' },
                { id: 'municipal', label: 'Municipal / City Tap', desc: 'Moderate Hardness' },
                { id: 'ro_filtered', label: 'RO / Filtered', desc: 'Low Minerals / Soft' }
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => handleWaterSourceChange(src.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    waterSource === src.id
                      ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{src.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{src.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ACV Rinse Recipe */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-extrabold text-teal-300">
                Calibrated Apple Cider Vinegar (ACV) Chelating Rinse
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">ACV Dosage:</span>
                <span className="font-bold text-slate-100">{waterAssessment.acvRinseFormula.acvAmount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Water Volume:</span>
                <span className="font-bold text-slate-100">{waterAssessment.acvRinseFormula.waterAmount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Target pH Mantle:</span>
                <span className="font-bold text-teal-300">{waterAssessment.acvRinseFormula.targetPh}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Recommended Frequency:</span>
                <span className="font-bold text-slate-100">{waterAssessment.acvRinseFormula.frequency}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200/90 leading-relaxed">
              <span className="font-bold block text-teal-300 mb-0.5">Application Protocol:</span>
              {waterAssessment.acvRinseFormula.instructions}
            </div>
          </div>

          {/* Section 2: Humidity & Weather Frizz Shield */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-100">
                  2. Humidity & Dew Point Anti-Frizz Rules
                </h3>
                <p className="text-[10px] text-slate-400">Select today's ambient humidity</p>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'high', label: 'Monsoon / High (>70%)', icon: CloudRain },
                { id: 'moderate', label: 'Optimal (40-70%)', icon: Sun },
                { id: 'dry', label: 'Arid / Dry (<40%)', icon: Wind }
              ].map((hum) => (
                <button
                  key={hum.id}
                  onClick={() => setHumidityLevel(hum.id as any)}
                  className={`flex-1 p-2 rounded-xl text-center border transition-all ${
                    humidityLevel === hum.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <p className="text-[11px] font-bold">{hum.label}</p>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              {humidityLevel === 'high' && (
                <>
                  <p>🌧️ <strong>The Humectant Trap:</strong> High humidity pushes excess moisture into the hair cortex, causing hair shafts to balloon and frizz.</p>
                  <p>• <strong>Rule:</strong> Avoid leave-in conditioners with pure glycerin as the first 3 ingredients.</p>
                  <p>• <strong>Solution:</strong> Seal with 2-3 drops of lightweight Argan or Jojoba oil over damp hair to create an invisible water-vapor shield.</p>
                </>
              )}
              {humidityLevel === 'moderate' && (
                <>
                  <p>☀️ <strong>Golden Dew Point:</strong> Ambient moisture and hair hydration are balanced.</p>
                  <p>• <strong>Rule:</strong> Standard hydrating routines work optimally. Light leave-in sprays maintain curl clump definition.</p>
                </>
              )}
              {humidityLevel === 'dry' && (
                <>
                  <p>🏜️ <strong>Reverse Osmosis Hazard:</strong> In dry winter or air-conditioned rooms, humectants pull water OUT of your hair into the dry air.</p>
                  <p>• <strong>Rule:</strong> Never apply glycerin to dry hair without an occlusive barrier.</p>
                  <p>• <strong>Solution:</strong> Layer a rich conditioning cream followed by a sealing oil.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: TRICHOLOGY DIY FORMULATOR                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'diy' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Rosemary Essential Oil Calculator */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-400">
                  Trichology Formulator
                </span>
                <h3 className="text-base font-extrabold text-slate-100">
                  Rosemary Essential Oil Safe Dilution
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                dilutionResult.safetyLevel === 'Clinical Standard'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : dilutionResult.safetyLevel === 'Ultra-Gentle'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {dilutionResult.safetyLevel}
              </span>
            </div>

            {/* Carrier Oil Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Carrier Oil Volume (Jojoba / Coconut):</span>
                <span className="text-teal-400 font-bold">{carrierMl} ml</span>
              </div>
              <div className="flex gap-2">
                {[15, 30, 50, 100].map((ml) => (
                  <button
                    key={ml}
                    onClick={() => handleCarrierChange(ml)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      carrierMl === ml
                        ? 'bg-teal-500 text-slate-950 border-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {ml}ml
                  </button>
                ))}
              </div>
            </div>

            {/* Target Percentage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Target Concentration:</span>
                <span className="text-teal-400 font-bold">{dilutionPercent}%</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePercentChange(pct)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      dilutionPercent === pct
                        ? 'bg-teal-500 text-slate-950 border-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {pct}% {pct === 2 ? '(Standard)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Calculation Result */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center">
              <p className="text-[11px] text-teal-300 font-semibold mb-1">Add Exactly to {carrierMl}ml Carrier Oil:</p>
              <h2 className="text-3xl font-black text-teal-300 tracking-tight">
                {dilutionResult.essentialOilDrops} Drops
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                (~{dilutionResult.approxEssentialOilMl} ml pure rosemary essential oil)
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              💡 {dilutionResult.instructions}
            </p>
          </div>

          {/* Microneedling / Derma Stamp Safety Protocol */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
                  Scalp Collagen Protocol
                </span>
                <h3 className="text-base font-extrabold text-slate-100">
                  Derma-Roller / Stamp Protocol
                </h3>
              </div>
            </div>

            {/* Needle depth selector */}
            <div className="flex gap-2">
              {[
                { depth: '0.25', label: '0.25 mm', desc: 'Absorption' },
                { depth: '0.5', label: '0.5 mm', desc: 'Collagen & VEGF' },
                { depth: '1.0', label: '1.0 mm', desc: 'Deep' }
              ].map((item) => (
                <button
                  key={item.depth}
                  onClick={() => setNeedleDepth(item.depth as any)}
                  className={`flex-1 p-2 rounded-xl text-center border transition-all ${
                    needleDepth === item.depth
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className="text-[9px] opacity-75">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Selected Protocol Details */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Clinical Purpose:</span>
                <p className="text-slate-200">{microneedleProtocol.purpose}</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
                <span className="text-[10px] font-black uppercase text-rose-300 block mb-0.5">
                  CRITICAL 24-HR SAFETY RULE:
                </span>
                <p className="text-[11px] leading-relaxed font-semibold">
                  {microneedleProtocol.waitPeriodActives}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Step-by-Step Checklist:</span>
                {microneedleProtocol.steps.map((st, i) => (
                  <p key={i} className="text-[11px] text-slate-300 leading-snug">
                    {st}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: SHEDDING & SCALP LAB                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'shedding' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Diagnostic 1: Bulb Test (Shedding vs Breakage) */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-100">
                  The White Bulb Test (Shedding vs Breakage)
                </h3>
                <p className="text-[10px] text-slate-400">Examine a fallen hair strand from your brush or pillow</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBulbTestAnswer('white_bulb')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  bulbTestAnswer === 'white_bulb'
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">White Tiny Bulb at Root</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Visible tiny white ball at one end</p>
              </button>

              <button
                onClick={() => setBulbTestAnswer('no_bulb')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  bulbTestAnswer === 'no_bulb'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">No Bulb / Blunt Ends</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Snaps cleanly with frayed tips</p>
              </button>
            </div>

            {bulbTestAnswer && (
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-slate-200 space-y-1.5 leading-relaxed animate-fadeIn">
                {bulbTestAnswer === 'white_bulb' ? (
                  <>
                    <span className="font-extrabold text-teal-300 block">Verdict: Natural Follicle Shedding (Telogen Phase)</span>
                    <p>The hair reached the end of its 3-5 year growth cycle. 50-100 shed hairs per day is standard biology. A new anagen hair is already starting below the surface.</p>
                  </>
                ) : (
                  <>
                    <span className="font-extrabold text-amber-300 block">Verdict: Mechanical Shaft Breakage</span>
                    <p>This is NOT root hair loss! Your strand broke midway due to friction, rough towel drying, heat, or comb snagging. Focus on leave-in conditioners, silk sleep caps, and wide-tooth combs.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Diagnostic 2: 90-Day Shock Timeline (Telogen Effluvium) */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-100">
              The 90-Day Stress Shock Tracker (Telogen Effluvium)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hair follicles take <strong>2 to 3 months</strong> to enter the shedding phase after a metabolic shock. Did you experience any of these 60–90 days ago?
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              {[
                'High fever or viral infection (Dengue, Covid, Malaria)',
                'Sudden crash diet, rapid weight loss, or low protein',
                'Major life stress, grief, or sleep deprivation',
                'Stopping/starting hormonal medication or childbirth'
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span className="text-[11px]">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
              💡 <em>Good News:</em> Acute Telogen Effluvium is temporary and self-resolving. Once the trigger passes, follicles spontaneously re-enter the anagen growth cycle within 4–6 months.
            </p>
          </div>

          {/* Diagnostic 3: Water Float Porosity Test */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <h3 className="text-xs font-extrabold text-slate-100">
                Water Float Porosity Test
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Drop a clean shed strand in a glass of water for 4 minutes:
            </p>

            <div className="flex gap-2">
              {[
                { id: 'floats_top', label: 'Floats on Top (Low)' },
                { id: 'slow_sink', label: 'Middle (Medium)' },
                { id: 'sinks_fast', label: 'Sinks (High)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPorosityAnswer(opt.id as any)}
                  className={`flex-1 p-2 rounded-xl text-center border text-[10px] font-bold transition-all ${
                    porosityAnswer === opt.id
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {porosityAnswer && (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-slate-200 leading-relaxed">
                {porosityAnswer === 'floats_top' && 'Low Porosity: Avoid heavy shea butter; use warm water when deep conditioning to open cuticles.'}
                {porosityAnswer === 'slow_sink' && 'Medium Porosity: Balanced cuticles. Maintain balanced moisture and occasional light protein.'}
                {porosityAnswer === 'sinks_fast' && 'High Porosity: Raised cuticles. Needs bi-weekly hydrolyzed protein and rich sealing oils.'}
              </div>
            )}
          </div>

          {/* Dermatologist Clinic Summary Button */}
          <button
            onClick={() => setShowDermSummary(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Doctor / Clinic Summary</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: EVIDENCE-BASED CLINICAL MYTH BUSTER                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'myths' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-extrabold text-slate-100">
                Trichology Myth Buster & Clinical Reality
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don't waste money on marketing gimmicks. Here is what peer-reviewed dermatology literature actually proves.
            </p>
          </div>

          {[
            {
              myth: "Biotin Gummies Stop Hair Loss & Accelerate Growth",
              verdict: "FALSE & CLINICALLY RISKY",
              statusColor: "border-rose-500/30 bg-rose-500/10 text-rose-300",
              science: "Intestinal microflora already synthesize 100% of human biotin requirements. True deficiency is exceedingly rare (<0.01%). High-dose biotin gummies cause severe cystic jawline acne and dangerously skew cardiac troponin blood tests during heart emergencies.",
              truth: "Check serum Ferritin (iron storage) and Vitamin D3 instead; these are the actual silent drivers of telogen effluvium."
            },
            {
              myth: "Trimming Hair Makes It Grow Faster from the Scalp",
              verdict: "PHYSIOLOGICALLY IMPOSSIBLE",
              statusColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
              science: "Hair fiber is dead keratinized protein. Follicles deep inside the scalp have zero bio-feedback with cut hair ends 12 inches away. Trimming stops existing split ends from traveling upward, preserving hair length, but does not speed up follicle division.",
              truth: "Trim every 3 to 4 months solely to eliminate frayed tips and mechanical breakage."
            },
            {
              myth: "Washing Hair Every Day Causes Permanent Hair Loss",
              verdict: "FALSE (Harmful for Oily Scalps)",
              statusColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
              science: "The hairs you shed in the shower detached 2 to 5 days earlier in the telogen phase. Washing merely flushes them out. For oily or seborrheic scalps, skipping washes lets sebum and Malassezia yeast accumulate, triggering follicular inflammation.",
              truth: "Wash as frequently as sebum dictates. Oily scalps benefit from daily or alternate-day gentle cleansing."
            },
            {
              myth: "Commercial Bottled Onion Shampoos Reverse Baldness",
              verdict: "MARKETING DECEPTION",
              statusColor: "border-rose-500/30 bg-rose-500/10 text-rose-300",
              science: "The 2002 Sharquie trial used fresh, unpasteurized crude allium cepa juice applied twice daily. Catalase enzymes and sulfur compounds oxidize and break down within 48 hours. Bottled shampoos contain less than 0.1% stabilized extract diluted in standard detergents.",
              truth: "Use clinically verified topicals (diluted rosemary oil or minoxidil) instead of cosmetic onion gimmicks."
            },
            {
              myth: "Natural Essential Oils Are Always Safe Because They're Organic",
              verdict: "DANGEROUS MISCONCEPTION",
              statusColor: "border-rose-500/30 bg-rose-500/10 text-rose-300",
              science: "Pure essential oils (Rosemary, Peppermint, Cinnamon, Tea Tree) are aggressive volatile chemical concentrates. Applying them undiluted causes chemical burns, severe contact dermatitis, and immediate shock shedding.",
              truth: "Never exceed 1%–2% dilution in a gentle carrier oil (Jojoba or Sweet Almond)."
            },
            {
              myth: "Ice Cold Water Rinses Cure Follicular Thinning",
              verdict: "MYTH",
              statusColor: "border-teal-500/30 bg-teal-500/10 text-teal-300",
              science: "Follicle dermal papillae are anchored 3 to 4 mm beneath the scalp surface. Cold surface water cannot revive miniaturized follicles. However, cool water does flat-iron outer cuticle scales for cosmetic shine.",
              truth: "Wash with comfortable lukewarm water and finish with a cool rinse for shine."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-black text-slate-100">
                  ❌ "{item.myth}"
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${item.statusColor}`}>
                  {item.verdict}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
                <p>🧬 <strong className="text-slate-100">Dermatology Science:</strong> {item.science}</p>
                <p className="pt-1.5 border-t border-slate-900 text-teal-300 font-semibold">
                  💡 <strong>Actionable Truth:</strong> {item.truth}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DERMATOLOGIST SUMMARY MODAL                                               */}
      {/* ========================================================================= */}
      {showDermSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
                  Clinical Consultation Prep
                </span>
                <h3 className="text-base font-black text-slate-100">Dermatologist Summary Sheet</h3>
              </div>
              <button
                onClick={() => setShowDermSummary(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Profile:</span>
                <p className="font-bold text-slate-100 mt-0.5">Scalp: {profile.scalpType} | Texture: {profile.hairType || 'Wavy'} | Goal: {profile.hairGoal || 'Maintenance'}</p>
                <p className="text-[11px] text-slate-400">Wash Frequency: {profile.washFrequency}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Current Topicals on Shelf:</span>
                {shelfProducts.length === 0 ? (
                  <p className="text-slate-500 mt-0.5">No products recorded.</p>
                ) : (
                  <div className="mt-1 space-y-1 text-[11px] text-slate-200">
                    {shelfProducts.map((p) => (
                      <p key={p.id}>• <strong>{p.name}</strong> ({p.category}) — {p.status === 'irritating' ? '⚠️ Caused irritation' : 'Currently in use'}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Environmental & Water Data:</span>
                <p className="text-slate-200 mt-0.5">Water Source: {waterAssessment.waterSource} ({waterAssessment.depositRisk})</p>
              </div>

              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-200 leading-relaxed">
                💡 <em>Tip for Appointment:</em> Show this sheet to your doctor so they immediately know your wash schedule, environmental hardness, and topical contact history without 15 minutes of questioning.
              </div>
            </div>

            <button
              onClick={() => setShowDermSummary(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* Fair Price & Privacy Guarantee Card */}
      <div className="mt-8 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-teal-400" />
          ₹10 Fair Value Guarantee
        </div>
        <p className="text-xs font-bold text-slate-200">
          Lifetime Ownership • Zero Ads • Complete Offline Privacy
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
          Unlike apps that charge ₹499/month and harvest personal data, HAIR OS runs 100% on your device with zero recurring fees.
        </p>
      </div>
    </div>
  );
};
