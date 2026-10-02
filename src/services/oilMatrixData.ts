// Hair Oil Chemistry & Fatty Acid Matrix
// Penetrating vs Sealing Oils based on molecular weight, porosity, and lipid science

export interface HairOilProfile {
  id: string;
  name: string;
  botanicalName: string;
  type: 'penetrating' | 'sealing' | 'occlusive' | 'active_essential';
  typeLabel: string;
  primaryFattyAcid: string;
  molecularWeight: 'Low (Enters Cortex)' | 'Medium (Cuticle Buffer)' | 'High (Surface Shield)';
  bestPorosity: 'low' | 'medium' | 'high' | 'all';
  bestPorosityLabel: string;
  scalpSafetyScore: number; // 1-100 (high = safe for scalp)
  comedogenicRating: number; // 0-5
  howToUse: string;
  clinicalFact: string;
}

export const HAIR_OIL_DATABASE: HairOilProfile[] = [
  {
    id: 'coconut',
    name: 'Virgin Coconut Oil',
    botanicalName: 'Cocos Nucifera',
    type: 'penetrating',
    typeLabel: 'Deep Penetrating Oil',
    primaryFattyAcid: 'Lauric Acid (~50%)',
    molecularWeight: 'Low (Enters Cortex)',
    bestPorosity: 'high',
    bestPorosityLabel: 'High Porosity / Damaged Hair',
    scalpSafetyScore: 55,
    comedogenicRating: 4,
    howToUse: 'Use strictly as a pre-shampoo treatment (30 mins before wash). Avoid leaving on oily scalp as it can clog follicle pores.',
    clinicalFact: 'A landmark 2003 Journal of Cosmetic Science study proved coconut oil is one of the only oils small enough to enter the hair cortex and prevent protein loss during washing.'
  },
  {
    id: 'jojoba',
    name: 'Pure Golden Jojoba Oil',
    botanicalName: 'Simmondsia Chinensis',
    type: 'sealing',
    typeLabel: 'Sebum-Mimicking Wax Ester',
    primaryFattyAcid: 'Gadoleic & Erucic Acid',
    molecularWeight: 'Medium (Cuticle Buffer)',
    bestPorosity: 'all',
    bestPorosityLabel: 'All Porosities (Ideal for Low & Normal)',
    scalpSafetyScore: 98,
    comedogenicRating: 2,
    howToUse: 'Excellent carrier oil for Rosemary oil. Can be massaged directly into scalp or used as a lightweight post-wash serum on damp ends.',
    clinicalFact: 'Chemically, Jojoba is not a triglyceride oil; it is a liquid wax ester that closely mirrors 25% of human sebum, meaning it balances oil production without clogging.'
  },
  {
    id: 'argan',
    name: 'Moroccan Argan Oil',
    botanicalName: 'Argania Spinosa',
    type: 'sealing',
    typeLabel: 'Nutrient-Rich Cuticle Sealant',
    primaryFattyAcid: 'Oleic Acid (43%) & Linoleic Acid (37%)',
    molecularWeight: 'Medium (Cuticle Buffer)',
    bestPorosity: 'all',
    bestPorosityLabel: 'Medium & High Porosity',
    scalpSafetyScore: 92,
    comedogenicRating: 0,
    howToUse: 'Rub 2-3 drops between palms and glide over damp hair lengths to lock in hydration and tame frizz without a greasy look.',
    clinicalFact: 'High in Vitamin E (tocopherols) and squalene, protecting hair keratin against lipid peroxidation and heat damage from blow-drying.'
  },
  {
    id: 'castor',
    name: 'Cold-Pressed Castor Oil',
    botanicalName: 'Ricinus Communis',
    type: 'occlusive',
    typeLabel: 'Heavy Viscous Occlusive',
    primaryFattyAcid: 'Ricinoleic Acid (90%)',
    molecularWeight: 'High (Surface Shield)',
    bestPorosity: 'high',
    bestPorosityLabel: 'High Porosity / Coarse Hair Only',
    scalpSafetyScore: 70,
    comedogenicRating: 1,
    howToUse: 'NEVER use 100% pure on fine hair. Always dilute 1 part castor oil with 3 parts light oil (Jojoba/Sweet Almond) for easy washing.',
    clinicalFact: 'Ricinoleic acid provides intense surface lubrication, reducing frictional breakage, but does NOT penetrate the hair cortex due to high molecular viscosity.'
  },
  {
    id: 'sweet_almond',
    name: 'Sweet Almond Oil',
    botanicalName: 'Prunus Amygdalus Dulcis',
    type: 'sealing',
    typeLabel: 'Light Emollient Sealant',
    primaryFattyAcid: 'Oleic Acid (68%)',
    molecularWeight: 'Medium (Cuticle Buffer)',
    bestPorosity: 'low',
    bestPorosityLabel: 'Low & Medium Porosity',
    scalpSafetyScore: 88,
    comedogenicRating: 2,
    howToUse: 'Great lightweight pre-wash detangling oil. Coats hair fiber smoothly, preventing snagging with wide-tooth combs.',
    clinicalFact: 'Rich in biotin precursors and zinc, it softens the hair cuticle layer without creating a heavy impermeable film.'
  },
  {
    id: 'olive',
    name: 'Extra Virgin Olive Oil',
    botanicalName: 'Olea Europaea',
    type: 'penetrating',
    typeLabel: 'Partial Penetrating Emollient',
    primaryFattyAcid: 'Oleic Acid (70-80%)',
    molecularWeight: 'Low-Medium',
    bestPorosity: 'high',
    bestPorosityLabel: 'High Porosity & Dry Scalp',
    scalpSafetyScore: 65,
    comedogenicRating: 2,
    howToUse: 'Deep conditioning hot oil treatment for dry or bleached hair ends. Warm gently before applying.',
    clinicalFact: 'Contains squalene and tyrosol antioxidants that coat damaged split ends and temporarily reduce porosity gaps.'
  },
  {
    id: 'rosemary_essential',
    name: 'Rosemary Essential Oil',
    botanicalName: 'Rosmarinus Officinalis',
    type: 'active_essential',
    typeLabel: 'Clinical Active Essential Oil',
    primaryFattyAcid: '1,8-Cineole, Camphor, Pinene',
    molecularWeight: 'Low (Volatile Terpenes)',
    bestPorosity: 'all',
    bestPorosityLabel: 'All Hair Types (Targeted Scalp Use)',
    scalpSafetyScore: 90, // When properly diluted
    comedogenicRating: 0,
    howToUse: 'MUST be diluted in carrier oil (1-2% concentration = 10-12 drops per 30ml carrier). Never apply directly undiluted!',
    clinicalFact: 'In the 2015 randomized clinical trial by Panahi et al., 2% rosemary oil achieved comparable hair count increases to 2% minoxidil after 6 months of consistent use with significantly less scalp itching.'
  }
];

export function getRecommendedOilCombination(scalpType: string, porosity: string) {
  if (porosity === 'low') {
    return {
      preWash: 'Sweet Almond or Argan Oil (Lightweight, won\'t weigh down cuticles)',
      carrierForScalp: 'Golden Jojoba Oil (Mimics sebum, zero pore clogging)',
      postWashSealant: '1-2 drops Argan Oil or Grapeseed Oil on damp ends',
      avoid: 'Virgin Coconut Oil and Castor Oil (too heavy, creates stiff protein-like buildup on low-porosity cuticles)'
    };
  }

  if (porosity === 'high') {
    return {
      preWash: 'Virgin Coconut Oil (Essential: enters cortex to prevent hygral fatigue and protein wash-out)',
      carrierForScalp: 'Jojoba + 20% Castor Oil blend (Rich lipid nourishment)',
      postWashSealant: 'Argan Oil or Shea butter on ends (Seals raised cuticle gaps)',
      avoid: 'Relying solely on lightweight sprays without an occlusive sealing layer'
    };
  }

  return {
    preWash: 'Golden Jojoba or Sweet Almond Oil',
    carrierForScalp: 'Jojoba Oil with 2% Rosemary Essential Oil',
    postWashSealant: '2 drops Argan Oil',
    avoid: 'Over-saturating scalp with heavy butter or unrefined mineral grease'
  };
}
