// Trichology & Hair Formulation Calculators
// Accurate, scientific, on-device calculations for real-world hair care

export interface DilutionCalculation {
  carrierOilMl: number;
  targetPercentage: number;
  essentialOilDrops: number;
  approxEssentialOilMl: number;
  safetyLevel: 'Ultra-Gentle' | 'Clinical Standard' | 'Maximum Safe Dose' | 'Unsafe';
  instructions: string;
}

export interface HardWaterResult {
  waterSource: string;
  estimatedTds: string;
  depositRisk: 'Low' | 'Moderate' | 'Severe Mineral Buildup';
  breakageImpact: string;
  acvRinseFormula: {
    acvAmount: string;
    waterAmount: string;
    targetPh: string;
    frequency: string;
    instructions: string;
  };
  citricAcidAlternative: {
    citricAcidAmount: string;
    waterAmount: string;
    instructions: string;
  };
}

export interface MicroneedleProtocol {
  needleDepth: string;
  frequency: string;
  purpose: string;
  waitPeriodActives: string;
  steps: string[];
  safetyCheck: string;
}

export const HairCalculators = {
  /**
   * Calculates safe dilution of Rosemary Essential Oil in carrier oils (Jojoba, Argan, Almond, Coconut)
   * Standard trichology rule: 1 ml essential oil ≈ 20 drops.
   * 1% dilution = 0.01 * carrierMl. Drops = (0.01 * carrierMl) * 20
   */
  calculateRosemaryDilution(carrierOilMl: number, targetPercentage: number): DilutionCalculation {
    const mlEssential = (carrierOilMl * targetPercentage) / 100;
    const drops = Math.round(mlEssential * 20);

    let safetyLevel: DilutionCalculation['safetyLevel'] = 'Clinical Standard';
    let instructions = 'Mix thoroughly in a dark amber glass bottle. Conduct a 24-hr inner-arm patch test before full scalp use.';

    if (targetPercentage <= 1) {
      safetyLevel = 'Ultra-Gentle';
      instructions = 'Ideal for sensitive scalps, first-time users, or daily scalp massages.';
    } else if (targetPercentage <= 2) {
      safetyLevel = 'Clinical Standard';
      instructions = 'Matches the 2015 Panahi clinical trial on rosemary oil vs 2% minoxidil. Use 3-4 times weekly.';
    } else if (targetPercentage <= 3) {
      safetyLevel = 'Maximum Safe Dose';
      instructions = 'Strong concentration. Only recommended for non-sensitive, resilient scalps.';
    } else {
      safetyLevel = 'Unsafe';
      instructions = '⚠️ DANGER: Exceeds 3% concentration! High risk of contact dermatitis, severe itching, and chemical burning of follicles.';
    }

    return {
      carrierOilMl,
      targetPercentage,
      essentialOilDrops: Math.max(1, drops),
      approxEssentialOilMl: parseFloat(mlEssential.toFixed(2)),
      safetyLevel,
      instructions
    };
  },

  /**
   * Calculates hard water damage risk and generates exact chelating acidic rinse recipes
   */
  assessHardWater(sourceType: 'borewell' | 'municipal' | 'ro_filtered' | 'tanker'): HardWaterResult {
    switch (sourceType) {
      case 'borewell':
      case 'tanker':
        return {
          waterSource: sourceType === 'borewell' ? 'Borewell / Ground Water' : 'Tanker Water',
          estimatedTds: '350 - 800+ ppm (Very Hard)',
          depositRisk: 'Severe Mineral Buildup',
          breakageImpact: 'Calcium & Magnesium salts crystalize inside hair cuticles, making strands stiff, brittle, and resistant to conditioner.',
          acvRinseFormula: {
            acvAmount: '2 tablespoons (30 ml) raw unfiltered ACV',
            waterAmount: '500 ml cool/lukewarm water',
            targetPh: 'pH 4.5 - 5.0 (natural hair mantle)',
            frequency: 'Once weekly after shampooing',
            instructions: 'Pour slowly over scalp and lengths as the final rinse. Massage for 60 seconds, then lightly rinse with cool water.'
          },
          citricAcidAlternative: {
            citricAcidAmount: '1/4 teaspoon food-grade citric acid powder',
            waterAmount: '1 Liter water',
            instructions: 'Dissolve completely. Pour over hair after shampoo to dissolve calcium carbonate crust.'
          }
        };

      case 'municipal':
        return {
          waterSource: 'Municipal / City Tap Water',
          estimatedTds: '150 - 300 ppm (Moderate Hardness)',
          depositRisk: 'Moderate',
          breakageImpact: 'Mild mineral coat over 2-3 weeks; can cause color dullness and sluggish lathering.',
          acvRinseFormula: {
            acvAmount: '1 tablespoon (15 ml) ACV',
            waterAmount: '500 ml water',
            targetPh: 'pH 4.8',
            frequency: 'Once every 10 to 14 days',
            instructions: 'Use as a clarifying rinse between regular washes.'
          },
          citricAcidAlternative: {
            citricAcidAmount: 'Pinch (1/8 teaspoon)',
            waterAmount: '1 Liter water',
            instructions: 'Mild acidic balancing rinse.'
          }
        };

      case 'ro_filtered':
      default:
        return {
          waterSource: 'RO / Soft Water Filter',
          estimatedTds: '20 - 90 ppm (Soft Water)',
          depositRisk: 'Low',
          breakageImpact: 'Negligible mineral stress. Cuticles remain smooth; shampoos foam easily.',
          acvRinseFormula: {
            acvAmount: '1 teaspoon (5 ml) ACV (Optional)',
            waterAmount: '500 ml water',
            targetPh: 'pH 5.2',
            frequency: 'Once a month for extra cuticle gloss',
            instructions: 'Optional shine rinse.'
          },
          citricAcidAlternative: {
            citricAcidAmount: 'Not needed',
            waterAmount: 'Not needed',
            instructions: 'Your water is already soft.'
          }
        };
    }
  },

  /**
   * Microneedling / Derma-roller clinical safety guidelines
   */
  getMicroneedleProtocol(depth: '0.25' | '0.5' | '1.0'): MicroneedleProtocol {
    switch (depth) {
      case '0.25':
        return {
          needleDepth: '0.25 mm (Product Enhancer)',
          frequency: '2 - 3 times per week',
          purpose: 'Micro-channels for enhanced topical absorption (peptides, serums). Does NOT cause micro-trauma bleeding.',
          waitPeriodActives: 'Can apply lightweight gentle serums immediately.',
          steps: [
            '1. Cleanse scalp with gentle shampoo and pat dry.',
            '2. Disinfect roller in 70% Isopropyl Alcohol for 10 minutes.',
            '3. Roll 4-5 times in vertical, horizontal, and diagonal directions.',
            '4. Apply serum gently without rubbing.'
          ],
          safetyCheck: 'Safe for daily/alternate use; do not press with heavy force.'
        };

      case '0.5':
      default:
        return {
          needleDepth: '0.5 mm (Follicle & Collagen Stimulator)',
          frequency: 'Once every 7 - 10 days',
          purpose: 'Triggers natural wound-healing cascade, stimulates VEGF and Wnt/β-catenin hair growth pathways.',
          waitPeriodActives: 'WAIT 24 HOURS before applying Minoxidil, essential oils, or strong actives to prevent systemic absorption/heart palpitations.',
          steps: [
            '1. Wash scalp with anti-bacterial or gentle cleanser; scalp must be 100% clean.',
            '2. Submerge roller in 70% Isopropyl alcohol for 15 minutes before use.',
            '3. Part hair neatly into sections. Roll with light, even pressure (4 passes per section).',
            '4. Scalp will have mild erythema (redness) — this is normal.',
            '5. Disinfect roller again immediately after use and store in a sterile case.',
            '6. Keep scalp clean and sweat-free for the next 12 hours.'
          ],
          safetyCheck: 'Never roll over active scalp infections, open sores, or active acne pustules.'
        };

      case '1.0':
        return {
          needleDepth: '1.0 mm (Deep Scalp Remodeling)',
          frequency: 'Once every 2 - 3 weeks',
          purpose: 'Deep follicular stimulation for stubborn thinning areas.',
          waitPeriodActives: 'STRICT 24 - 48 HOUR WAIT before any active chemicals or direct sunlight.',
          steps: [
            '1. Strict medical sterilization: 70% Isopropyl alcohol soak.',
            '2. Part hair and roll with very light hand; do not drag roller needles across the skin.',
            '3. Rinse with saline or clean cool water if pinpoint spotting occurs.',
            '4. Disinfect thoroughly.'
          ],
          safetyCheck: '⚠️ CAUTION: High risk of scarring if pressed too hard. Derma-stamps are preferred over rollers at this depth to prevent micro-tears.'
        };
    }
  }
};
