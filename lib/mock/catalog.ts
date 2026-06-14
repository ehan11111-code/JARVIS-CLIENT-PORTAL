import type { Bi, NodeKind } from './types'

export type SolutionSeed = {
  slug: string
  name: Bi
  context: Bi
  systems: string[]
  kpiSeeds: { label: Bi; format: 'int' | 'pct' | 'sar' | 'ms' | 'hrs'; range: [number, number]; highlight?: boolean }[]
  chartTitle: Bi
  chartA: Bi
  chartB: Bi
  workflow: { id: string; label: Bi; kind: NodeKind }[]
  decisionTemplates: Bi[]
  interventionTemplates: Bi[]
  activityTemplates: Bi[]
}

export type DepartmentSeed = {
  slug: string
  name: Bi
  contextLine: Bi
  kpiSeeds: { label: Bi; format: 'int' | 'pct' | 'sar' | 'ms' | 'hrs'; range: [number, number]; highlight?: boolean }[]
  solutions: SolutionSeed[]
}

const std = (id: string, en: string, ar: string, kind: NodeKind) => ({ id, label: { en, ar }, kind })

const baseWorkflow = (sourceA: string, sourceAAr: string, sourceB: string, sourceBAr: string, agent: string, agentAr: string, integ: string, integAr: string, output: string, outputAr: string) => [
  std('s1', sourceA, sourceAAr, 'source'),
  std('s2', sourceB, sourceBAr, 'source'),
  std('a1', agent, agentAr, 'agent'),
  std('i1', integ, integAr, 'integration'),
  std('o1', output, outputAr, 'output')
]

export const departmentSeeds: DepartmentSeed[] = [
  {
    slug: 'logistics',
    name: { en: 'Logistics & Supply Chain', ar: 'الإمداد والخدمات اللوجستية' },
    contextLine: { en: 'Six modules live · four integrated systems · last sync 00:42 ago.', ar: 'ست وحدات نشطة · أربعة أنظمة مرتبطة · آخر مزامنة قبل 00:42 دقيقة.' },
    kpiSeeds: [
      { label: { en: 'Delivery notes today', ar: 'إشعارات التسليم اليوم' }, format: 'int', range: [380, 480] },
      { label: { en: 'In-transit shipments', ar: 'شحنات في الطريق' }, format: 'int', range: [120, 180] },
      { label: { en: 'POD match rate', ar: 'نسبة مطابقة إثبات التسليم' }, format: 'pct', range: [96, 99], highlight: true },
      { label: { en: 'Open exceptions', ar: 'حالات مفتوحة' }, format: 'int', range: [3, 9] }
    ],
    solutions: [
      {
        slug: 'delivery-note-reconciliation',
        name: { en: 'Delivery-note reconciliation', ar: 'مطابقة إشعارات التسليم' },
        context: { en: 'Closes the gap between warehouse and last-mile so every delivery note is matched.', ar: 'يسدّ الفجوة بين المستودع والميل الأخير، فلا يضيع أي إشعار تسليم بلا مطابقة.' },
        systems: ['SAP', 'WMS', 'FLEET-OS'],
        kpiSeeds: [
          { label: { en: 'NOTES PROCESSED · 24H', ar: 'إشعارات معالجة · 24س' }, format: 'int', range: [380, 480] },
          { label: { en: 'MATCH RATE', ar: 'نسبة التطابق' }, format: 'pct', range: [97, 99], highlight: true },
          { label: { en: 'EXCEPTIONS OPEN', ar: 'استثناءات مفتوحة' }, format: 'int', range: [2, 8] },
          { label: { en: 'AVG RESOLUTION', ar: 'متوسط زمن المعالجة' }, format: 'ms', range: [180, 420] }
        ],
        chartTitle: { en: 'PROCESSED VOLUME vs EXCEPTIONS · 14D', ar: 'الحجم المُعالج مقابل الاستثناءات · 14 يومًا' },
        chartA: { en: 'Processed', ar: 'تمت معالجته' },
        chartB: { en: 'Exceptions', ar: 'الاستثناءات' },
        workflow: baseWorkflow('Carrier API', 'واجهة الناقل', 'WMS receipts', 'إيصالات المستودع', 'Reconciliation agent', 'وكيل التسوية', 'SAP S/4', 'SAP S/4', 'Reconciled DN ledger', 'سجل إشعارات مُسوّى'),
        decisionTemplates: [
          { en: 'Auto-matched DN-{n} → PO-{m}', ar: 'مطابقة تلقائية DN-{n} ← PO-{m}' },
          { en: 'Flagged DN-{n} mismatch (qty −{q})', ar: 'تنبيه عدم تطابق DN-{n} (كمية −{q})' },
          { en: 'Resolved orphan DN-{n} against carrier feed', ar: 'تمت تسوية DN-{n} اليتيمة من خلال تغذية الناقل' }
        ],
        interventionTemplates: [
          { en: 'DN-{n} variance exceeds tolerance · approve override', ar: 'تجاوز DN-{n} حد التسامح · يلزم اعتماد التجاوز' },
          { en: 'Missing POD for DN-{n} · escalate to last-mile', ar: 'إثبات تسليم مفقود لـ DN-{n} · يلزم التصعيد للميل الأخير' }
        ],
        activityTemplates: [
          { en: 'Synced {n} delivery notes from carrier feed', ar: 'تمت مزامنة {n} إشعار تسليم من تغذية الناقل' },
          { en: 'Cleared variance batch · {n} notes', ar: 'تمت معالجة دفعة الفروقات · {n} إشعار' }
        ]
      },
      {
        slug: 'stock-intelligence',
        name: { en: 'Real-Time Stock Intelligence Layer', ar: 'طبقة ذكاء المخزون اللحظي' },
        context: { en: 'Closes inventory blind spots across warehouses and retail nodes.', ar: 'يغلق فجوات الرؤية على المخزون عبر المستودعات ونقاط البيع.' },
        systems: ['SAP', 'WMS', 'POS'],
        kpiSeeds: [
          { label: { en: 'SKUs TRACKED', ar: 'وحدات المخزون المتتبعة' }, format: 'int', range: [12000, 18000] },
          { label: { en: 'STOCKOUT RISK · 7D', ar: 'خطر نفاد المخزون · 7 أيام' }, format: 'int', range: [4, 14], highlight: true },
          { label: { en: 'AVG TURNS', ar: 'متوسط دوران المخزون' }, format: 'int', range: [6, 11] },
          { label: { en: 'INTEGRATED NODES', ar: 'عقد متكاملة' }, format: 'int', range: [18, 28] }
        ],
        chartTitle: { en: 'STOCK COVERAGE vs FORECAST DEMAND · 14D', ar: 'تغطية المخزون مقابل الطلب المتوقع · 14 يومًا' },
        chartA: { en: 'Coverage', ar: 'التغطية' },
        chartB: { en: 'Risk SKUs', ar: 'وحدات معرضة' },
        workflow: baseWorkflow('POS feeds', 'تغذية نقاط البيع', 'WMS stock levels', 'مستويات المستودع', 'Stock intelligence agent', 'وكيل ذكاء المخزون', 'ERP replenishment', 'تجديد ERP', 'Replenishment orders', 'أوامر تجديد المخزون'),
        decisionTemplates: [
          { en: 'Issued replenishment order RP-{n} for SKU-{m}', ar: 'إصدار أمر تجديد RP-{n} للوحدة SKU-{m}' },
          { en: 'Down-graded SKU-{m} stockout risk after restock', ar: 'تخفيض خطر نفاد SKU-{m} بعد التجديد' }
        ],
        interventionTemplates: [
          { en: 'SKU-{m} below safety stock · approve emergency PO', ar: 'SKU-{m} تحت مخزون الأمان · اعتماد طلب طارئ' }
        ],
        activityTemplates: [
          { en: 'Recomputed coverage for {n} SKUs', ar: 'إعادة حساب التغطية لـ {n} وحدة' }
        ]
      },
      {
        slug: 'route-orchestration',
        name: { en: 'Route Orchestration Agent', ar: 'وكيل تنسيق المسارات' },
        context: { en: 'Replaces manual route planning with continuous orchestration.', ar: 'يستبدل التخطيط اليدوي للمسارات بتنسيق مستمر.' },
        systems: ['FLEET-OS', 'TMS', 'GIS'],
        kpiSeeds: [
          { label: { en: 'ROUTES ORCHESTRATED · 24H', ar: 'مسارات مُنسقة · 24س' }, format: 'int', range: [80, 140] },
          { label: { en: 'AVG STOPS / ROUTE', ar: 'متوسط التوقفات / مسار' }, format: 'int', range: [14, 22] },
          { label: { en: 'ON-TIME RATE', ar: 'نسبة الالتزام بالوقت' }, format: 'pct', range: [93, 98], highlight: true },
          { label: { en: 'KM SAVED · 7D', ar: 'كم تم توفيرها · 7 أيام' }, format: 'int', range: [800, 1600] }
        ],
        chartTitle: { en: 'ON-TIME vs LATE DELIVERIES · 14D', ar: 'التسليم في الوقت مقابل المتأخر · 14 يومًا' },
        chartA: { en: 'On-time', ar: 'في الوقت' },
        chartB: { en: 'Late', ar: 'متأخر' },
        workflow: baseWorkflow('Order intake', 'استلام الطلبات', 'GIS / traffic', 'GIS / حركة المرور', 'Route agent', 'وكيل المسارات', 'TMS dispatch', 'إرسال TMS', 'Driver routes', 'مسارات السائقين'),
        decisionTemplates: [
          { en: 'Re-routed RT-{n} around incident · saved {q} min', ar: 'تغيير مسار RT-{n} لتجنب حادث · توفير {q} دقيقة' }
        ],
        interventionTemplates: [
          { en: 'Driver D-{n} exceeded shift limit · approve relief', ar: 'تجاوز السائق D-{n} حد الوردية · اعتماد بديل' }
        ],
        activityTemplates: [
          { en: 'Dispatched {n} routes for window {q}', ar: 'إرسال {n} مسار للنافذة {q}' }
        ]
      },
      {
        slug: 'upstream-risk',
        name: { en: 'Upstream Risk Early-Warning', ar: 'الإنذار المبكر لمخاطر الموردين' },
        context: { en: 'Detects supplier delay propagation before it hits production.', ar: 'يكشف تأخر الموردين قبل أن يصل إلى الإنتاج.' },
        systems: ['SAP', 'EDI', 'Vendor portals'],
        kpiSeeds: [
          { label: { en: 'SUPPLIERS MONITORED', ar: 'موردون مُراقَبون' }, format: 'int', range: [80, 160] },
          { label: { en: 'RISK FLAGS · OPEN', ar: 'تنبيهات مخاطر · مفتوحة' }, format: 'int', range: [3, 12], highlight: true },
          { label: { en: 'AVG LEAD TIME · DAYS', ar: 'متوسط زمن التوريد · أيام' }, format: 'int', range: [9, 18] },
          { label: { en: 'EDI HANDSHAKES · 24H', ar: 'تبادلات EDI · 24س' }, format: 'int', range: [600, 1200] }
        ],
        chartTitle: { en: 'RISK FLAGS RAISED · 14D', ar: 'تنبيهات المخاطر · 14 يومًا' },
        chartA: { en: 'Flags', ar: 'تنبيهات' },
        chartB: { en: 'Resolved', ar: 'تمت المعالجة' },
        workflow: baseWorkflow('EDI feeds', 'تغذية EDI', 'Vendor portal', 'بوابة المورد', 'Risk model', 'نموذج المخاطر', 'SAP MRP', 'SAP MRP', 'Procurement alerts', 'تنبيهات المشتريات'),
        decisionTemplates: [
          { en: 'Raised yellow flag on Supplier S-{n} · ETA slip {q}d', ar: 'رفع تنبيه أصفر للمورد S-{n} · انزلاق الموعد {q}يوم' }
        ],
        interventionTemplates: [
          { en: 'Supplier S-{n} at red · approve secondary source', ar: 'المورد S-{n} حالة حرجة · اعتماد مصدر بديل' }
        ],
        activityTemplates: [
          { en: 'Re-scored {n} suppliers on lead-time variance', ar: 'إعادة تقييم {n} مورد على تباين زمن التوريد' }
        ]
      },
      {
        slug: 'capacity-forecasting',
        name: { en: 'Warehouse Capacity Forecasting', ar: 'التنبؤ بالسعة التشغيلية للمستودعات' },
        context: { en: 'Predicts capacity drift across DC network ahead of saturation.', ar: 'يتنبأ بانحراف السعة عبر شبكة المراكز قبل التشبّع.' },
        systems: ['WMS', 'IoT sensors'],
        kpiSeeds: [
          { label: { en: 'DCs MONITORED', ar: 'مراكز توزيع مُراقَبة' }, format: 'int', range: [4, 12] },
          { label: { en: 'AVG UTILISATION', ar: 'متوسط الاستخدام' }, format: 'pct', range: [62, 84], highlight: true },
          { label: { en: 'OVER-CAPACITY · 7D', ar: 'تجاوز السعة · 7 أيام' }, format: 'int', range: [0, 4] },
          { label: { en: 'IOT SIGNALS · 24H', ar: 'إشارات IoT · 24س' }, format: 'int', range: [12000, 22000] }
        ],
        chartTitle: { en: 'CAPACITY UTILISATION · 14D', ar: 'استخدام السعة · 14 يومًا' },
        chartA: { en: 'Utilisation', ar: 'الاستخدام' },
        chartB: { en: 'Threshold', ar: 'العتبة' },
        workflow: baseWorkflow('IoT sensors', 'مستشعرات IoT', 'WMS slotting', 'تخصيص المستودع', 'Capacity model', 'نموذج السعة', 'Slotting engine', 'محرك التخصيص', 'Capacity alerts', 'تنبيهات السعة'),
        decisionTemplates: [{ en: 'Reslotted aisle A-{n} to relieve bottleneck', ar: 'إعادة تخصيص الممر A-{n} لتخفيف الازدحام' }],
        interventionTemplates: [{ en: 'DC-{n} forecast over 95% in 48h · approve overflow plan', ar: 'مركز التوزيع DC-{n} متوقع تجاوز 95% خلال 48س · اعتماد خطة الفائض' }],
        activityTemplates: [{ en: 'Updated capacity forecasts for {n} DCs', ar: 'تحديث توقعات السعة لـ {n} مركز' }]
      },
      {
        slug: 'proof-of-delivery',
        name: { en: 'Vision + Signature POD Pipeline', ar: 'خط معالجة إثبات التسليم بالرؤية والتوقيع' },
        context: { en: 'Closes the last-mile proof-of-delivery gap with vision + signature capture.', ar: 'يغلق فجوة إثبات التسليم في الميل الأخير عبر التقاط الصورة والتوقيع.' },
        systems: ['Mobile app', 'OCR', 'CRM'],
        kpiSeeds: [
          { label: { en: 'PODs CAPTURED · 24H', ar: 'إثباتات تسليم · 24س' }, format: 'int', range: [320, 480] },
          { label: { en: 'OCR CONFIDENCE AVG', ar: 'متوسط ثقة OCR' }, format: 'pct', range: [94, 99] },
          { label: { en: 'DISPUTES · 7D', ar: 'نزاعات · 7 أيام' }, format: 'int', range: [1, 6], highlight: true },
          { label: { en: 'AVG CAPTURE TIME', ar: 'متوسط زمن الالتقاط' }, format: 'ms', range: [600, 1400] }
        ],
        chartTitle: { en: 'PODs CAPTURED · 14D', ar: 'إثباتات التسليم · 14 يومًا' },
        chartA: { en: 'Captured', ar: 'تم الالتقاط' },
        chartB: { en: 'Disputed', ar: 'متنازع عليه' },
        workflow: baseWorkflow('Driver app', 'تطبيق السائق', 'Signature pad', 'لوحة التوقيع', 'Vision + OCR', 'الرؤية + OCR', 'CRM record', 'سجل CRM', 'POD ledger', 'سجل الإثباتات'),
        decisionTemplates: [{ en: 'Validated POD for DN-{n} with confidence {q}', ar: 'تم التحقق من إثبات DN-{n} بثقة {q}' }],
        interventionTemplates: [{ en: 'POD-{n} signature mismatch · review manually', ar: 'عدم تطابق توقيع POD-{n} · مراجعة يدوية' }],
        activityTemplates: [{ en: 'Captured {n} PODs across {q} routes', ar: 'تم التقاط {n} إثبات عبر {q} مسار' }]
      }
    ]
  },
  {
    slug: 'sales',
    name: { en: 'Sales', ar: 'المبيعات' },
    contextLine: { en: 'Six modules live · connected to CRM, phone system and calendar.', ar: 'ست وحدات نشطة · مربوطة بنظام CRM والهاتف والتقويم.' },
    kpiSeeds: [
      { label: { en: 'Leads routed today', ar: 'العملاء المحوَّلون اليوم' }, format: 'int', range: [120, 220] },
      { label: { en: 'Open pipeline', ar: 'الأنبوب المفتوح' }, format: 'sar', range: [8, 22], highlight: true },
      { label: { en: 'Quotes this week', ar: 'عروض الأسعار هذا الأسبوع' }, format: 'int', range: [40, 80] },
      { label: { en: 'Stalled deals', ar: 'صفقات متوقفة' }, format: 'int', range: [6, 18] }
    ],
    solutions: [
      {
        slug: 'lead-router',
        name: { en: 'Smart lead routing', ar: 'التوجيه الذكي للعملاء المحتملين' },
        context: { en: 'Routes incoming leads to the right owner in seconds, so none slip through.', ar: 'يوجّه كل عميل جديد إلى المسؤول المناسب في ثوانٍ، فلا يضيع أحد.' },
        systems: ['CRM', 'Email', 'WhatsApp'],
        kpiSeeds: [
          { label: { en: 'LEADS ROUTED · 24H', ar: 'عملاء مُوجَّهون · 24س' }, format: 'int', range: [120, 220] },
          { label: { en: 'AVG ROUTING TIME', ar: 'متوسط زمن التوجيه' }, format: 'ms', range: [200, 800] },
          { label: { en: 'CONTACT RATE · 24H', ar: 'نسبة الاتصال · 24س' }, format: 'pct', range: [62, 84], highlight: true },
          { label: { en: 'UNCLAIMED · OPEN', ar: 'غير مُستلَم · مفتوح' }, format: 'int', range: [0, 6] }
        ],
        chartTitle: { en: 'LEAD VOLUME vs CONTACTED · 14D', ar: 'حجم العملاء مقابل المُتواصل معهم · 14 يومًا' },
        chartA: { en: 'Volume', ar: 'الحجم' },
        chartB: { en: 'Contacted', ar: 'تم الاتصال' },
        workflow: baseWorkflow('Web forms', 'نماذج الويب', 'Inbound mail', 'بريد وارد', 'Routing agent', 'وكيل التوجيه', 'CRM assignment', 'تخصيص CRM', 'Owner notification', 'إشعار المالك'),
        decisionTemplates: [{ en: 'Routed LD-{n} to A-{m} based on territory + capacity', ar: 'توجيه LD-{n} إلى A-{m} بناءً على المنطقة والطاقة' }],
        interventionTemplates: [{ en: 'LD-{n} unclaimed > 4h · escalate to manager', ar: 'LD-{n} غير مُستلَم > 4س · تصعيد للمدير' }],
        activityTemplates: [{ en: 'Routed {n} leads to {q} owners', ar: 'توجيه {n} عميل إلى {q} مسؤول' }]
      },
      {
        slug: 'pipeline-sync',
        name: { en: 'Pipeline-Sync Agent', ar: 'وكيل مزامنة الأنبوب' },
        context: { en: 'Closes CRM staleness by capturing calls, mail and calendar automatically.', ar: 'يقضي على ركود CRM عبر التقاط المكالمات والبريد والتقويم تلقائيًا.' },
        systems: ['CRM', 'Telephony', 'Outlook'],
        kpiSeeds: [
          { label: { en: 'TOUCHES CAPTURED · 24H', ar: 'تفاعلات مُلتقطة · 24س' }, format: 'int', range: [600, 1100] },
          { label: { en: 'CRM FRESHNESS', ar: 'حداثة CRM' }, format: 'pct', range: [88, 98], highlight: true },
          { label: { en: 'AUTO-FIELDS UPDATED', ar: 'حقول حُدّثت تلقائيًا' }, format: 'int', range: [800, 1600] },
          { label: { en: 'MISSED LOGS · 24H', ar: 'سجلات فائتة · 24س' }, format: 'int', range: [2, 14] }
        ],
        chartTitle: { en: 'TOUCHES CAPTURED · 14D', ar: 'التفاعلات المُلتقطة · 14 يومًا' },
        chartA: { en: 'Captured', ar: 'مُلتقَط' },
        chartB: { en: 'Missed', ar: 'فائت' },
        workflow: baseWorkflow('Telephony', 'الاتصالات', 'Calendar', 'التقويم', 'Sync agent', 'وكيل المزامنة', 'CRM API', 'واجهة CRM', 'Updated records', 'سجلات محدثة'),
        decisionTemplates: [{ en: 'Logged call C-{n} against opportunity O-{m}', ar: 'تسجيل المكالمة C-{n} مقابل الفرصة O-{m}' }],
        interventionTemplates: [{ en: 'Ambiguous attribution for call C-{n} · confirm account', ar: 'تخصيص غامض للمكالمة C-{n} · تأكيد الحساب' }],
        activityTemplates: [{ en: 'Synced {n} touches across {q} owners', ar: 'مزامنة {n} تفاعل عبر {q} مسؤول' }]
      },
      {
        slug: 'quote-generation',
        name: { en: 'Quote-Generation Workflow', ar: 'تدفق توليد عروض الأسعار' },
        context: { en: 'Replaces manual quoting with margin-guarded autonomous quote issuance.', ar: 'يستبدل عروض الأسعار اليدوية بإصدار آلي مع ضوابط الهامش.' },
        systems: ['CRM', 'Pricing engine', 'ERP'],
        kpiSeeds: [
          { label: { en: 'QUOTES ISSUED · 7D', ar: 'عروض صادرة · 7 أيام' }, format: 'int', range: [40, 80] },
          { label: { en: 'AVG CYCLE TIME', ar: 'متوسط زمن الدورة' }, format: 'hrs', range: [1, 5], highlight: true },
          { label: { en: 'MARGIN GUARD HITS', ar: 'تنبيهات ضابط الهامش' }, format: 'int', range: [2, 10] },
          { label: { en: 'WIN RATE · 30D', ar: 'نسبة الفوز · 30 يوم' }, format: 'pct', range: [22, 38] }
        ],
        chartTitle: { en: 'QUOTES ISSUED vs MARGIN HITS · 14D', ar: 'العروض الصادرة مقابل تنبيهات الهامش · 14 يومًا' },
        chartA: { en: 'Issued', ar: 'تم الإصدار' },
        chartB: { en: 'Margin hits', ar: 'تنبيهات الهامش' },
        workflow: baseWorkflow('CRM opp', 'فرصة CRM', 'Pricing rules', 'قواعد التسعير', 'Quote agent', 'وكيل العروض', 'ERP commit', 'تثبيت ERP', 'PDF quote', 'عرض PDF'),
        decisionTemplates: [{ en: 'Issued quote QT-{n} to account A-{m} · {q}% margin', ar: 'إصدار العرض QT-{n} للحساب A-{m} · هامش {q}%' }],
        interventionTemplates: [{ en: 'QT-{n} margin below floor · approve override', ar: 'هامش QT-{n} تحت الحد الأدنى · اعتماد التجاوز' }],
        activityTemplates: [{ en: 'Generated {n} quotes for {q} accounts', ar: 'توليد {n} عرض لـ {q} حساب' }]
      },
      {
        slug: 'forecast-layer',
        name: { en: 'Probabilistic Forecast Layer', ar: 'طبقة التنبؤ الاحتمالية' },
        context: { en: 'Replaces gut-feel forecasts with probability-weighted pipeline outcomes.', ar: 'يستبدل التنبؤات الحدسية بتوقعات أنبوبية مرجَّحة احتماليًا.' },
        systems: ['CRM', 'Data warehouse'],
        kpiSeeds: [
          { label: { en: 'COMMIT PIPELINE', ar: 'تعهدات الأنبوب' }, format: 'sar', range: [3, 9], highlight: true },
          { label: { en: 'P50 / P90 DELTA', ar: 'فجوة P50 / P90' }, format: 'pct', range: [12, 28] },
          { label: { en: 'FORECAST DRIFT · 7D', ar: 'انجراف التنبؤ · 7 أيام' }, format: 'pct', range: [2, 8] },
          { label: { en: 'OPPS RE-SCORED', ar: 'فرص أُعيد تقييمها' }, format: 'int', range: [80, 180] }
        ],
        chartTitle: { en: 'COMMIT vs P50 vs P90 · 14D', ar: 'الالتزام مقابل P50 مقابل P90 · 14 يومًا' },
        chartA: { en: 'Commit', ar: 'الالتزام' },
        chartB: { en: 'P50', ar: 'P50' },
        workflow: baseWorkflow('CRM opps', 'فرص CRM', 'Historical wins', 'فوز سابق', 'Forecast model', 'نموذج التنبؤ', 'Exec dashboard', 'لوحة تنفيذية', 'Forecast cube', 'مكعب التنبؤ'),
        decisionTemplates: [{ en: 'Re-scored opportunity O-{n} to P{q}', ar: 'إعادة تقييم الفرصة O-{n} إلى P{q}' }],
        interventionTemplates: [{ en: 'Forecast drift > 5% · review with sales lead', ar: 'انجراف التنبؤ > 5% · مراجعة مع قائد المبيعات' }],
        activityTemplates: [{ en: 'Re-scored {n} opportunities', ar: 'إعادة تقييم {n} فرصة' }]
      },
      {
        slug: 'deal-nudge',
        name: { en: 'Deal-Nudge Intelligence', ar: 'ذكاء تنشيط الصفقات' },
        context: { en: 'Surfaces stalled deals before they decay.', ar: 'يُبرز الصفقات المتوقفة قبل أن تتلاشى.' },
        systems: ['CRM', 'Email', 'Slack'],
        kpiSeeds: [
          { label: { en: 'NUDGES SENT · 24H', ar: 'تنشيطات أُرسلت · 24س' }, format: 'int', range: [40, 110] },
          { label: { en: 'STALLED · OPEN', ar: 'متوقفة · مفتوحة' }, format: 'int', range: [6, 18], highlight: true },
          { label: { en: 'REACTIVATION RATE', ar: 'نسبة إعادة التفعيل' }, format: 'pct', range: [22, 38] },
          { label: { en: 'AGE THRESHOLD · DAYS', ar: 'عتبة العمر · أيام' }, format: 'int', range: [10, 21] }
        ],
        chartTitle: { en: 'STALLED vs REACTIVATED · 14D', ar: 'متوقفة مقابل مُعاد تفعيلها · 14 يومًا' },
        chartA: { en: 'Stalled', ar: 'متوقفة' },
        chartB: { en: 'Reactivated', ar: 'مُعاد تفعيلها' },
        workflow: baseWorkflow('CRM opps', 'فرص CRM', 'Activity log', 'سجل النشاط', 'Nudge engine', 'محرك التنشيط', 'Owner channels', 'قنوات المسؤول', 'Action prompts', 'مطالبات إجرائية'),
        decisionTemplates: [{ en: 'Nudged owner of O-{n} · last touch {q}d ago', ar: 'تنشيط مسؤول O-{n} · آخر تواصل قبل {q} يوم' }],
        interventionTemplates: [{ en: 'O-{n} stalled > 30d · escalate or close', ar: 'O-{n} متوقفة > 30 يوم · تصعيد أو إغلاق' }],
        activityTemplates: [{ en: 'Issued {n} nudges across {q} pipelines', ar: 'إصدار {n} تنشيط عبر {q} أنبوب' }]
      },
      {
        slug: 'expansion-recommender',
        name: { en: 'Account-Expansion Recommender', ar: 'محرك توصيات التوسع' },
        context: { en: 'Catches missed cross-sell and upsell signals across the installed base.', ar: 'يلتقط فرص البيع المتقاطع والتوسع الضائعة في القاعدة القائمة.' },
        systems: ['CRM', 'Product telemetry'],
        kpiSeeds: [
          { label: { en: 'SIGNALS DETECTED · 7D', ar: 'إشارات مُكتشفة · 7 أيام' }, format: 'int', range: [40, 120] },
          { label: { en: 'EXPANSION OPS RAISED', ar: 'فرص توسع مُنشأة' }, format: 'int', range: [10, 28], highlight: true },
          { label: { en: 'AVG OPP SIZE', ar: 'متوسط حجم الفرصة' }, format: 'sar', range: [40, 180] },
          { label: { en: 'ACCEPT RATE', ar: 'نسبة القبول' }, format: 'pct', range: [44, 68] }
        ],
        chartTitle: { en: 'SIGNALS vs ACCEPTED · 14D', ar: 'الإشارات مقابل المقبولة · 14 يومًا' },
        chartA: { en: 'Signals', ar: 'إشارات' },
        chartB: { en: 'Accepted', ar: 'مقبولة' },
        workflow: baseWorkflow('Usage data', 'بيانات الاستخدام', 'CRM activity', 'نشاط CRM', 'Recommender', 'محرك التوصيات', 'CRM opps', 'فرص CRM', 'AE backlog', 'قائمة المندوب'),
        decisionTemplates: [{ en: 'Recommended expansion on A-{m} · signal score {q}', ar: 'توصية بالتوسع على A-{m} · درجة الإشارة {q}' }],
        interventionTemplates: [{ en: 'High-value signal on A-{m} unactioned > 7d', ar: 'إشارة عالية على A-{m} دون إجراء > 7 أيام' }],
        activityTemplates: [{ en: 'Ingested {n} usage signals', ar: 'استيعاب {n} إشارة استخدام' }]
      }
    ]
  },
  {
    slug: 'finance',
    name: { en: 'Finance', ar: 'المالية' },
    contextLine: { en: 'Five modules live · linked to your ERP, banks and treasury.', ar: 'خمس وحدات نشطة · مرتبطة بنظام ERP والبنوك والخزينة.' },
    kpiSeeds: [
      { label: { en: 'Invoices matched today', ar: 'الفواتير المُطابَقة اليوم' }, format: 'int', range: [180, 320] },
      { label: { en: 'Cash position', ar: 'الوضع النقدي الحالي' }, format: 'sar', range: [12, 28], highlight: true },
      { label: { en: 'Receivables over 60d', ar: 'مستحقات تجاوزت 60 يومًا' }, format: 'sar', range: [1, 4] },
      { label: { en: 'Pending approvals', ar: 'موافقات بانتظارك' }, format: 'int', range: [4, 18] }
    ],
    solutions: [
      {
        slug: 'cashflow-intelligence',
        name: { en: 'Cash-flow forecasting', ar: 'التنبؤ بالتدفق النقدي' },
        context: { en: 'Continuous cash-flow visibility, drawn from your bank feeds and ERP.', ar: 'رؤية مستمرة للتدفق النقدي، تُستخرج تلقائيًا من بياناتك البنكية ونظام ERP.' },
        systems: ['ERP', 'Bank APIs'],
        kpiSeeds: [
          { label: { en: '14D CASH FORECAST', ar: 'توقع نقدي 14 يومًا' }, format: 'sar', range: [10, 24], highlight: true },
          { label: { en: 'FORECAST ACCURACY', ar: 'دقة التنبؤ' }, format: 'pct', range: [88, 97] },
          { label: { en: 'BANK FEEDS ACTIVE', ar: 'تغذيات بنكية نشطة' }, format: 'int', range: [4, 8] },
          { label: { en: 'VARIANCE ALERTS · 7D', ar: 'تنبيهات فروقات · 7 أيام' }, format: 'int', range: [1, 6] }
        ],
        chartTitle: { en: 'INFLOW vs OUTFLOW · 14D', ar: 'تدفق داخل مقابل خارج · 14 يومًا' },
        chartA: { en: 'Inflow', ar: 'داخل' },
        chartB: { en: 'Outflow', ar: 'خارج' },
        workflow: baseWorkflow('Bank feeds', 'تغذيات بنكية', 'ERP AR/AP', 'ذمم وموردي ERP', 'Forecast engine', 'محرك التنبؤ', 'Treasury view', 'عرض الخزينة', 'CFO dashboard', 'لوحة المدير المالي'),
        decisionTemplates: [{ en: 'Raised variance alert · projected gap SAR {q}M on D+{n}', ar: 'تنبيه فجوة · فجوة متوقعة {q} مليون ريال في D+{n}' }],
        interventionTemplates: [{ en: 'Projected dip on D+5 · approve credit-line draw', ar: 'انخفاض متوقع في D+5 · اعتماد سحب خط ائتمان' }],
        activityTemplates: [{ en: 'Refreshed {n} cash positions', ar: 'تحديث {n} وضع نقدي' }]
      },
      {
        slug: 'three-way-match',
        name: { en: 'Three-Way Match Agent', ar: 'وكيل المطابقة الثلاثية' },
        context: { en: 'Automates invoice / PO / receipt reconciliation.', ar: 'يؤتمت تسوية الفاتورة / أمر الشراء / الإيصال.' },
        systems: ['ERP', 'OCR', 'WMS'],
        kpiSeeds: [
          { label: { en: 'INVOICES MATCHED · 24H', ar: 'فواتير مُطابَقة · 24س' }, format: 'int', range: [180, 320] },
          { label: { en: 'AUTO-MATCH RATE', ar: 'نسبة المطابقة التلقائية' }, format: 'pct', range: [88, 97], highlight: true },
          { label: { en: 'EXCEPTIONS OPEN', ar: 'استثناءات مفتوحة' }, format: 'int', range: [4, 14] },
          { label: { en: 'AVG MATCH TIME', ar: 'متوسط زمن المطابقة' }, format: 'ms', range: [400, 1200] }
        ],
        chartTitle: { en: 'MATCH RATE vs EXCEPTIONS · 14D', ar: 'نسبة المطابقة مقابل الاستثناءات · 14 يومًا' },
        chartA: { en: 'Matched', ar: 'مُطابَق' },
        chartB: { en: 'Exceptions', ar: 'استثناءات' },
        workflow: baseWorkflow('Vendor invoices', 'فواتير الموردين', 'POs + receipts', 'أوامر وإيصالات', 'Match agent', 'وكيل المطابقة', 'ERP posting', 'ترحيل ERP', 'AP ledger', 'سجل الموردين'),
        decisionTemplates: [{ en: 'Auto-matched INV-{n} → PO-{m}', ar: 'مطابقة تلقائية INV-{n} ← PO-{m}' }],
        interventionTemplates: [{ en: 'INV-{n} qty mismatch · approve adjustment', ar: 'عدم تطابق كمية INV-{n} · اعتماد تسوية' }],
        activityTemplates: [{ en: 'Processed {n} invoices · {q} auto-cleared', ar: 'معالجة {n} فاتورة · {q} تمت تلقائيًا' }]
      },
      {
        slug: 'expense-approval',
        name: { en: 'Policy-Aware Expense Approval', ar: 'اعتماد المصروفات وفق السياسة' },
        context: { en: 'Removes expense approval bottlenecks with policy-aware routing.', ar: 'يزيل اختناقات اعتماد المصروفات بتوجيه يفهم السياسة.' },
        systems: ['Expense system', 'HRIS'],
        kpiSeeds: [
          { label: { en: 'CLAIMS PROCESSED · 24H', ar: 'مطالبات معالجة · 24س' }, format: 'int', range: [80, 180] },
          { label: { en: 'AUTO-APPROVED', ar: 'مُعتمد تلقائيًا' }, format: 'pct', range: [62, 84], highlight: true },
          { label: { en: 'POLICY HITS · 7D', ar: 'تنبيهات سياسة · 7 أيام' }, format: 'int', range: [6, 22] },
          { label: { en: 'AVG CYCLE TIME', ar: 'متوسط زمن الدورة' }, format: 'hrs', range: [2, 12] }
        ],
        chartTitle: { en: 'CLAIMS PROCESSED · 14D', ar: 'المطالبات المعالجة · 14 يومًا' },
        chartA: { en: 'Auto', ar: 'تلقائي' },
        chartB: { en: 'Manual', ar: 'يدوي' },
        workflow: baseWorkflow('Receipts', 'إيصالات', 'Policy rules', 'قواعد السياسة', 'Approval agent', 'وكيل الاعتماد', 'ERP posting', 'ترحيل ERP', 'Reimbursement', 'صرف' ),
        decisionTemplates: [{ en: 'Approved claim CL-{n} under policy P-{m}', ar: 'اعتماد المطالبة CL-{n} وفق السياسة P-{m}' }],
        interventionTemplates: [{ en: 'CL-{n} above per-diem threshold · approve', ar: 'CL-{n} فوق حد البدل · اعتماد' }],
        activityTemplates: [{ en: 'Cleared {n} claims · {q} flagged', ar: 'تمت معالجة {n} مطالبة · {q} تم تنبيهها' }]
      },
      {
        slug: 'collection-priority',
        name: { en: 'Collection-Priority Engine', ar: 'محرك أولوية التحصيل' },
        context: { en: 'Replaces ageing-by-bucket with risk-weighted collection prioritisation.', ar: 'يستبدل التصنيف العمري التقليدي بأولوية تحصيل مُرجَّحة بالمخاطر.' },
        systems: ['ERP', 'CRM'],
        kpiSeeds: [
          { label: { en: 'AR OVER 60D', ar: 'ذمم > 60 يوم' }, format: 'sar', range: [1, 4], highlight: true },
          { label: { en: 'PRIORITY ACCOUNTS', ar: 'حسابات ذات أولوية' }, format: 'int', range: [8, 24] },
          { label: { en: 'COLLECTION RATE · 30D', ar: 'نسبة التحصيل · 30 يوم' }, format: 'pct', range: [62, 86] },
          { label: { en: 'CONTACTS ISSUED · 7D', ar: 'اتصالات صادرة · 7 أيام' }, format: 'int', range: [40, 120] }
        ],
        chartTitle: { en: 'AR > 60D vs RECOVERED · 14D', ar: 'ذمم > 60 يوم مقابل المُحصَّل · 14 يومًا' },
        chartA: { en: 'AR > 60D', ar: 'ذمم > 60' },
        chartB: { en: 'Recovered', ar: 'مُحصَّل' },
        workflow: baseWorkflow('Ageing report', 'تقرير العمر', 'CRM risk', 'مخاطر CRM', 'Priority engine', 'محرك الأولوية', 'Collections queue', 'طابور التحصيل', 'AR dashboard', 'لوحة الذمم'),
        decisionTemplates: [{ en: 'Promoted account A-{m} to priority tier · {q} risk', ar: 'ترقية الحساب A-{m} إلى أولوية · مخاطر {q}' }],
        interventionTemplates: [{ en: 'A-{m} unresponsive > 21d · approve dunning step', ar: 'A-{m} لا يستجيب > 21 يوم · اعتماد خطوة المطالبة' }],
        activityTemplates: [{ en: 'Rescored {n} AR accounts', ar: 'إعادة تقييم {n} حساب' }]
      },
      {
        slug: 'treasury-view',
        name: { en: 'Consolidated Treasury View', ar: 'عرض الخزينة الموحَّد' },
        context: { en: 'Unifies fragmented treasury balances across banks and entities.', ar: 'يوحّد أرصدة الخزينة المتفرقة بين البنوك والكيانات.' },
        systems: ['Bank APIs', 'ERP'],
        kpiSeeds: [
          { label: { en: 'ACCOUNTS CONSOLIDATED', ar: 'حسابات موحَّدة' }, format: 'int', range: [8, 22] },
          { label: { en: 'TOTAL POSITION', ar: 'الوضع الكلي' }, format: 'sar', range: [22, 48], highlight: true },
          { label: { en: 'FX EXPOSURE', ar: 'الانكشاف على العملات' }, format: 'sar', range: [1, 6] },
          { label: { en: 'BANK FEEDS · ONLINE', ar: 'تغذيات بنكية · متصلة' }, format: 'int', range: [4, 10] }
        ],
        chartTitle: { en: 'POSITION BY ENTITY · 14D', ar: 'الوضع حسب الكيان · 14 يومًا' },
        chartA: { en: 'Entity A', ar: 'كيان A' },
        chartB: { en: 'Entity B', ar: 'كيان B' },
        workflow: baseWorkflow('Bank APIs', 'واجهات بنكية', 'ERP GL', 'دفتر GL', 'Consolidation agent', 'وكيل التوحيد', 'Treasury cube', 'مكعب الخزينة', 'CFO view', 'عرض المدير المالي'),
        decisionTemplates: [{ en: 'Consolidated {q} entities into single view', ar: 'توحيد {q} كيان في عرض واحد' }],
        interventionTemplates: [{ en: 'FX exposure > policy on Entity-{m}', ar: 'تجاوز العملات لحدود السياسة في الكيان-{m}' }],
        activityTemplates: [{ en: 'Synced {n} bank balances', ar: 'مزامنة {n} رصيد بنكي' }]
      }
    ]
  },
  {
    slug: 'accounting',
    name: { en: 'Accounting', ar: 'المحاسبة' },
    contextLine: { en: 'Five modules live · linked to ERP, the tax authority and your banks.', ar: 'خمس وحدات نشطة · مرتبطة بنظام ERP وهيئة الزكاة والبنوك.' },
    kpiSeeds: [
      { label: { en: 'Journal entries today', ar: 'قيود اليوم' }, format: 'int', range: [180, 320] },
      { label: { en: 'Close progress', ar: 'تقدّم الإقفال' }, format: 'pct', range: [60, 92], highlight: true },
      { label: { en: 'Reconciliation gaps', ar: 'فجوات في التسوية' }, format: 'int', range: [2, 12] },
      { label: { en: 'Audit events today', ar: 'أحداث التدقيق اليوم' }, format: 'int', range: [4000, 8000] }
    ],
    solutions: [
      {
        slug: 'close-orchestration',
        name: { en: 'Month-end close orchestration', ar: 'تنسيق الإقفال الشهري' },
        context: { en: 'Cuts month-end close from days to hours by orchestrating every task in sequence.', ar: 'يُقصّر إقفال الشهر من أيام إلى ساعات بترتيب المهام آليًا.' },
        systems: ['ERP', 'Excel imports'],
        kpiSeeds: [
          { label: { en: 'CLOSE PROGRESS', ar: 'تقدم الإقفال' }, format: 'pct', range: [60, 95], highlight: true },
          { label: { en: 'TASKS COMPLETED', ar: 'مهام مكتملة' }, format: 'int', range: [80, 140] },
          { label: { en: 'BLOCKERS OPEN', ar: 'معوقات مفتوحة' }, format: 'int', range: [1, 6] },
          { label: { en: 'EST. CLOSE DATE', ar: 'تاريخ الإقفال المتوقع' }, format: 'int', range: [3, 7] }
        ],
        chartTitle: { en: 'TASK COMPLETION · 14D', ar: 'إنجاز المهام · 14 يومًا' },
        chartA: { en: 'Completed', ar: 'مكتمل' },
        chartB: { en: 'Open', ar: 'مفتوح' },
        workflow: baseWorkflow('ERP modules', 'وحدات ERP', 'Sub-ledger', 'دفتر فرعي', 'Close orchestrator', 'منسق الإقفال', 'GL postings', 'ترحيلات GL', 'Close pack', 'حزمة الإقفال'),
        decisionTemplates: [{ en: 'Completed task T-{n} · {q} subtasks', ar: 'اكتمال المهمة T-{n} · {q} مهام فرعية' }],
        interventionTemplates: [{ en: 'Blocker on T-{n} · review and unblock', ar: 'معوق في T-{n} · مراجعة وإزالة' }],
        activityTemplates: [{ en: 'Advanced close from {n}% to {q}%', ar: 'تقدم الإقفال من {n}% إلى {q}%' }]
      },
      {
        slug: 'journal-capture',
        name: { en: 'Journal-Entry Capture Agent', ar: 'وكيل التقاط القيود اليومية' },
        context: { en: 'Eliminates manual journal entry by capturing transactions at the source.', ar: 'يلغي القيود اليدوية عبر التقاط المعاملات من المصدر.' },
        systems: ['ERP', 'Banking', 'Expense'],
        kpiSeeds: [
          { label: { en: 'JEs CAPTURED · 24H', ar: 'قيود مُلتقطة · 24س' }, format: 'int', range: [180, 320] },
          { label: { en: 'AUTO-POSTED', ar: 'مُرحَّلة تلقائيًا' }, format: 'pct', range: [86, 98], highlight: true },
          { label: { en: 'REVIEW QUEUE', ar: 'قائمة المراجعة' }, format: 'int', range: [2, 10] },
          { label: { en: 'AVG POSTING TIME', ar: 'متوسط زمن الترحيل' }, format: 'ms', range: [300, 900] }
        ],
        chartTitle: { en: 'JOURNAL ENTRIES · 14D', ar: 'القيود اليومية · 14 يومًا' },
        chartA: { en: 'Auto', ar: 'تلقائي' },
        chartB: { en: 'Manual', ar: 'يدوي' },
        workflow: baseWorkflow('Transactions', 'معاملات', 'Categorisation', 'تصنيف', 'JE agent', 'وكيل القيود', 'ERP posting', 'ترحيل ERP', 'GL ledger', 'دفتر الأستاذ'),
        decisionTemplates: [{ en: 'Posted JE-{n} · category C-{m}', ar: 'ترحيل JE-{n} · فئة C-{m}' }],
        interventionTemplates: [{ en: 'Ambiguous classification on JE-{n}', ar: 'تصنيف غامض في JE-{n}' }],
        activityTemplates: [{ en: 'Posted {n} journal entries', ar: 'ترحيل {n} قيد يومي' }]
      },
      {
        slug: 'tax-workflow',
        name: { en: 'Tax-Deadline + Filing Workflow', ar: 'تدفق المواعيد والإقرارات الضريبية' },
        context: { en: 'Tracks every tax deadline and prepares filings on time.', ar: 'يتتبع كل موعد ضريبي ويُعد الإقرارات في الوقت.' },
        systems: ['ERP', 'ZATCA'],
        kpiSeeds: [
          { label: { en: 'FILINGS PENDING · 30D', ar: 'إقرارات معلقة · 30 يوم' }, format: 'int', range: [2, 8] },
          { label: { en: 'FILING ACCURACY', ar: 'دقة الإقرارات' }, format: 'pct', range: [97, 100], highlight: true },
          { label: { en: 'DEADLINES TRACKED', ar: 'مواعيد متتبعة' }, format: 'int', range: [12, 28] },
          { label: { en: 'OVERDUE', ar: 'متأخر' }, format: 'int', range: [0, 1] }
        ],
        chartTitle: { en: 'FILINGS ON-TIME · 14D', ar: 'الإقرارات في الوقت · 14 يومًا' },
        chartA: { en: 'On-time', ar: 'في الوقت' },
        chartB: { en: 'Late', ar: 'متأخر' },
        workflow: baseWorkflow('ERP data', 'بيانات ERP', 'Tax rules', 'قواعد ضريبية', 'Filing agent', 'وكيل الإقرارات', 'Authority API', 'واجهة الجهة', 'Filing receipt', 'إيصال الإقرار'),
        decisionTemplates: [{ en: 'Prepared filing F-{n} for period P-{m}', ar: 'إعداد الإقرار F-{n} للفترة P-{m}' }],
        interventionTemplates: [{ en: 'F-{n} requires controller sign-off', ar: 'F-{n} يحتاج توقيع المراقب' }],
        activityTemplates: [{ en: 'Tracked {n} deadlines · {q} prepared', ar: 'تتبع {n} موعد · {q} مُعد' }]
      },
      {
        slug: 'audit-trail',
        name: { en: 'Continuous Audit Trail', ar: 'مسار التدقيق المستمر' },
        context: { en: 'Reconstructs an immutable audit trail across systems.', ar: 'يعيد بناء مسار تدقيق غير قابل للتعديل عبر الأنظمة.' },
        systems: ['ERP', 'Identity', 'Logs'],
        kpiSeeds: [
          { label: { en: 'EVENTS CAPTURED · 24H', ar: 'أحداث مُلتقطة · 24س' }, format: 'int', range: [4000, 8000] },
          { label: { en: 'COVERAGE', ar: 'التغطية' }, format: 'pct', range: [94, 99], highlight: true },
          { label: { en: 'TAMPER ALERTS · 7D', ar: 'تنبيهات تلاعب · 7 أيام' }, format: 'int', range: [0, 2] },
          { label: { en: 'RETENTION · DAYS', ar: 'الاحتفاظ · أيام' }, format: 'int', range: [365, 720] }
        ],
        chartTitle: { en: 'EVENT VOLUME · 14D', ar: 'حجم الأحداث · 14 يومًا' },
        chartA: { en: 'Events', ar: 'أحداث' },
        chartB: { en: 'Alerts', ar: 'تنبيهات' },
        workflow: baseWorkflow('System logs', 'سجلات الأنظمة', 'Identity', 'الهوية', 'Trail builder', 'منشئ المسار', 'Append-only store', 'مخزن غير قابل للتعديل', 'Audit view', 'عرض التدقيق'),
        decisionTemplates: [{ en: 'Linked event E-{n} to actor U-{m}', ar: 'ربط الحدث E-{n} بالفاعل U-{m}' }],
        interventionTemplates: [{ en: 'Tamper signature detected on log L-{n}', ar: 'كشف تلاعب على السجل L-{n}' }],
        activityTemplates: [{ en: 'Ingested {n} audit events', ar: 'استيعاب {n} حدث تدقيق' }]
      },
      {
        slug: 'bank-reconciliation',
        name: { en: 'Bank Reconciliation Agent', ar: 'وكيل تسوية الحسابات البنكية' },
        context: { en: 'Auto-reconciles bank statements against ledger.', ar: 'يسوّي كشوف البنوك مع الدفاتر تلقائيًا.' },
        systems: ['Bank APIs', 'ERP'],
        kpiSeeds: [
          { label: { en: 'STATEMENTS RECONCILED · 24H', ar: 'كشوف مُسوّاة · 24س' }, format: 'int', range: [8, 22] },
          { label: { en: 'AUTO-MATCH RATE', ar: 'نسبة المطابقة' }, format: 'pct', range: [92, 99], highlight: true },
          { label: { en: 'GAPS OPEN', ar: 'فجوات مفتوحة' }, format: 'int', range: [0, 6] },
          { label: { en: 'AVG TIME / STMT', ar: 'متوسط زمن الكشف' }, format: 'ms', range: [400, 1100] }
        ],
        chartTitle: { en: 'RECONCILIATION RATE · 14D', ar: 'نسبة التسوية · 14 يومًا' },
        chartA: { en: 'Matched', ar: 'مُطابَق' },
        chartB: { en: 'Gaps', ar: 'فجوات' },
        workflow: baseWorkflow('Bank API', 'واجهة بنكية', 'GL ledger', 'دفتر GL', 'Recon agent', 'وكيل التسوية', 'ERP posting', 'ترحيل ERP', 'Recon report', 'تقرير التسوية'),
        decisionTemplates: [{ en: 'Matched STMT-{n} to JE-{m}', ar: 'مطابقة STMT-{n} مع JE-{m}' }],
        interventionTemplates: [{ en: 'Unmatched debit on STMT-{n} > 1000 SAR', ar: 'خصم غير مُطابَق على STMT-{n} > 1000 ريال' }],
        activityTemplates: [{ en: 'Reconciled {n} statements', ar: 'تسوية {n} كشف' }]
      }
    ]
  },
  {
    slug: 'hr',
    name: { en: 'Human Resources', ar: 'الموارد البشرية' },
    contextLine: { en: 'Six modules live · linked to HRIS, ATS, payroll and learning platforms.', ar: 'ست وحدات نشطة · مرتبطة بأنظمة الموارد البشرية والتوظيف والرواتب والتدريب.' },
    kpiSeeds: [
      { label: { en: 'Applications screened · 7 days', ar: 'طلبات تمّت دراستها · 7 أيام' }, format: 'int', range: [600, 1200] },
      { label: { en: 'Active onboardings', ar: 'تعيينات جارية الآن' }, format: 'int', range: [8, 24] },
      { label: { en: 'Retention-risk flags', ar: 'موظفون نحتاج الانتباه لهم' }, format: 'int', range: [4, 14], highlight: true },
      { label: { en: 'Overdue training', ar: 'تدريبات متأخرة' }, format: 'int', range: [12, 36] }
    ],
    solutions: [
      {
        slug: 'candidate-screening',
        name: { en: 'Candidate screening & ranking', ar: 'فرز المرشحين وترتيبهم' },
        context: { en: 'Reads, scores and ranks applications so recruiters spend time only on the shortlist.', ar: 'يقرأ الطلبات ويرتّبها ليُركّز فريق التوظيف على المرشحين الأفضل فقط.' },
        systems: ['ATS', 'Email'],
        kpiSeeds: [
          { label: { en: 'CANDIDATES SCREENED · 7D', ar: 'مرشحون تم فرزهم · 7 أيام' }, format: 'int', range: [600, 1200] },
          { label: { en: 'SHORTLIST RATE', ar: 'نسبة القائمة المختصرة' }, format: 'pct', range: [10, 22], highlight: true },
          { label: { en: 'AVG SCREEN TIME', ar: 'متوسط زمن الفرز' }, format: 'ms', range: [800, 2200] },
          { label: { en: 'OPEN REQS', ar: 'وظائف مفتوحة' }, format: 'int', range: [12, 36] }
        ],
        chartTitle: { en: 'APPLICATIONS vs SHORTLISTED · 14D', ar: 'الطلبات مقابل القائمة المختصرة · 14 يومًا' },
        chartA: { en: 'Applications', ar: 'الطلبات' },
        chartB: { en: 'Shortlisted', ar: 'مختصر' },
        workflow: baseWorkflow('ATS feeds', 'تغذية ATS', 'JD criteria', 'معايير JD', 'Screening agent', 'وكيل الفرز', 'Recruiter queue', 'طابور المُجنِّد', 'Shortlist', 'القائمة المختصرة'),
        decisionTemplates: [{ en: 'Shortlisted candidate C-{n} for req R-{m} · score {q}', ar: 'إدراج المرشح C-{n} للوظيفة R-{m} · درجة {q}' }],
        interventionTemplates: [{ en: 'Borderline candidate C-{n} · recruiter review', ar: 'مرشح على الحدود C-{n} · مراجعة المُجنِّد' }],
        activityTemplates: [{ en: 'Screened {n} candidates across {q} reqs', ar: 'فرز {n} مرشح عبر {q} وظيفة' }]
      },
      {
        slug: 'onboarding-orchestration',
        name: { en: 'Onboarding Orchestration', ar: 'تنسيق التعيين' },
        context: { en: 'Compresses onboarding cycles by orchestrating IT, HR, manager tasks.', ar: 'يقلص دورات التعيين عبر تنسيق مهام IT والموارد البشرية والمدير.' },
        systems: ['HRIS', 'IT provisioning'],
        kpiSeeds: [
          { label: { en: 'ONBOARDINGS ACTIVE', ar: 'تعيينات جارية' }, format: 'int', range: [8, 24] },
          { label: { en: 'AVG TIME-TO-PRODUCTIVE', ar: 'متوسط زمن الإنتاجية' }, format: 'int', range: [3, 8] },
          { label: { en: 'ON-TIME COMPLETION', ar: 'إنجاز في الوقت' }, format: 'pct', range: [84, 96], highlight: true },
          { label: { en: 'BLOCKERS OPEN', ar: 'معوقات مفتوحة' }, format: 'int', range: [0, 4] }
        ],
        chartTitle: { en: 'TIME-TO-PRODUCTIVE · 14D', ar: 'زمن الإنتاجية · 14 يومًا' },
        chartA: { en: 'Avg days', ar: 'متوسط أيام' },
        chartB: { en: 'Target', ar: 'الهدف' },
        workflow: baseWorkflow('Offer accepted', 'قبول العرض', 'Role profile', 'ملف الدور', 'Orchestrator', 'المُنسق', 'IT + facilities', 'IT والمرافق', 'Productive Day 1', 'إنتاجي من اليوم 1'),
        decisionTemplates: [{ en: 'Provisioned access for hire H-{n} · {q} systems', ar: 'تهيئة الوصول للموظف H-{n} · {q} نظام' }],
        interventionTemplates: [{ en: 'Manager not assigned for H-{n}', ar: 'لم يُعيَّن مدير للموظف H-{n}' }],
        activityTemplates: [{ en: 'Onboarded {n} hires this week', ar: 'تعيين {n} موظف هذا الأسبوع' }]
      },
      {
        slug: 'attendance-anomalies',
        name: { en: 'Anomaly Detection Layer', ar: 'طبقة كشف الشذوذ في الحضور' },
        context: { en: 'Flags attendance and leave anomalies before they become payroll issues.', ar: 'يُبرز شذوذ الحضور والإجازات قبل أن يصبح مشكلة رواتب.' },
        systems: ['HRIS', 'Time clocks'],
        kpiSeeds: [
          { label: { en: 'ANOMALIES · 7D', ar: 'شذوذ · 7 أيام' }, format: 'int', range: [6, 22], highlight: true },
          { label: { en: 'EMPLOYEES MONITORED', ar: 'موظفون مُراقَبون' }, format: 'int', range: [400, 1400] },
          { label: { en: 'FALSE-POSITIVE RATE', ar: 'نسبة الإيجابيات الكاذبة' }, format: 'pct', range: [2, 8] },
          { label: { en: 'AVG DETECT TIME', ar: 'متوسط زمن الكشف' }, format: 'hrs', range: [1, 6] }
        ],
        chartTitle: { en: 'ANOMALIES BY TYPE · 14D', ar: 'الشذوذ حسب النوع · 14 يومًا' },
        chartA: { en: 'Detected', ar: 'مُكتشف' },
        chartB: { en: 'Confirmed', ar: 'مؤكد' },
        workflow: baseWorkflow('Time clocks', 'ساعات الدوام', 'HRIS leave', 'إجازات HRIS', 'Anomaly engine', 'محرك الشذوذ', 'HR queue', 'طابور HR', 'Notification', 'إشعار'),
        decisionTemplates: [{ en: 'Flagged late-pattern for employee E-{n}', ar: 'تنبيه نمط تأخر للموظف E-{n}' }],
        interventionTemplates: [{ en: 'E-{n} unauthorized absence · contact manager', ar: 'غياب غير مأذون E-{n} · تواصل مع المدير' }],
        activityTemplates: [{ en: 'Reviewed {n} attendance records', ar: 'مراجعة {n} سجل حضور' }]
      },
      {
        slug: 'performance-review',
        name: { en: 'Structured Review Intelligence', ar: 'ذكاء مراجعات الأداء المُهيكلة' },
        context: { en: 'Standardises performance reviews and surfaces inconsistency.', ar: 'يوحّد مراجعات الأداء ويُبرز التباين.' },
        systems: ['HRIS', 'Manager portal'],
        kpiSeeds: [
          { label: { en: 'REVIEWS CYCLE', ar: 'دورة المراجعات' }, format: 'pct', range: [40, 90], highlight: true },
          { label: { en: 'COMPLETED', ar: 'مكتمل' }, format: 'int', range: [120, 380] },
          { label: { en: 'INCONSISTENCY FLAGS', ar: 'تنبيهات تباين' }, format: 'int', range: [4, 14] },
          { label: { en: 'CALIBRATION SESSIONS', ar: 'جلسات معايرة' }, format: 'int', range: [3, 8] }
        ],
        chartTitle: { en: 'COMPLETED vs PENDING · 14D', ar: 'مكتمل مقابل معلق · 14 يومًا' },
        chartA: { en: 'Completed', ar: 'مكتمل' },
        chartB: { en: 'Pending', ar: 'معلق' },
        workflow: baseWorkflow('Goals', 'الأهداف', 'Feedback', 'التغذية الراجعة', 'Review engine', 'محرك المراجعة', 'HRIS update', 'تحديث HRIS', 'Calibration', 'المعايرة'),
        decisionTemplates: [{ en: 'Flagged rating outlier on review RV-{n}', ar: 'تنبيه تقييم شاذ في المراجعة RV-{n}' }],
        interventionTemplates: [{ en: 'Calibration needed for team T-{m}', ar: 'مطلوب معايرة للفريق T-{m}' }],
        activityTemplates: [{ en: 'Processed {n} reviews', ar: 'معالجة {n} مراجعة' }]
      },
      {
        slug: 'attrition-risk',
        name: { en: 'Retention Early-Warning', ar: 'الإنذار المبكر للاحتفاظ بالموظفين' },
        context: { en: 'Predicts attrition risk per employee before resignation signals fire.', ar: 'يتنبأ بمخاطر مغادرة كل موظف قبل ظهور إشارات الاستقالة.' },
        systems: ['HRIS', 'Engagement', 'Calendar'],
        kpiSeeds: [
          { label: { en: 'AT-RISK EMPLOYEES', ar: 'موظفون عرضة للمخاطر' }, format: 'int', range: [4, 14], highlight: true },
          { label: { en: 'PRECISION · 90D', ar: 'الدقة · 90 يوم' }, format: 'pct', range: [62, 84] },
          { label: { en: 'INTERVENTIONS RUN', ar: 'تدخلات تمت' }, format: 'int', range: [8, 22] },
          { label: { en: 'RETAINED · 90D', ar: 'تم الاحتفاظ بهم · 90 يوم' }, format: 'pct', range: [60, 86] }
        ],
        chartTitle: { en: 'RISK SCORE DISTRIBUTION · 14D', ar: 'توزيع درجة المخاطر · 14 يومًا' },
        chartA: { en: 'High', ar: 'عالية' },
        chartB: { en: 'Med', ar: 'متوسطة' },
        workflow: baseWorkflow('HRIS signals', 'إشارات HRIS', 'Engagement', 'الانخراط', 'Risk model', 'نموذج المخاطر', 'HRBP queue', 'طابور HRBP', 'Intervention', 'التدخل'),
        decisionTemplates: [{ en: 'Raised retention flag on E-{n}', ar: 'رفع علامة احتفاظ على E-{n}' }],
        interventionTemplates: [{ en: 'E-{n} high-risk · schedule HRBP conversation', ar: 'E-{n} مخاطر عالية · جدولة محادثة HRBP' }],
        activityTemplates: [{ en: 'Rescored {n} employees', ar: 'إعادة تقييم {n} موظف' }]
      },
      {
        slug: 'training-tracker',
        name: { en: 'Training-Completion Tracker', ar: 'متتبع إكمال التدريب' },
        context: { en: 'Tracks compliance training completion and chases overdue learners.', ar: 'يتتبع إكمال التدريب الإلزامي ويتابع المتأخرين.' },
        systems: ['LMS', 'HRIS'],
        kpiSeeds: [
          { label: { en: 'COMPLETION · 30D', ar: 'الإنجاز · 30 يوم' }, format: 'pct', range: [70, 95], highlight: true },
          { label: { en: 'OVERDUE LEARNERS', ar: 'متدربون متأخرون' }, format: 'int', range: [12, 36] },
          { label: { en: 'COURSES TRACKED', ar: 'دورات متتبعة' }, format: 'int', range: [8, 24] },
          { label: { en: 'NUDGES ISSUED · 7D', ar: 'تنشيطات صادرة · 7 أيام' }, format: 'int', range: [20, 80] }
        ],
        chartTitle: { en: 'COMPLETION RATE · 14D', ar: 'نسبة الإنجاز · 14 يومًا' },
        chartA: { en: 'Complete', ar: 'مكتمل' },
        chartB: { en: 'Overdue', ar: 'متأخر' },
        workflow: baseWorkflow('LMS data', 'بيانات LMS', 'HRIS roster', 'كشف HRIS', 'Tracker', 'المتتبع', 'Nudge engine', 'محرك التنشيط', 'Manager view', 'عرض المدير'),
        decisionTemplates: [{ en: 'Nudged learner L-{n} on course C-{m}', ar: 'تنشيط المتدرب L-{n} على الدورة C-{m}' }],
        interventionTemplates: [{ en: 'L-{n} overdue > 30d on mandatory course', ar: 'L-{n} متأخر > 30 يوم على دورة إلزامية' }],
        activityTemplates: [{ en: 'Issued {n} training nudges', ar: 'إصدار {n} تنشيط تدريبي' }]
      }
    ]
  },
  {
    slug: 'marketing',
    name: { en: 'Marketing', ar: 'التسويق' },
    contextLine: { en: 'Six modules live · linked to your CDP, ad platforms and CMS.', ar: 'ست وحدات نشطة · مرتبطة بمنصات الإعلانات والمحتوى ومنصة بيانات العملاء.' },
    kpiSeeds: [
      { label: { en: 'Attributed pipeline · 30 days', ar: 'أنبوب منسوب للتسويق · 30 يوم' }, format: 'sar', range: [4, 12], highlight: true },
      { label: { en: 'Ad spend · 7 days', ar: 'الإنفاق الإعلاني · 7 أيام' }, format: 'sar', range: [180, 420] },
      { label: { en: 'Content shipped · 7 days', ar: 'محتوى نُشر · 7 أيام' }, format: 'int', range: [12, 32] },
      { label: { en: 'Competitor signals', ar: 'إشارات عن المنافسين' }, format: 'int', range: [4, 18] }
    ],
    solutions: [
      {
        slug: 'attribution',
        name: { en: 'Marketing attribution', ar: 'نسب التسويق إلى مصادره' },
        context: { en: 'Ties every closed deal back to the marketing touches that actually moved it.', ar: 'يربط كل صفقة مغلقة بالنشاط التسويقي الذي ساعد فعلًا في إنجازها.' },
        systems: ['CDP', 'Ad platforms', 'CRM'],
        kpiSeeds: [
          { label: { en: 'ATTRIBUTED PIPELINE · 30D', ar: 'أنبوب منسوب · 30 يوم' }, format: 'sar', range: [4, 12], highlight: true },
          { label: { en: 'TOUCHES PROCESSED · 24H', ar: 'لمسات مُعالَجة · 24س' }, format: 'int', range: [40000, 90000] },
          { label: { en: 'CHANNELS UNIFIED', ar: 'قنوات موحَّدة' }, format: 'int', range: [8, 18] },
          { label: { en: 'MODEL CONFIDENCE', ar: 'ثقة النموذج' }, format: 'pct', range: [82, 94] }
        ],
        chartTitle: { en: 'ATTRIBUTED PIPELINE BY CHANNEL · 14D', ar: 'الأنبوب المنسوب حسب القناة · 14 يومًا' },
        chartA: { en: 'Paid', ar: 'مدفوع' },
        chartB: { en: 'Organic', ar: 'عضوي' },
        workflow: baseWorkflow('Ad platforms', 'منصات إعلانية', 'CRM closes', 'إغلاقات CRM', 'Attribution model', 'نموذج الإسناد', 'BI view', 'عرض BI', 'Spend re-allocation', 'إعادة توزيع الإنفاق'),
        decisionTemplates: [{ en: 'Re-credited touch T-{n} from {q} to alt channel', ar: 'إعادة نسب اللمسة T-{n} من {q} إلى قناة بديلة' }],
        interventionTemplates: [{ en: 'Attribution drift > 5% on channel C-{m}', ar: 'انجراف الإسناد > 5% على القناة C-{m}' }],
        activityTemplates: [{ en: 'Recomputed attribution for {n} closes', ar: 'إعادة حساب الإسناد لـ {n} إغلاق' }]
      },
      {
        slug: 'content-production',
        name: { en: 'Content-Production Workflow', ar: 'تدفق إنتاج المحتوى' },
        context: { en: 'Lifts content velocity without sacrificing quality.', ar: 'يرفع سرعة إنتاج المحتوى دون التضحية بالجودة.' },
        systems: ['CMS', 'Briefs', 'DAM'],
        kpiSeeds: [
          { label: { en: 'PIECES SHIPPED · 7D', ar: 'قطع منشورة · 7 أيام' }, format: 'int', range: [12, 32], highlight: true },
          { label: { en: 'IN-PRODUCTION', ar: 'قيد الإنتاج' }, format: 'int', range: [8, 22] },
          { label: { en: 'AVG CYCLE · DAYS', ar: 'متوسط الدورة · أيام' }, format: 'int', range: [3, 9] },
          { label: { en: 'REJECTION RATE', ar: 'نسبة الرفض' }, format: 'pct', range: [4, 14] }
        ],
        chartTitle: { en: 'CONTENT SHIPPED · 14D', ar: 'محتوى منشور · 14 يومًا' },
        chartA: { en: 'Shipped', ar: 'منشور' },
        chartB: { en: 'In flight', ar: 'قيد العمل' },
        workflow: baseWorkflow('Brief queue', 'طابور الموجز', 'Drafting', 'الصياغة', 'Content agent', 'وكيل المحتوى', 'Review', 'المراجعة', 'CMS publish', 'نشر CMS'),
        decisionTemplates: [{ en: 'Routed brief B-{n} to writer W-{m}', ar: 'توجيه الموجز B-{n} إلى الكاتب W-{m}' }],
        interventionTemplates: [{ en: 'Brief B-{n} stalled > 5d · escalate', ar: 'الموجز B-{n} متوقف > 5 أيام · تصعيد' }],
        activityTemplates: [{ en: 'Published {n} pieces', ar: 'نشر {n} قطعة' }]
      },
      {
        slug: 'lead-scoring',
        name: { en: 'Behaviour-Driven Lead Scoring', ar: 'تقييم العملاء حسب السلوك' },
        context: { en: 'Replaces flat scoring with behaviour-weighted intent signals.', ar: 'يستبدل التقييم الثابت بإشارات نية مرجَّحة بالسلوك.' },
        systems: ['CDP', 'CRM'],
        kpiSeeds: [
          { label: { en: 'LEADS SCORED · 24H', ar: 'عملاء تم تقييمهم · 24س' }, format: 'int', range: [400, 1100] },
          { label: { en: 'MQL RATE', ar: 'نسبة MQL' }, format: 'pct', range: [12, 28], highlight: true },
          { label: { en: 'AVG SCORE', ar: 'متوسط الدرجة' }, format: 'int', range: [40, 76] },
          { label: { en: 'MODEL DRIFT · 7D', ar: 'انجراف النموذج · 7 أيام' }, format: 'pct', range: [1, 6] }
        ],
        chartTitle: { en: 'MQL CREATION · 14D', ar: 'إنشاء MQL · 14 يومًا' },
        chartA: { en: 'MQL', ar: 'MQL' },
        chartB: { en: 'Disqualified', ar: 'مستبعد' },
        workflow: baseWorkflow('Web events', 'أحداث الويب', 'CRM signals', 'إشارات CRM', 'Scoring model', 'نموذج التقييم', 'Sales hand-off', 'تسليم للمبيعات', 'MQL queue', 'طابور MQL'),
        decisionTemplates: [{ en: 'Scored lead LD-{n} to MQL · score {q}', ar: 'تقييم العميل LD-{n} كـ MQL · درجة {q}' }],
        interventionTemplates: [{ en: 'Score collapse detected on segment S-{m}', ar: 'انهيار درجات في الشريحة S-{m}' }],
        activityTemplates: [{ en: 'Scored {n} leads', ar: 'تم تقييم {n} عميل' }]
      },
      {
        slug: 'spend-optimizer',
        name: { en: 'Spend-Allocation Optimizer', ar: 'مُحسِّن توزيع الإنفاق' },
        context: { en: 'Reduces wasted ad spend by reallocating against attribution.', ar: 'يقلل هدر الإنفاق الإعلاني بإعادة توزيعه وفق الإسناد.' },
        systems: ['Ad platforms'],
        kpiSeeds: [
          { label: { en: 'SPEND · 7D', ar: 'إنفاق · 7 أيام' }, format: 'sar', range: [180, 420] },
          { label: { en: 'WASTE FLAGGED', ar: 'هدر مُكتشف' }, format: 'pct', range: [4, 14], highlight: true },
          { label: { en: 'REALLOCATIONS · 7D', ar: 'إعادة توزيع · 7 أيام' }, format: 'int', range: [4, 18] },
          { label: { en: 'CAC TREND', ar: 'اتجاه CAC' }, format: 'pct', range: [-12, 8] }
        ],
        chartTitle: { en: 'SPEND vs ATTRIBUTED REVENUE · 14D', ar: 'الإنفاق مقابل الإيراد المنسوب · 14 يومًا' },
        chartA: { en: 'Spend', ar: 'إنفاق' },
        chartB: { en: 'Revenue', ar: 'إيراد' },
        workflow: baseWorkflow('Ad spend', 'إنفاق إعلاني', 'Attribution', 'الإسناد', 'Optimizer', 'المُحسِّن', 'Ad platforms', 'منصات إعلانية', 'Reallocated spend', 'إنفاق مُعاد توزيعه'),
        decisionTemplates: [{ en: 'Reallocated SAR {q}K from C-{n} to C-{m}', ar: 'إعادة توزيع {q} ألف ريال من C-{n} إلى C-{m}' }],
        interventionTemplates: [{ en: 'Campaign C-{n} CAC > target · approve pause', ar: 'حملة C-{n} تجاوزت هدف CAC · اعتماد الإيقاف' }],
        activityTemplates: [{ en: 'Optimized {n} campaigns', ar: 'تحسين {n} حملة' }]
      },
      {
        slug: 'cohort-intelligence',
        name: { en: 'Cohort Intelligence', ar: 'ذكاء الشرائح' },
        context: { en: 'Detects segmentation drift and emerging cohorts in real time.', ar: 'يكشف انجراف الشرائح ويظهر الشرائح الناشئة لحظيًا.' },
        systems: ['CDP', 'Product telemetry'],
        kpiSeeds: [
          { label: { en: 'COHORTS TRACKED', ar: 'شرائح متتبعة' }, format: 'int', range: [12, 28] },
          { label: { en: 'DRIFT EVENTS · 7D', ar: 'أحداث انجراف · 7 أيام' }, format: 'int', range: [2, 10], highlight: true },
          { label: { en: 'EMERGING COHORTS', ar: 'شرائح ناشئة' }, format: 'int', range: [1, 6] },
          { label: { en: 'MODEL FRESHNESS', ar: 'حداثة النموذج' }, format: 'hrs', range: [2, 24] }
        ],
        chartTitle: { en: 'COHORT VELOCITY · 14D', ar: 'سرعة الشرائح · 14 يومًا' },
        chartA: { en: 'Active', ar: 'نشط' },
        chartB: { en: 'Emerging', ar: 'ناشئ' },
        workflow: baseWorkflow('Product events', 'أحداث المنتج', 'Profile data', 'بيانات الملف', 'Cohort engine', 'محرك الشرائح', 'Marketing console', 'وحدة التسويق', 'Audience export', 'تصدير الجمهور'),
        decisionTemplates: [{ en: 'Promoted cohort CH-{n} to active', ar: 'ترقية الشريحة CH-{n} إلى نشطة' }],
        interventionTemplates: [{ en: 'Drift in cohort CH-{n} · review thresholds', ar: 'انجراف في الشريحة CH-{n} · مراجعة العتبات' }],
        activityTemplates: [{ en: 'Updated {n} cohorts', ar: 'تحديث {n} شريحة' }]
      },
      {
        slug: 'competitor-signal',
        name: { en: 'Competitor-Signal Feed', ar: 'تغذية إشارات المنافسين' },
        context: { en: 'Continuously surfaces competitor moves and market signals.', ar: 'يُبرز تحركات المنافسين وإشارات السوق باستمرار.' },
        systems: ['Web crawl', 'Press feeds'],
        kpiSeeds: [
          { label: { en: 'COMPETITORS WATCHED', ar: 'منافسون مُراقَبون' }, format: 'int', range: [8, 24] },
          { label: { en: 'SIGNALS · 7D', ar: 'إشارات · 7 أيام' }, format: 'int', range: [40, 120], highlight: true },
          { label: { en: 'HIGH-SIGNAL · 7D', ar: 'عالية الإشارة · 7 أيام' }, format: 'int', range: [4, 18] },
          { label: { en: 'AVG DETECT TIME', ar: 'متوسط زمن الكشف' }, format: 'hrs', range: [1, 8] }
        ],
        chartTitle: { en: 'SIGNAL VOLUME · 14D', ar: 'حجم الإشارات · 14 يومًا' },
        chartA: { en: 'Signals', ar: 'إشارات' },
        chartB: { en: 'High-priority', ar: 'عالية الأولوية' },
        workflow: baseWorkflow('Web sources', 'مصادر ويب', 'Press feeds', 'تغذية الصحافة', 'Signal engine', 'محرك الإشارات', 'Slack digest', 'موجز Slack', 'PMM brief', 'موجز PMM'),
        decisionTemplates: [{ en: 'Flagged competitor C-{n} pricing move', ar: 'تنبيه تحرك تسعير منافس C-{n}' }],
        interventionTemplates: [{ en: 'High-priority signal on C-{n} · brief leadership', ar: 'إشارة عالية على C-{n} · إفادة القيادة' }],
        activityTemplates: [{ en: 'Captured {n} competitor signals', ar: 'التقاط {n} إشارة منافسين' }]
      }
    ]
  },
  {
    slug: 'management',
    name: { en: 'Leadership', ar: 'القيادة التنفيذية' },
    contextLine: { en: 'Five executive modules · one calm view across every department.', ar: 'خمس وحدات تنفيذية · رؤية موحَّدة وهادئة لكل أقسام منشأتك.' },
    kpiSeeds: [
      { label: { en: 'Departments online', ar: 'أقسام تعمل الآن' }, format: 'int', range: [11, 11] },
      { label: { en: 'OKRs on track', ar: 'أهداف ضمن المسار' }, format: 'pct', range: [62, 92], highlight: true },
      { label: { en: 'Critical alerts · 7 days', ar: 'تنبيهات مهمة · 7 أيام' }, format: 'int', range: [2, 12] },
      { label: { en: 'Briefings generated', ar: 'إيجازات تنفيذية' }, format: 'int', range: [4, 12] }
    ],
    solutions: [
      {
        slug: 'exec-overview',
        name: { en: 'Executive overview', ar: 'النظرة التنفيذية الموحَّدة' },
        context: { en: 'One unified view of every department, refreshed continuously for leadership.', ar: 'صفحة واحدة تجمع حالة كل الأقسام، تتجدّد باستمرار للقيادة.' },
        systems: ['All Jarvis modules'],
        kpiSeeds: [
          { label: { en: 'DEPTS UNIFIED', ar: 'أقسام موحَّدة' }, format: 'int', range: [11, 11] },
          { label: { en: 'METRICS TRACKED', ar: 'مؤشرات متتبعة' }, format: 'int', range: [120, 260], highlight: true },
          { label: { en: 'REFRESH · MIN', ar: 'تحديث · دقيقة' }, format: 'int', range: [1, 5] },
          { label: { en: 'EXEC SESSIONS · 7D', ar: 'جلسات تنفيذية · 7 أيام' }, format: 'int', range: [20, 80] }
        ],
        chartTitle: { en: 'CROSS-DEPT THROUGHPUT · 14D', ar: 'الإنتاجية بين الأقسام · 14 يومًا' },
        chartA: { en: 'Decisions', ar: 'قرارات' },
        chartB: { en: 'Exceptions', ar: 'استثناءات' },
        workflow: baseWorkflow('Dept feeds', 'تغذية الأقسام', 'Finance + ops', 'مالية وعمليات', 'Exec aggregator', 'مُجمِّع تنفيذي', 'Briefing engine', 'محرك الإفادات', 'CEO console', 'وحدة الرئيس التنفيذي'),
        decisionTemplates: [{ en: 'Rolled up {q} dept metrics into exec view', ar: 'تجميع {q} مؤشر قسم في العرض التنفيذي' }],
        interventionTemplates: [{ en: 'Cross-dept anomaly on metric M-{n}', ar: 'شذوذ بين الأقسام على المؤشر M-{n}' }],
        activityTemplates: [{ en: 'Refreshed {n} executive metrics', ar: 'تحديث {n} مؤشر تنفيذي' }]
      },
      {
        slug: 'alert-routing',
        name: { en: 'Signal-Rated Alert Routing', ar: 'توجيه التنبيهات وفق قيمة الإشارة' },
        context: { en: 'Removes alert fatigue by routing only signal-rated events to managers.', ar: 'يزيل إرهاق التنبيهات بتوجيه الأحداث الإشارية فقط للمديرين.' },
        systems: ['All modules'],
        kpiSeeds: [
          { label: { en: 'EVENTS PROCESSED · 24H', ar: 'أحداث معالجة · 24س' }, format: 'int', range: [4000, 9000] },
          { label: { en: 'ROUTED · 24H', ar: 'مُوجَّهة · 24س' }, format: 'int', range: [40, 140], highlight: true },
          { label: { en: 'NOISE SUPPRESSED', ar: 'ضوضاء مكبوتة' }, format: 'pct', range: [88, 98] },
          { label: { en: 'AVG RATING TIME', ar: 'متوسط زمن التقييم' }, format: 'ms', range: [60, 180] }
        ],
        chartTitle: { en: 'ROUTED vs SUPPRESSED · 14D', ar: 'مُوجَّه مقابل مكبوت · 14 يومًا' },
        chartA: { en: 'Routed', ar: 'مُوجَّه' },
        chartB: { en: 'Suppressed', ar: 'مكبوت' },
        workflow: baseWorkflow('All events', 'كل الأحداث', 'Signal rules', 'قواعد الإشارة', 'Rating engine', 'محرك التقييم', 'Manager inboxes', 'صناديق المديرين', 'Mobile push', 'إشعار محمول'),
        decisionTemplates: [{ en: 'Routed event E-{n} to manager M-{m}', ar: 'توجيه الحدث E-{n} إلى المدير M-{m}' }],
        interventionTemplates: [{ en: 'Critical event E-{n} unactioned > 30 min', ar: 'حدث حرج E-{n} دون إجراء > 30 دقيقة' }],
        activityTemplates: [{ en: 'Rated {n} events · {q} routed', ar: 'تقييم {n} حدث · توجيه {q}' }]
      },
      {
        slug: 'executive-briefings',
        name: { en: 'Auto-Compiled Executive Briefings', ar: 'إفادات تنفيذية مُولَّدة تلقائيًا' },
        context: { en: 'Compresses board-reporting prep from days to minutes.', ar: 'يقلص إعداد تقارير المجلس من أيام إلى دقائق.' },
        systems: ['All depts', 'BI'],
        kpiSeeds: [
          { label: { en: 'BRIEFINGS · 7D', ar: 'إفادات · 7 أيام' }, format: 'int', range: [4, 12], highlight: true },
          { label: { en: 'AVG GENERATION', ar: 'متوسط التوليد' }, format: 'ms', range: [800, 2400] },
          { label: { en: 'SECTIONS', ar: 'أقسام' }, format: 'int', range: [8, 18] },
          { label: { en: 'CITATIONS PER BRIEF', ar: 'استشهادات لكل إفادة' }, format: 'int', range: [12, 36] }
        ],
        chartTitle: { en: 'BRIEFINGS GENERATED · 14D', ar: 'إفادات مُولَّدة · 14 يومًا' },
        chartA: { en: 'Briefings', ar: 'إفادات' },
        chartB: { en: 'Edits', ar: 'تعديلات' },
        workflow: baseWorkflow('Module data', 'بيانات الوحدات', 'BI warehouse', 'مستودع BI', 'Briefing engine', 'محرك الإفادات', 'Citations', 'الاستشهادات', 'PDF brief', 'إفادة PDF'),
        decisionTemplates: [{ en: 'Generated briefing BR-{n} · {q} sections', ar: 'توليد الإفادة BR-{n} · {q} قسم' }],
        interventionTemplates: [{ en: 'Briefing BR-{n} needs executive review', ar: 'الإفادة BR-{n} تحتاج مراجعة تنفيذية' }],
        activityTemplates: [{ en: 'Compiled {n} briefings', ar: 'تجميع {n} إفادة' }]
      },
      {
        slug: 'okr-tracking',
        name: { en: 'OKR Tracking Layer', ar: 'طبقة تتبع OKR' },
        context: { en: 'Surfaces OKR drift against quarterly commitments.', ar: 'يُبرز انحراف OKR عن التزامات الربع.' },
        systems: ['HRIS', 'OKR tool'],
        kpiSeeds: [
          { label: { en: 'OBJECTIVES ON-TRACK', ar: 'أهداف في المسار' }, format: 'pct', range: [62, 92], highlight: true },
          { label: { en: 'KEY RESULTS TRACKED', ar: 'نتائج رئيسية' }, format: 'int', range: [40, 140] },
          { label: { en: 'AT-RISK ORs', ar: 'أهداف بخطر' }, format: 'int', range: [2, 10] },
          { label: { en: 'REVIEWS PER WEEK', ar: 'مراجعات أسبوعية' }, format: 'int', range: [4, 12] }
        ],
        chartTitle: { en: 'OKR ON-TRACK · 14D', ar: 'OKR في المسار · 14 يومًا' },
        chartA: { en: 'On-track', ar: 'في المسار' },
        chartB: { en: 'At-risk', ar: 'بخطر' },
        workflow: baseWorkflow('OKR tool', 'أداة OKR', 'Dept metrics', 'مؤشرات الأقسام', 'Tracking layer', 'طبقة التتبع', 'Exec view', 'عرض تنفيذي', 'KR scorecard', 'بطاقة KR'),
        decisionTemplates: [{ en: 'Re-scored OR-{n} to {q}% achievement', ar: 'إعادة تقييم OR-{n} إلى {q}%' }],
        interventionTemplates: [{ en: 'OR-{n} at-risk · review with owner', ar: 'OR-{n} بخطر · مراجعة مع المالك' }],
        activityTemplates: [{ en: 'Refreshed {n} OKRs', ar: 'تحديث {n} OKR' }]
      },
      {
        slug: 'escalation-routing',
        name: { en: 'Escalation Routing Workflow', ar: 'تدفق توجيه التصعيد' },
        context: { en: 'Cuts escalation latency to the right manager every time.', ar: 'يقلل زمن وصول التصعيد إلى المدير الصحيح في كل مرة.' },
        systems: ['All modules', 'HRIS'],
        kpiSeeds: [
          { label: { en: 'ESCALATIONS · 24H', ar: 'تصعيدات · 24س' }, format: 'int', range: [20, 80] },
          { label: { en: 'AVG ROUTING TIME', ar: 'متوسط زمن التوجيه' }, format: 'ms', range: [80, 220], highlight: true },
          { label: { en: 'UNRESOLVED > 4H', ar: 'دون حل > 4 ساعات' }, format: 'int', range: [0, 4] },
          { label: { en: 'MANAGERS REACHED', ar: 'مديرون تم الوصول إليهم' }, format: 'int', range: [12, 36] }
        ],
        chartTitle: { en: 'ESCALATION VELOCITY · 14D', ar: 'سرعة التصعيد · 14 يومًا' },
        chartA: { en: 'Routed', ar: 'مُوجَّه' },
        chartB: { en: 'Resolved', ar: 'تم الحل' },
        workflow: baseWorkflow('Exceptions', 'استثناءات', 'Org structure', 'الهيكل التنظيمي', 'Routing engine', 'محرك التوجيه', 'Manager push', 'إشعار المدير', 'Resolution', 'الحل'),
        decisionTemplates: [{ en: 'Routed ESC-{n} to manager M-{m}', ar: 'توجيه ESC-{n} إلى المدير M-{m}' }],
        interventionTemplates: [{ en: 'ESC-{n} unresolved > 4h · escalate to next tier', ar: 'ESC-{n} دون حل > 4 ساعات · تصعيد للمستوى التالي' }],
        activityTemplates: [{ en: 'Routed {n} escalations', ar: 'توجيه {n} تصعيد' }]
      }
    ]
  },
  {
    slug: 'customer-service',
    name: { en: 'Customer Service', ar: 'خدمة العملاء' },
    contextLine: { en: 'Five modules live · linked to your helpdesk, CRM and knowledge base.', ar: 'خمس وحدات نشطة · مرتبطة بنظام التذاكر وبيانات العملاء وقاعدة المعرفة.' },
    kpiSeeds: [
      { label: { en: 'Tickets handled today', ar: 'تذاكر تمّت اليوم' }, format: 'int', range: [200, 460] },
      { label: { en: 'Avg first response', ar: 'متوسط زمن أول رد' }, format: 'ms', range: [800, 3000], highlight: true },
      { label: { en: 'Churn-risk flags', ar: 'عملاء قد نخسرهم' }, format: 'int', range: [2, 12] },
      { label: { en: 'SLA breaches · 7 days', ar: 'إخلالات بمستوى الخدمة · 7 أيام' }, format: 'int', range: [0, 6] }
    ],
    solutions: [
      {
        slug: 'triage-routing',
        name: { en: 'Ticket triage & routing', ar: 'فرز التذاكر وتوجيهها' },
        context: { en: 'Reads each ticket, understands intent, and routes it to the right team automatically.', ar: 'يقرأ كل تذكرة ويفهم المطلوب، ثم يوجّهها إلى الفريق المناسب تلقائيًا.' },
        systems: ['Helpdesk', 'CRM'],
        kpiSeeds: [
          { label: { en: 'TICKETS TRIAGED · 24H', ar: 'تذاكر تم فرزها · 24س' }, format: 'int', range: [200, 460] },
          { label: { en: 'CORRECT ROUTE RATE', ar: 'نسبة التوجيه الصحيح' }, format: 'pct', range: [92, 99], highlight: true },
          { label: { en: 'AVG TRIAGE TIME', ar: 'متوسط زمن الفرز' }, format: 'ms', range: [200, 800] },
          { label: { en: 'RE-ROUTED', ar: 'مُعاد توجيهها' }, format: 'int', range: [2, 14] }
        ],
        chartTitle: { en: 'TRIAGED vs RE-ROUTED · 14D', ar: 'مُفرَّز مقابل مُعاد توجيهه · 14 يومًا' },
        chartA: { en: 'Triaged', ar: 'مُفرَّز' },
        chartB: { en: 'Re-routed', ar: 'مُعاد توجيهه' },
        workflow: baseWorkflow('Inbox', 'صندوق وارد', 'Channels', 'قنوات', 'Triage agent', 'وكيل الفرز', 'Helpdesk queue', 'طابور الدعم', 'Owner assigned', 'تم تعيين مالك'),
        decisionTemplates: [{ en: 'Routed ticket TK-{n} to queue Q-{m}', ar: 'توجيه التذكرة TK-{n} إلى الطابور Q-{m}' }],
        interventionTemplates: [{ en: 'TK-{n} re-routed twice · review intent rules', ar: 'TK-{n} أُعيد توجيهها مرتين · مراجعة قواعد النية' }],
        activityTemplates: [{ en: 'Triaged {n} tickets', ar: 'فرز {n} تذكرة' }]
      },
      {
        slug: 'first-response',
        name: { en: 'First-Response Auto-Draft', ar: 'مسودة أول استجابة آلية' },
        context: { en: 'Compresses first-response time without sacrificing voice.', ar: 'يقلص زمن أول استجابة دون التضحية بنبرة الصوت.' },
        systems: ['Helpdesk', 'KB'],
        kpiSeeds: [
          { label: { en: 'DRAFTS GENERATED · 24H', ar: 'مسودات مُولَّدة · 24س' }, format: 'int', range: [200, 420] },
          { label: { en: 'AVG FIRST RESPONSE', ar: 'متوسط أول استجابة' }, format: 'ms', range: [800, 3000], highlight: true },
          { label: { en: 'AGENT EDITS · AVG', ar: 'تعديلات الوكيل · متوسط' }, format: 'int', range: [3, 12] },
          { label: { en: 'CSAT · 7D', ar: 'رضا · 7 أيام' }, format: 'pct', range: [80, 96] }
        ],
        chartTitle: { en: 'FIRST-RESPONSE TIME · 14D', ar: 'زمن أول استجابة · 14 يومًا' },
        chartA: { en: 'Avg ms', ar: 'متوسط مللي' },
        chartB: { en: 'Target', ar: 'الهدف' },
        workflow: baseWorkflow('Ticket', 'تذكرة', 'KB articles', 'مقالات المعرفة', 'Draft engine', 'محرك المسودات', 'Agent review', 'مراجعة الوكيل', 'Send', 'إرسال'),
        decisionTemplates: [{ en: 'Drafted response for TK-{n} · {q} KB hits', ar: 'صياغة رد لـ TK-{n} · {q} مصدر معرفة' }],
        interventionTemplates: [{ en: 'TK-{n} drafted but pending agent send', ar: 'TK-{n} مسودة بانتظار إرسال الوكيل' }],
        activityTemplates: [{ en: 'Drafted {n} responses', ar: 'صياغة {n} رد' }]
      },
      {
        slug: 'knowledge-agent',
        name: { en: 'Internal Knowledge Agent', ar: 'وكيل المعرفة الداخلي' },
        context: { en: 'Unifies fragmented internal knowledge for agents and ops.', ar: 'يوحّد المعرفة الداخلية المتفرقة للوكلاء والعمليات.' },
        systems: ['Confluence', 'Drive', 'Helpdesk'],
        kpiSeeds: [
          { label: { en: 'QUERIES · 24H', ar: 'استعلامات · 24س' }, format: 'int', range: [400, 900] },
          { label: { en: 'ANSWER ACCURACY', ar: 'دقة الإجابات' }, format: 'pct', range: [86, 98], highlight: true },
          { label: { en: 'SOURCES INDEXED', ar: 'مصادر مفهرسة' }, format: 'int', range: [800, 2400] },
          { label: { en: 'AVG LATENCY', ar: 'متوسط زمن الاستجابة' }, format: 'ms', range: [400, 1200] }
        ],
        chartTitle: { en: 'QUERIES vs ACCURACY · 14D', ar: 'الاستعلامات مقابل الدقة · 14 يومًا' },
        chartA: { en: 'Queries', ar: 'استعلامات' },
        chartB: { en: 'Correct', ar: 'صحيح' },
        workflow: baseWorkflow('Knowledge sources', 'مصادر المعرفة', 'Index', 'الفهرس', 'Retrieval agent', 'وكيل الاسترجاع', 'Citations', 'الاستشهادات', 'Agent reply', 'رد الوكيل'),
        decisionTemplates: [{ en: 'Answered query QR-{n} with {q} citations', ar: 'الإجابة على الاستعلام QR-{n} بـ {q} استشهاد' }],
        interventionTemplates: [{ en: 'Low-confidence answer on QR-{n} · review', ar: 'إجابة منخفضة الثقة QR-{n} · مراجعة' }],
        activityTemplates: [{ en: 'Indexed {n} new sources', ar: 'فهرسة {n} مصدر جديد' }]
      },
      {
        slug: 'sentiment-churn',
        name: { en: 'Sentiment + Churn-Risk Layer', ar: 'طبقة المشاعر ومخاطر الانفصال' },
        context: { en: 'Detects churn risk from conversation signals before renewal.', ar: 'يكشف مخاطر الانفصال من إشارات المحادثات قبل التجديد.' },
        systems: ['Helpdesk', 'CRM'],
        kpiSeeds: [
          { label: { en: 'CONVERSATIONS SCANNED · 24H', ar: 'محادثات تم فحصها · 24س' }, format: 'int', range: [300, 700] },
          { label: { en: 'HIGH-RISK FLAGS', ar: 'تنبيهات عالية المخاطر' }, format: 'int', range: [2, 12], highlight: true },
          { label: { en: 'AVG SENTIMENT', ar: 'متوسط المشاعر' }, format: 'pct', range: [42, 76] },
          { label: { en: 'INTERVENTIONS · 7D', ar: 'تدخلات · 7 أيام' }, format: 'int', range: [4, 18] }
        ],
        chartTitle: { en: 'NEGATIVE SENTIMENT · 14D', ar: 'مشاعر سلبية · 14 يومًا' },
        chartA: { en: 'Negative', ar: 'سلبي' },
        chartB: { en: 'Neutral', ar: 'محايد' },
        workflow: baseWorkflow('Conversations', 'محادثات', 'CRM context', 'سياق CRM', 'Sentiment model', 'نموذج المشاعر', 'Account team', 'فريق الحساب', 'Save play', 'خطة الإنقاذ'),
        decisionTemplates: [{ en: 'Flagged account A-{m} · sentiment {q}', ar: 'تنبيه الحساب A-{m} · مشاعر {q}' }],
        interventionTemplates: [{ en: 'A-{m} renewal in {q}d · run save play', ar: 'تجديد A-{m} خلال {q} يوم · تنفيذ خطة الإنقاذ' }],
        activityTemplates: [{ en: 'Scanned {n} conversations', ar: 'فحص {n} محادثة' }]
      },
      {
        slug: 'sla-prediction',
        name: { en: 'SLA Prediction Workflow', ar: 'تدفق التنبؤ بخروقات SLA' },
        context: { en: 'Predicts SLA breaches before they happen.', ar: 'يتنبأ بخروقات SLA قبل وقوعها.' },
        systems: ['Helpdesk'],
        kpiSeeds: [
          { label: { en: 'AT-RISK TICKETS', ar: 'تذاكر عرضة' }, format: 'int', range: [4, 22], highlight: true },
          { label: { en: 'PREDICTION ACCURACY', ar: 'دقة التنبؤ' }, format: 'pct', range: [82, 95] },
          { label: { en: 'BREACHES PREVENTED · 7D', ar: 'خروقات تم منعها · 7 أيام' }, format: 'int', range: [4, 18] },
          { label: { en: 'SLAs MONITORED', ar: 'SLA مُراقبة' }, format: 'int', range: [4, 14] }
        ],
        chartTitle: { en: 'PREDICTED vs PREVENTED · 14D', ar: 'متوقع مقابل تم منعه · 14 يومًا' },
        chartA: { en: 'At-risk', ar: 'عرضة' },
        chartB: { en: 'Prevented', ar: 'تم منعه' },
        workflow: baseWorkflow('Ticket states', 'حالات التذاكر', 'SLA rules', 'قواعد SLA', 'Prediction model', 'نموذج التنبؤ', 'Owner nudge', 'تنشيط المسؤول', 'Saved SLA', 'SLA محفوظ'),
        decisionTemplates: [{ en: 'Predicted breach on TK-{n} in {q}h · nudged owner', ar: 'توقع خرق TK-{n} خلال {q}س · تم تنشيط المالك' }],
        interventionTemplates: [{ en: 'TK-{n} predicted breach > 95% · escalate now', ar: 'توقع خرق TK-{n} > 95% · تصعيد فوري' }],
        activityTemplates: [{ en: 'Prevented {n} breaches today', ar: 'تم منع {n} خرق اليوم' }]
      }
    ]
  },
  {
    slug: 'procurement',
    name: { en: 'Procurement', ar: 'المشتريات' },
    contextLine: { en: 'Five modules live · linked to ERP, contracts and vendor portals.', ar: 'خمس وحدات نشطة · مرتبطة بنظام ERP وإدارة العقود وبوابات الموردين.' },
    kpiSeeds: [
      { label: { en: 'POs issued · 7 days', ar: 'أوامر شراء صادرة · 7 أيام' }, format: 'int', range: [80, 180] },
      { label: { en: 'Contract renewals · 30 days', ar: 'تجديدات عقود · 30 يوم' }, format: 'int', range: [4, 18] },
      { label: { en: 'Off-policy spend · 30 days', ar: 'إنفاق خارج السياسة · 30 يوم' }, format: 'sar', range: [1, 6], highlight: true },
      { label: { en: 'Vendor risk flags', ar: 'موردون نحتاج متابعتهم' }, format: 'int', range: [2, 12] }
    ],
    solutions: [
      {
        slug: 'vendor-performance',
        name: { en: 'Vendor performance scoring', ar: 'تقييم أداء الموردين' },
        context: { en: 'Continuously scores every vendor on delivery, quality and price, so renewals are data-driven.', ar: 'يقيّم كل مورد باستمرار على التسليم والجودة والسعر، فتُبنى قرارات التجديد على بيانات حقيقية.' },
        systems: ['ERP', 'Vendor portals'],
        kpiSeeds: [
          { label: { en: 'VENDORS SCORED', ar: 'موردون مُقيَّمون' }, format: 'int', range: [80, 220] },
          { label: { en: 'TOP-TIER VENDORS', ar: 'موردو الصف الأول' }, format: 'int', range: [12, 36], highlight: true },
          { label: { en: 'DEGRADED · 30D', ar: 'تراجع · 30 يوم' }, format: 'int', range: [2, 12] },
          { label: { en: 'DATA POINTS · 24H', ar: 'نقاط بيانات · 24س' }, format: 'int', range: [4000, 9000] }
        ],
        chartTitle: { en: 'TOP-TIER vs DEGRADED · 14D', ar: 'الصف الأول مقابل المتراجع · 14 يومًا' },
        chartA: { en: 'Top-tier', ar: 'صف أول' },
        chartB: { en: 'Degraded', ar: 'متراجع' },
        workflow: baseWorkflow('Delivery data', 'بيانات التسليم', 'Quality data', 'بيانات الجودة', 'Scoring engine', 'محرك التقييم', 'Procurement view', 'عرض المشتريات', 'Vendor tier', 'فئة المورد'),
        decisionTemplates: [{ en: 'Rescored vendor V-{n} to tier {q}', ar: 'إعادة تقييم المورد V-{n} إلى الفئة {q}' }],
        interventionTemplates: [{ en: 'V-{n} degraded > 2 tiers · review contract', ar: 'V-{n} تراجع > فئتين · مراجعة العقد' }],
        activityTemplates: [{ en: 'Scored {n} vendors', ar: 'تقييم {n} مورد' }]
      },
      {
        slug: 'contract-lifecycle',
        name: { en: 'Contract-Lifecycle Workflow', ar: 'تدفق دورة حياة العقود' },
        context: { en: 'Closes missed contract renewals and milestone dates.', ar: 'يغلق فجوة تجديد العقود والمواعيد المهمة.' },
        systems: ['CLM', 'ERP'],
        kpiSeeds: [
          { label: { en: 'CONTRACTS TRACKED', ar: 'عقود متتبعة' }, format: 'int', range: [60, 180] },
          { label: { en: 'RENEWALS · 30D', ar: 'تجديدات · 30 يوم' }, format: 'int', range: [4, 18], highlight: true },
          { label: { en: 'AT-RISK · 30D', ar: 'بخطر · 30 يوم' }, format: 'int', range: [2, 8] },
          { label: { en: 'AUTO-NUDGES · 7D', ar: 'تنشيطات تلقائية · 7 أيام' }, format: 'int', range: [12, 36] }
        ],
        chartTitle: { en: 'RENEWAL FUNNEL · 14D', ar: 'قمع التجديد · 14 يومًا' },
        chartA: { en: 'Approaching', ar: 'مقبل' },
        chartB: { en: 'Closed', ar: 'تم الإغلاق' },
        workflow: baseWorkflow('CLM data', 'بيانات CLM', 'ERP terms', 'شروط ERP', 'Lifecycle engine', 'محرك الدورة', 'Owner reminders', 'تذكير المالك', 'Renewal queue', 'طابور التجديد'),
        decisionTemplates: [{ en: 'Nudged owner of contract C-{n} · expires in {q}d', ar: 'تنشيط مالك العقد C-{n} · ينتهي خلال {q} يوم' }],
        interventionTemplates: [{ en: 'C-{n} expires in 15d · approve renewal start', ar: 'C-{n} ينتهي خلال 15 يوم · اعتماد بدء التجديد' }],
        activityTemplates: [{ en: 'Tracked {n} contracts · {q} approaching renewal', ar: 'تتبع {n} عقد · {q} مقبل على التجديد' }]
      },
      {
        slug: 'spend-compliance',
        name: { en: 'Spend-Compliance Agent', ar: 'وكيل الالتزام في الإنفاق' },
        context: { en: 'Eliminates maverick spend and PO leakage.', ar: 'يلغي الإنفاق غير المتوافق وتسرب أوامر الشراء.' },
        systems: ['ERP', 'Procurement', 'P-Card'],
        kpiSeeds: [
          { label: { en: 'PO COVERAGE', ar: 'تغطية أوامر الشراء' }, format: 'pct', range: [82, 98], highlight: true },
          { label: { en: 'MAVERICK SPEND · 30D', ar: 'إنفاق غير متوافق · 30 يوم' }, format: 'sar', range: [1, 6] },
          { label: { en: 'FLAGS · 7D', ar: 'تنبيهات · 7 أيام' }, format: 'int', range: [6, 22] },
          { label: { en: 'POLICY COVERAGE', ar: 'تغطية السياسة' }, format: 'pct', range: [86, 99] }
        ],
        chartTitle: { en: 'COVERED vs MAVERICK · 14D', ar: 'مُغطى مقابل غير متوافق · 14 يومًا' },
        chartA: { en: 'Covered', ar: 'مُغطى' },
        chartB: { en: 'Maverick', ar: 'غير متوافق' },
        workflow: baseWorkflow('Spend feeds', 'تغذية الإنفاق', 'Policy rules', 'قواعد السياسة', 'Compliance agent', 'وكيل الالتزام', 'Procurement queue', 'طابور المشتريات', 'PO retro-fit', 'استرداد أمر الشراء'),
        decisionTemplates: [{ en: 'Retro-fit PO-{n} against transaction T-{m}', ar: 'استرداد أمر الشراء PO-{n} مقابل المعاملة T-{m}' }],
        interventionTemplates: [{ en: 'Maverick spend on cost-center CC-{n} > policy', ar: 'إنفاق غير متوافق في مركز التكلفة CC-{n} > السياسة' }],
        activityTemplates: [{ en: 'Reviewed {n} transactions', ar: 'مراجعة {n} معاملة' }]
      },
      {
        slug: 'rfq-automation',
        name: { en: 'RFQ Automation Workflow', ar: 'تدفق أتمتة طلبات عروض الأسعار' },
        context: { en: 'Compresses RFQ cycle from weeks to days.', ar: 'يقلص دورة RFQ من أسابيع إلى أيام.' },
        systems: ['Procurement', 'Vendor portals'],
        kpiSeeds: [
          { label: { en: 'RFQs IN-FLIGHT', ar: 'RFQ نشطة' }, format: 'int', range: [4, 18] },
          { label: { en: 'AVG CYCLE · DAYS', ar: 'متوسط الدورة · أيام' }, format: 'int', range: [3, 9], highlight: true },
          { label: { en: 'RESPONSES · 7D', ar: 'استجابات · 7 أيام' }, format: 'int', range: [20, 80] },
          { label: { en: 'AWARDED · 7D', ar: 'منحت · 7 أيام' }, format: 'int', range: [2, 12] }
        ],
        chartTitle: { en: 'RFQ CYCLE TIME · 14D', ar: 'زمن دورة RFQ · 14 يومًا' },
        chartA: { en: 'Avg days', ar: 'متوسط أيام' },
        chartB: { en: 'Target', ar: 'الهدف' },
        workflow: baseWorkflow('Requisition', 'طلب', 'Vendor list', 'قائمة موردين', 'RFQ engine', 'محرك RFQ', 'Vendor portal', 'بوابة المورد', 'Award', 'الترسية'),
        decisionTemplates: [{ en: 'Issued RFQ-{n} to {q} vendors', ar: 'إصدار RFQ-{n} إلى {q} مورد' }],
        interventionTemplates: [{ en: 'RFQ-{n} with no responses > 5d', ar: 'RFQ-{n} بلا استجابات > 5 أيام' }],
        activityTemplates: [{ en: 'Issued {n} RFQs', ar: 'إصدار {n} RFQ' }]
      },
      {
        slug: 'supplier-risk',
        name: { en: 'Continuous Supplier-Risk Monitor', ar: 'المراقبة المستمرة لمخاطر الموردين' },
        context: { en: 'Surfaces supplier risk before it disrupts operations.', ar: 'يُبرز مخاطر الموردين قبل أن تعطل العمليات.' },
        systems: ['News', 'Trade data', 'ERP'],
        kpiSeeds: [
          { label: { en: 'SUPPLIERS MONITORED', ar: 'موردون مُراقَبون' }, format: 'int', range: [80, 220] },
          { label: { en: 'RISK EVENTS · 7D', ar: 'أحداث مخاطر · 7 أيام' }, format: 'int', range: [4, 18], highlight: true },
          { label: { en: 'CRITICAL RISK · OPEN', ar: 'مخاطر حرجة · مفتوحة' }, format: 'int', range: [0, 3] },
          { label: { en: 'DATA SOURCES', ar: 'مصادر بيانات' }, format: 'int', range: [8, 22] }
        ],
        chartTitle: { en: 'RISK EVENTS · 14D', ar: 'أحداث المخاطر · 14 يومًا' },
        chartA: { en: 'Events', ar: 'أحداث' },
        chartB: { en: 'Critical', ar: 'حرج' },
        workflow: baseWorkflow('News feeds', 'تغذية إخبارية', 'Trade data', 'بيانات تجارية', 'Risk engine', 'محرك المخاطر', 'Procurement', 'المشتريات', 'Alternate source', 'مصدر بديل'),
        decisionTemplates: [{ en: 'Raised yellow flag on Supplier S-{n} · {q} signals', ar: 'رفع تنبيه أصفر للمورد S-{n} · {q} إشارة' }],
        interventionTemplates: [{ en: 'Critical risk on S-{n} · approve alt source', ar: 'مخاطر حرجة على S-{n} · اعتماد مصدر بديل' }],
        activityTemplates: [{ en: 'Scanned {n} supplier signals', ar: 'فحص {n} إشارة مورد' }]
      }
    ]
  },
  {
    slug: 'it-ops',
    name: { en: 'IT & Operations', ar: 'تقنية المعلومات' },
    contextLine: { en: 'Four modules live · linked to monitoring, ITSM and asset management.', ar: 'أربع وحدات نشطة · مرتبطة بالمراقبة ونظام ITSM وإدارة الأصول.' },
    kpiSeeds: [
      { label: { en: 'Open incidents', ar: 'حوادث مفتوحة' }, format: 'int', range: [4, 18] },
      { label: { en: 'Mean time to resolve', ar: 'متوسط زمن الحل' }, format: 'hrs', range: [1, 6], highlight: true },
      { label: { en: 'Changes · 30 days', ar: 'تغييرات · 30 يوم' }, format: 'int', range: [40, 120] },
      { label: { en: 'Assets tracked', ar: 'أصول مُتتبَّعة' }, format: 'int', range: [800, 2400] }
    ],
    solutions: [
      {
        slug: 'incident-routing',
        name: { en: 'Incident routing', ar: 'توجيه الحوادث' },
        context: { en: 'Cuts triage noise by sending every incident to the right team on the first try.', ar: 'يقلّل ضوضاء الفرز بإرسال كل حادث إلى الفريق المعني من أول مرة.' },
        systems: ['ITSM', 'Monitoring'],
        kpiSeeds: [
          { label: { en: 'INCIDENTS ROUTED · 24H', ar: 'حوادث مُوجَّهة · 24س' }, format: 'int', range: [40, 140] },
          { label: { en: 'CORRECT-ROUTE RATE', ar: 'نسبة التوجيه الصحيح' }, format: 'pct', range: [88, 98], highlight: true },
          { label: { en: 'AVG ROUTE TIME', ar: 'متوسط زمن التوجيه' }, format: 'ms', range: [200, 800] },
          { label: { en: 'P1 / P2 · OPEN', ar: 'P1 / P2 مفتوحة' }, format: 'int', range: [0, 6] }
        ],
        chartTitle: { en: 'ROUTED vs RE-ROUTED · 14D', ar: 'مُوجَّه مقابل مُعاد توجيهه · 14 يومًا' },
        chartA: { en: 'Routed', ar: 'مُوجَّه' },
        chartB: { en: 'Re-routed', ar: 'مُعاد توجيهه' },
        workflow: baseWorkflow('Monitoring', 'المراقبة', 'ITSM', 'ITSM', 'Routing agent', 'وكيل التوجيه', 'Team queue', 'طابور الفريق', 'Assigned', 'مُسنَد'),
        decisionTemplates: [{ en: 'Routed INC-{n} to team T-{m}', ar: 'توجيه الحادث INC-{n} إلى الفريق T-{m}' }],
        interventionTemplates: [{ en: 'INC-{n} P1 unactioned > 15m · escalate', ar: 'INC-{n} P1 بدون إجراء > 15 دقيقة · تصعيد' }],
        activityTemplates: [{ en: 'Routed {n} incidents', ar: 'توجيه {n} حادث' }]
      },
      {
        slug: 'alert-correlation',
        name: { en: 'Alert Correlation Layer', ar: 'طبقة ربط التنبيهات' },
        context: { en: 'Collapses monitoring noise into correlated incidents.', ar: 'يجمع ضوضاء المراقبة في حوادث مترابطة.' },
        systems: ['Monitoring'],
        kpiSeeds: [
          { label: { en: 'RAW ALERTS · 24H', ar: 'تنبيهات خام · 24س' }, format: 'int', range: [4000, 9000] },
          { label: { en: 'CORRELATED INC · 24H', ar: 'حوادث مرتبطة · 24س' }, format: 'int', range: [30, 120], highlight: true },
          { label: { en: 'NOISE SUPPRESSED', ar: 'ضوضاء مكبوتة' }, format: 'pct', range: [90, 99] },
          { label: { en: 'AVG WINDOW · MIN', ar: 'متوسط النافذة · دقيقة' }, format: 'int', range: [3, 10] }
        ],
        chartTitle: { en: 'NOISE vs CORRELATED · 14D', ar: 'ضوضاء مقابل مرتبطة · 14 يومًا' },
        chartA: { en: 'Raw', ar: 'خام' },
        chartB: { en: 'Correlated', ar: 'مرتبطة' },
        workflow: baseWorkflow('Metrics', 'مقاييس', 'Logs', 'سجلات', 'Correlation engine', 'محرك الربط', 'ITSM ticket', 'تذكرة ITSM', 'Oncall', 'الاستدعاء'),
        decisionTemplates: [{ en: 'Correlated {q} alerts into INC-{n}', ar: 'ربط {q} تنبيه في INC-{n}' }],
        interventionTemplates: [{ en: 'Cluster on service S-{n} not matched', ar: 'تجمع على الخدمة S-{n} لم يُربط' }],
        activityTemplates: [{ en: 'Suppressed {n} noise events', ar: 'كبت {n} حدث ضوضاء' }]
      },
      {
        slug: 'change-orchestration',
        name: { en: 'Change-Orchestration Workflow', ar: 'تدفق تنسيق التغييرات' },
        context: { en: 'Standardises change management without slowing throughput.', ar: 'يوحّد إدارة التغييرات دون إبطاء الإنتاجية.' },
        systems: ['ITSM', 'CI/CD'],
        kpiSeeds: [
          { label: { en: 'CHANGES · 30D', ar: 'تغييرات · 30 يوم' }, format: 'int', range: [40, 120] },
          { label: { en: 'CHANGE FAILURE RATE', ar: 'نسبة فشل التغييرات' }, format: 'pct', range: [2, 10], highlight: true },
          { label: { en: 'AVG LEAD TIME', ar: 'متوسط زمن الإنجاز' }, format: 'hrs', range: [4, 24] },
          { label: { en: 'EMERGENCY CHGs · 7D', ar: 'تغييرات طارئة · 7 أيام' }, format: 'int', range: [0, 4] }
        ],
        chartTitle: { en: 'CHANGE THROUGHPUT · 14D', ar: 'إنتاجية التغييرات · 14 يومًا' },
        chartA: { en: 'Successful', ar: 'ناجحة' },
        chartB: { en: 'Failed', ar: 'فاشلة' },
        workflow: baseWorkflow('Change request', 'طلب تغيير', 'CI/CD', 'CI/CD', 'Orchestrator', 'المُنسق', 'CAB approval', 'اعتماد CAB', 'Deploy', 'نشر'),
        decisionTemplates: [{ en: 'Auto-approved CHG-{n} · low-risk template', ar: 'اعتماد تلقائي CHG-{n} · نموذج منخفض المخاطر' }],
        interventionTemplates: [{ en: 'CHG-{n} high-risk · CAB review required', ar: 'CHG-{n} عالي المخاطر · مطلوب مراجعة CAB' }],
        activityTemplates: [{ en: 'Processed {n} changes', ar: 'معالجة {n} تغيير' }]
      },
      {
        slug: 'asset-intelligence',
        name: { en: 'Asset-Intelligence Tracker', ar: 'متتبع ذكاء الأصول' },
        context: { en: 'Closes asset lifecycle gaps across IT and operational assets.', ar: 'يغلق فجوات دورة حياة الأصول التقنية والتشغيلية.' },
        systems: ['CMDB', 'IT inventory'],
        kpiSeeds: [
          { label: { en: 'ASSETS TRACKED', ar: 'أصول متتبعة' }, format: 'int', range: [800, 2400] },
          { label: { en: 'EXPIRING · 90D', ar: 'منتهية · 90 يوم' }, format: 'int', range: [12, 36], highlight: true },
          { label: { en: 'UNTAGGED · OPEN', ar: 'غير مُوسومة · مفتوحة' }, format: 'int', range: [2, 18] },
          { label: { en: 'SOURCES', ar: 'مصادر' }, format: 'int', range: [4, 10] }
        ],
        chartTitle: { en: 'EXPIRING ASSETS · 14D', ar: 'أصول منتهية · 14 يومًا' },
        chartA: { en: 'Expiring', ar: 'منتهية' },
        chartB: { en: 'Renewed', ar: 'مجددة' },
        workflow: baseWorkflow('CMDB', 'CMDB', 'IT inventory', 'مخزون IT', 'Lifecycle agent', 'وكيل دورة الحياة', 'Owner alerts', 'تنبيهات المالك', 'Renewal', 'تجديد'),
        decisionTemplates: [{ en: 'Flagged asset A-{n} for renewal in {q}d', ar: 'تنبيه الأصل A-{n} للتجديد خلال {q} يوم' }],
        interventionTemplates: [{ en: 'A-{n} expired · approve replacement', ar: 'A-{n} منتهي · اعتماد الاستبدال' }],
        activityTemplates: [{ en: 'Refreshed {n} asset records', ar: 'تحديث {n} سجل أصل' }]
      }
    ]
  },
  {
    slug: 'legal-compliance',
    name: { en: 'Legal & Compliance', ar: 'الشؤون القانونية والامتثال' },
    contextLine: { en: 'Four modules live · linked to contract management, your document library and regulatory feeds.', ar: 'أربع وحدات نشطة · مرتبطة بإدارة العقود ومكتبة الوثائق وتنبيهات الجهات التنظيمية.' },
    kpiSeeds: [
      { label: { en: 'Contracts in review', ar: 'عقود قيد المراجعة' }, format: 'int', range: [4, 22] },
      { label: { en: 'Deadlines · 30 days', ar: 'مواعيد قانونية · 30 يوم' }, format: 'int', range: [8, 24], highlight: true },
      { label: { en: 'Policy drift · 7 days', ar: 'تباين في السياسات · 7 أيام' }, format: 'int', range: [0, 4] },
      { label: { en: 'Regulatory updates · 7 days', ar: 'تحديثات تنظيمية · 7 أيام' }, format: 'int', range: [4, 18] }
    ],
    solutions: [
      {
        slug: 'contract-review',
        name: { en: 'Contract review', ar: 'مراجعة العقود' },
        context: { en: 'Reads contracts, flags risky clauses, and saves your legal team hours on every deal.', ar: 'يقرأ العقود ويُبرز البنود التي تحتاج انتباهًا، فيوفّر على فريقك القانوني ساعات في كل صفقة.' },
        systems: ['CLM', 'Policy library'],
        kpiSeeds: [
          { label: { en: 'CONTRACTS REVIEWED · 7D', ar: 'عقود تمت مراجعتها · 7 أيام' }, format: 'int', range: [12, 36] },
          { label: { en: 'AUTO-CLEARED', ar: 'مُعتمدة تلقائيًا' }, format: 'pct', range: [42, 72], highlight: true },
          { label: { en: 'AVG REVIEW TIME', ar: 'متوسط زمن المراجعة' }, format: 'hrs', range: [1, 6] },
          { label: { en: 'RISK FLAGS RAISED', ar: 'تنبيهات مخاطر' }, format: 'int', range: [6, 22] }
        ],
        chartTitle: { en: 'REVIEWED vs FLAGGED · 14D', ar: 'تمت المراجعة مقابل تم تنبيهها · 14 يومًا' },
        chartA: { en: 'Reviewed', ar: 'مراجعة' },
        chartB: { en: 'Flagged', ar: 'مُنبَّهة' },
        workflow: baseWorkflow('Contract upload', 'رفع العقد', 'Policy clauses', 'بنود السياسة', 'Review agent', 'وكيل المراجعة', 'Legal queue', 'طابور القانوني', 'Redlined', 'مُؤشَّر' ),
        decisionTemplates: [{ en: 'Reviewed contract CT-{n} · {q} risk flags', ar: 'مراجعة العقد CT-{n} · {q} تنبيه مخاطر' }],
        interventionTemplates: [{ en: 'CT-{n} non-standard indemnity · counsel review', ar: 'CT-{n} تعويض غير قياسي · مراجعة المستشار' }],
        activityTemplates: [{ en: 'Processed {n} contracts', ar: 'معالجة {n} عقد' }]
      },
      {
        slug: 'compliance-calendar',
        name: { en: 'Compliance-Calendar Workflow', ar: 'تدفق تقويم الامتثال' },
        context: { en: 'Eliminates missed compliance deadlines.', ar: 'يلغي تفويت مواعيد الامتثال.' },
        systems: ['Compliance tool', 'Calendar'],
        kpiSeeds: [
          { label: { en: 'DEADLINES TRACKED', ar: 'مواعيد متتبعة' }, format: 'int', range: [40, 120] },
          { label: { en: 'WITHIN 30D', ar: 'خلال 30 يوم' }, format: 'int', range: [8, 24], highlight: true },
          { label: { en: 'OVERDUE', ar: 'متأخر' }, format: 'int', range: [0, 1] },
          { label: { en: 'OWNERS NUDGED · 7D', ar: 'مسؤولون تم تنشيطهم · 7 أيام' }, format: 'int', range: [8, 28] }
        ],
        chartTitle: { en: 'DEADLINES · 14D', ar: 'مواعيد · 14 يومًا' },
        chartA: { en: 'Closed', ar: 'مغلق' },
        chartB: { en: 'Open', ar: 'مفتوح' },
        workflow: baseWorkflow('Reg sources', 'مصادر تنظيمية', 'Owner roster', 'كشف المسؤولين', 'Calendar engine', 'محرك التقويم', 'Owner nudges', 'تنشيط المسؤولين', 'Filing', 'الإقرار'),
        decisionTemplates: [{ en: 'Nudged owner of obligation OB-{n} · {q}d to deadline', ar: 'تنشيط مالك الالتزام OB-{n} · {q} يوم للموعد' }],
        interventionTemplates: [{ en: 'OB-{n} overdue · escalate to GC', ar: 'OB-{n} متأخر · تصعيد للمستشار العام' }],
        activityTemplates: [{ en: 'Issued {n} compliance nudges', ar: 'إصدار {n} تنشيط امتثال' }]
      },
      {
        slug: 'policy-scanner',
        name: { en: 'Policy-Consistency Scanner', ar: 'ماسح اتساق السياسات' },
        context: { en: 'Detects policy drift across documentation.', ar: 'يكشف انجراف السياسات بين المستندات.' },
        systems: ['Doc store', 'CLM'],
        kpiSeeds: [
          { label: { en: 'DOCS SCANNED', ar: 'وثائق ممسوحة' }, format: 'int', range: [400, 1200] },
          { label: { en: 'DRIFT EVENTS · 7D', ar: 'أحداث انجراف · 7 أيام' }, format: 'int', range: [0, 6], highlight: true },
          { label: { en: 'POLICIES TRACKED', ar: 'سياسات متتبعة' }, format: 'int', range: [20, 60] },
          { label: { en: 'AVG SCAN TIME', ar: 'متوسط زمن الفحص' }, format: 'ms', range: [600, 1800] }
        ],
        chartTitle: { en: 'DRIFT EVENTS · 14D', ar: 'أحداث انجراف · 14 يومًا' },
        chartA: { en: 'Drift', ar: 'انجراف' },
        chartB: { en: 'Resolved', ar: 'تم الحل' },
        workflow: baseWorkflow('Doc store', 'مخزن الوثائق', 'Policy library', 'مكتبة السياسات', 'Consistency engine', 'محرك الاتساق', 'Owner alerts', 'تنبيهات المالك', 'Updated doc', 'وثيقة محدّثة'),
        decisionTemplates: [{ en: 'Flagged drift in document D-{n} on policy P-{m}', ar: 'تنبيه انجراف في الوثيقة D-{n} حول السياسة P-{m}' }],
        interventionTemplates: [{ en: 'D-{n} contradicts P-{m} · counsel review', ar: 'D-{n} يتعارض مع P-{m} · مراجعة المستشار' }],
        activityTemplates: [{ en: 'Scanned {n} documents', ar: 'فحص {n} وثيقة' }]
      },
      {
        slug: 'regulatory-watch',
        name: { en: 'Regulatory-Watch Feed', ar: 'تغذية متابعة الجهات التنظيمية' },
        context: { en: 'Surfaces relevant regulatory updates with minimal lag.', ar: 'يُبرز التحديثات التنظيمية ذات الصلة بأدنى تأخير.' },
        systems: ['Regulator feeds'],
        kpiSeeds: [
          { label: { en: 'FEEDS MONITORED', ar: 'تغذيات مُراقبة' }, format: 'int', range: [8, 24] },
          { label: { en: 'UPDATES · 7D', ar: 'تحديثات · 7 أيام' }, format: 'int', range: [4, 18], highlight: true },
          { label: { en: 'HIGH-RELEVANCE · 7D', ar: 'عالية الصلة · 7 أيام' }, format: 'int', range: [1, 6] },
          { label: { en: 'AVG DETECT · HRS', ar: 'متوسط الكشف · ساعات' }, format: 'hrs', range: [1, 6] }
        ],
        chartTitle: { en: 'UPDATE VOLUME · 14D', ar: 'حجم التحديثات · 14 يومًا' },
        chartA: { en: 'Updates', ar: 'تحديثات' },
        chartB: { en: 'High relevance', ar: 'عالية الصلة' },
        workflow: baseWorkflow('Regulator feeds', 'تغذية الجهات', 'Topic taxonomy', 'تصنيف الموضوعات', 'Watch engine', 'محرك المتابعة', 'Counsel digest', 'موجز المستشار', 'Action backlog', 'قائمة الإجراءات'),
        decisionTemplates: [{ en: 'Routed reg update RU-{n} to counsel · relevance {q}', ar: 'توجيه التحديث RU-{n} للمستشار · صلة {q}' }],
        interventionTemplates: [{ en: 'High-relevance update RU-{n} unactioned > 24h', ar: 'تحديث عالي الصلة RU-{n} دون إجراء > 24س' }],
        activityTemplates: [{ en: 'Ingested {n} regulatory updates', ar: 'استيعاب {n} تحديث تنظيمي' }]
      }
    ]
  }
]
