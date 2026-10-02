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
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Award
} from 'lucide-react';
import { 
  analyzeIngredients, 
  PRESET_PRODUCTS, 
  AnalysisResult 
} from '../services/ingredientAnalyzer';
import { HairCalculators, HardWaterResult, DilutionCalculation } from '../services/hairCalculators';
import { UserProfile } from '../types';

interface HairLabScreenProps {
  profile: UserProfile;
}

export const HairLabScreen: React.FC<HairLabScreenProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'decoder' | 'water' | 'diy' | 'porosity'>('decoder');

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

      {/* Sub Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 mb-6">
        <button
          onClick={() => setActiveSubTab('decoder')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'decoder'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Decoder
        </button>
        <button
          onClick={() => setActiveSubTab('water')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'water'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Water Shield
        </button>
        <button
          onClick={() => setActiveSubTab('diy')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'diy'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          DIY Formulator
        </button>
        <button
          onClick={() => setActiveSubTab('porosity')}
          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'porosity'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Porosity
        </button>
      </div>

      {/* TAB 1: INGREDIENT DECODER */}
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
                  {analysis.sulfatesFound.length} Harsh Detergent(s)
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
                No known cosmetic flag ingredients detected. Always check your scalp's response when introducing new formulations.
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

      {/* TAB 2: HARD WATER & PH SHIELD */}
      {activeSubTab === 'water' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Source Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Select Your Daily Shower Water Source:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'borewell', label: 'Borewell / Ground', desc: 'High Mineral / Hard' },
                { id: 'tanker', label: 'Tanker Water', desc: 'Hard Water Supply' },
                { id: 'municipal', label: 'Municipal / City Tap', desc: 'Moderate Hardness' },
                { id: 'ro_filtered', label: 'RO / Water Softener', desc: 'Low Minerals / Soft' }
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

          {/* Risk Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Mineral Deposition Impact
                </span>
                <h3 className="text-lg font-black text-slate-100">{waterAssessment.waterSource}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                waterAssessment.depositRisk === 'Severe Mineral Buildup'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : waterAssessment.depositRisk === 'Moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {waterAssessment.depositRisk}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 leading-relaxed">
              {waterAssessment.breakageImpact}
            </p>
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

          {/* Citric Acid Alternative */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200">Alternative: Citric Acid Rinse (Odorless)</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If you dislike vinegar aroma, dissolve <strong className="text-slate-200">{waterAssessment.citricAcidAlternative.citricAcidAmount}</strong> into <strong className="text-slate-200">{waterAssessment.citricAcidAlternative.waterAmount}</strong>. It binds directly with free calcium ions to prevent hair stiffness.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: SCIENTIFIC DIY FORMULATOR */}
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

      {/* TAB 4: POROSITY & SCALP TEST */}
      {activeSubTab === 'porosity' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Diagnostic Float Test */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-base font-extrabold text-slate-100">
                  The Glass Water Porosity Test
                </h3>
                <p className="text-[11px] text-slate-400">
                  Take a clean, shed strand of hair (wash-off free) and drop it into a transparent glass of room-temperature water for 4 minutes.
                </p>
              </div>
            </div>

            {/* Answer Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">What happened to the strand?</label>
              <div className="space-y-2">
                {[
                  {
                    id: 'floats_top',
                    label: 'Strand Floats at the Top',
                    porosity: 'Low Porosity Hair',
                    desc: 'Cuticles are tightly closed like roof shingles. Moisture has a hard time entering, but once in, stays locked.'
                  },
                  {
                    id: 'slow_sink',
                    label: 'Floats in the Middle',
                    porosity: 'Medium / Balanced Porosity',
                    desc: 'Healthy cuticles. Absorbs and retains balanced moisture effortlessly with standard wash routines.'
                  },
                  {
                    id: 'sinks_fast',
                    label: 'Sinks Straight to the Bottom',
                    porosity: 'High Porosity Hair',
                    desc: 'Cuticles have raised or damaged gaps (from heat, bleaching, or genetics). Absorbs water instantly but dries out immediately.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPorosityAnswer(opt.id as any)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all ${
                      porosityAnswer === opt.id
                        ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actionable Rules based on answer */}
            {porosityAnswer && (
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2 animate-fadeIn">
                <h4 className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                  Recommended Regimen Rules:
                </h4>
                {porosityAnswer === 'floats_top' && (
                  <div className="text-[11px] text-slate-200 space-y-1.5 leading-relaxed">
                    <p>• <strong>Apply Warmth:</strong> Use warm water or a warm towel when deep conditioning to gently open tight cuticles.</p>
                    <p>• <strong>Avoid Heavy Butters:</strong> Heavy shea butter and castor oil will sit on top of strands and look greasy. Use lightweight Argan, Jojoba, or Grapeseed oil.</p>
                    <p>• <strong>Avoid Protein Overload:</strong> Limit hydrolyzed keratin products to once every 6 weeks.</p>
                  </div>
                )}
                {porosityAnswer === 'slow_sink' && (
                  <div className="text-[11px] text-slate-200 space-y-1.5 leading-relaxed">
                    <p>• <strong>Balanced Routine:</strong> Alternate between lightweight moisturizing conditioners and occasional protein masks.</p>
                    <p>• <strong>Protection:</strong> Use silk/satin pillowcases to maintain the intact cuticle layer.</p>
                  </div>
                )}
                {porosityAnswer === 'sinks_fast' && (
                  <div className="text-[11px] text-slate-200 space-y-1.5 leading-relaxed">
                    <p>• <strong>Frequent Protein:</strong> Incorporate hydrolyzed proteins or amino acids bi-weekly to temporarily patch cuticle gaps.</p>
                    <p>• <strong>Seal with Heavier Oils:</strong> Use the L.O.C. method (Liquid - Oil - Cream) to lock water inside the strand.</p>
                    <p>• <strong>Acidic Final Rinse:</strong> Cold water or an ACV rinse helps smooth and clamp down raised cuticles.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fair Price & Privacy Promise Card */}
      <div className="mt-8 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-teal-400" />
          ₹10 Fair Value Guarantee
        </div>
        <p className="text-xs font-bold text-slate-200">
          Lifetime Ownership • Zero Ads • Complete Offline Privacy
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
          Unlike apps that charge ₹499/month and sell personal data, HAIR OS runs 100% on your device hardware with zero recurring fees.
        </p>
      </div>
    </div>
  );
};
