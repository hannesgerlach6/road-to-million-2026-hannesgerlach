// Ernährungsplan Daten basierend auf Hannes' Plan
// 2998 Kalorien | 220g Protein | 307g Carbs | 90g Fett

export interface Recipe {
  id: string
  name: string
  emoji: string
  category: 'fruehstueck' | 'mittag' | 'snack' | 'abend'
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  steps: string[]
  tip?: string
  prepTime: number // in Minuten
}

export interface Supplement {
  name: string
  time: 'morgens' | 'abends'
  amount: string
  note?: string
}

export interface DayPlan {
  fruehstueck: string // recipe id
  mittag: string
  snack: string
  abend: string
}

export interface WeekPlan {
  [key: string]: DayPlan // 'montag', 'dienstag', etc.
}

// Supplements
export const supplements: Supplement[] = [
  { name: 'Schwarzkümmelöl', time: 'morgens', amount: '1 Teelöffel pur', note: 'nüchtern' },
  { name: 'Probiotika', time: 'morgens', amount: '2 Kapseln mit Wasser', note: 'nüchtern' },
  { name: 'Zink', time: 'abends', amount: '1 Tablette', note: 'vor dem Schlafen' },
  { name: 'Flohsamenschalen', time: 'abends', amount: '1 TL in großem Glas Wasser', note: 'vor dem Schlafen' },
  { name: 'Butyrat', time: 'abends', amount: '1 Kapsel', note: 'vor dem Schlafen' },
]

// Hautpflege Routine
export const hautpflege = {
  time: 'abends',
  steps: [
    'Gesicht mit lauwarmem Wasser waschen',
    'Teebaumöl mit Wasser mischen (1 Teil Öl : 3 Teile Wasser)',
    'Mit Wattestäbchen NUR auf die Pickel tupfen',
    'Einwirken lassen, nicht abwaschen',
  ]
}

// Alle Rezepte
export const recipes: Recipe[] = [
  {
    id: 'mega-ruehrei',
    name: 'Mega Rührei',
    emoji: '🍳',
    category: 'fruehstueck',
    calories: 620,
    protein: 56,
    carbs: 8,
    fat: 40,
    prepTime: 10,
    ingredients: [
      '8 Bio-Eier',
      '1 EL Kokosöl',
      '1/2 Zucchini (gewürfelt)',
      'Salz, Pfeffer, Kurkuma',
    ],
    steps: [
      'Pfanne auf mittlere Hitze stellen. Kokosöl reingeben und schmelzen lassen.',
      'Zucchini-Würfel in die Pfanne geben. 3-4 Minuten anbraten bis sie leicht braun sind.',
      'Alle 8 Eier in eine Schüssel aufschlagen. Mit einer Gabel gut verquirlen.',
      'Salz, Pfeffer und eine gute Prise Kurkuma zu den Eiern geben. Nochmal mischen.',
      'Eier in die Pfanne zu den Zucchini geben. Hitze auf niedrig stellen.',
      'Mit einem Holzlöffel langsam vom Rand zur Mitte schieben. Immer wieder. Nicht zu viel rühren!',
      'Nach 3-4 Minuten sind die Eier cremig aber nicht mehr flüssig. SOFORT vom Herd nehmen!',
    ],
    tip: 'Die Eier garen noch nach. Lieber zu früh als zu spät vom Herd nehmen!',
  },
  {
    id: 'power-quinoa-bowl',
    name: 'Power Quinoa Bowl',
    emoji: '🥣',
    category: 'fruehstueck',
    calories: 640,
    protein: 22,
    carbs: 85,
    fat: 24,
    prepTime: 25,
    ingredients: [
      '120g Quinoa (trocken)',
      '300ml Wasser',
      '100g Heidelbeeren',
      '30g Mandeln (gehackt)',
      '20g Chiasamen',
      '1 EL Kokosöl',
      'Prise Salz',
    ],
    steps: [
      'Quinoa in ein feines Sieb geben und unter kaltem Wasser gut abspülen (30 Sekunden). Das entfernt die Bitterstoffe!',
      'Quinoa mit 300ml Wasser und einer Prise Salz in einen Topf geben.',
      'Aufkochen lassen, dann Hitze auf niedrig stellen. Deckel drauf.',
      '15 Minuten köcheln lassen. NICHT umrühren und Deckel nicht abnehmen!',
      'Nach 15 Minuten Hitze ausmachen. Deckel drauf lassen und 5 Minuten quellen lassen.',
      'Quinoa mit einer Gabel auflockern. Kokosöl unterrühren.',
      'In eine Schüssel geben. Heidelbeeren, Mandeln und Chiasamen drauf verteilen.',
    ],
    tip: 'Quinoa am Abend vorher kochen und kalt als Bowl essen - schmeckt auch mega!',
  },
  {
    id: 'haehnchen-monster',
    name: 'Hähnchen Monster',
    emoji: '🍗',
    category: 'mittag',
    calories: 890,
    protein: 75,
    carbs: 95,
    fat: 22,
    prepTime: 35,
    ingredients: [
      '300g Hähnchenbrust (halal)',
      '150g Basmatireis (trocken)',
      '200g Zucchini',
      '100g Karotten',
      '2 EL Olivenöl',
      '1 TL Kurkuma',
      '1 TL Kreuzkümmel',
      'Salz, Pfeffer',
      '2 Knoblauchzehen (optional)',
    ],
    steps: [
      'Reis: 150g Reis mit 300ml Wasser und Prise Salz aufkochen. Hitze runter, Deckel drauf, 12 Minuten köcheln. Dann 5 Min quellen lassen.',
      'Hähnchen vorbereiten: Hähnchenbrust in 2cm dicke Scheiben schneiden. Mit Kurkuma, Kreuzkümmel, Salz und Pfeffer von beiden Seiten einreiben.',
      'Gemüse schneiden: Zucchini in Halbmonde schneiden. Karotten in dünne Scheiben.',
      'Große Pfanne auf HOHE Hitze. 1 EL Olivenöl rein. Wenn es leicht raucht: Hähnchen rein!',
      'Hähnchen 4-5 Minuten pro Seite braten. NICHT ständig wenden! Soll schöne braune Kruste bekommen.',
      'Hähnchen rausnehmen und zur Seite legen (auf Teller).',
      'Gleiche Pfanne, 1 EL Olivenöl dazu. Karotten rein, 3 Minuten braten.',
      'Zucchini dazu, weitere 4 Minuten braten. Salz und Pfeffer.',
      'Hähnchen wieder in die Pfanne legen, 1 Minute mit aufwärmen.',
      'Reis auf Teller, Gemüse drauf, Hähnchen oben drauf. FERTIG!',
    ],
    tip: 'Doppelte Menge machen = Meal Prep für morgen!',
  },
  {
    id: 'rinderhack-pfanne',
    name: 'Killer Rinderhack Pfanne',
    emoji: '🥩',
    category: 'mittag',
    calories: 860,
    protein: 62,
    carbs: 75,
    fat: 35,
    prepTime: 30,
    ingredients: [
      '250g Rinderhack (halal)',
      '120g Quinoa (trocken)',
      '200g Zucchini',
      '100g Karotten',
      '1 EL Kokosöl',
      '1 TL Kurkuma',
      '1 TL Kreuzkümmel',
      '1/2 TL Oregano',
      'Salz, Pfeffer',
      'Frischer Ingwer (2cm Stück, gerieben)',
    ],
    steps: [
      'Quinoa wie oben beschrieben kochen (abspülen, 15 Min köcheln, 5 Min quellen).',
      'Gemüse würfeln: Zucchini und Karotten in kleine Würfel (ca. 1cm) schneiden.',
      'Große Pfanne auf HOHE Hitze. Kokosöl rein.',
      'Rinderhack in die Pfanne. MIT DEM LÖFFEL ZERDRÜCKEN! Soll keine großen Klumpen geben.',
      '5-6 Minuten braten und dabei immer wieder zerdrücken. Soll richtig braun und krümelig werden.',
      'Gewürze dazu: Kurkuma, Kreuzkümmel, Oregano, Salz, Pfeffer. 1 Minute mitbraten.',
      'Geriebenen Ingwer dazu. 30 Sekunden mitbraten.',
      'Gemüse dazu. Alles gut vermischen.',
      'Hitze auf mittel. 8-10 Minuten braten bis Gemüse weich aber noch Biss hat.',
      'Quinoa auf Teller, Hackfleisch-Gemüse-Mix drauf. ZERSTÖREN!',
    ],
    tip: 'Extra geil mit einem Klecks fermentiertem Gemüse (Sauerkraut) oben drauf!',
  },
  {
    id: 'steak-suesskartoffeln',
    name: 'Perfektes Steak mit Süßkartoffeln',
    emoji: '🥩',
    category: 'mittag',
    calories: 770,
    protein: 58,
    carbs: 70,
    fat: 28,
    prepTime: 45,
    ingredients: [
      '250g Rindersteak (halal) - am besten Hüftsteak oder Rumpsteak',
      '350g Süßkartoffeln',
      '150g Fenchel',
      '2 EL Olivenöl',
      '1 TL Kurkuma',
      'Salz, Pfeffer',
      'Frischer Oregano oder getrocknet',
    ],
    steps: [
      'Ofen auf 200°C vorheizen.',
      'Süßkartoffeln schälen und in 2cm Würfel schneiden. In eine Schüssel geben.',
      '1 EL Olivenöl, Kurkuma, Salz über die Süßkartoffeln geben. Mit Händen gut vermischen.',
      'Auf ein Backblech mit Backpapier verteilen. In den Ofen: 25-30 Minuten backen.',
      'WICHTIG: Steak 30 Minuten vor dem Braten aus dem Kühlschrank nehmen! Muss Raumtemperatur haben.',
      'Steak von beiden Seiten großzügig mit Salz und Pfeffer einreiben.',
      'Fenchel in dünne Streifen schneiden.',
      'Gusseisenpfanne oder schwere Pfanne auf HÖCHSTE Hitze. 1 EL Olivenöl rein.',
      'Wenn Öl anfängt zu rauchen: Steak rein! NICHT BEWEGEN für 3-4 Minuten.',
      'Umdrehen. Weitere 3-4 Minuten für Medium. (2-3 Min für Rare, 5-6 für Well Done)',
      'Steak rausnehmen und 5 MINUTEN RUHEN LASSEN auf einem Brett. Das ist wichtig!',
      'In der gleichen Pfanne Fenchel 5 Minuten anbraten. Salz dazu.',
      'Süßkartoffeln aus dem Ofen. Alles auf Teller. Steak in Streifen schneiden.',
    ],
    tip: 'Steak MUSS ruhen! Sonst läuft der ganze Saft raus und es wird trocken.',
  },
  {
    id: 'haehnchen-bowl',
    name: 'All-in-One Hähnchen Bowl',
    emoji: '🥗',
    category: 'abend',
    calories: 870,
    protein: 70,
    carbs: 90,
    fat: 25,
    prepTime: 35,
    ingredients: [
      '300g Hähnchenschenkel OHNE Haut (halal) oder 280g Hähnchenbrust',
      '130g Quinoa (trocken)',
      '150g Zucchini',
      '100g Karotten',
      '50g fermentiertes Gemüse (Sauerkraut)',
      '2 EL Olivenöl',
      '1 TL Kurkuma',
      '1 TL Kreuzkümmel',
      '1/2 TL Oregano',
      'Salz, Pfeffer',
      '30g Mandeln (gehackt) zum Topping',
    ],
    steps: [
      'Quinoa kochen (abspülen, 15 Min köcheln, 5 Min quellen).',
      'Hähnchen würfeln (2-3cm Stücke). Mit allen Gewürzen in einer Schüssel vermischen.',
      'Gemüse in Würfel schneiden.',
      'Große Pfanne auf hohe Hitze. 1 EL Olivenöl rein.',
      'Hähnchen rein. 6-8 Minuten braten bis goldbraun. Ab und zu umrühren.',
      'Hähnchen rausnehmen.',
      '1 EL Olivenöl in die Pfanne. Gemüse rein. 6-8 Minuten braten.',
      'BOWL BAUEN: Quinoa als Basis in eine große Schüssel. Gemüse auf eine Seite, Hähnchen auf die andere.',
      'Fermentiertes Gemüse in die Mitte. Mandeln drüber streuen.',
    ],
    tip: 'Die perfekte Meal Prep Mahlzeit - hält 3-4 Tage im Kühlschrank!',
  },
  {
    id: 'eier-spezial',
    name: 'Eier Spezial - 8er Pack',
    emoji: '🥚',
    category: 'snack',
    calories: 580,
    protein: 50,
    carbs: 4,
    fat: 40,
    prepTime: 15,
    ingredients: [
      '8 Bio-Eier',
      '100g Gurke',
      '50g Karotten',
      '1 EL Olivenöl',
      'Salz, Pfeffer, Kurkuma',
    ],
    steps: [
      'Großen Topf mit Wasser zum Kochen bringen. Muss richtig sprudeln!',
      'Eier vorsichtig mit einem Löffel ins kochende Wasser legen.',
      'Timer stellen: 6:30 Minuten für weich (flüssiges Eigelb), 8 Minuten für wachsweich, 10 Minuten für hart.',
      'Während Eier kochen: Gurke und Karotten in Sticks schneiden.',
      'Nach der Zeit: Eier sofort in Schüssel mit EISKALTEM Wasser legen! 2 Minuten drin lassen.',
      'Eier schälen. Auf Teller legen.',
      'Mit Salz, Pfeffer und Kurkuma würzen. Olivenöl drüber träufeln.',
      'Mit Gemüse-Sticks servieren.',
    ],
    tip: 'Eier vorkochen für die ganze Woche! Im Kühlschrank 1 Woche haltbar.',
  },
  {
    id: 'suesskartoffel-wedges',
    name: 'Süßkartoffel Wedges',
    emoji: '🍠',
    category: 'snack',
    calories: 450,
    protein: 5,
    carbs: 75,
    fat: 14,
    prepTime: 35,
    ingredients: [
      '400g Süßkartoffeln',
      '1.5 EL Kokosöl (geschmolzen)',
      '1 TL Kurkuma',
      '1/2 TL Kreuzkümmel',
      'Salz, Pfeffer',
    ],
    steps: [
      'Ofen auf 220°C vorheizen.',
      'Süßkartoffeln waschen (Schale kann dran bleiben!). In Spalten schneiden wie Pommes.',
      'Kokosöl in der Mikrowelle oder Topf schmelzen.',
      'Alle Gewürze in eine große Schüssel geben. Geschmolzenes Kokosöl dazu. Mischen.',
      'Süßkartoffel-Spalten in die Schüssel. Mit Händen gut vermischen bis alle Spalten bedeckt sind.',
      'Auf Backblech mit Backpapier verteilen. WICHTIG: Spalten dürfen sich nicht berühren!',
      '25-30 Minuten backen. Nach 15 Minuten einmal wenden.',
      'Fertig wenn außen knusprig und innen weich.',
    ],
    tip: 'Dazu passt fermentiertes Gemüse als Dip-Ersatz!',
  },
]

// Wochenpläne
export const woche1: WeekPlan = {
  montag: { fruehstueck: 'mega-ruehrei', mittag: 'haehnchen-monster', snack: 'suesskartoffel-wedges', abend: 'rinderhack-pfanne' },
  dienstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'steak-suesskartoffeln', snack: 'eier-spezial', abend: 'haehnchen-bowl' },
  mittwoch: { fruehstueck: 'mega-ruehrei', mittag: 'rinderhack-pfanne', snack: 'suesskartoffel-wedges', abend: 'haehnchen-monster' },
  donnerstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'haehnchen-bowl', snack: 'eier-spezial', abend: 'steak-suesskartoffeln' },
  freitag: { fruehstueck: 'mega-ruehrei', mittag: 'haehnchen-monster', snack: 'suesskartoffel-wedges', abend: 'rinderhack-pfanne' },
  samstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'steak-suesskartoffeln', snack: 'eier-spezial', abend: 'haehnchen-bowl' },
  sonntag: { fruehstueck: 'mega-ruehrei', mittag: 'rinderhack-pfanne', snack: 'suesskartoffel-wedges', abend: 'haehnchen-monster' },
}

export const woche2: WeekPlan = {
  montag: { fruehstueck: 'power-quinoa-bowl', mittag: 'haehnchen-bowl', snack: 'eier-spezial', abend: 'steak-suesskartoffeln' },
  dienstag: { fruehstueck: 'mega-ruehrei', mittag: 'rinderhack-pfanne', snack: 'suesskartoffel-wedges', abend: 'haehnchen-monster' },
  mittwoch: { fruehstueck: 'power-quinoa-bowl', mittag: 'steak-suesskartoffeln', snack: 'eier-spezial', abend: 'haehnchen-bowl' },
  donnerstag: { fruehstueck: 'mega-ruehrei', mittag: 'haehnchen-monster', snack: 'suesskartoffel-wedges', abend: 'rinderhack-pfanne' },
  freitag: { fruehstueck: 'power-quinoa-bowl', mittag: 'haehnchen-bowl', snack: 'eier-spezial', abend: 'steak-suesskartoffeln' },
  samstag: { fruehstueck: 'mega-ruehrei', mittag: 'rinderhack-pfanne', snack: 'suesskartoffel-wedges', abend: 'haehnchen-monster' },
  sonntag: { fruehstueck: 'power-quinoa-bowl', mittag: 'steak-suesskartoffeln', snack: 'eier-spezial', abend: 'haehnchen-bowl' },
}

export const woche3: WeekPlan = {
  montag: { fruehstueck: 'mega-ruehrei', mittag: 'steak-suesskartoffeln', snack: 'suesskartoffel-wedges', abend: 'haehnchen-bowl' },
  dienstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'haehnchen-monster', snack: 'eier-spezial', abend: 'rinderhack-pfanne' },
  mittwoch: { fruehstueck: 'mega-ruehrei', mittag: 'haehnchen-bowl', snack: 'suesskartoffel-wedges', abend: 'steak-suesskartoffeln' },
  donnerstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'rinderhack-pfanne', snack: 'eier-spezial', abend: 'haehnchen-monster' },
  freitag: { fruehstueck: 'mega-ruehrei', mittag: 'steak-suesskartoffeln', snack: 'suesskartoffel-wedges', abend: 'haehnchen-bowl' },
  samstag: { fruehstueck: 'power-quinoa-bowl', mittag: 'haehnchen-monster', snack: 'eier-spezial', abend: 'rinderhack-pfanne' },
  sonntag: { fruehstueck: 'mega-ruehrei', mittag: 'haehnchen-bowl', snack: 'suesskartoffel-wedges', abend: 'steak-suesskartoffeln' },
}

// Einkaufslisten
export const einkaufsliste = {
  halalMetzger: [
    { item: 'Hähnchenbrust', menge: '2 kg' },
    { item: 'Hähnchenschenkel ohne Haut', menge: '600g' },
    { item: 'Rinderhack', menge: '1 kg' },
    { item: 'Rindersteak (Hüfte oder Rumpsteak)', menge: '750g' },
  ],
  supermarkt: [
    { item: 'Bio-Eier', menge: '60 Stück' },
    { item: 'Quinoa', menge: '700g' },
    { item: 'Basmatireis', menge: '1 kg' },
    { item: 'Süßkartoffeln', menge: '3 kg' },
  ],
  gemuese: [
    { item: 'Zucchini', menge: '2 kg' },
    { item: 'Karotten', menge: '1.5 kg' },
    { item: 'Fenchel', menge: '600g' },
    { item: 'Gurken', menge: '500g' },
    { item: 'Sauerkraut (fermentiert, ohne Zusätze)', menge: '400g' },
  ],
  obstNuesse: [
    { item: 'Heidelbeeren', menge: '500g' },
    { item: 'Mandeln', menge: '200g' },
    { item: 'Chiasamen', menge: '200g' },
  ],
  oeleGewuerze: [
    { item: 'Kokosöl', menge: '1 Glas (500ml)' },
    { item: 'Olivenöl kaltgepresst', menge: '750ml' },
    { item: 'Kurkuma gemahlen', menge: '1 Dose' },
    { item: 'Kreuzkümmel', menge: '1 Dose' },
    { item: 'Oregano', menge: '1 Dose' },
    { item: 'Ingwer frisch', menge: '100g' },
  ],
}

// Die 10 Regeln
export const regeln = [
  { nr: 1, regel: 'LANGSAM ESSEN', beschreibung: 'Jeden Bissen 20-30x kauen. Das ist mega wichtig für deinen Darm!' },
  { nr: 2, regel: 'VIEL TRINKEN', beschreibung: 'Mindestens 3 Liter stilles Wasser pro Tag.' },
  { nr: 3, regel: 'SUPPLEMENTS NIE VERGESSEN', beschreibung: 'Jeden Tag, gleiche Uhrzeit.' },
  { nr: 4, regel: 'KEINE AUSNAHMEN', beschreibung: '3 Wochen durchziehen. Kein Cheat Day.' },
  { nr: 5, regel: 'MEAL PREP', beschreibung: 'Sonntags vorbereiten spart Zeit und verhindert Ausreden.' },
  { nr: 6, regel: 'HALAL FLEISCH', beschreibung: 'Nur vom Halal-Metzger. Kein Supermarkt-Fleisch.' },
  { nr: 7, regel: 'HAUTPFLEGE', beschreibung: 'Jeden Abend Teebaumöl auf die Pickel.' },
  { nr: 8, regel: 'GEDULD', beschreibung: 'Ergebnisse kommen nach 4-8 Wochen. Nicht vorher aufgeben!' },
  { nr: 9, regel: 'KEIN STRESS', beschreibung: 'Stress macht Akne schlimmer. Entspann dich.' },
  { nr: 10, regel: 'DOKUMENTIEREN', beschreibung: 'Mach jede Woche ein Foto von deiner Haut. Du wirst den Unterschied sehen!' },
]

// Verbotene Lebensmittel
export const verboten = [
  'Zucker, Süßigkeiten, Honig, Agavensirup',
  'Weizen, Roggen, Dinkel, Gerste, Brot, Nudeln, Pizza',
  'Milch, Joghurt, Käse, Sahne, Butter',
  'Schweinefleisch, Wurst, Fertigfleisch',
  'Kaffee, Alkohol, Softdrinks, Fruchtsäfte',
  'Tomaten, Paprika, Aubergine (Nachtschatten)',
  'Bananen, Orangen, Zitrusfrüchte, Trockenfrüchte',
  'Chips, Pommes, frittierte Sachen, Fertigprodukte',
]

// Helper Funktion: Rezept by ID finden
export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(r => r.id === id)
}

// Helper Funktion: Tagesplan für ein Datum
export function getDayPlan(date: Date, week: number = 1): DayPlan {
  const days = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag']
  const dayName = days[date.getDay()]
  
  const weekPlan = week === 1 ? woche1 : week === 2 ? woche2 : woche3
  return weekPlan[dayName]
}

// Helper Funktion: Welche Woche im Plan (1, 2, oder 3)
export function getCurrentWeek(startDate: Date, currentDate: Date): number {
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(diffDays / 7) % 3 + 1
  return weekNumber
}
