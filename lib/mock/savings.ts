import type { Bi, Chart } from './types'

export type SavingsCategoryKey =
  | 'labor'
  | 'errors'
  | 'capital'
  | 'vendor'
  | 'compliance'
  | 'churn'

export type SavingsCategory = {
  key: SavingsCategoryKey
  label: Bi
  description: Bi
  amountSar: number
  detail: Bi
}

export type DeptSavings = {
  slug: string
  name: Bi
  ytdSar: number
  monthlySar: number
  fteHoursReclaimed: number
  modules: number
  topCategory: SavingsCategoryKey
  baselineSar: number
  withJarvisSar: number
  drivers: { label: Bi; valueSar: number }[]
}

export type SavingsState = {
  ytdSar: number
  monthSar: number
  runRateAnnualSar: number
  baselineCostSar: number
  withJarvisCostSar: number
  roiMultiplier: number
  fteHoursReclaimed: number
  modulesContributing: number
  generatedAt: string
  categories: SavingsCategory[]
  byDept: DeptSavings[]
  monthlyTrend: Chart
  comparisonTrend: Chart
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function mulberry32(seed: number) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

const r = mulberry32(hashString('jarvis-savings-2026-06'))
const jitter = (base: number, spread: number) => Math.round(base + (r() - 0.5) * 2 * spread)

const DEPT_SAVINGS: DeptSavings[] = [
  {
    slug: 'logistics',
    name: { en: 'Logistics & Supply Chain', ar: 'الإمداد والخدمات اللوجستية' },
    ytdSar: 4_820_000,
    monthlySar: 612_000,
    fteHoursReclaimed: 14_200,
    modules: 6,
    topCategory: 'labor',
    baselineSar: 11_400_000,
    withJarvisSar: 6_580_000,
    drivers: [
      { label: { en: 'Route consolidation', ar: 'تجميع المسارات' }, valueSar: 1_840_000 },
      { label: { en: 'Reconciled delivery notes', ar: 'تسوية إشعارات التسليم' }, valueSar: 1_220_000 },
      { label: { en: 'Stockout avoidance', ar: 'تفادي نفاد المخزون' }, valueSar: 980_000 },
      { label: { en: 'POD dispute reduction', ar: 'تقليل نزاعات إثبات التسليم' }, valueSar: 780_000 }
    ]
  },
  {
    slug: 'sales',
    name: { en: 'Sales', ar: 'المبيعات' },
    ytdSar: 5_640_000,
    monthlySar: 705_000,
    fteHoursReclaimed: 9_800,
    modules: 6,
    topCategory: 'churn',
    baselineSar: 9_300_000,
    withJarvisSar: 3_660_000,
    drivers: [
      { label: { en: 'Recovered leakage from slow leads', ar: 'استرداد العملاء المتسرّبين' }, valueSar: 2_310_000 },
      { label: { en: 'Quote margin guardrails', ar: 'حدود هامش العروض' }, valueSar: 1_460_000 },
      { label: { en: 'Stalled-deal recovery', ar: 'إنقاذ الصفقات المتوقفة' }, valueSar: 1_180_000 },
      { label: { en: 'Cross-sell uplift', ar: 'زيادة البيع المتقاطع' }, valueSar: 690_000 }
    ]
  },
  {
    slug: 'finance',
    name: { en: 'Finance', ar: 'المالية' },
    ytdSar: 6_120_000,
    monthlySar: 740_000,
    fteHoursReclaimed: 11_400,
    modules: 5,
    topCategory: 'capital',
    baselineSar: 10_200_000,
    withJarvisSar: 4_080_000,
    drivers: [
      { label: { en: 'Working capital release', ar: 'تحرير رأس المال العامل' }, valueSar: 2_900_000 },
      { label: { en: 'Three-way match accuracy', ar: 'دقة المطابقة الثلاثية' }, valueSar: 1_540_000 },
      { label: { en: 'Collection priority', ar: 'أولوية التحصيل' }, valueSar: 1_120_000 },
      { label: { en: 'Treasury optimization', ar: 'تحسين الخزينة' }, valueSar: 560_000 }
    ]
  },
  {
    slug: 'accounting',
    name: { en: 'Accounting', ar: 'المحاسبة' },
    ytdSar: 2_780_000,
    monthlySar: 312_000,
    fteHoursReclaimed: 7_600,
    modules: 5,
    topCategory: 'labor',
    baselineSar: 5_400_000,
    withJarvisSar: 2_620_000,
    drivers: [
      { label: { en: 'Month-end close compression', ar: 'تقليص الإقفال الشهري' }, valueSar: 1_320_000 },
      { label: { en: 'Journal-entry automation', ar: 'أتمتة قيود اليومية' }, valueSar: 760_000 },
      { label: { en: 'Tax filing accuracy', ar: 'دقة الإقرارات الضريبية' }, valueSar: 420_000 },
      { label: { en: 'Reconciliation throughput', ar: 'إنتاجية التسويات' }, valueSar: 280_000 }
    ]
  },
  {
    slug: 'hr',
    name: { en: 'Human Resources', ar: 'الموارد البشرية' },
    ytdSar: 3_140_000,
    monthlySar: 384_000,
    fteHoursReclaimed: 12_800,
    modules: 6,
    topCategory: 'labor',
    baselineSar: 6_800_000,
    withJarvisSar: 3_660_000,
    drivers: [
      { label: { en: 'Screening cycle time', ar: 'زمن دورة الفرز' }, valueSar: 1_240_000 },
      { label: { en: 'Onboarding throughput', ar: 'إنتاجية الإلحاق' }, valueSar: 880_000 },
      { label: { en: 'Attrition prevention', ar: 'تقليص الاستقالات' }, valueSar: 740_000 },
      { label: { en: 'Compliance training reach', ar: 'وصول التدريب الإلزامي' }, valueSar: 280_000 }
    ]
  },
  {
    slug: 'marketing',
    name: { en: 'Marketing', ar: 'التسويق' },
    ytdSar: 4_360_000,
    monthlySar: 548_000,
    fteHoursReclaimed: 8_900,
    modules: 6,
    topCategory: 'vendor',
    baselineSar: 12_600_000,
    withJarvisSar: 8_240_000,
    drivers: [
      { label: { en: 'Ad-spend reallocation', ar: 'إعادة توزيع الإنفاق الإعلاني' }, valueSar: 2_100_000 },
      { label: { en: 'Attribution clarity', ar: 'وضوح الإسناد' }, valueSar: 1_140_000 },
      { label: { en: 'Content cycle compression', ar: 'تقليص دورة المحتوى' }, valueSar: 720_000 },
      { label: { en: 'Audience targeting', ar: 'استهداف الجمهور' }, valueSar: 400_000 }
    ]
  },
  {
    slug: 'management',
    name: { en: 'Leadership', ar: 'القيادة' },
    ytdSar: 1_820_000,
    monthlySar: 224_000,
    fteHoursReclaimed: 3_600,
    modules: 5,
    topCategory: 'compliance',
    baselineSar: 4_200_000,
    withJarvisSar: 2_380_000,
    drivers: [
      { label: { en: 'Cross-department alert routing', ar: 'توجيه التنبيهات بين الأقسام' }, valueSar: 740_000 },
      { label: { en: 'Faster board reporting', ar: 'إعداد تقارير المجلس أسرع' }, valueSar: 520_000 },
      { label: { en: 'OKR drift correction', ar: 'تصحيح انحراف الأهداف' }, valueSar: 360_000 },
      { label: { en: 'Escalation cycle time', ar: 'زمن دورة التصعيد' }, valueSar: 200_000 }
    ]
  },
  {
    slug: 'customer-service',
    name: { en: 'Customer Service', ar: 'خدمة العملاء' },
    ytdSar: 3_980_000,
    monthlySar: 498_000,
    fteHoursReclaimed: 10_700,
    modules: 5,
    topCategory: 'churn',
    baselineSar: 7_900_000,
    withJarvisSar: 3_920_000,
    drivers: [
      { label: { en: 'Churn prevention', ar: 'منع التسرب' }, valueSar: 1_840_000 },
      { label: { en: 'First-response automation', ar: 'أتمتة الردّ الأول' }, valueSar: 1_120_000 },
      { label: { en: 'Knowledge-agent deflection', ar: 'تحويل وكيل المعرفة' }, valueSar: 680_000 },
      { label: { en: 'SLA breach reduction', ar: 'تقليل خروقات اتفاقية الخدمة' }, valueSar: 340_000 }
    ]
  },
  {
    slug: 'procurement',
    name: { en: 'Procurement', ar: 'المشتريات' },
    ytdSar: 5_120_000,
    monthlySar: 612_000,
    fteHoursReclaimed: 8_400,
    modules: 5,
    topCategory: 'vendor',
    baselineSar: 14_300_000,
    withJarvisSar: 9_180_000,
    drivers: [
      { label: { en: 'Maverick-spend recapture', ar: 'استرداد الإنفاق غير المعتمد' }, valueSar: 1_980_000 },
      { label: { en: 'Vendor performance pricing', ar: 'تسعير أداء الموردين' }, valueSar: 1_420_000 },
      { label: { en: 'Contract renewal capture', ar: 'استكمال تجديد العقود' }, valueSar: 1_080_000 },
      { label: { en: 'RFQ cycle compression', ar: 'تقليص دورة عروض الأسعار' }, valueSar: 640_000 }
    ]
  },
  {
    slug: 'it-ops',
    name: { en: 'IT & Operations', ar: 'تقنية المعلومات والعمليات' },
    ytdSar: 2_980_000,
    monthlySar: 364_000,
    fteHoursReclaimed: 9_200,
    modules: 4,
    topCategory: 'errors',
    baselineSar: 5_600_000,
    withJarvisSar: 2_620_000,
    drivers: [
      { label: { en: 'Incident MTTR reduction', ar: 'تقليل زمن معالجة الحوادث' }, valueSar: 1_240_000 },
      { label: { en: 'Alert correlation savings', ar: 'وفر مزامنة التنبيهات' }, valueSar: 820_000 },
      { label: { en: 'Change failure rate cut', ar: 'تقليل فشل التغييرات' }, valueSar: 540_000 },
      { label: { en: 'Asset utilization', ar: 'استخدام الأصول' }, valueSar: 380_000 }
    ]
  },
  {
    slug: 'legal-compliance',
    name: { en: 'Legal & Compliance', ar: 'القانوني والامتثال' },
    ytdSar: 2_360_000,
    monthlySar: 286_000,
    fteHoursReclaimed: 5_600,
    modules: 4,
    topCategory: 'compliance',
    baselineSar: 6_100_000,
    withJarvisSar: 3_740_000,
    drivers: [
      { label: { en: 'Contract review velocity', ar: 'سرعة مراجعة العقود' }, valueSar: 980_000 },
      { label: { en: 'Compliance deadline capture', ar: 'الالتزام بمواعيد الامتثال' }, valueSar: 620_000 },
      { label: { en: 'Policy consistency', ar: 'اتساق السياسات' }, valueSar: 460_000 },
      { label: { en: 'Regulatory-watch coverage', ar: 'تغطية الرصد التنظيمي' }, valueSar: 300_000 }
    ]
  }
]

const ytdSar = DEPT_SAVINGS.reduce((a, d) => a + d.ytdSar, 0)
const monthSar = DEPT_SAVINGS.reduce((a, d) => a + d.monthlySar, 0)
const baseline = DEPT_SAVINGS.reduce((a, d) => a + d.baselineSar, 0)
const withJarvis = DEPT_SAVINGS.reduce((a, d) => a + d.withJarvisSar, 0)
const fteHours = DEPT_SAVINGS.reduce((a, d) => a + d.fteHoursReclaimed, 0)
const modulesContributing = DEPT_SAVINGS.reduce((a, d) => a + d.modules, 0)
const runRate = monthSar * 12
const roi = +(baseline / Math.max(withJarvis, 1)).toFixed(2)

const monthly = Array.from({ length: 6 }, (_, i) => {
  const base = monthSar / 1_000_000
  const drift = 1 + (i - 2.5) * 0.06
  return +(base * drift + (r() - 0.5) * 0.4).toFixed(2)
})

const monthlyTrend: Chart = {
  title: { en: 'Monthly savings · SAR (M)', ar: 'الوفر الشهري · مليون ريال' },
  series: [
    {
      key: 'savings',
      label: { en: 'Savings (M SAR)', ar: 'الوفر (مليون)' },
      highlight: true,
      data: monthly.map((v, i) => ({ t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12], v }))
    }
  ]
}

const comparisonTrend: Chart = {
  title: { en: 'Operating cost · with vs without JARVIS · SAR (M)', ar: 'تكلفة التشغيل · مع جارفِس مقابل بدونه · مليون ريال' },
  series: [
    {
      key: 'without',
      label: { en: 'Without JARVIS', ar: 'بدون جارفِس' },
      data: Array.from({ length: 6 }, (_, i) => ({
        t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12],
        v: +((baseline / 6 / 1_000_000) * (1 + (i - 2.5) * 0.03 + (r() - 0.5) * 0.05)).toFixed(2)
      }))
    },
    {
      key: 'with',
      label: { en: 'With JARVIS', ar: 'مع جارفِس' },
      highlight: true,
      data: Array.from({ length: 6 }, (_, i) => ({
        t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12],
        v: +((withJarvis / 6 / 1_000_000) * (1 - (i - 2.5) * 0.02 + (r() - 0.5) * 0.04)).toFixed(2)
      }))
    }
  ]
}

const categories: SavingsCategory[] = [
  {
    key: 'labor',
    label: { en: 'Labor & cycle time', ar: 'العمالة وزمن الدورة' },
    description: {
      en: 'Hours reclaimed by autonomous workflows: routing, screening, reconciliation and reporting that no longer need a human in the loop for the routine path.',
      ar: 'ساعات استُردّت من تدفقات تشغيل ذاتية: التوجيه والفرز والتسوية وإعداد التقارير لم تعد تحتاج تدخّلًا بشريًا في المسار المعتاد.'
    },
    amountSar: 11_400_000,
    detail: { en: `${fteHours.toLocaleString('en-US')} FTE-hours · SAR ${(11_400_000 / 1_000_000).toFixed(1)}M`, ar: `${fteHours.toLocaleString('en-US')} ساعة عمل · ${(11_400_000 / 1_000_000).toFixed(1)} مليون ريال` }
  },
  {
    key: 'errors',
    label: { en: 'Errors prevented', ar: 'الأخطاء المُمنوعة' },
    description: {
      en: 'Costs avoided when an agent caught a mismatch, a missing approval or an out-of-policy entry before it cleared a downstream system.',
      ar: 'تكاليف تم تفاديها حين رصد الوكيل عدم تطابق، أو غياب اعتماد، أو إدخالًا خارج السياسة قبل أن ينفذ إلى نظام أدنى.'
    },
    amountSar: 6_240_000,
    detail: { en: '3,820 exceptions caught · 91% before cost crystallized', ar: '3,820 استثناءً مرصودًا · 91% قبل تجسّد التكلفة' }
  },
  {
    key: 'capital',
    label: { en: 'Working capital', ar: 'رأس المال العامل' },
    description: {
      en: 'Faster cash cycle from cleaner three-way match, prioritized collections, and consolidated treasury — capital that used to sit in transit now compounds.',
      ar: 'دورة نقدية أسرع من مطابقة ثلاثية أنظف وتحصيل مُرتَّب وخزينة موحَّدة — رأس المال الذي كان في الطريق صار يعمل لصالحك.'
    },
    amountSar: 8_900_000,
    detail: { en: 'DSO −7 days · DPO +5 days · capital released SAR 8.9M', ar: 'تقليل DSO 7 أيام · زيادة DPO 5 أيام · تحرير 8.9 مليون' }
  },
  {
    key: 'vendor',
    label: { en: 'Vendor & spend', ar: 'الموردون والإنفاق' },
    description: {
      en: 'Maverick-spend recapture, contract-renewal capture, performance-based pricing renegotiation and ad-spend reallocation.',
      ar: 'استرداد الإنفاق غير المعتمد، استكمال تجديد العقود، إعادة تفاوض الأسعار وفق الأداء، وإعادة توزيع الإنفاق الإعلاني.'
    },
    amountSar: 9_620_000,
    detail: { en: '142 contracts reviewed · 38 renegotiated · SAR 9.6M recovered', ar: '142 عقدًا تمت مراجعته · 38 إعادة تفاوض · 9.6 مليون مسترد' }
  },
  {
    key: 'compliance',
    label: { en: 'Compliance & risk', ar: 'الامتثال والمخاطر' },
    description: {
      en: 'Penalty avoidance from on-time filings, policy-consistency scans and regulatory watch — quantified as the prior 12-month average of incurred fines and remediation.',
      ar: 'تفادي الغرامات من خلال الإقرارات في موعدها وفحص اتساق السياسات والرصد التنظيمي — مقاسة بمتوسط الغرامات والمعالجات في آخر 12 شهرًا.'
    },
    amountSar: 3_180_000,
    detail: { en: '0 missed filings YTD · SAR 3.18M penalty avoidance', ar: '0 إقرارات فائتة هذا العام · 3.18 مليون تفادي غرامات' }
  },
  {
    key: 'churn',
    label: { en: 'Retention uplift', ar: 'تحسين الاحتفاظ' },
    description: {
      en: 'Customer-lifetime value protected by churn-risk routing, first-response automation and stalled-deal recovery on the sales side.',
      ar: 'قيمة العميل مدى الحياة محمية بفضل توجيه مخاطر التسرب، أتمتة الردّ الأول، وإنقاذ الصفقات المتوقفة في المبيعات.'
    },
    amountSar: 7_800_000,
    detail: { en: 'Churn 4.8% → 2.6% · CLV uplift SAR 7.8M', ar: 'التسرب 4.8% ← 2.6% · زيادة قيمة العميل 7.8 مليون' }
  }
]

const generatedAt = '2026-06-15T08:00:00Z'

let savingsState: SavingsState | null = null

export function getSavingsState(): SavingsState {
  if (savingsState) return savingsState
  savingsState = {
    ytdSar: jitter(ytdSar, 50_000),
    monthSar,
    runRateAnnualSar: runRate,
    baselineCostSar: baseline,
    withJarvisCostSar: withJarvis,
    roiMultiplier: roi,
    fteHoursReclaimed: fteHours,
    modulesContributing,
    generatedAt,
    categories,
    byDept: [...DEPT_SAVINGS].sort((a, b) => b.ytdSar - a.ytdSar),
    monthlyTrend,
    comparisonTrend
  }
  return savingsState
}

export function formatSar(value: number, locale: 'en' | 'ar'): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(2)
    return locale === 'ar' ? `${v} مليون ريال` : `SAR ${v}M`
  }
  if (abs >= 1_000) {
    const v = (value / 1_000).toFixed(0)
    return locale === 'ar' ? `${v} ألف ريال` : `SAR ${v}K`
  }
  return locale === 'ar' ? `${Math.round(value)} ريال` : `SAR ${Math.round(value)}`
}

export function formatHours(value: number, locale: 'en' | 'ar'): string {
  const v = value.toLocaleString('en-US')
  return locale === 'ar' ? `${v} ساعة` : `${v} hrs`
}
