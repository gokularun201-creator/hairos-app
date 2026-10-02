export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: 'shampoo' | 'conditioner' | 'mask' | 'oil' | 'serum' | 'styling';
  categoryLabel: string;
  description: string;
  ingredients: string;
  targetHair: string;
  popularRating: number; // e.g. 4.8
  tags: string[];
}

export const EXPANDED_PRODUCT_DATABASE: ProductItem[] = [
  // --- BOND BUILDERS & REPAIR ---
  {
    id: 'olaplex-no3',
    name: 'No. 3 Hair Perfector',
    brand: 'Olaplex',
    category: 'mask',
    categoryLabel: 'Bond Repair Treatment',
    description: 'Patented Bis-Aminopropyl Diglycol Dimaleate rebuilds broken disulfide bonds from chemical, heat, and mechanical damage.',
    ingredients: 'Water (Aqua/Eau), Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Phenoxyethanol, Glycerin, Hydroxyethyl Ethylcellulose, Stearamidopropyl Dimethylamine, Quaternium-91, Cetrimonium Methosulfate, Cetrimonium Chloride, Fragrance (Parfum), Polyquaternium-37, Tetrasodium EDTA, Benzyl Benzoate, Etidronic Acid, Ascorbic Acid, Phytantriol, Tocopheryl Acetate, Aloe Barbadensis Leaf Juice, Panthenol, Simmondsia Chinensis (Jojoba) Seed Oil, Citric Acid, Potassium Sorbate, Sodium Benzoate.',
    targetHair: 'Damaged, Bleached, Color-Treated, High Porosity',
    popularRating: 4.8,
    tags: ['bond repair', 'color safe', 'sulfate free']
  },
  {
    id: 'k18-leave-in-mask',
    name: 'Leave-In Molecular Repair Hair Mask',
    brand: 'K18 Biomimetic Hairscience',
    category: 'mask',
    categoryLabel: 'Biomimetic Peptide Treatment',
    description: 'Patented K18Peptide reverses damage from bleach, color, chemical services, and heat in 4 minutes without rinsing.',
    ingredients: 'Water (Aqua) (Eau), Alcohol Denat., Propylene Glycol, Cetearyl Alcohol, Dicaprylyl Ether, Cetyl Esters, Behentrimonium Chloride, Polysorbate 20, sh-Oligopeptide-78 (K18Peptide), Hydrolyzed Wheat Protein, Hydrolyzed Wheat Starch, Isopropyl Alcohol, Tocopherol, Phenoxyethanol, Potassium Sorbate, Citric Acid, Fragrance (Parfum), Geraniol, Linalool, Hexyl Cinnamal, Benzyl Alcohol.',
    targetHair: 'Severely Damaged, Elasticity Loss, Bleached',
    popularRating: 4.9,
    tags: ['peptide', 'molecular repair', 'leave-in']
  },
  {
    id: 'minimalist-maleic-05',
    name: 'Maleic Bond Repair Complex 05% Serum',
    brand: 'Minimalist',
    category: 'serum',
    categoryLabel: 'Pre-Shampoo Bond Repair',
    description: 'Formulated with Maleic Acid, Transglutaminase and Amino Acids to repair disulphide bonds and protect against external stressors.',
    ingredients: 'Aqua, Maleic Acid, Propylene Glycol, Aminomethyl Propanol, Hydrolyzed Wheat Protein, Transglutaminase, Sodium Benzoate, Phenoxyethanol, Ethylhexylglycerin, Disodium EDTA.',
    targetHair: 'Frizzy, Chemically Treated, Brittle Hair',
    popularRating: 4.6,
    tags: ['maleic acid', 'pre-wash', 'fragrance free']
  },
  {
    id: 'redken-acidic-bonding',
    name: 'Acidic Bonding Concentrate Intensive Treatment',
    brand: 'Redken',
    category: 'mask',
    categoryLabel: 'Acidic pH Bond Fortifier',
    description: '14% Bonding Care Complex with Citric Acid reinforces weakened bonds to improve hair strength and resilience.',
    ingredients: 'Aqua/Water, Cetearyl Alcohol, Glycerin, Behentrimonium Chloride, Stearyl Alcohol, Citric Acid, Cetyl Esters, Sodium Citrate, Isopropyl Alcohol, Parfum/Fragrance, Phenoxyethanol, Polyquaternium-10, Polysorbate 20, Hydroxypropyl Guar, Limonene, Linalool.',
    targetHair: 'Color-treated, Weak, Processed Hair',
    popularRating: 4.7,
    tags: ['citric acid', 'acidic ph', 'salon professional']
  },
  {
    id: 'living-proof-triple-bond',
    name: 'Triple Bond Complex Leave-In',
    brand: 'Living Proof',
    category: 'serum',
    categoryLabel: 'Leave-In Bond Builder',
    description: 'Builds a 3D network within the hair fiber to repair 100% of damage and make hair 8x stronger against breakage.',
    ingredients: 'Water/Eau/Aqua, Cetyl Alcohol, Glyceryl Stearate, Isodecyl Oleate, Isoamyl Laurate, Dioctyldodecyl Dodecanedioate, Behentrimonium Chloride, Diheptyl Succinate, Capryloyl Glycerin/Sebacic Acid Copolymer, Phytosteryl/Octyldodecyl Lauroyl Glutamate, Hydrolyzed Pea Protein, Fragrance/Parfum.',
    targetHair: 'Split Ends, Heat Weakened, Fine to Thick',
    popularRating: 4.7,
    tags: ['triple bond', 'heat activated', 'anti-breakage']
  },

  // --- SHAMPOOS & CLARIFIERS ---
  {
    id: 'nizoral-ad',
    name: 'A-D Anti-Dandruff Shampoo (Ketoconazole 1%)',
    brand: 'Nizoral',
    category: 'shampoo',
    categoryLabel: 'Clinical Anti-Dandruff Shampoo',
    description: 'Contains Ketoconazole 1% to control Malassezia yeast fungus, relieving stubborn flaking, scaling, and scalp itching.',
    ingredients: 'Ketoconazole 1%, Water, Sodium Laureth Sulfate, Cocamide MEA, Sodium Cocoyl Sarcosinate, Glycol Distearate, Acrylic Acid Polymer (Carbomer 1342), Fragrance, Sodium Chloride, Tetrasodium EDTA, Butylated Hydroxytoluene, Quaternium-15, Polyquaternium-7, FD&C Blue No. 1.',
    targetHair: 'Dandruff, Seborrheic Dermatitis, Oily Itchy Scalp',
    popularRating: 4.8,
    tags: ['ketoconazole', 'anti-dandruff', 'clarifying']
  },
  {
    id: 'loreal-hyaluron-moisture-shampoo',
    name: 'Hyaluron Moisture 72H Hydra Filling Shampoo',
    brand: "L'Oréal Paris",
    category: 'shampoo',
    categoryLabel: 'Hyaluronic Acid Hydrating Shampoo',
    description: 'Infused with Hyaluronic Acid to weightlessly plump dehydrated fibers and lock in moisture for 72 hours.',
    ingredients: 'Aqua/Water, Sodium Laureth Sulfate, Glycol Distearate, Sodium Chloride, Cocamidopropyl Betaine, Dimethicone, Sodium Hyaluronate, Cocamide MEA, Guar Hydroxypropyltrimonium Chloride, Sodium Benzoate, Sodium Hydroxide, Salicylic Acid, Carbomer, Citric Acid, Hexylene Glycol, Fragrance.',
    targetHair: 'Dehydrated, Lifeless, Dull Hair',
    popularRating: 4.5,
    tags: ['hyaluronic acid', 'hydration', 'volumizing']
  },
  {
    id: 'ouai-detox-shampoo',
    name: 'Detox Shampoo with Apple Cider Vinegar',
    brand: 'OUAI',
    category: 'shampoo',
    categoryLabel: 'Weekly Clarifying Cleanser',
    description: 'Uses Apple Cider Vinegar and Hydrolyzed Keratin to strip away heavy product buildup, hard water minerals, and excess oil.',
    ingredients: 'Aqua (Water, Eau), Sodium C14-16 Olefin Sulfonate, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Betaine, Decyl Glucoside, Acrylates Copolymer, Cocamide MIPA, Parfum (Fragrance), Apple Cider Vinegar, Hydrolyzed Keratin, Glycerin, Cetrimonium Chloride, Panthenol, Phenoxyethanol, Ethylhexylglycerin.',
    targetHair: 'All Hair Types with Buildup, Hard Water Residue',
    popularRating: 4.7,
    tags: ['clarifying', 'apple cider vinegar', 'detox']
  },
  {
    id: 'head-shoulders-clinical',
    name: 'Clinical Strength Dandruff Defense Shampoo',
    brand: 'Head & Shoulders',
    category: 'shampoo',
    categoryLabel: 'Selenium Sulfide Shampoo',
    description: 'Formulated with Selenium Sulfide 1% for maximum prescription-strength protection against severe flakes and scalp flare-ups.',
    ingredients: 'Selenium Sulfide 1%, Water, Sodium Laureth Sulfate, Glycol Distearate, Zinc Pyrithione, Sodium Chloride, Fragrance, Dimethicone, Ammonium Laureth Sulfate, Cocamide MEA, Sodium Citrate, Citric Acid, DMDM Hydantoin.',
    targetHair: 'Severe Flaking, Psoriasis Prone Scalp',
    popularRating: 4.6,
    tags: ['selenium sulfide', 'clinical', 'dandruff']
  },
  {
    id: 'wow-apple-cider-shampoo',
    name: 'Apple Cider Vinegar Shampoo',
    brand: 'WOW Skin Science',
    category: 'shampoo',
    categoryLabel: 'Sulfate-Free Clarifying Cleanser',
    description: 'Raw apple cider vinegar restores scalp pH and gently removes residue without harsh sulfates or parabens.',
    ingredients: 'Purified Water, Caprylyl/Capryl Glucoside, Sodium Methyl Cocoyl Taurate, Sodium Lauroyl Sarcosinate, Organic Apple Cider Vinegar, Almond Oil, Argan Oil, D Panthenol (Pro-Vitamin B5), Tocopheryl Acetate (Vitamin E), Fragrance, Citric Acid.',
    targetHair: 'Oily Scalp, Product Buildup, Dull Cuticles',
    popularRating: 4.3,
    tags: ['sulfate free', 'apple cider vinegar', 'ph balanced']
  },
  {
    id: 'shea-moisture-jbco-shampoo',
    name: 'Jamaican Black Castor Oil Strengthen & Restore Shampoo',
    brand: 'Shea Moisture',
    category: 'shampoo',
    categoryLabel: 'Nourishing Reparative Shampoo',
    description: 'Sulfate-free clarifying shampoo enriched with Jamaican Black Castor Oil, Fair Trade Shea Butter, and Peppermint.',
    ingredients: 'Water (Aqua), Decyl Glucoside, Sodium Lauroyl Lactylate, Fragrance (Essential Oil Blend), Glycerin (Vegetable), Hydrolyzed Rice Protein, Panthenol, Hydrolyzed Vegetable Protein PG-Propyl Silanetriol, Ricinus Communis (Castor) Seed Oil, Butyrospermum Parkii (Shea) Butter, Mentha Piperita (Peppermint) Leaf Extract, Yeast Extract, Tocopherol.',
    targetHair: 'Curly, Coily, Transitioning, Chemically Processed',
    popularRating: 4.6,
    tags: ['castor oil', 'shea butter', 'curl friendly']
  },
  {
    id: 'sebamed-anti-dandruff',
    name: 'Anti-Dandruff Shampoo pH 5.5',
    brand: 'Sebamed',
    category: 'shampoo',
    categoryLabel: 'Scalp Acid-Mantle Shampoo',
    description: 'Piroctone Olamine gently removes dandruff while pH 5.5 stabilizes the protective scalp acid mantle barrier.',
    ingredients: 'Aqua, Sodium Laureth Sulfate, Lauryl Glucoside, Sodium Lauroyl Sarcosinate, Sodium Chloride, Sodium Lactate, Hydroxypropyl Oxidized Starch PG-Trimonium Chloride, Piroctone Olamine, Glycol Distearate, Stearic Acid, Parfum, Phenoxyethanol, Sodium Benzoate.',
    targetHair: 'Sensitive, Oily Dandruff Scalp',
    popularRating: 4.5,
    tags: ['piroctone olamine', 'ph 5.5', 'dermatologist tested']
  },
  {
    id: 'neutrogena-tsal',
    name: 'T/Sal Therapeutic Shampoo (Salicylic Acid 3%)',
    brand: 'Neutrogena',
    category: 'shampoo',
    categoryLabel: 'Exfoliating Scalp Shampoo',
    description: 'Contains 3% Salicylic Acid to breakdown crusty scalp build-up, psoriasis plaques, and control sebum accumulation.',
    ingredients: 'Salicylic Acid 3%, Water, Sodium C14-16 Olefin Sulfonate, Cocamidopropyl Betaine, Sodium Chloride, PEG-120 Methyl Glucose Dioleate, Polyquaternium-22, DMDM Hydantoin, Tetrasodium EDTA.',
    targetHair: 'Seborrheic Dermatitis, Scalp Psoriasis, Heavy Build-up',
    popularRating: 4.6,
    tags: ['salicylic acid', 'scalp exfoliation', 'medicated']
  },
  {
    id: 'giovanni-tea-tree-triple-threat',
    name: 'Tea Tree Triple Threat Invigorating Shampoo',
    brand: 'Giovanni Eco Chic',
    category: 'shampoo',
    categoryLabel: 'Botanical Stimulating Cleanser',
    description: 'Infused with cooling Peppermint, Tea Tree, Rosemary, and Eucalyptus to stimulate scalp micro-circulation.',
    ingredients: 'Aqua (Purified Water), Sodium Cocoamphoacetate, Lauryl Glucoside, Sodium Cocoyl Glutamate, Sodium Lauryl Glucose Carboxylate, Decyl Glucoside, Cocamidopropyl Betaine, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Mentha Piperita (Peppermint) Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Eucalyptus Globulus Oil, Chamomilla Recutita Extract, Thyme Extract.',
    targetHair: 'All Hair Types, Sluggish Scalp, Fine to Normal',
    popularRating: 4.6,
    tags: ['tea tree', 'peppermint', 'organic botanicals']
  },
  {
    id: 'tresemme-keratin-smooth-shampoo',
    name: 'Keratin Smooth System Shampoo with Argan Oil',
    brand: 'TRESemmé',
    category: 'shampoo',
    categoryLabel: 'Frizz Control Keratin Shampoo',
    description: 'Infused with Hydrolyzed Keratin and Moroccan Argan Oil to seal cuticles and combat frizz for up to 72 hours.',
    ingredients: 'Water (Aqua), Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Dimethiconol, Fragrance (Parfum), Argania Spinosa Kernel Oil, Hydrolyzed Keratin, Glycerin, Glycol Distearate, Carbomer, TEA-Dodecylbenzenesulfonate, Guar Hydroxypropyltrimonium Chloride, Citric Acid, Disodium EDTA, DMDM Hydantoin.',
    targetHair: 'Frizzy, Unruly, Coarse, Straight to Wavy',
    popularRating: 4.4,
    tags: ['keratin', 'argan oil', 'silicone smoothing']
  },

  // --- CONDITIONERS & MASKS ---
  {
    id: 'briogeo-dont-despair-repair',
    name: "Don't Despair, Repair! Deep Conditioning Mask",
    brand: 'Briogeo',
    category: 'mask',
    categoryLabel: 'Protein & Moisture Restorative Mask',
    description: 'Clinically proven blend of Rosehip Oil, B-vitamins, and Algae Extract restores essential hydration and natural elasticity.',
    ingredients: 'Water/Aqua/Eau, Cetyl Alcohol, Stearyl Alcohol, Brassica Alcohol, Brassicyl Isoleucinate Esylate, Propanediol, Rosa Canina Seed Oil, Argania Spinosa Kernel Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Hydrolyzed Corn Protein, Hydrolyzed Wheat Protein, Hydrolyzed Soy Protein, Biotin, Panthenol, Algae Extract, Aloe Barbadensis Leaf Juice.',
    targetHair: 'Dry, Chemically Weakened, Curly, High Porosity',
    popularRating: 4.8,
    tags: ['clean beauty', 'algae extract', 'biotin']
  },
  {
    id: 'moroccanoil-intense-mask',
    name: 'Intense Hydrating Mask',
    brand: 'Moroccanoil',
    category: 'mask',
    categoryLabel: 'Argan Oil Deep Moisture Mask',
    description: 'Rich, creamy treatment infused with antioxidant-rich Argan Oil and nourishing ingredients to condition dry, medium-to-thick hair.',
    ingredients: 'Aqua/Water, Cetearyl Alcohol, Argania Spinosa (Argan) Kernel Oil, Canola Oil, Parfum/Fragrance, Dimethicone, Behentrimonium Methosulfate, Cetyl Alcohol, Ceteareth-20, Isopropyl Alcohol, Stearyl Alcohol, Citric Acid, Chlorphenesin, Phenoxyethanol.',
    targetHair: 'Medium to Thick, Very Dry, Dehydrated Hair',
    popularRating: 4.7,
    tags: ['argan oil', 'deep hydration', 'luxury']
  },
  {
    id: 'plum-olive-macadamia-mask',
    name: 'Olive & Macadamia Mega Moisturizing Hair Spa',
    brand: 'Plum Goodness',
    category: 'mask',
    categoryLabel: 'Plant Nutritive Hair Spa',
    description: 'Olive Oil, Macadamia Nut Oil, and Plant Keratin deeply nourish parched strands and reverse styling stress.',
    ingredients: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Olea Europaea (Olive) Fruit Oil, Macadamia Integrifolia (Macadamia) Seed Oil, Hydrolyzed Soy Protein, Hydrolyzed Wheat Protein, Hydrolyzed Corn Protein, D-Panthenol, Fragrance, Phenoxyethanol, Ethylhexylglycerin.',
    targetHair: 'Dry, Chemically Treated, Split Ends',
    popularRating: 4.5,
    tags: ['macadamia oil', 'plant keratin', 'vegan']
  },
  {
    id: 'shea-moisture-manuka-honey-mask',
    name: 'Manuka Honey & Mafura Oil Intensive Hydration Hair Masque',
    brand: 'Shea Moisture',
    category: 'mask',
    categoryLabel: 'Humectant Rich Moisture Masque',
    description: 'Intense conditioning masque infused with certified organic Shea Butter, Manuka Honey, and Mafura & Baobab Oils.',
    ingredients: 'Water, Cetearyl Alcohol, Cocos Nucifera (Coconut) Oil, Butyrospermum Parkii (Shea) Butter, Behentrimonium Chloride, Glycerin (Vegetable), Fragrance, Honey, Trichilia Emetica (Mafura) Seed Oil, Adansonia Digitata (Baobab) Seed Oil, Ficus Carica (Fig) Fruit/Leaf Extract, Tocopherol, Panthenol.',
    targetHair: 'Type 3 & 4 Curls, Parched Coarse Hair',
    popularRating: 4.8,
    tags: ['manuka honey', 'shea butter', 'curl definition']
  },
  {
    id: 'garnier-fructis-banana-food',
    name: 'Fructis 1 Minute Hair Treat (Banana Extract)',
    brand: 'Garnier',
    category: 'mask',
    categoryLabel: '3-in-1 Fast Nourishing Mask',
    description: '98% naturally derived formula packed with Banana Extract to deeply nourish dry strands without heavy weigh-down.',
    ingredients: '1199805 D - Aqua/Water, Cetearyl Alcohol, Glycerin, Isopropyl Myristate, Stearamidopropyl Dimethylamine, Musa Paradisiaca Fruit Juice/Banana Fruit Juice, Glycine Soja Oil/Soybean Oil, Helianthus Annuus Seed Oil/Sunflower Seed Oil, Rosmarinus Officinalis Leaf Extract, Coco-Caprylate/Caprate, Cetyl Esters, Citric Acid, Linalool, Fragrance.',
    targetHair: 'Dry, Dull, Wavy to Curly Hair',
    popularRating: 4.6,
    tags: ['banana extract', 'silicone free', 'fast acting']
  },
  {
    id: 'cantu-shea-butter-leavein',
    name: 'Shea Butter Leave-In Conditioning Repair Cream',
    brand: 'Cantu',
    category: 'conditioner',
    categoryLabel: 'Intensive Leave-In Conditioning Cream',
    description: 'Made with pure Shea Butter and essential oils to stop and mend hair breakage, leaving hair soft and manageable.',
    ingredients: 'Water (Aqua, Eau), Cetearyl Alcohol, Canola Oil, Glycerin, Butyrospermum Parkii (Shea) Butter, Dicetyldimonium Chloride, Behentrimonium Methosulfate, Fragrance (Parfum), Dimethicone, Isopropyl Alcohol, Polyquaternium-10, Sodium Chloride, Disodium EDTA, Citric Acid, Phenoxyethanol, Ethylhexylglycerin.',
    targetHair: 'Textured, Relaxed, Color Treated, Transitioning',
    popularRating: 4.5,
    tags: ['shea butter', 'leave in', 'breakage repair']
  },
  {
    id: 'redken-all-soft-conditioner',
    name: 'All Soft Argan Oil Conditioner',
    brand: 'Redken',
    category: 'conditioner',
    categoryLabel: 'Salon Softening Conditioner',
    description: 'Formulated with RCT Protein Complex and Argan Oil to deliver 15x more conditioning for dry, brittle hair.',
    ingredients: 'Aqua/Water/Eau, Cetearyl Alcohol, Behentrimonium Chloride, Elaeis Guineensis Oil/Palm Oil, Cetyl Alcohol, Isopropyl Alcohol, Phenoxyethanol, Stearamidopropyl Dimethylamine, Octyldodecanol, Sodium PCA, Parfum/Fragrance, Citric Acid, Argania Spinosa Kernel Oil, Hydrolyzed Soy Protein, Hydrolyzed Vegetable Protein.',
    targetHair: 'Brittle, Dry, Rough Cuticle Hair',
    popularRating: 4.7,
    tags: ['argan oil', 'rct protein', 'softness']
  },

  // --- SCALP SERUMS & TONICS ---
  {
    id: 'the-ordinary-density-serum',
    name: 'Multi-Peptide Serum for Hair Density',
    brand: 'The Ordinary',
    category: 'serum',
    categoryLabel: 'High-Concentration Density Serum',
    description: 'Concentrated serum combining REDENSYL, Procapil, CAPIXYL, BAICAPIL, and Caffeine to boost hair thickness and follicle vitality.',
    ingredients: 'Aqua (Water), Propanediol, Butylene Glycol, Glycerin, Caffeine, Biotinoyl Tripeptide-1, Acetyl Tetrapeptide-3, Larix Europaea Wood Extract, Pisum Sativum Extract, Scutellaria Baicalensis Root Extract, Camellia Sinensis Leaf Extract, Glycine Soja Germ Extract, Triticum Vulgare Germ Extract, Gluconolactone, Zinc Chloride, Glycine, Sodium Metabisulfite, Lactic Acid, Hydroxyethylcellulose, Phenoxyethanol.',
    targetHair: 'Thinning Hair, Telogen Effluvium, Low Density',
    popularRating: 4.7,
    tags: ['peptides', 'redensyl', 'caffeine', 'density']
  },
  {
    id: 'minimalist-hair-growth-actives-18',
    name: 'Hair Growth Actives 18% Hair Density Serum',
    brand: 'Minimalist',
    category: 'serum',
    categoryLabel: 'Multi-Active Density Tonic',
    description: 'A powerful blend of 5 proven hair growth actives: Capixyl 5%, Redensyl 3%, Procapil 3%, Anagain 3%, and Baicapil 4%.',
    ingredients: 'Aqua, Butylene Glycol, Dextran, Acetyl Tetrapeptide-3, Trifolium Pratense (Clover) Flower Extract, Glycerin, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract, PPG-26-Buteth-26, PEG-40 Hydrogenated Castor Oil, Apigenin, Oleanolic Acid, Biotinoyl Tripeptide-1, Pisum Sativum (Pea) Sprout Extract, Scutellaria Baicalensis Root Extract, Phenoxyethanol, Ethylhexylglycerin.',
    targetHair: 'Receding Hairlines, Thinning Crown, Shedding',
    popularRating: 4.8,
    tags: ['redensyl', 'capixyl', 'anagain', 'high concentration']
  },
  {
    id: 'mamaearth-rosemary-serum',
    name: 'Rosemary Anti-Hair Fall Scalp Serum with Methi Dana',
    brand: 'Mamaearth',
    category: 'serum',
    categoryLabel: 'Ayurvedic Botanical Scalp Serum',
    description: 'Rosemary oil boosts follicle micro-circulation while Methi Dana (Fenugreek) strengthens hair roots to reduce shedding.',
    ingredients: 'Aqua, Rosemary Leaf Extract, Trigonella Foenum-Graecum (Methi) Seed Extract, Glycerin, Hydrolyzed Keratin, Sodium Hyaluronate, Hydroxyethylcellulose, Niacinamide, Phenoxyethanol, Potassium Sorbate, Rosemary Essential Oil.',
    targetHair: 'Seasonal Shedding, Weak Roots, Dry Scalp',
    popularRating: 4.4,
    tags: ['rosemary', 'methi', 'fenugreek', 'scalp tonic']
  },
  {
    id: 'pilgrim-redensyl-serum',
    name: 'Redensyl & Anagain Advanced Hair Growth Serum',
    brand: 'Pilgrim',
    category: 'serum',
    categoryLabel: 'Follicle Rejuvenating Serum',
    description: 'Infused with Redensyl 3% and Anagain 3% alongside Green Tea extract to reactivate stem cells in the hair follicle bulge.',
    ingredients: 'Purified Water, Redensyl (Glycerin, Aqua, Sodium Metabisulfite, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract), Anagain (Pisum Sativum (Pea) Sprout Extract), Camellia Sinensis (Green Tea) Leaf Extract, Phenoxyethanol, Ethylhexylglycerin, Sodium Gluconate.',
    targetHair: 'Diffused Thinning, Stress Hair Fall, All Textures',
    popularRating: 4.6,
    tags: ['redensyl', 'anagain', 'green tea']
  },
  {
    id: 'wishcare-growth-serum-concentrate',
    name: 'Hair Growth Serum Concentrate',
    brand: 'WishCare',
    category: 'serum',
    categoryLabel: 'Peptide & Caffeine Serum',
    description: 'Concentrated clean blend of Caffeine, Biotin, Plant Keratin, and Fermented Rice Water for dense, lush hair growth.',
    ingredients: 'Aqua, Caffeine, Biotin, Rice Water Ferment Filtrate, Hydrolyzed Soy Protein, Hydrolyzed Wheat Protein, Saw Palmetto Extract, Horsetail Extract, Niacinamide, Hyaluronic Acid, Benzyl Alcohol, Salicylic Acid, Glycerin, Sorbic Acid.',
    targetHair: 'Sluggish Follicles, DHT Sensitivity, Thinning',
    popularRating: 4.5,
    tags: ['caffeine', 'saw palmetto', 'rice water']
  },
  {
    id: 'kirkland-minoxidil-5',
    name: 'Minoxidil 5% Extra Strength Topical Solution',
    brand: 'Kirkland / Rogaine',
    category: 'serum',
    categoryLabel: 'FDA-Approved Vasodilator',
    description: 'Clinically proven potassium channel opener that prolongs the anagen growth phase and enlarges miniaturized follicles.',
    ingredients: 'Minoxidil 5% w/v, Alcohol (30% v/v), Propylene Glycol (50% v/v), Purified Water.',
    targetHair: 'Androgenetic Alopecia, Crown Vertex Thinning (Men & Women)',
    popularRating: 4.8,
    tags: ['minoxidil', 'fda approved', 'anagen prolonger']
  },

  // --- HAIR OILS & ELIXIRS ---
  {
    id: 'moroccanoil-treatment-original',
    name: 'Moroccanoil Treatment Original',
    brand: 'Moroccanoil',
    category: 'oil',
    categoryLabel: 'Iconic Argan Conditioning Oil',
    description: 'The pioneer of oil-infused hair care. Infused with Argan Oil and Linseed Extract to instantly detangle, shine, and tame flyaways.',
    ingredients: 'Cyclomethicone, Dimethicone, Argania Spinosa (Argan) Kernel Oil, Fragrance/Parfum, Linum Usitatissimum (Linseed) Seed Extract, CI 26100 (Red 17), CI 47000 (Yellow 11).',
    targetHair: 'Normal to Coarse, Frizzy, High Porosity',
    popularRating: 4.9,
    tags: ['argan oil', 'linseed', 'shine enhancer']
  },
  {
    id: 'kerastase-elixir-ultime',
    name: "Elixir Ultime L'Huile Originale Hair Oil",
    brand: 'Kérastase',
    category: 'oil',
    categoryLabel: 'Precious Camellia & Marula Elixir',
    description: 'Infused with Wild French Camellia Oil and Marula Oil to deliver 96-hour frizz control and 230°C heat defense.',
    ingredients: 'Isododecane, Dimethicone, C11-13 Isoparaffin, Caprylic/Capric Triglyceride, Dimethiconol, Amodimethicone, Camellia Japonica Seed Oil, Zea Mays Germ Oil/Corn Oil, Argania Spinosa Kernel Oil, Sclerocarya Birrea Seed Oil (Marula), Pentaclethra Macroloba Seed Oil (Pracaxi), Fragrance/Parfum.',
    targetHair: 'Dull, Dry, High End Styling, All Types',
    popularRating: 4.8,
    tags: ['camellia oil', 'marula oil', 'heat defense']
  },
  {
    id: 'olaplex-no7-bonding-oil',
    name: 'No. 7 Bonding Oil',
    brand: 'Olaplex',
    category: 'oil',
    categoryLabel: 'Weightless Reparative Styling Oil',
    description: 'Highly-concentrated, weightless reparative styling oil that dramatically increases shine, softness, and protects up to 450°F.',
    ingredients: 'Dimethicone, Isohexadecane, C13-14 Isoparaffin, Coco-Caprylate, Phenyl Trimethicone, Bis-Aminopropyl Diglycol Dimaleate, Propanediol, Zea Mays (Corn) Oil, Beta-Carotene, Helianthus Annuus (Sunflower) Seed Oil, Moringa Oleifera Seed Oil, Punica Granatum (Pomegranate) Seed Oil, Fragrance (Parfum).',
    targetHair: 'All Hair Types, Fine to Coarse, Color Treated',
    popularRating: 4.8,
    tags: ['bonding oil', 'heat protection', 'weightless']
  },
  {
    id: 'mielle-rosemary-mint-oil',
    name: 'Rosemary Mint Scalp & Hair Strengthening Oil',
    brand: 'Mielle Organics',
    category: 'oil',
    categoryLabel: 'Biotin Infused Scalp Stimulator',
    description: 'Enriched with Rosemary, Mint, and Biotin to invigorate the scalp, nourish follicles, and smooth split ends.',
    ingredients: 'Glycine Soja (Soybean) Oil, Ricinus Communis (Castor) Seed Oil, Rosmarinus Officinalis (Rosemary) Leaf Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Mentha Piperita (Peppermint) Oil, Eucalyptus Globulus Leaf Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Cocos Nucifera (Coconut) Oil, Equisetum Arvense (Horsetail) Extract, Aloe Barbadensis Extract, Lavandula Angustifolia (Lavender) Oil, Triticum Vulgare (Wheat) Germ Oil, Carthamus Tinctorius (Safflower) Seed Oil, Oenothera Biennis (Evening Primrose) Oil, Vitis Vinifera (Grape) Seed Oil, Benzyl Nicotinate, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Oryza Sativa (Rice) Bran Oil, Tocopheryl Acetate, Biotin.',
    targetHair: 'Braids, Protective Styles, Sluggish Growth, Low/High Porosity',
    popularRating: 4.7,
    tags: ['rosemary', 'peppermint', 'biotin', 'castor oil']
  },
  {
    id: 'kama-bringadi-oil',
    name: 'Bringadi Intensive Hair Treatment Oil',
    brand: 'Kama Ayurveda',
    category: 'oil',
    categoryLabel: 'Authentic Ayurvedic Classical Oil',
    description: 'Traditional Ayurvedic recipe brewed in Pure Sesame Oil and Milk with Bhringraj, Indigo, Gooseberry (Amla), and Licorice.',
    ingredients: 'Sesamum Indicum (Sesame) Seed Oil, Eclipta Alba (Bhringraj) Extract, Indigofera Tinctoria (Indigo) Extract, Cardiospermum Halicacabum (Balloon Vine) Extract, Phyllanthus Emblica (Amla) Extract, Goat Milk, Glycyrrhiza Glabra (Licorice) Root Extract, Rosmarinus Officinalis Leaf Oil.',
    targetHair: 'Premature Graying, Dandruff, Root Weakness',
    popularRating: 4.7,
    tags: ['bhringraj', 'ayurvedic', 'amla', 'sesame oil']
  },
  {
    id: 'indulekha-bringha-oil',
    name: 'Bringha Ayurvedic Proprietary Medicine Hair Oil',
    brand: 'Indulekha',
    category: 'oil',
    categoryLabel: 'Clinical Anti-Hair Fall Oil',
    description: 'Contains 100% natural herbs extracted into Virgin Coconut Oil through sunlight extraction, proven to grow new hair in 4 months.',
    ingredients: 'Virgin Coconut Oil (Cocos Nucifera), Bringharaj (Eclipta Alba), Svetakutaja (Wrightia Tinctoria), Amla (Phyllanthus Emblica), Virgin Coconut Milk, Camphor (Cinnamomum Camphora), Kshiram (Cow Milk).',
    targetHair: 'Excessive Shedding, Patchy Hair Loss, Scalp Irritation',
    popularRating: 4.5,
    tags: ['bringha', 'selfie comb applicator', 'ayurveda']
  },
  {
    id: 'dabur-amla-hair-oil',
    name: 'Amla Traditional Hair Oil',
    brand: 'Dabur',
    category: 'oil',
    categoryLabel: 'Heritage Gooseberry Oil',
    description: 'Enriched with Indian Gooseberry (Amla) to strengthen roots from within and provide deep rich natural pigment protection.',
    ingredients: 'Mineral Oil (Paraffinum Liquidum), Canola Oil, Elaeis Guineensis Oil, Phyllanthus Emblica (Amla) Fruit Extract, Fragrance (Parfum), Butyl Methoxydibenzoylmethane, Antioxidant (TBHQ), CI 61565, CI 47000.',
    targetHair: 'Black Hair, Coarse Strands, Traditional Hot Oil Care',
    popularRating: 4.4,
    tags: ['amla', 'mineral oil base', 'deep darkening']
  },
  {
    id: 'parachute-100-pure-coconut-oil',
    name: '100% Pure Virgin Coconut Oil',
    brand: 'Parachute',
    category: 'oil',
    categoryLabel: 'Pure Lauric Acid Penetrating Oil',
    description: '100% pure coconut oil whose small molecular size penetrates deep into the hair cortex to prevent protein loss during washing.',
    ingredients: 'Pure Coconut Oil (100% Cocos Nucifera). Zero chemicals, zero mineral oil.',
    targetHair: 'Normal to Coarse, Pre-Wash Oil Bath, Low-to-Medium Porosity',
    popularRating: 4.9,
    tags: ['lauric acid', 'protein sparing', 'edible grade']
  },

  // --- STYLING, HEAT PROTECTANTS & LEAVE-INS ---
  {
    id: 'color-wow-dream-coat',
    name: 'Dream Coat Supernatural Spray',
    brand: 'Color WOW',
    category: 'styling',
    categoryLabel: 'Humidity-Proof Cuticle Sealant',
    description: 'Heat-activated polymer technology wraps every strand in an invisible waterproof cloak to prevent frizz in extreme humidity.',
    ingredients: 'Aqua/Water, Dipropylene Glycol, Polysilicone-29, Silicone Quaternium-18, Glycerin, Trideceth-6, Chamomilla Recutita (Matricaria) Flower Extract, Calendula Officinalis Flower Extract, Potassium Sorbate, Phenoxyethanol, Trideceth-12, Sodium Benzoate, Chlorphenesin, Potassium Benzoate, Disodium EDTA, Citric Acid.',
    targetHair: 'All Hair Types, Frizzy, Blow-Dry Styling',
    popularRating: 4.9,
    tags: ['heat activated', 'humidity proof', 'glass hair']
  },
  {
    id: 'chi-44-iron-guard',
    name: '44 Iron Guard Thermal Protection Spray',
    brand: 'CHI',
    category: 'styling',
    categoryLabel: 'Thermal Defense Spray',
    description: 'Contains Ceramic and silk proteins to shield hair against dramatic heat damage from flat irons and curling wands up to 450°F.',
    ingredients: 'Aqua/Water/Eau, Sodium Polystyrene Sulfonate, Alcohol Denat., Propanediol, Polysorbate 20, Hydrolyzed Silk, Phenoxyethanol, Caprylyl Glycol, Hexylene Glycol, Potassium Sorbate, Hydrolyzed Wheat Protein PG-Propyl Silanetriol, PPG-20 Methyl Glucose Ether, Parfum (Fragrance), Citric Acid.',
    targetHair: 'Daily Flat Iron Users, Heat Styling',
    popularRating: 4.6,
    tags: ['thermal shield', 'silk protein', 'ceramic']
  },
  {
    id: 'pureology-color-fanatic-21',
    name: 'Color Fanatic Multi-Tasking Leave-In Spray',
    brand: 'Pureology',
    category: 'styling',
    categoryLabel: '21-Benefit Leave-In Treatment',
    description: 'Primes, protects, and perfects with 21 essential benefits including heat protection, detangling, and AntiFade Complex.',
    ingredients: 'Aqua/Water/Eau, Cocos Nucifera Oil/Coconut Oil, Amodimethicone, Polyquaternium-37, PPG-5-Ceteth-10 Phosphate, Phenoxyethanol, Propylene Glycol Dicaprylate/Dicaprate, Acetamide MEA, Parfum/Fragrance, Lactamide MEA, Dimethicone PEG-7 Phosphate, PPG-1 Trideceth-6, Trideceth-6, Behentrimonium Chloride, Xylose, Ethylhexylglycerin, Helianthus Annuus Seed Extract, Camelina Sativa Seed Oil, Olea Europaea Fruit Oil, Tocopherol.',
    targetHair: 'Color Treated, Chemically Processed, Fine to Thick',
    popularRating: 4.8,
    tags: ['antifade', '21 benefits', 'leave in primer']
  },
  {
    id: 'shea-moisture-curl-smoothie',
    name: 'Coconut & Hibiscus Curl Enhancing Smoothie',
    brand: 'Shea Moisture',
    category: 'styling',
    categoryLabel: 'Curl Defining Cream',
    description: 'Infused with Silk Protein, Neem Oil, and Coconut Oil to condition curls, provide brilliant shine, and restore curl bounce.',
    ingredients: 'Deionized Water, Butyrospermum Parkii (Shea) Butter, Cocos Nucifera (Coconut) Oil, Macadamia Ternifolia Seed Oil, Magnifera Indica (Mango) Seed Butter, Persea Gratissima (Avocado) Oil, Vegetable Glycerin, Aloe Barbadensis Leaf Extract, Silk Protein, Melia Azadirachta (Neem) Seed Oil, Hibiscus Sabdariffa Flower Extract, Tocopherol (Vitamin E), Panthenol.',
    targetHair: 'Thick, Curly, Coily Types 3A to 4C',
    popularRating: 4.7,
    tags: ['curl smoothie', 'silk protein', 'neem oil']
  },
  {
    id: 'as-i-am-coconut-cowash',
    name: 'Coconut CoWash Cleansing Conditioner',
    brand: 'As I Am',
    category: 'conditioner',
    categoryLabel: 'Sulfate-Free Cleansing Conditioner',
    description: 'Light non-foaming cleansing cream that removes residue without stripping natural moisture from curls and coils.',
    ingredients: 'Aqua/Water/Eau, Cetyl Alcohol, Cetrimonium Chloride, Cetearyl Alcohol, Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, Colocasia Esculenta Root Powder (Tangerine), Phytosterols, Camellia Oleifera Leaf Extract, Pyrus Malus (Apple) Fruit Extract, Citrus Limon (Lemon) Peel Extract, Sugar Cane Extract, Fragrance/Parfum, Citric Acid, Phenoxyethanol, Caprylyl Glycol.',
    targetHair: 'Coily, Curly, Kinky, Dry Scalp',
    popularRating: 4.7,
    tags: ['cowash', 'curly girl method', 'gentle clean']
  },
  {
    id: 'garnier-sleek-shine-serum',
    name: 'Fructis Sleek & Shine Anti-Frizz Serum',
    brand: 'Garnier',
    category: 'serum',
    categoryLabel: 'Argan Anti-Frizz Serum',
    description: 'Soaks into frizzy, dry hair to provide long-lasting smoothness and luminous shine even in 97% humidity.',
    ingredients: 'Cyclopentasiloxane, Dimethiconol, Fragrance/Parfum, Argania Spinosa Oil/Argania Spinosa Kernel Oil, Prunus Armeniaca Kernel Oil/Apricot Kernel Oil, Hexyl Cinnamal, Benzyl Alcohol, Linalool, Amyl Cinnamal.',
    targetHair: 'Frizzy, Flyaway Hair, Quick Polish',
    popularRating: 4.6,
    tags: ['argan oil', 'apricot oil', 'instant shine']
  },
  {
    id: 'miss-jessies-pillow-soft-curls',
    name: 'Pillow Soft Curls Styling Lotion',
    brand: "Miss Jessie's",
    category: 'styling',
    categoryLabel: 'Soft Hold Styling Cream',
    description: 'Formulated with fabric-softener technology to create fluffy, featherweight, touchably soft big curls and waves.',
    ingredients: 'Water (Aqua), Polysorbate 20, Glycerin, Carbomer, PVP, Triethanolamine, DMDM Hydantoin, Fragrance (Parfum), Disodium EDTA, Hydrolyzed Wheat Protein, CI 17200 (Red 33).',
    targetHair: 'Wavy & Curly Hair Seeking Zero Crunch',
    popularRating: 4.5,
    tags: ['soft curls', 'touchable hold', 'crunch free']
  },
  {
    id: 'olaplex-no6-bond-smoother',
    name: 'No. 6 Bond Smoother Reparative Styling Creme',
    brand: 'Olaplex',
    category: 'styling',
    categoryLabel: 'Leave-In Reparative Styling Creme',
    description: 'Concentrated leave-in smoothing cream that strengthens, hydrates, moisturizes, and speeds up blow-dry times while calming frizz for up to 72 hours.',
    ingredients: 'Water, Cetearyl Alcohol, Dimethicone, Isohexadecane, Coco-Caprylate, Neopentyl Glycol Diheptanoate, Behentrimonium Chloride, Isododecane, Phenyl Trimethicone, Propanediol, Bis-Aminopropyl Diglycol Dimaleate, Fragrance (Parfum), Cetrimonium Chloride, Phenoxyethanol, Glyceryl Stearate, Hydroxypropyl Guar, Hydroxyethylcellulose, Quaternium-91, Cetrimonium Methosulfate, Phytantriol, Tocopheryl Acetate, Aloe Barbadensis Leaf Juice, Panthenol, Vitis Vinifera (Grape) Seed Oil, Helianthus Annuus (Sunflower) Seed Oil, Ferulic Acid.',
    targetHair: 'All Hair Types, Color Treated, Chemically Processed',
    popularRating: 4.8,
    tags: ['bond smoother', '72hr frizz', 'leave-in']
  }
];
