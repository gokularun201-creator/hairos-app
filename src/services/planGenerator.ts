import { HairScanResult, PlanDay, ProductCheckResult } from '../types';
import { analyzeIngredients } from './ingredientAnalyzer';

export function generateThirtyDayPlan(scan: HairScanResult): PlanDay[] {
  const isOily = scan.scalpCondition === 'Oily';
  const isDry = scan.scalpCondition === 'Dry';
  const isCurly = scan.hairType === 'Curly' || scan.hairType === 'Coily';
  const isFine = scan.texture === 'Fine';
  const hasThinning = scan.concerns.includes('thinning') || scan.concerns.includes('hair_fall');
  const hasFrizz = scan.frizzLevel === 'High' || scan.concerns.includes('frizz');

  // Wash cadence: Oily = every 2 days; Dry/Curly = every 3-4 days
  const washInterval = isOily ? 2 : 3;

  const plan: PlanDay[] = [];

  for (let day = 1; day <= 30; day++) {
    const weekNumber = Math.ceil(day / 7);
    const isWashDay = (day === 1) || ((day - 1) % washInterval === 0);
    const isMilestone = day === 1 || day === 7 || day === 14 || day === 21 || day === 30;

    let phaseTitle = 'Phase 1: Scalp Reset & Barrier Balance';
    if (weekNumber === 2) phaseTitle = 'Phase 2: Hydration Balance & Cuticle Sealing';
    if (weekNumber === 3) phaseTitle = 'Phase 3: Mechanical Protection & Follicle Flow';
    if (weekNumber === 4) phaseTitle = 'Phase 4: Habit Mastery & Transformation';

    let dayTitle = `Day ${day}: `;
    let focus = '';
    const habits: PlanDay['habits'] = [];

    if (isWashDay) {
      dayTitle += isOily ? 'Clarifying Scalp Wash & Light Seal' : 'Hydrating Gentle Wash & Moisture Lock';
      focus = isOily 
        ? 'Deeply clear sebum build-up around follicle openings with lukewarm water.' 
        : 'Gently cleanse scalp while protecting vulnerable mid-lengths with plenty of conditioner slip.';

      habits.push({
        id: `d${day}-wash`,
        title: isOily ? 'Gentle Scalp Emulsification (Wash Day)' : 'Gentle Cleansing Wash (Lukewarm Water)',
        category: 'wash',
        completed: false
      });

      habits.push({
        id: `d${day}-cond`,
        title: isFine 
          ? 'Lightweight Conditioner (Ends Only, avoid scalp)' 
          : 'Moisture Sealing Conditioner (2 min dwell time)',
        category: 'condition',
        completed: false
      });
    } else {
      dayTitle += isCurly ? 'Curl Refresh & Scalp Barrier Rest' : 'Hydration & Friction Defense';
      focus = 'Rest the scalp lipid barrier. Avoid overwashing and focus on internal hydration.';

      habits.push({
        id: `d${day}-hyd`,
        title: 'Drink 2.5L Water (Keep follicular cells turgid)',
        category: 'hydrate',
        completed: false
      });

      if (hasThinning || day % 2 === 0) {
        habits.push({
          id: `d${day}-scalp`,
          title: '3-Min Gentle Scalp Massage (Boost galea micro-circulation)',
          category: 'scalp',
          completed: false
        });
      }
    }

    // Daily night habit
    habits.push({
      id: `d${day}-night`,
      title: isCurly 
        ? 'Silk/Satin Bonnet or Pillowcase (Zero curl friction)' 
        : 'Loose protective detangling before bed',
      category: 'night',
      completed: false
    });

    // Milestone photo habit
    if (isMilestone) {
      habits.push({
        id: `d${day}-photo`,
        title: day === 1 
          ? '📸 Capture Baseline Photos (Front, Top, Side)' 
          : `📸 Week ${weekNumber} Progress Photo Check-in`,
        category: 'photo',
        completed: false
      });
    }

    // Dynamic food suggestions
    const foodTips = [
      'Almonds & Walnuts (Zinc & Vitamin E support keratin structure)',
      'Eggs or Tofu/Paneer (Essential cysteine amino acids for hair shaft strength)',
      'Spinach or Green Leafy Greens (Plant-based iron for red blood cell oxygen transport to follicles)',
      'Chia or Flaxseeds (Omega-3 fatty acids to soothe dry scalp inflammation)',
      'Greek Yogurt or Sprouted Moong (High bioavailability protein for follicular matrix)',
      'Pumpkin seeds (Rich in phytosterols & magnesium to support healthy scalp enzyme balance)',
      'Citrus fruit / Amla / Guava (Vitamin C promotes collagen synthesis around hair roots)'
    ];
    const foodTip = foodTips[(day - 1) % foodTips.length];

    // Dynamic hair wisdom tips
    let hairTip = 'Never rub wet hair violently with a rough towel; use a cotton t-shirt or microfiber wrap.';
    if (isWashDay) {
      hairTip = 'Finish your wash with a 30-second cool water rinse to clamp down the outer cuticle scales for natural shine.';
    } else if (hasFrizz) {
      hairTip = 'In high humidity, avoid leave-ins packed with simple glycerin as the first 3 ingredients; use light sealing oil drops instead.';
    } else if (hasThinning) {
      hairTip = 'Scalp tension in the crown restricts capillary flow. Gentle fingertip kneading promotes local nutrient perfusion.';
    }

    plan.push({
      dayNumber: day,
      weekNumber,
      phaseTitle,
      title: dayTitle,
      focus,
      habits,
      foodTip,
      hairTip,
      isMilestonePhotoDay: isMilestone
    });
  }

  return plan;
}

export function checkProductCompatibility(
  productName: string,
  brand: string,
  category: string,
  ingredients: string,
  scan: HairScanResult
): ProductCheckResult {
  const analysis = analyzeIngredients(ingredients, scan.scalpCondition.toLowerCase());
  const goodPoints: string[] = [];
  const thingsToConsider: string[] = [];

  let matchScore = analysis.cleanScore;

  // Evaluate for user's scalp
  if (scan.scalpCondition === 'Oily') {
    if (analysis.sulfatesFound.length === 0 && analysis.poreCloggersFound.length === 0) {
      goodPoints.push('Contains no pore-clogging heavy waxes or comedogenic mineral oils, keeping oily scalp follicles clear.');
      matchScore += 5;
    }
    if (analysis.poreCloggersFound.length > 0) {
      thingsToConsider.push(`Contains comedogenic ingredients (${analysis.poreCloggersFound.join(', ')}) that can exacerbate oiliness and buildup on your scalp.`);
      matchScore -= 15;
    }
  } else if (scan.scalpCondition === 'Dry' || scan.scalpCondition === 'Sensitive') {
    if (analysis.dryingAlcoholsFound.length > 0) {
      thingsToConsider.push(`Contains drying short-chain alcohols (${analysis.dryingAlcoholsFound.join(', ')}) that may cause stinging or flaking on your dry/sensitive scalp.`);
      matchScore -= 20;
    } else {
      goodPoints.push('Free from drying short-chain alcohols, respecting your scalp barrier.');
      matchScore += 5;
    }
  }

  // Evaluate for texture & hair type
  if (scan.texture === 'Fine') {
    if (analysis.siliconesFound.length > 0) {
      thingsToConsider.push('Contains insoluble silicones (e.g. Dimethicone) which may weigh down fine hair and flatten natural volume over time.');
      matchScore -= 10;
    } else {
      goodPoints.push('Silicone-free formula prevents weight and preserves natural bounce in fine strands.');
      matchScore += 5;
    }
  }

  // Evaluate for proteins & frizz
  if (analysis.proteinsFound.length > 0) {
    if (scan.hairType === 'Curly' || scan.concerns.includes('breakage')) {
      goodPoints.push(`Contains structural proteins (${analysis.proteinsFound.join(', ')}) to help temporarily reinforce damaged cuticle gaps.`);
      matchScore += 10;
    } else {
      thingsToConsider.push('Contains proteins. If your hair feels stiff or brittle after use, rotate with pure moisturizing products to avoid protein overload.');
    }
  }

  // Beneficial ingredients
  if (analysis.matches.some(m => m.category === 'beneficial_botanical')) {
    const botanicals = analysis.matches.filter(m => m.category === 'beneficial_botanical').map(m => m.name);
    goodPoints.push(`Infused with active botanicals (${botanicals.join(', ')}) clinically recognized for scalp wellness.`);
    matchScore += 10;
  }

  // Default fallback points if clean
  if (goodPoints.length === 0) {
    goodPoints.push('Standard cosmetic formulation with no severe toxic allergens detected.');
  }
  if (thingsToConsider.length === 0) {
    thingsToConsider.push('Well-tolerated profile. Always conduct a small 24-hr patch test on your inner arm when trying new products.');
  }

  // Normalize match percentage
  const finalPercentage = Math.max(25, Math.min(98, matchScore));

  let verdict: ProductCheckResult['verdict'] = 'Suitable for your current routine';
  let verdictColor: ProductCheckResult['verdictColor'] = 'teal';

  if (finalPercentage >= 85) {
    verdict = 'Highly recommended';
    verdictColor = 'emerald';
  } else if (finalPercentage >= 70) {
    verdict = 'Suitable for your current routine';
    verdictColor = 'teal';
  } else if (finalPercentage >= 50) {
    verdict = 'Use with caution';
    verdictColor = 'amber';
  } else {
    verdict = 'Not recommended';
    verdictColor = 'rose';
  }

  // How to use instructions
  let howToUse = 'Apply as directed on the label.';
  const lowerCat = (category || '').toLowerCase();
  if (lowerCat.includes('shampoo')) {
    howToUse = 'Emulsify between wet hands first to build lather. Massage onto scalp only; avoid scrubbing your ends. Rinse with lukewarm water.';
  } else if (lowerCat.includes('conditioner') || lowerCat.includes('mask')) {
    howToUse = 'Squeeze excess water from hair. Apply strictly from mid-lengths to ends, keeping 2 inches away from your scalp. Leave for 2-3 mins before cool rinsing.';
  } else if (lowerCat.includes('oil') || lowerCat.includes('serum')) {
    howToUse = 'Warm 2-3 drops between your palms. Smooth gently over damp hair ends to seal in hydration and protect against atmospheric frizz.';
  }

  return {
    productName: productName || 'Scanned Hair Product',
    brand: brand || 'Cosmetic Brand',
    category: category || 'Care Product',
    matchPercentage: finalPercentage,
    verdict,
    verdictColor,
    goodPoints,
    thingsToConsider,
    howToUse
  };
}
