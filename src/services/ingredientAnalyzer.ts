// On-Device Hair & Scalp Ingredient Analyzer Engine
// 100% offline, zero cloud API costs, instant clinical categorization

export interface IngredientMatch {
  name: string;
  category: 
    | 'harsh_sulfate' 
    | 'gentle_cleanser' 
    | 'insoluble_silicone' 
    | 'water_soluble_silicone' 
    | 'drying_alcohol' 
    | 'fatty_alcohol' 
    | 'pore_clogger' 
    | 'protein' 
    | 'humectant' 
    | 'preservative_caution' 
    | 'beneficial_botanical';
  categoryLabel: string;
  severity: 'safe' | 'caution' | 'warning';
  explanation: string;
}

export interface AnalysisResult {
  totalAnalyzed: number;
  cleanScore: number; // 0 - 100
  verdict: 'Excellent' | 'Good' | 'Use With Caution' | 'Not Recommended';
  summary: string;
  matches: IngredientMatch[];
  sulfatesFound: string[];
  siliconesFound: string[];
  dryingAlcoholsFound: string[];
  poreCloggersFound: string[];
  proteinsFound: string[];
  scalpVerdict: string;
  porosityVerdict: string;
}

interface IngredientRule {
  pattern: RegExp;
  name: string;
  category: IngredientMatch['category'];
  categoryLabel: string;
  severity: IngredientMatch['severity'];
  explanation: string;
}

const INGREDIENT_DATABASE: IngredientRule[] = [
  // Harsh Sulfates
  {
    pattern: /\b(sodium\s+lauryl\s+sulfate|sls)\b/i,
    name: 'Sodium Lauryl Sulfate (SLS)',
    category: 'harsh_sulfate',
    categoryLabel: 'Harsh Sulfate Cleanser',
    severity: 'warning',
    explanation: 'Very harsh surfactant that strips natural lipids, leading to dry scalp, irritation, and cuticle damage.'
  },
  {
    pattern: /\b(sodium\s+laureth\s+sulfate|sles)\b/i,
    name: 'Sodium Laureth Sulfate (SLES)',
    category: 'harsh_sulfate',
    categoryLabel: 'Sulfate Cleanser',
    severity: 'caution',
    explanation: 'Slightly milder than SLS due to ethoxylation, but can still strip moisture with daily use.'
  },
  {
    pattern: /\b(ammonium\s+lauryl\s+sulfate|als)\b/i,
    name: 'Ammonium Lauryl Sulfate (ALS)',
    category: 'harsh_sulfate',
    categoryLabel: 'Harsh Sulfate Cleanser',
    severity: 'warning',
    explanation: 'High-foaming strong detergent; prone to causing scalp tightness and color fade.'
  },
  {
    pattern: /\b(sodium\s+c14-16\s+olefin\s+sulfonate)\b/i,
    name: 'Sodium C14-16 Olefin Sulfonate',
    category: 'harsh_sulfate',
    categoryLabel: 'Clarifying Cleanser (Near-Sulfate)',
    severity: 'caution',
    explanation: 'Technically sulfate-free, but just as stripping as standard sulfates. Best for occasional deep cleansing only.'
  },

  // Gentle Cleansers
  {
    pattern: /\b(cocamidopropyl\s+betaine|coco\s+betaine)\b/i,
    name: 'Cocamidopropyl Betaine',
    category: 'gentle_cleanser',
    categoryLabel: 'Gentle Amphoteric Surfactant',
    severity: 'safe',
    explanation: 'Mild coconut-derived cleanser that cleans without stripping natural scalp moisture.'
  },
  {
    pattern: /\b(coco[- ]?glucoside|decyl\s+glucoside|lauryl\s+glucoside)\b/i,
    name: 'Alkyl Polyglucosides (Glucosides)',
    category: 'gentle_cleanser',
    categoryLabel: 'Ultra-Mild Cleanser',
    severity: 'safe',
    explanation: 'Biodegradable, non-ionic gentle cleanser ideal for sensitive or eczema-prone scalps.'
  },
  {
    pattern: /\b(sodium\s+cocoyl\s+isethionate)\b/i,
    name: 'Sodium Cocoyl Isethionate (SCI)',
    category: 'gentle_cleanser',
    categoryLabel: 'Creamy Gentle Surfactant',
    severity: 'safe',
    explanation: 'Known as "baby foam"; creates rich lather without altering the scalp\'s protective acid mantle.'
  },

  // Insoluble Silicones (Buildup risks)
  {
    pattern: /\b(dimethicone)\b/i,
    name: 'Dimethicone',
    category: 'insoluble_silicone',
    categoryLabel: 'Insoluble Silicone',
    severity: 'caution',
    explanation: 'Smooths cuticles and adds shine, but forms an insoluble waterproof barrier that requires sulfates or clarifying shampoo to wash out.'
  },
  {
    pattern: /\b(amodimethicone)\b/i,
    name: 'Amodimethicone',
    category: 'insoluble_silicone',
    categoryLabel: 'Targeted Silicone',
    severity: 'caution',
    explanation: 'Binds selectively to damaged areas of the hair shaft; provides superior heat protection but can weigh down fine/low-porosity hair.'
  },
  {
    pattern: /\b(dimethiconol)\b/i,
    name: 'Dimethiconol',
    category: 'insoluble_silicone',
    categoryLabel: 'Insoluble Silicone',
    severity: 'caution',
    explanation: 'Heavy silicone used for split-end sealing; requires thorough washing to prevent scalp buildup.'
  },

  // Water Soluble & Evaporating Silicones
  {
    pattern: /\b(peg-?\d+\s+dimethicone|dimethicone\s+copolyol)\b/i,
    name: 'PEG-Modified Dimethicone',
    category: 'water_soluble_silicone',
    categoryLabel: 'Water-Soluble Silicone',
    severity: 'safe',
    explanation: 'Easily rinses clean with plain water or mild sulfate-free shampoo with zero residue buildup.'
  },
  {
    pattern: /\b(cyclopentasiloxane|cyclomethicone)\b/i,
    name: 'Cyclopentasiloxane',
    category: 'water_soluble_silicone',
    categoryLabel: 'Volatile Silicone',
    severity: 'safe',
    explanation: 'Evaporates into the air after giving a silky slip during application; does not coat or weigh down hair.'
  },

  // Drying Alcohols
  {
    pattern: /\b(alcohol\s+denat|denatured\s+alcohol|sd\s+alcohol\s*40)\b/i,
    name: 'Alcohol Denat (Denatured Alcohol)',
    category: 'drying_alcohol',
    categoryLabel: 'Drying Short-Chain Alcohol',
    severity: 'warning',
    explanation: 'Quick-drying solvent that evaporates fast but strips hair cuticle moisture and exacerbates dry, flaky scalp.'
  },
  {
    pattern: /\b(isopropyl\s+alcohol|isopropanol)\b/i,
    name: 'Isopropyl Alcohol',
    category: 'drying_alcohol',
    categoryLabel: 'Harsh Drying Alcohol',
    severity: 'warning',
    explanation: 'Extremely dehydrating to hair shafts, leading to brittle strands and frizz when used frequently.'
  },

  // Nourishing Fatty Alcohols
  {
    pattern: /\b(cetyl\s+alcohol|stearyl\s+alcohol|cetearyl\s+alcohol|behenyl\s+alcohol)\b/i,
    name: 'Fatty Alcohol (Cetyl / Stearyl / Cetearyl)',
    category: 'fatty_alcohol',
    categoryLabel: 'Moisturizing Fatty Alcohol',
    severity: 'safe',
    explanation: 'Derived from natural plant oils; acts as an emollient that lubricates, softens, and detangles hair with zero dryness.'
  },

  // Pore Cloggers & Comedogenic Components
  {
    pattern: /\b(mineral\s+oil|paraffinum\s+liquidum|petrolatum)\b/i,
    name: 'Mineral Oil / Petrolatum',
    category: 'pore_clogger',
    categoryLabel: 'Heavy Occlusive / Comedogenic',
    severity: 'caution',
    explanation: 'Locks in moisture on hair lengths, but suffocates scalp pores and traps dead skin cells if applied directly to the scalp.'
  },
  {
    pattern: /\b(isopropyl\s+myristate|isopropyl\s+palmitate)\b/i,
    name: 'Isopropyl Myristate',
    category: 'pore_clogger',
    categoryLabel: 'Pore-Clogging Ester',
    severity: 'caution',
    explanation: 'High comedogenicity rating (4/5); can trigger folliculitis or hairline acne on acne-prone scalps.'
  },

  // Proteins
  {
    pattern: /\b(hydrolyzed\s+keratin|hydrolyzed\s+wheat\s+protein|hydrolyzed\s+silk|hydrolyzed\s+soy\s+protein|amino\s+acids)\b/i,
    name: 'Hydrolyzed Protein / Amino Acids',
    category: 'protein',
    categoryLabel: 'Structural Protein',
    severity: 'safe',
    explanation: 'Temporarily patches damaged gaps in high-porosity or bleached hair. Caution: low-porosity hair can get stiff if overused (protein overload).'
  },

  // Humectants
  {
    pattern: /\b(glycerin|glycerol)\b/i,
    name: 'Glycerin',
    category: 'humectant',
    categoryLabel: 'Moisture Humectant',
    severity: 'safe',
    explanation: 'Pulls moisture from ambient air into hair. In extremely dry or desert climates (<30% humidity), can pull water out of hair instead.'
  },
  {
    pattern: /\b(panthenol|pro-vitamin\s+b5)\b/i,
    name: 'Panthenol (Pro-Vitamin B5)',
    category: 'humectant',
    categoryLabel: 'Deep Penetrating Humectant',
    severity: 'safe',
    explanation: 'Penetrates hair cortex to increase elasticity and relieve scalp itching.'
  },
  {
    pattern: /\b(hyaluronic\s+acid|sodium\s+hyaluronate)\b/i,
    name: 'Hyaluronic Acid',
    category: 'humectant',
    categoryLabel: 'Ultra-Hydrating Humectant',
    severity: 'safe',
    explanation: 'Holds up to 1000x its weight in water, providing weightless hydration without grease.'
  },

  // Preservatives & Caution Ingredients
  {
    pattern: /\b(dmdm\s+hydantoin|diazolidinyl\s+urea|imidazolidinyl\s+urea)\b/i,
    name: 'Formaldehyde-Releasing Preservative',
    category: 'preservative_caution',
    categoryLabel: 'Preservative of Concern',
    severity: 'warning',
    explanation: 'Slowly releases micro-amounts of formaldehyde for antimicrobial protection; known contact allergen for sensitive scalps.'
  },
  {
    pattern: /\b(methylchloroisothiazolinone|methylisothiazolinone|mci\/mi)\b/i,
    name: 'MCI / MI Preservatives',
    category: 'preservative_caution',
    categoryLabel: 'Sensitizing Preservative',
    severity: 'caution',
    explanation: 'Strong preservative; safe in wash-off shampoos but banned in leave-on hair products due to allergic sensitization.'
  },

  // Beneficial Botanicals
  {
    pattern: /\b(rosmarinus\s+officinalis|rosemary\s+leaf\s+oil|rosemary\s+extract)\b/i,
    name: 'Rosemary Leaf Extract / Oil',
    category: 'beneficial_botanical',
    categoryLabel: 'Scalp Stimulating Botanical',
    severity: 'safe',
    explanation: 'Clinically shown in trials to support scalp micro-circulation and counter follicle miniaturization comparable to mild minoxidil.'
  },
  {
    pattern: /\b(melaleuca\s+alternifolia|tea\s+tree\s+oil)\b/i,
    name: 'Tea Tree Oil',
    category: 'beneficial_botanical',
    categoryLabel: 'Anti-Microbial Botanical',
    severity: 'safe',
    explanation: 'Natural anti-fungal action against Malassezia yeast, helping to control dandruff and scalp odor.'
  },
  {
    pattern: /\b(salicylic\s+acid|bha)\b/i,
    name: 'Salicylic Acid (BHA)',
    category: 'beneficial_botanical',
    categoryLabel: 'Keratolytic Exfoliant',
    severity: 'safe',
    explanation: 'Oil-soluble acid that penetrates and clears sebum build-up and dead flakes around follicle openings.'
  },
  {
    pattern: /\b(ketoconazole)\b/i,
    name: 'Ketoconazole',
    category: 'beneficial_botanical',
    categoryLabel: 'Anti-Dandruff / DHT Inhibitor',
    severity: 'safe',
    explanation: 'Gold standard antifungal for seborrheic dermatitis; also has mild anti-androgenic effects on scalp receptors.'
  }
];

export const PRESET_PRODUCTS = [
  {
    id: 'sulfate_shampoo',
    name: 'Standard Drugstore Clarifying Shampoo',
    ingredients: 'Water (Aqua), Sodium Lauryl Sulfate, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Dimethicone, Fragrance, Glycol Distearate, DMDM Hydantoin, Citric Acid, Tetrasodium EDTA.'
  },
  {
    id: 'gentle_cleanser',
    name: 'Clean Gentle Scalp Cleanser',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Sodium Cocoyl Isethionate, Glycerin, Panthenol, Rosmarinus Officinalis (Rosemary) Leaf Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Phenoxyethanol, Ethylhexylglycerin.'
  },
  {
    id: 'silicone_serum',
    name: 'High-Gloss Anti-Frizz Serum',
    ingredients: 'Cyclopentasiloxane, Dimethiconol, Dimethicone, Argania Spinosa Kernel Oil, Isopropyl Myristate, Fragrance (Parfum), Alcohol Denat.'
  },
  {
    id: 'damage_repair_mask',
    name: 'Intense Keratin Hair Mask',
    ingredients: 'Water, Cetearyl Alcohol, Behentrimonium Chloride, Cetyl Alcohol, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, Amodimethicone, Glycerin, Butyrospermum Parkii (Shea) Butter, Phenoxyethanol.'
  }
];

export function analyzeIngredients(rawText: string, userScalpType: string = 'normal'): AnalysisResult {
  if (!rawText || rawText.trim().length === 0) {
    return {
      totalAnalyzed: 0,
      cleanScore: 100,
      verdict: 'Good',
      summary: 'No ingredients entered.',
      matches: [],
      sulfatesFound: [],
      siliconesFound: [],
      dryingAlcoholsFound: [],
      poreCloggersFound: [],
      proteinsFound: [],
      scalpVerdict: 'Enter or paste ingredients above to scan.',
      porosityVerdict: 'Neutral.'
    };
  }

  const matches: IngredientMatch[] = [];
  const matchedRules = new Set<string>();

  for (const rule of INGREDIENT_DATABASE) {
    if (rule.pattern.test(rawText)) {
      if (!matchedRules.has(rule.name)) {
        matchedRules.add(rule.name);
        matches.push({
          name: rule.name,
          category: rule.category,
          categoryLabel: rule.categoryLabel,
          severity: rule.severity,
          explanation: rule.explanation
        });
      }
    }
  }

  const sulfatesFound = matches.filter(m => m.category === 'harsh_sulfate').map(m => m.name);
  const siliconesFound = matches.filter(m => m.category === 'insoluble_silicone' || m.category === 'water_soluble_silicone').map(m => m.name);
  const dryingAlcoholsFound = matches.filter(m => m.category === 'drying_alcohol').map(m => m.name);
  const poreCloggersFound = matches.filter(m => m.category === 'pore_clogger').map(m => m.name);
  const proteinsFound = matches.filter(m => m.category === 'protein').map(m => m.name);

  // Score Calculation
  let baseScore = 100;
  baseScore -= (sulfatesFound.length * 20);
  baseScore -= (dryingAlcoholsFound.length * 25);
  baseScore -= (matches.filter(m => m.category === 'preservative_caution').length * 15);
  baseScore -= (poreCloggersFound.length * 10);
  baseScore -= (matches.filter(m => m.category === 'insoluble_silicone').length * 10);
  
  // Bonus for gentle & beneficial ingredients
  const gentleCount = matches.filter(m => m.category === 'gentle_cleanser' || m.category === 'beneficial_botanical').length;
  baseScore += Math.min(gentleCount * 5, 15);

  const cleanScore = Math.max(10, Math.min(100, baseScore));

  let verdict: AnalysisResult['verdict'] = 'Good';
  if (cleanScore >= 85) verdict = 'Excellent';
  else if (cleanScore >= 65) verdict = 'Good';
  else if (cleanScore >= 45) verdict = 'Use With Caution';
  else verdict = 'Not Recommended';

  // Scalp Type Context
  let scalpVerdict = 'Generally safe for regular scalp use.';
  if (userScalpType === 'dry' && (sulfatesFound.length > 0 || dryingAlcoholsFound.length > 0)) {
    scalpVerdict = '⚠️ Warning for Dry Scalp: Contains moisture-stripping agents that can trigger peeling and irritation.';
  } else if (userScalpType === 'oily' && poreCloggersFound.length > 0) {
    scalpVerdict = '⚠️ Caution for Oily Scalp: Contains comedogenic agents that can clog hair follicles and worsen sebum buildup.';
  } else if (userScalpType === 'sensitive' && matches.some(m => m.severity === 'warning')) {
    scalpVerdict = '⚠️ Alert for Sensitive Scalp: Detected harsh compounds that may provoke redness or itching.';
  } else if (matches.some(m => m.category === 'gentle_cleanser')) {
    scalpVerdict = '✅ Scalp Friendly: Uses gentle surfactant systems that respect the epidermal barrier.';
  }

  // Porosity Verdict
  let porosityVerdict = 'Compatible with most hair porosity levels.';
  if (proteinsFound.length > 0 && siliconesFound.some(s => s.includes('Dimethicone'))) {
    porosityVerdict = 'Best for High Porosity: Rich in reparative proteins and sealing agents to smooth open cuticles.';
  } else if (proteinsFound.length > 0) {
    porosityVerdict = 'Caution for Low Porosity: Contains proteins. Use in moderation to avoid stiff, brittle protein overload.';
  } else if (matches.some(m => m.category === 'humectant')) {
    porosityVerdict = 'Ideal for Low to Medium Porosity: Lightweight humectant moisture without heavy build-up.';
  }

  const summary = `${matches.length} key active cosmetic compounds identified. Clean Score: ${cleanScore}/100.`;

  return {
    totalAnalyzed: matches.length,
    cleanScore,
    verdict,
    summary,
    matches,
    sulfatesFound,
    siliconesFound,
    dryingAlcoholsFound,
    poreCloggersFound,
    proteinsFound,
    scalpVerdict,
    porosityVerdict
  };
}
