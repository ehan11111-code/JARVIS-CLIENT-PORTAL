import type { Country, Cut, Meat } from './mec-types'

export const COUNTRIES: Country[] = [
  { code: 'BR', name: { en: 'Brazil', ar: 'البرازيل' }, flag: '🇧🇷' },
  { code: 'IN', name: { en: 'India', ar: 'الهند' }, flag: '🇮🇳' },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة' }, flag: '🇺🇸' },
  { code: 'AU', name: { en: 'Australia', ar: 'أستراليا' }, flag: '🇦🇺' },
  { code: 'AR', name: { en: 'Argentina', ar: 'الأرجنتين' }, flag: '🇦🇷' },
  { code: 'NZ', name: { en: 'New Zealand', ar: 'نيوزيلندا' }, flag: '🇳🇿' },
  { code: 'PK', name: { en: 'Pakistan', ar: 'باكستان' }, flag: '🇵🇰' },
  { code: 'PT', name: { en: 'Portugal', ar: 'البرتغال' }, flag: '🇵🇹' },
  { code: 'UY', name: { en: 'Uruguay', ar: 'الأوروغواي' }, flag: '🇺🇾' }
]

export const MEATS: Meat[] = [
  { slug: 'beef', name: { en: 'Beef', ar: 'لحم بقر' } },
  { slug: 'lamb', name: { en: 'Lamb / Mutton', ar: 'لحم ضأن' } },
  { slug: 'chicken', name: { en: 'Chicken', ar: 'دجاج' } },
  { slug: 'camel', name: { en: 'Camel', ar: 'لحم إبل' } },
  { slug: 'goat', name: { en: 'Goat', ar: 'لحم ماعز' } }
]

export const CUTS: Cut[] = [
  { slug: 'tenderloin', meat: 'beef', name: { en: 'Tenderloin', ar: 'تندرلوين (فيليه)' } },
  { slug: 'ribeye', meat: 'beef', name: { en: 'Ribeye', ar: 'ريب آي' } },
  { slug: 'striploin', meat: 'beef', name: { en: 'Striploin', ar: 'ستريبلوين' } },
  { slug: 'brisket', meat: 'beef', name: { en: 'Brisket', ar: 'بريسكت (صدر)' } },
  { slug: 'trimmings', meat: 'beef', name: { en: 'Trimmings', ar: 'تريمنغز' } },

  { slug: 'lamb-carcass', meat: 'lamb', name: { en: 'Whole carcass', ar: 'ذبيحة كاملة' } },
  { slug: 'lamb-leg', meat: 'lamb', name: { en: 'Leg', ar: 'فخذ' } },
  { slug: 'lamb-shoulder', meat: 'lamb', name: { en: 'Shoulder', ar: 'كتف' } },
  { slug: 'lamb-rack', meat: 'lamb', name: { en: 'Rack', ar: 'كستليتة' } },

  { slug: 'chicken-whole', meat: 'chicken', name: { en: 'Whole bird', ar: 'دجاج كامل' } },
  { slug: 'chicken-breast', meat: 'chicken', name: { en: 'Breast', ar: 'صدر دجاج' } },
  { slug: 'chicken-leg', meat: 'chicken', name: { en: 'Leg quarters', ar: 'أرباع أفخاذ' } },
  { slug: 'chicken-mdm', meat: 'chicken', name: { en: 'MDM', ar: 'لحم منزوع آليًا' } },

  { slug: 'camel-carcass', meat: 'camel', name: { en: 'Whole carcass', ar: 'ذبيحة كاملة' } },
  { slug: 'camel-leg', meat: 'camel', name: { en: 'Leg', ar: 'فخذ' } },

  { slug: 'goat-carcass', meat: 'goat', name: { en: 'Whole carcass', ar: 'ذبيحة كاملة' } },
  { slug: 'goat-leg', meat: 'goat', name: { en: 'Leg', ar: 'فخذ' } }
]

export const PORTS = {
  JED: { name: { en: 'Jeddah (JED)', ar: 'جدة (JED)' } },
  DMM: { name: { en: 'Dammam (DMM)', ar: 'الدمام (DMM)' } }
} as const

export const COVERAGE: Record<string, Record<string, ('BR'|'IN'|'US'|'AU'|'AR'|'NZ'|'PK'|'PT'|'UY')[]>> = {
  beef: {
    tenderloin: ['BR', 'AU', 'AR', 'UY', 'US'],
    ribeye: ['BR', 'AU', 'US', 'AR'],
    striploin: ['BR', 'AU', 'AR', 'UY'],
    brisket: ['BR', 'AU', 'US', 'UY'],
    trimmings: ['BR', 'IN', 'AR', 'UY', 'AU']
  },
  lamb: {
    'lamb-carcass': ['AU', 'NZ', 'PK'],
    'lamb-leg': ['AU', 'NZ', 'PT'],
    'lamb-shoulder': ['AU', 'NZ'],
    'lamb-rack': ['AU', 'NZ', 'PT']
  },
  chicken: {
    'chicken-whole': ['BR', 'US', 'PK'],
    'chicken-breast': ['BR', 'US', 'PT'],
    'chicken-leg': ['BR', 'US'],
    'chicken-mdm': ['BR', 'US']
  },
  camel: {
    'camel-carcass': ['PK'],
    'camel-leg': ['PK']
  },
  goat: {
    'goat-carcass': ['IN', 'PK', 'AU'],
    'goat-leg': ['IN', 'PK']
  }
}

export const NEWS_TEMPLATES: Array<{
  headline: { en: string; ar: string }
  summary: { en: string; ar: string }
  country: 'BR' | 'IN' | 'US' | 'AU' | 'AR' | 'NZ' | 'PK' | 'PT' | 'UY' | 'GLOBAL'
  category: 'crisis' | 'policy' | 'disease' | 'freight' | 'market'
  severity: 1 | 2 | 3 | 4 | 5
  hoursAgo: number
}> = [
  {
    headline: { en: 'Brazil suspends key beef plants amid avian-flu scare', ar: 'البرازيل تُعلّق عمل مصانع لحوم رئيسية بسبب موجة إنفلونزا طيور' },
    summary: { en: 'Three of Brazil\'s largest exporters paused shipments after veterinary inspections. Expect tightening supply on tenderloin and ribeye.', ar: 'أوقف ثلاثة من أكبر مصدّري البرازيل الشحنات بعد تفتيش بيطري. توقّع شُحًّا على التندرلوين والريب آي.' },
    country: 'BR',
    category: 'crisis',
    severity: 5,
    hoursAgo: 4
  },
  {
    headline: { en: 'Red Sea routing delays push freight up 14%', ar: 'تأخيرات شحن بسبب البحر الأحمر ترفع التكلفة 14%' },
    summary: { en: 'Container freight from Brazil to Jeddah is averaging 38 days vs 26. Expect short-term landed-cost pressure.', ar: 'متوسط زمن الشحن من البرازيل إلى جدة 38 يومًا بدلًا من 26. توقّع ضغطًا على التكلفة الواصلة قريبًا.' },
    country: 'GLOBAL',
    category: 'freight',
    severity: 4,
    hoursAgo: 9
  },
  {
    headline: { en: 'Australia opens new lamb-quota window to GCC', ar: 'أستراليا تفتح حصة جديدة من الضأن لدول الخليج' },
    summary: { en: 'A new tariff-rate quota releases 12,000 t of lamb to GCC importers next quarter — supply pressure should ease.', ar: 'حصة جمركية جديدة تُتيح 12,000 طن من الضأن لمستوردي الخليج الربع القادم — يخفّ الضغط على الأسعار.' },
    country: 'AU',
    category: 'policy',
    severity: 3,
    hoursAgo: 16
  },
  {
    headline: { en: 'India lifts buffalo-meat export restrictions', ar: 'الهند ترفع قيود تصدير لحم الجاموس' },
    summary: { en: 'Indian trimmings re-enter the market at competitive USD/kg levels. Watch for substitution opportunities.', ar: 'تعود لحوم التريمنغز الهندية بأسعار تنافسية. راقب فرص الاستبدال.' },
    country: 'IN',
    category: 'policy',
    severity: 3,
    hoursAgo: 22
  },
  {
    headline: { en: 'NZ floods disrupt lamb processing in Canterbury', ar: 'فيضانات في نيوزيلندا تُعطّل تجهيز الضأن في كانتربري' },
    summary: { en: 'Two major processors temporarily offline. Carcass and rack supply tightens for 2–3 weeks.', ar: 'توقّفت اثنتان من كبرى وحدات التجهيز مؤقتًا. شحّ متوقّع على الذبائح والكستليتة لمدّة 2–3 أسابيع.' },
    country: 'NZ',
    category: 'crisis',
    severity: 4,
    hoursAgo: 30
  },
  {
    headline: { en: 'US chicken breast averages drop 6% week-over-week', ar: 'انخفاض متوسط صدور الدجاج الأمريكي 6% أسبوعيًا' },
    summary: { en: 'Strong domestic supply lowers FOB prices. Good window for breast and leg-quarter orders.', ar: 'إمدادات محلية قوية تخفض أسعار FOB. نافذة جيدة لطلبات الصدور والأرباع.' },
    country: 'US',
    category: 'market',
    severity: 2,
    hoursAgo: 36
  },
  {
    headline: { en: 'Argentina raises beef-export tax to 15%', ar: 'الأرجنتين ترفع ضريبة تصدير لحم البقر إلى 15%' },
    summary: { en: 'New levy effective immediately. Expect Argentine ribeye and striploin to lose price advantage.', ar: 'ضريبة جديدة فورية. توقّع خسارة الريب آي والستريبلوين الأرجنتيني لتفوّقهما السعري.' },
    country: 'AR',
    category: 'policy',
    severity: 4,
    hoursAgo: 48
  },
  {
    headline: { en: 'FMD outbreak reported in Punjab cattle herds', ar: 'تفشّي الحمى القلاعية في قطعان أبقار البنجاب' },
    summary: { en: 'Pakistan suspends some exports pending vet clearance. Camel and goat lines unaffected so far.', ar: 'باكستان تُعلّق بعض الصادرات بانتظار التصاريح البيطرية. لحوم الإبل والماعز غير متأثرة حتى الآن.' },
    country: 'PK',
    category: 'disease',
    severity: 4,
    hoursAgo: 60
  },
  {
    headline: { en: 'Uruguay forecasts record beef export year', ar: 'الأوروغواي تتوقّع عامًا قياسيًا لتصدير لحم البقر' },
    summary: { en: 'Production up 8% YoY. Watch for downward FOB pressure on tenderloin and brisket.', ar: 'إنتاج أعلى بنسبة 8% سنويًا. توقّع ضغطًا نزوليًا على أسعار التندرلوين والبريسكت.' },
    country: 'UY',
    category: 'market',
    severity: 2,
    hoursAgo: 84
  },
  {
    headline: { en: 'Portuguese lamb prices steady on stable demand', ar: 'استقرار أسعار الضأن البرتغالي مع طلب ثابت' },
    summary: { en: 'No major shifts expected. Rack quality remains the standout.', ar: 'لا تحوّلات كبيرة متوقّعة. تبقى جودة الكستليتة هي الأبرز.' },
    country: 'PT',
    category: 'market',
    severity: 1,
    hoursAgo: 100
  }
]
