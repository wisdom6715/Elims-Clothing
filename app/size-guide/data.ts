export interface MeasurementPair {
  in: string;
  cm: string;
}

export interface FittedSize {
  size: string;
  uk: string;
  us: string;
  eu: string;
  bust: MeasurementPair;
  waist: MeasurementPair;
  hip: MeasurementPair;
  length: MeasurementPair;
}

export interface FreeSize {
  size: string;
  uk: string;
  bust: MeasurementPair;
  waist: MeasurementPair;
  hip: MeasurementPair;
}

export interface KidsSizeRow {
  size: string;
  usSize: string;
  age: string;
  height: MeasurementPair;
  chest: MeasurementPair;
  waist: MeasurementPair;
  hip: MeasurementPair;
  shoulder: MeasurementPair;
  sleeve: MeasurementPair;
  suggestedDressLength?: MeasurementPair;
  trouserInseam?: MeasurementPair;
}

export interface LengthOption {
  option: string;
  label: string;
  inches: string;
  cm: string;
}

export interface MeasureStep {
  number: string;
  title: string;
  description: string;
}

export type FeatureIcon = "gem" | "sparkles" | "ruler" | "tag" | "award";

export interface Feature {
  label: string;
  icon: FeatureIcon;
}

export const fittedSizes: FittedSize[] = [
  {
    size: "S",
    uk: "8 — 10",
    us: "4 — 6",
    eu: "36 — 38",
    bust: { in: "34-36", cm: "86-91" },
    waist: { in: "28-30", cm: "71-76" },
    hip: { in: "38-40", cm: "97-102" },
    length: { in: "56-58", cm: "142-147" },
  },
  {
    size: "M",
    uk: "12 — 14",
    us: "8 — 10",
    eu: "40 — 42",
    bust: { in: "38-40", cm: "97-102" },
    waist: { in: "32-34", cm: "81-86" },
    hip: { in: "42-44", cm: "107-112" },
    length: { in: "58-60", cm: "147-152" },
  },
  {
    size: "L",
    uk: "16 — 18",
    us: "12 — 14",
    eu: "44 — 46",
    bust: { in: "42-44", cm: "107-112" },
    waist: { in: "36-38", cm: "91-97" },
    hip: { in: "46-48", cm: "117-122" },
    length: { in: "60-62", cm: "152-157" },
  },
  {
    size: "XL",
    uk: "20",
    us: "16",
    eu: "48",
    bust: { in: "46-48", cm: "117-122" },
    waist: { in: "40-42", cm: "102-107" },
    hip: { in: "50-52", cm: "127-132" },
    length: { in: "62-64", cm: "157-163" },
  },
  {
    size: "XXL",
    uk: "22 — 24",
    us: "18 — 20",
    eu: "50 — 52",
    bust: { in: "50-52", cm: "127-132" },
    waist: { in: "44-46", cm: "112-117" },
    hip: { in: "54-56", cm: "137-142" },
    length: { in: "62-64", cm: "157-163" },
  },
];

export const freeSizes: FreeSize[] = [
  {
    size: "S",
    uk: "8 — 10",
    bust: { in: "42", cm: "107" },
    waist: { in: "36", cm: "91" },
    hip: { in: "44", cm: "112" },
  },
  {
    size: "M",
    uk: "12 — 14",
    bust: { in: "46", cm: "117" },
    waist: { in: "40", cm: "102" },
    hip: { in: "48", cm: "122" },
  },
  {
    size: "L",
    uk: "16 — 18",
    bust: { in: "50", cm: "127" },
    waist: { in: "44", cm: "112" },
    hip: { in: "52", cm: "132" },
  },
  {
    size: "XL",
    uk: "20",
    bust: { in: "54", cm: "137" },
    waist: { in: "48", cm: "122" },
    hip: { in: "56", cm: "142" },
  },
  {
    size: "XXL",
    uk: "22 — 24",
    bust: { in: "60", cm: "152" },
    waist: { in: "54", cm: "137" },
    hip: { in: "60", cm: "152" },
  },
];

export const lengthOptions: LengthOption[] = [
  { option: "Option 01", label: "Petite", inches: "54 — 56 in", cm: "137 — 142 cm" },
  { option: "Option 02", label: "Regular", inches: "58 — 60 in", cm: "147 — 152 cm" },
  { option: "Option 03", label: "Tall", inches: "62 — 64 in", cm: "157 — 163 cm" },
];

export const measureSteps: MeasureStep[] = [
  {
    number: "01",
    title: "Burst (Bust)",
    description:
      "Measure around the fullest part of your bust, keeping the tape straight across your back.",
  },
  {
    number: "02",
    title: "Waist",
    description:
      "Measure around the smallest part of your waist, typically just above the navel.",
  },
  {
    number: "03",
    title: "Hip",
    description:
      "Measure around the fullest part of your hips, making sure the tape is level.",
  },
  {
    number: "04",
    title: "Length",
    description:
      "Measure from your shoulder (or highest point) down to your desired length on the floor.",
  },
];

export const features: Feature[] = [
  { label: "Premium Quality", icon: "gem" },
  { label: "Timeless Elegance", icon: "sparkles" },
  { label: "Designed to Stand Apart", icon: "ruler" },
  { label: "Exclusive Style", icon: "tag" },
  { label: "Luxury Details", icon: "award" },
];

export const girlsSizes: KidsSizeRow[] = [
  {
    size: "XXS",
    usSize: "2T",
    age: "2",
    height: { in: "33-35", cm: "84-89" },
    chest: { in: "20-21", cm: "51-53" },
    waist: { in: "19.5-20", cm: "50-51" },
    hip: { in: "20-21", cm: "51-53" },
    shoulder: { in: "8.5-9", cm: "22-23" },
    sleeve: { in: "11-12", cm: "28-30" },
    suggestedDressLength: { in: "18-19", cm: "46-48" },
  },
  {
    size: "XS",
    usSize: "3T",
    age: "3",
    height: { in: "36-38", cm: "91-97" },
    chest: { in: "21-22", cm: "53-56" },
    waist: { in: "20-20.5", cm: "51-52" },
    hip: { in: "21-22", cm: "53-56" },
    shoulder: { in: "9-9.5", cm: "23-24" },
    sleeve: { in: "12-13", cm: "30-33" },
    suggestedDressLength: { in: "20-21", cm: "51-53" },
  },
  {
    size: "XS",
    usSize: "4T",
    age: "4",
    height: { in: "39-41", cm: "99-104" },
    chest: { in: "22-23", cm: "56-58" },
    waist: { in: "20.5-21", cm: "52-53" },
    hip: { in: "22-23", cm: "56-58" },
    shoulder: { in: "9.5-10", cm: "24-25" },
    sleeve: { in: "13-14", cm: "33-36" },
    suggestedDressLength: { in: "22-23", cm: "56-58" },
  },
  {
    size: "S",
    usSize: "5",
    age: "5",
    height: { in: "42-44", cm: "107-112" },
    chest: { in: "23-24", cm: "58-61" },
    waist: { in: "21-21.5", cm: "53-55" },
    hip: { in: "23-24", cm: "58-61" },
    shoulder: { in: "10-10.5", cm: "25-27" },
    sleeve: { in: "14-15", cm: "36-38" },
    suggestedDressLength: { in: "24-25", cm: "61-64" },
  },
  {
    size: "S",
    usSize: "6",
    age: "6",
    height: { in: "45-47", cm: "114-119" },
    chest: { in: "24-25", cm: "61-64" },
    waist: { in: "21.5-22", cm: "55-56" },
    hip: { in: "24-25", cm: "61-64" },
    shoulder: { in: "10.5-11", cm: "27-28" },
    sleeve: { in: "15-16", cm: "38-41" },
    suggestedDressLength: { in: "26-27", cm: "66-69" },
  },
  {
    size: "M",
    usSize: "7",
    age: "7",
    height: { in: "48-50", cm: "122-127" },
    chest: { in: "25-26", cm: "64-66" },
    waist: { in: "22-23", cm: "56-58" },
    hip: { in: "25-26.5", cm: "64-67" },
    shoulder: { in: "11-11.5", cm: "28-29" },
    sleeve: { in: "16-17", cm: "41-43" },
    suggestedDressLength: { in: "28-29", cm: "71-74" },
  },
  {
    size: "M",
    usSize: "8",
    age: "8",
    height: { in: "51-53", cm: "130-135" },
    chest: { in: "26-27.5", cm: "66-70" },
    waist: { in: "23-24", cm: "58-61" },
    hip: { in: "26.5-28", cm: "67-71" },
    shoulder: { in: "11.5-12", cm: "29-30" },
    sleeve: { in: "17-18", cm: "43-46" },
    suggestedDressLength: { in: "30-31", cm: "76-79" },
  },
  {
    size: "L",
    usSize: "10",
    age: "9-10",
    height: { in: "54-56", cm: "137-142" },
    chest: { in: "27.5-29", cm: "70-74" },
    waist: { in: "24-25", cm: "61-64" },
    hip: { in: "28-30", cm: "71-76" },
    shoulder: { in: "12-12.5", cm: "30-32" },
    sleeve: { in: "18-19", cm: "46-48" },
    suggestedDressLength: { in: "32-34", cm: "81-86" },
  },
  {
    size: "L",
    usSize: "12",
    age: "11-12",
    height: { in: "57-59", cm: "145-150" },
    chest: { in: "29-30.5", cm: "74-77" },
    waist: { in: "25-26", cm: "64-66" },
    hip: { in: "30-32", cm: "76-81" },
    shoulder: { in: "12.5-13", cm: "32-33" },
    sleeve: { in: "19-20", cm: "48-51" },
    suggestedDressLength: { in: "35-37", cm: "89-94" },
  },
  {
    size: "XL",
    usSize: "14",
    age: "13-14",
    height: { in: "60-62", cm: "152-157" },
    chest: { in: "30.5-32", cm: "77-81" },
    waist: { in: "26-27", cm: "66-69" },
    hip: { in: "32-34", cm: "81-86" },
    shoulder: { in: "13-13.5", cm: "33-34" },
    sleeve: { in: "20-21", cm: "51-53" },
    suggestedDressLength: { in: "38-40", cm: "97-102" },
  },
  {
    size: "XXL",
    usSize: "16",
    age: "15-16",
    height: { in: "63-65", cm: "160-165" },
    chest: { in: "32-34", cm: "81-86" },
    waist: { in: "27-28.5", cm: "69-72" },
    hip: { in: "34-36", cm: "86-91" },
    shoulder: { in: "13.5-14", cm: "34-36" },
    sleeve: { in: "21-22", cm: "53-56" },
    suggestedDressLength: { in: "41-43", cm: "104-109" },
  },
];

export const boysSizes: KidsSizeRow[] = [
  {
    size: "XXS",
    usSize: "2T",
    age: "2",
    height: { in: "33-35", cm: "84-89" },
    chest: { in: "20-21", cm: "51-53" },
    waist: { in: "19.5-20", cm: "50-51" },
    hip: { in: "20-21", cm: "51-53" },
    shoulder: { in: "8.5-9", cm: "22-23" },
    sleeve: { in: "11-12", cm: "28-30" },
    trouserInseam: { in: "12-13", cm: "30-33" },
  },
  {
    size: "XS",
    usSize: "3T",
    age: "3",
    height: { in: "36-38", cm: "91-97" },
    chest: { in: "21-22", cm: "53-56" },
    waist: { in: "20-20.5", cm: "51-52" },
    hip: { in: "21-22", cm: "53-56" },
    shoulder: { in: "9-9.5", cm: "23-24" },
    sleeve: { in: "12-13", cm: "30-33" },
    trouserInseam: { in: "14-15", cm: "36-38" },
  },
  {
    size: "XS",
    usSize: "4T",
    age: "4",
    height: { in: "39-41", cm: "99-104" },
    chest: { in: "22-23", cm: "56-58" },
    waist: { in: "20.5-21", cm: "52-53" },
    hip: { in: "22-23", cm: "56-58" },
    shoulder: { in: "9.5-10", cm: "24-25" },
    sleeve: { in: "13-14", cm: "33-36" },
    trouserInseam: { in: "16-17", cm: "41-43" },
  },
  {
    size: "S",
    usSize: "5",
    age: "5",
    height: { in: "42-44", cm: "107-112" },
    chest: { in: "23-24", cm: "58-61" },
    waist: { in: "21-21.5", cm: "53-55" },
    hip: { in: "23-24", cm: "58-61" },
    shoulder: { in: "10-10.5", cm: "25-27" },
    sleeve: { in: "14-15", cm: "36-38" },
    trouserInseam: { in: "18-19", cm: "46-48" },
  },
  {
    size: "S",
    usSize: "6",
    age: "6",
    height: { in: "45-47", cm: "114-119" },
    chest: { in: "24-25", cm: "61-64" },
    waist: { in: "21.5-22", cm: "55-56" },
    hip: { in: "24-25", cm: "61-64" },
    shoulder: { in: "10.5-11", cm: "27-28" },
    sleeve: { in: "15-16", cm: "38-41" },
    trouserInseam: { in: "20-21", cm: "51-53" },
  },
  {
    size: "M",
    usSize: "7",
    age: "7",
    height: { in: "48-50", cm: "122-127" },
    chest: { in: "25-26", cm: "64-66" },
    waist: { in: "22-23", cm: "56-58" },
    hip: { in: "25-26.5", cm: "64-67" },
    shoulder: { in: "11-11.5", cm: "28-29" },
    sleeve: { in: "16-17", cm: "41-43" },
    trouserInseam: { in: "22-23", cm: "56-58" },
  },
  {
    size: "M",
    usSize: "8",
    age: "8",
    height: { in: "51-53", cm: "130-135" },
    chest: { in: "26-27.5", cm: "66-70" },
    waist: { in: "23-24", cm: "58-61" },
    hip: { in: "26.5-28", cm: "67-71" },
    shoulder: { in: "11.5-12", cm: "29-30" },
    sleeve: { in: "17-18", cm: "43-46" },
    trouserInseam: { in: "24-25", cm: "61-64" },
  },
  {
    size: "L",
    usSize: "10",
    age: "9-10",
    height: { in: "54-56", cm: "137-142" },
    chest: { in: "27.5-29", cm: "70-74" },
    waist: { in: "24-25", cm: "61-64" },
    hip: { in: "28-30", cm: "71-76" },
    shoulder: { in: "12-12.5", cm: "30-32" },
    sleeve: { in: "18-19", cm: "46-48" },
    trouserInseam: { in: "26-27", cm: "66-69" },
  },
  {
    size: "L",
    usSize: "12",
    age: "11-12",
    height: { in: "57-59", cm: "145-150" },
    chest: { in: "29-30.5", cm: "74-77" },
    waist: { in: "25-26", cm: "64-66" },
    hip: { in: "30-32", cm: "76-81" },
    shoulder: { in: "12.5-13", cm: "32-33" },
    sleeve: { in: "19-20", cm: "48-51" },
    trouserInseam: { in: "28-29", cm: "71-74" },
  },
  {
    size: "XL",
    usSize: "14",
    age: "13-14",
    height: { in: "60-62", cm: "152-157" },
    chest: { in: "30.5-32", cm: "77-81" },
    waist: { in: "26-27", cm: "66-69" },
    hip: { in: "32-34", cm: "81-86" },
    shoulder: { in: "13-13.5", cm: "33-34" },
    sleeve: { in: "20-21", cm: "51-53" },
    trouserInseam: { in: "30-31", cm: "76-79" },
  },
  {
    size: "XXL",
    usSize: "16",
    age: "15-16",
    height: { in: "63-65", cm: "160-165" },
    chest: { in: "32-34", cm: "81-86" },
    waist: { in: "27-28.5", cm: "69-72" },
    hip: { in: "34-36", cm: "86-91" },
    shoulder: { in: "13.5-14", cm: "34-36" },
    sleeve: { in: "21-22", cm: "53-56" },
    trouserInseam: { in: "32-33", cm: "81-84" },
  },
];