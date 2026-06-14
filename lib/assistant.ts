import { departmentSeeds } from './mock/catalog'
import type { FirmState } from './mock/types'
import { COUNTRIES, CUTS, MEATS } from './mock/mec-catalog'
import type { CountryCode, MeatSlug, MecState } from './mock/mec-types'

export type AssistantAction =
  | { kind: 'set-theme'; value: 'light' | 'dark'; label: string }
  | { kind: 'set-locale'; value: 'en' | 'ar'; label: string }
  | { kind: 'set-admin'; value: boolean; label: string }
  | { kind: 'set-whatsapp'; value: boolean; label: string }

export type AssistantLink = { label: string; href: string }

export type AssistantCard =
  | { kind: 'metric'; label: string; value: string; tone?: 'accent' | 'success' | 'warn' | 'neutral' }
  | { kind: 'list'; title: string; items: { label: string; meta?: string; href?: string }[] }

export type AssistantReply = {
  text: string
  cards?: AssistantCard[]
  links?: AssistantLink[]
  actions?: AssistantAction[]
  followups?: string[]
  scope?: 'in' | 'out'
}

export type Locale = 'en' | 'ar'

export type AssistantContext = {
  locale: Locale
  firm: FirmState
  mec: MecState
  clientName: string
}

// ---------- intent matching ----------

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/[إأٱآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()

const containsAny = (s: string, terms: string[]) => terms.some((t) => s.includes(t))

const DEPT_ALIASES: Record<string, string[]> = {
  logistics: ['logistics', 'supply', 'delivery', 'warehouse', 'shipment', 'shipping', 'لوجست', 'الامداد', 'الشحن', 'المستودع'],
  sales: ['sales', 'pipeline', 'lead', 'quote', 'deal', 'مبيعات', 'صفق', 'عروض'],
  finance: ['finance', 'cash', 'invoice', 'treasury', 'financial', 'ماليه', 'النقد', 'الفواتير', 'الخزينه'],
  accounting: ['accounting', 'journal', 'close', 'reconciliation', 'audit', 'محاسبه', 'القيود', 'الاقفال'],
  hr: ['hr', 'human resource', 'people', 'employee', 'hire', 'attrition', 'موارد', 'بشريه', 'موظف'],
  marketing: ['marketing', 'campaign', 'attribution', 'ads', 'content', 'تسويق', 'حمله', 'الاعلان'],
  management: ['management', 'leadership', 'executive', 'ceo', 'manager', 'القياده', 'الاداره', 'تنفيذ'],
  'customer-service': ['customer service', 'support', 'ticket', 'help desk', 'العملاء', 'الدعم'],
  procurement: ['procurement', 'vendor', 'supplier', 'po', 'purchase order', 'المشتريات', 'الموردين'],
  'it-ops': ['it', 'operations', 'incident', 'monitoring', 'asset', 'change management', 'تقني', 'الحوادث'],
  'legal-compliance': ['legal', 'compliance', 'contract', 'regulatory', 'القانوني', 'الامتثال', 'العقود']
}

const MEAT_ALIASES: Record<MeatSlug, string[]> = {
  beef: ['beef', 'بقر'],
  lamb: ['lamb', 'mutton', 'ضأن', 'خروف'],
  chicken: ['chicken', 'دجاج'],
  camel: ['camel', 'إبل', 'جمل'],
  goat: ['goat', 'ماعز']
}

const COUNTRY_ALIASES: Record<CountryCode, string[]> = {
  BR: ['brazil', 'brazilian', 'البرازيل'],
  IN: ['india', 'indian', 'الهند'],
  US: ['usa', 'united states', 'america', 'american', 'امريكا', 'الولايات'],
  AU: ['australia', 'australian', 'استراليا'],
  AR: ['argentina', 'argentinian', 'الارجنتين'],
  NZ: ['new zealand', 'kiwi', 'نيوزيلندا'],
  PK: ['pakistan', 'pakistani', 'باكستان'],
  PT: ['portugal', 'portuguese', 'البرتغال'],
  UY: ['uruguay', 'الاوروغواي', 'الاوروغواي']
}

function matchDept(q: string): string | null {
  for (const [slug, aliases] of Object.entries(DEPT_ALIASES)) {
    if (containsAny(q, aliases)) return slug
  }
  return null
}

function matchMeat(q: string): MeatSlug | null {
  for (const [slug, aliases] of Object.entries(MEAT_ALIASES) as [MeatSlug, string[]][]) {
    if (containsAny(q, aliases)) return slug
  }
  return null
}

function matchCountry(q: string): CountryCode | null {
  for (const [code, aliases] of Object.entries(COUNTRY_ALIASES) as [CountryCode, string[]][]) {
    if (containsAny(q, aliases)) return code
  }
  return null
}

function matchCut(q: string, meat?: MeatSlug | null): string | null {
  const pool = meat ? CUTS.filter((c) => c.meat === meat) : CUTS
  for (const cut of pool) {
    if (q.includes(cut.slug.replace(/-/g, ' ')) || q.includes(cut.name.en.toLowerCase()) || q.includes(cut.name.ar)) {
      return cut.slug
    }
  }
  return null
}

// ---------- responses ----------

function t<T extends Record<Locale, string>>(loc: Locale, dict: T) {
  return dict[loc]
}

function fmtList(items: string[], loc: Locale) {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  const sep = loc === 'ar' ? ' و ' : ' and '
  return items.slice(0, -1).join(', ') + sep + items[items.length - 1]
}

// --- overview ---
function overview({ locale, firm }: AssistantContext): AssistantReply {
  const running = firm.firmKpis[0]?.value
  const decisions = firm.firmKpis[1]?.value
  const exceptions = firm.firmKpis[2]?.value
  const interventions = firm.firmKpis[3]?.value
  return {
    text: t(locale, {
      en: `Across your operations: ${running} workflows live, ${decisions} decisions issued in the last 24 hours, ${exceptions} open exceptions, and ${interventions} items waiting on a human. Open the control center to drill in.`,
      ar: `حالة عملياتك: ${running} تدفقًا نشطًا، ${decisions} قرارًا خلال آخر 24 ساعة، ${exceptions} حالة مفتوحة، و${interventions} عنصرًا ينتظر قرارك. افتح مركز التحكم للتفاصيل.`
    }),
    cards: firm.firmKpis.slice(0, 4).map((k) => ({
      kind: 'metric' as const,
      label: k.label[locale],
      value: k.value,
      tone: k.highlight ? 'accent' : 'neutral'
    })),
    links: [{ label: locale === 'ar' ? 'مركز التحكم' : 'Control center', href: '/control-center' }],
    followups: [
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : "What needs my decision?",
      locale === 'ar' ? 'كيف حالة المبيعات؟' : 'How is sales doing?',
      locale === 'ar' ? 'أسعار اللحم البقري اليوم؟' : 'Beef prices today?'
    ]
  }
}

// --- exceptions / interventions ---
function exceptions({ locale, firm }: AssistantContext): AssistantReply {
  const top = firm.globalInterventions.slice(0, 4)
  const total = firm.globalInterventions.length
  if (total === 0) {
    return {
      text: t(locale, {
        en: "You're clear. No interventions pending right now.",
        ar: 'لا يوجد ما ينتظر قرارك حاليًا.'
      })
    }
  }
  return {
    text: t(locale, {
      en: `${total} item${total === 1 ? '' : 's'} waiting on you. Here are the top ones — open the notifications inbox for the full list.`,
      ar: `${total} عنصرًا ينتظر قرارك. هذه أبرزها — افتح صندوق التنبيهات لرؤية الكل.`
    }),
    cards: [
      {
        kind: 'list',
        title: locale === 'ar' ? 'أبرز الحالات' : 'Top items',
        items: top.map((iv) => ({
          label: iv.text[locale],
          meta: iv.severity
        }))
      }
    ],
    links: [{ label: locale === 'ar' ? 'صندوق التنبيهات' : 'Notifications inbox', href: '/notifications' }]
  }
}

// --- department-specific ---
function deptSummary(slug: string, { locale, firm }: AssistantContext): AssistantReply {
  const dept = firm.departments.find((d) => d.slug === slug)
  if (!dept) {
    return outOfScope({ locale } as AssistantContext)
  }
  const topKpi = dept.kpis[0]
  return {
    text: t(locale, {
      en: `${dept.name.en}: ${dept.solutions.length} modules live, ${dept.openExceptions} open exception${dept.openExceptions === 1 ? '' : 's'}. ${topKpi ? `${topKpi.label.en} sits at ${topKpi.value}.` : ''}`,
      ar: `${dept.name.ar}: ${dept.solutions.length} وحدة نشطة، و${dept.openExceptions} حاله مفتوحه. ${topKpi ? `${topKpi.label.ar} عند ${topKpi.value}.` : ''}`
    }),
    cards: dept.kpis.slice(0, 4).map((k) => ({
      kind: 'metric' as const,
      label: k.label[locale],
      value: k.value,
      tone: k.highlight ? 'accent' : 'neutral'
    })),
    links: [
      { label: locale === 'ar' ? `فتح ${dept.name.ar}` : `Open ${dept.name.en}`, href: `/departments/${dept.slug}` }
    ],
    followups: [
      locale === 'ar' ? 'ما المسائل العاجلة؟' : 'Anything urgent?',
      locale === 'ar' ? 'أعطني نظرة عامة' : 'Give me an overview'
    ]
  }
}

// --- MEC prices ---
function mecPrices(q: string, { locale, mec }: AssistantContext): AssistantReply {
  const meat = matchMeat(q)
  const cut = matchCut(q, meat)
  const country = matchCountry(q)

  if (!meat) {
    const beefTop = mec.latestPrices.filter((p) => p.meat === 'beef').sort((a, b) => a.price_usd_per_kg - b.price_usd_per_kg).slice(0, 3)
    return {
      text: t(locale, {
        en: "Tell me a meat and I'll surface the prices. Quick view of beef cheapest origins:",
        ar: 'أخبرني بنوع اللحم وسأعرض الأسعار. لقطة سريعة لأرخص مصادر لحم البقر:'
      }),
      cards: [
        {
          kind: 'list',
          title: locale === 'ar' ? 'أرخص أسعار البقر' : 'Cheapest beef',
          items: beefTop.map((p) => {
            const c = COUNTRIES.find((x) => x.code === p.country)
            const cutObj = CUTS.find((x) => x.slug === p.cut)
            return {
              label: `${c?.flag} ${cutObj?.name[locale]} — $${p.price_usd_per_kg.toFixed(2)}/kg`,
              meta: c?.name[locale]
            }
          })
        }
      ],
      links: [{ label: locale === 'ar' ? 'مستكشف الأسعار' : 'Price explorer', href: '/meat-intel/price-explorer' }]
    }
  }

  const filtered = mec.latestPrices.filter((p) => {
    if (p.meat !== meat) return false
    if (cut && p.cut !== cut) return false
    if (country && p.country !== country) return false
    return true
  })

  if (filtered.length === 0) {
    return {
      text: t(locale, {
        en: "I don't have prices for that combination yet — try a different cut or origin.",
        ar: 'لا تتوفر أسعار لهذه التركيبة حاليًا — جرّب قطعة أو مصدرًا آخر.'
      })
    }
  }

  filtered.sort((a, b) => a.price_usd_per_kg - b.price_usd_per_kg)
  const cheapest = filtered[0]
  const cheapestCountry = COUNTRIES.find((c) => c.code === cheapest.country)
  const cheapestCut = CUTS.find((c) => c.slug === cheapest.cut)
  const meatName = MEATS.find((m) => m.slug === meat)

  return {
    text: t(locale, {
      en: `${cheapestCountry?.flag} ${cheapestCountry?.name.en} ${cheapestCut?.name.en} is cheapest right now at $${cheapest.price_usd_per_kg.toFixed(2)}/kg (${(cheapest.price_usd_per_kg * mec.fx.rate).toFixed(2)} SAR), ${cheapest.delta_7d_pct >= 0 ? '+' : ''}${cheapest.delta_7d_pct.toFixed(1)}% week-over-week.`,
      ar: `${cheapestCountry?.flag} ${cheapestCountry?.name.ar} ${cheapestCut?.name.ar} هي الأرخص حاليًا بسعر $${cheapest.price_usd_per_kg.toFixed(2)}/كغ (${(cheapest.price_usd_per_kg * mec.fx.rate).toFixed(2)} ريال)، بتغيّر ${cheapest.delta_7d_pct >= 0 ? '+' : ''}${cheapest.delta_7d_pct.toFixed(1)}% أسبوعيًا.`
    }),
    cards: [
      {
        kind: 'list',
        title: `${meatName?.name[locale]}${cut ? ' · ' + cheapestCut?.name[locale] : ''}`,
        items: filtered.slice(0, 5).map((p) => {
          const c = COUNTRIES.find((x) => x.code === p.country)
          const cu = CUTS.find((x) => x.slug === p.cut)
          return {
            label: `${c?.flag} ${cu?.name[locale]}`,
            meta: `$${p.price_usd_per_kg.toFixed(2)} · ${p.delta_7d_pct >= 0 ? '+' : ''}${p.delta_7d_pct.toFixed(1)}%`
          }
        })
      }
    ],
    links: [
      { label: locale === 'ar' ? 'فتح مستكشف الأسعار' : 'Open price explorer', href: '/meat-intel/price-explorer' },
      { label: locale === 'ar' ? 'طلب تقرير' : 'Request a report', href: '/meat-intel/request-report' }
    ],
    followups: [
      locale === 'ar' ? 'هل هناك أزمة في السوق؟' : 'Any crisis in the market?',
      locale === 'ar' ? 'كيف الشحن إلى جدة؟' : 'How is freight to Jeddah?'
    ]
  }
}

// --- MEC crisis ---
function mecCrisis({ locale, mec }: AssistantContext): AssistantReply {
  const top = mec.news.filter((n) => n.severity >= 4).slice(0, 4)
  return {
    text: t(locale, {
      en: `${top.length} high-severity stor${top.length === 1 ? 'y' : 'ies'} active right now. Here's what's moving the market:`,
      ar: `${top.length} حدثًا عالي الخطورة نشط الآن. هذا ما يُحرّك السوق:`
    }),
    cards: [
      {
        kind: 'list',
        title: locale === 'ar' ? 'أبرز التنبيهات' : 'Top alerts',
        items: top.map((n) => ({
          label: n.headline[locale],
          meta: `S${n.severity}`
        }))
      }
    ],
    links: [{ label: locale === 'ar' ? 'فتح موجز الأزمات' : 'Open crisis feed', href: '/meat-intel/crisis-feed' }]
  }
}

// --- MEC report request ---
function mecReportGuide({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'Pick meat, cut, origin countries and destination port. I run the comparison and produce a bilingual PDF with a buy/wait verdict. Want me to open the form?',
      ar: 'اختر نوع اللحم والقطعة والدول والميناء، وأنا أجري المقارنة وأنتج تقريرًا ثنائي اللغة مع توصية شراء أو انتظار. أفتح لك النموذج؟'
    }),
    links: [{ label: locale === 'ar' ? 'فتح نموذج الطلب' : 'Open the request form', href: '/meat-intel/request-report' }]
  }
}

// --- navigation ---
const NAV_TARGETS: { keywords: string[]; href: string; en: string; ar: string }[] = [
  { keywords: ['control', 'overview', 'dashboard', 'home', 'لوح', 'مركز'], href: '/control-center', en: 'Control center', ar: 'مركز التحكم' },
  { keywords: ['department', 'departments', 'الاقسام', 'الأقسام'], href: '/departments', en: 'Departments', ar: 'الأقسام' },
  { keywords: ['notification', 'inbox', 'alert', 'صندوق', 'تنبيه'], href: '/notifications', en: 'Notifications', ar: 'التنبيهات' },
  { keywords: ['report', 'my report', 'تقاريري'], href: '/meat-intel/my-reports', en: 'My reports', ar: 'تقاريري' },
  { keywords: ['meat', 'lamb', 'beef', 'price', 'اللحوم', 'اسعار'], href: '/meat-intel', en: 'Meat Intel', ar: 'استخبارات اللحوم' },
  { keywords: ['academy', 'training', 'learn', 'الاكاديميه', 'تدريب'], href: '/jarvis-academy', en: 'Academy', ar: 'الأكاديمية' },
  { keywords: ['contact', 'engineer', 'support', 'تواصل', 'مهندس'], href: '/contact', en: 'Contact', ar: 'التواصل' }
]

function navigate(q: string, { locale }: AssistantContext): AssistantReply {
  for (const target of NAV_TARGETS) {
    if (containsAny(q, target.keywords)) {
      return {
        text: t(locale, {
          en: `Here's ${target.en} — click below to jump there.`,
          ar: `هذه ${target.ar} — اضغط لتنتقل.`
        }),
        links: [{ label: locale === 'ar' ? target.ar : target.en, href: target.href }]
      }
    }
  }
  return help({ locale } as AssistantContext)
}

// --- settings ---
function explainTheme({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: "I can switch the theme for you. The sun/moon button in the top bar toggles it too.",
      ar: 'أستطيع تبديل المظهر لك. زر الشمس/القمر في الشريط العلوي يفعل ذلك أيضًا.'
    }),
    actions: [
      { kind: 'set-theme', value: 'light', label: locale === 'ar' ? 'تفعيل الفاتح' : 'Switch to light' },
      { kind: 'set-theme', value: 'dark', label: locale === 'ar' ? 'تفعيل الداكن' : 'Switch to dark' }
    ]
  }
}

function explainLanguage({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'You can switch between English and Arabic. The EN/AR toggle in the top bar does the same thing.',
      ar: 'يمكنك التبديل بين العربية والإنجليزية. زر EN/AR في الشريط العلوي يقوم بنفس الأمر.'
    }),
    actions: [
      { kind: 'set-locale', value: 'en', label: 'English' },
      { kind: 'set-locale', value: 'ar', label: 'العربية' }
    ]
  }
}

function explainAdmin({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'Admin mode opens the Sources management page in Meat Intel. Demo only — no real permissions.',
      ar: 'وضع الإدارة يفتح صفحة إدارة المصادر في استخبارات اللحوم. بيئة تجريبية بلا صلاحيات حقيقية.'
    }),
    actions: [
      { kind: 'set-admin', value: true, label: locale === 'ar' ? 'تفعيل وضع الإدارة' : 'Enable admin mode' },
      { kind: 'set-admin', value: false, label: locale === 'ar' ? 'إيقاف وضع الإدارة' : 'Disable admin mode' }
    ],
    links: [{ label: locale === 'ar' ? 'فتح المصادر' : 'Open Sources', href: '/meat-intel/admin-sources' }]
  }
}

function explainWhatsApp({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'When a Meat Intel report finishes, we can also push the bilingual summary to your WhatsApp. Manage it on the Request Report page.',
      ar: 'عند انتهاء تقرير استخبارات اللحوم، يمكننا إرسال الملخّص ثنائي اللغة إلى واتساب. أدر الإعداد من صفحة طلب التقرير.'
    }),
    links: [{ label: locale === 'ar' ? 'إدارة الإشعارات' : 'Manage notifications', href: '/meat-intel/request-report' }]
  }
}

// --- meta ---
function help({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: "Ask me about your operations, any department, Meat Intel prices and crises, where to find things in the portal, or settings like theme and language. I keep to business and the interface.",
      ar: 'اسألني عن عملياتك، أي قسم، أسعار وأزمات استخبارات اللحوم، أين تجد الأمور في البوابة، أو إعدادات مثل المظهر واللغة. أبقى ضمن العمل والواجهة.'
    }),
    followups: [
      locale === 'ar' ? 'لخّص حالة العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : "What needs my attention?",
      locale === 'ar' ? 'أرني أسعار البقر' : 'Show beef prices',
      locale === 'ar' ? 'بدّل إلى الوضع الداكن' : 'Switch to dark mode'
    ]
  }
}

function greeting({ locale, clientName }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: `Hello — I'm Jarvis. I help with operations at ${clientName}, Meat Intel, and your portal settings. What can I look into?`,
      ar: `أهلًا — أنا جارفِس. أساعد في عمليات ${clientName} واستخبارات اللحوم وإعدادات البوابة. كيف يمكنني المساعدة؟`
    }),
    followups: [
      locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my attention?',
      locale === 'ar' ? 'أسعار البقر اليوم' : 'Beef prices today',
      locale === 'ar' ? 'الإعدادات' : 'Settings'
    ]
  }
}

function outOfScope({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: "That sits outside what I do. I keep to business operations, Meat Intel, and the portal interface. Try asking about a department, your reports, or settings.",
      ar: 'هذا خارج نطاقي. أركّز على عمليات الأعمال واستخبارات اللحوم وواجهة البوابة. جرّب أن تسأل عن قسم أو تقاريرك أو الإعدادات.'
    }),
    scope: 'out',
    followups: [
      locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ماذا تستطيع أن تفعل؟' : 'What can you do?'
    ]
  }
}

// ---------- intent classification ----------

const SCOPE_TERMS = [
  // English business / interface / settings
  'department', 'depart', 'sales', 'finance', 'hr', 'logistic', 'marketing', 'leadership', 'management', 'procurement', 'compliance', 'legal', 'support', 'customer', 'incident', 'operation', 'workflow', 'decision', 'exception', 'intervention', 'approval', 'kpi', 'metric', 'pipeline', 'cash', 'invoice', 'report', 'beef', 'lamb', 'chicken', 'goat', 'camel', 'meat', 'price', 'fob', 'jeddah', 'dammam', 'crisis', 'freight', 'verdict', 'theme', 'dark', 'light', 'language', 'arabic', 'english', 'whatsapp', 'admin', 'notification', 'settings', 'interface', 'navigate', 'where', 'show', 'open', 'help', 'summary', 'overview', 'status',
  // Arabic
  'قسم', 'مبيعات', 'ماليه', 'مالية', 'موارد', 'لوجست', 'تسويق', 'القياده', 'القيادة', 'المشتريات', 'الامتثال', 'القانوني', 'الدعم', 'العملاء', 'حادث', 'عمليات', 'تدفق', 'قرار', 'استثناء', 'تدخل', 'اعتماد', 'مؤشر', 'انبوب', 'انابيب', 'نقد', 'فاتوره', 'فاتورة', 'تقرير', 'بقر', 'ضأن', 'دجاج', 'ماعز', 'ابل', 'لحم', 'سعر', 'اسعار', 'جده', 'الدمام', 'ازمه', 'ازمة', 'شحن', 'قرار', 'مظهر', 'داكن', 'فاتح', 'لغه', 'لغة', 'عربي', 'انجل', 'واتساب', 'اداره', 'ادارة', 'تنبيه', 'اعدادات', 'واجهه', 'واجهة', 'انتقل', 'افتح', 'مساعد', 'ملخص', 'حاله', 'حالة'
]

function isInScope(q: string): boolean {
  return SCOPE_TERMS.some((s) => q.includes(s))
}

export function classifyAndAnswer(question: string, ctx: AssistantContext): AssistantReply {
  const q = norm(question)
  if (!q) return greeting(ctx)

  // help / what can you do
  if (containsAny(q, ['what can you do', 'help', 'capabilities', 'who are you', 'ماذا تستطيع', 'مساعده', 'مساعدة', 'كيف تساعد', 'من انت'])) {
    return help(ctx)
  }

  // greetings
  if (containsAny(q, ['hello', 'hi', 'hey', 'salam', 'مرحبا', 'اهلا', 'السلام'])) {
    return greeting(ctx)
  }

  // settings — theme
  if (containsAny(q, ['dark mode', 'light mode', 'theme', 'مظهر', 'الداكن', 'الفاتح'])) {
    return explainTheme(ctx)
  }
  // settings — language
  if (containsAny(q, ['language', 'arabic', 'english', 'translate', 'العربيه', 'العربية', 'الانجل', 'لغه', 'لغة'])) {
    return explainLanguage(ctx)
  }
  // settings — admin
  if (containsAny(q, ['admin', 'permission', 'role', 'الاداره', 'الادارة', 'صلاحيه', 'صلاحية'])) {
    return explainAdmin(ctx)
  }
  // settings — whatsapp
  if (containsAny(q, ['whatsapp', 'وتس', 'واتس'])) {
    return explainWhatsApp(ctx)
  }

  // exceptions
  if (containsAny(q, ['exception', 'attention', 'urgent', 'intervene', 'pending', 'need decision', 'awaiting', 'استثناء', 'انتباه', 'عاجل', 'تدخل', 'انتظار', 'قراري', 'يحتاج'])) {
    return exceptions(ctx)
  }

  // MEC crisis
  if (containsAny(q, ['crisis', 'alert', 'news', 'breakdown', 'outbreak', 'disease', 'flu', 'tariff', 'ازمه', 'ازمة', 'وباء', 'تنبيه', 'انفلونزا'])) {
    return mecCrisis(ctx)
  }

  // MEC report
  if (containsAny(q, ['request report', 'generate report', 'new report', 'compare', 'pdf', 'تقرير جديد', 'مقارنه', 'مقارنة'])) {
    return mecReportGuide(ctx)
  }

  // MEC prices (broad — any meat keyword or 'price')
  if (containsAny(q, ['price', 'cheap', 'cost', 'fob', 'beef', 'lamb', 'chicken', 'camel', 'goat', 'سعر', 'اسعار', 'ارخص', 'بقر', 'ضأن', 'دجاج', 'ابل', 'ماعز', 'لحم'])) {
    return mecPrices(q, ctx)
  }

  // navigation
  if (containsAny(q, ['where', 'find', 'show me', 'take me', 'go to', 'open the', 'اين', 'افتح', 'انتقل', 'وين'])) {
    return navigate(q, ctx)
  }

  // department
  const dept = matchDept(q)
  if (dept) return deptSummary(dept, ctx)

  // overview / summary
  if (containsAny(q, ['summary', 'overview', 'status', 'how are', 'how is', 'state of', 'ملخص', 'نظره', 'نظرة', 'حاله', 'حالة', 'كيف'])) {
    return overview(ctx)
  }

  // scope guard
  if (!isInScope(q)) return outOfScope(ctx)

  // generic fallback — give overview as best-effort
  return overview(ctx)
}

export function makeContext(args: { locale: Locale; firm: FirmState; mec: MecState }): AssistantContext {
  return {
    locale: args.locale,
    firm: args.firm,
    mec: args.mec,
    clientName: args.firm.clientName
  }
}

export function suggestionStarters(locale: Locale): string[] {
  return [
    locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
    locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my attention?',
    locale === 'ar' ? 'كيف حالة المبيعات؟' : 'How is sales?',
    locale === 'ar' ? 'أرني أسعار البقر' : 'Show beef prices',
    locale === 'ar' ? 'هل هناك أزمة في السوق؟' : 'Any market crisis?',
    locale === 'ar' ? 'بدّل إلى الوضع الداكن' : 'Switch to dark mode'
  ]
}
