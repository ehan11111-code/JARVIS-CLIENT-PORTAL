'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, GraduationCap, Clock, X } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'

const modules = [
  {
    code: 'JA-101',
    name: { en: 'Operating Alongside Engineered Systems', ar: 'العمل مع الأنظمة الذكية' },
    desc: { en: 'Foundations for working with autonomous operational systems day to day.', ar: 'أساسيات التعامل اليومي مع أنظمة الأتمتة الذكية.' },
    duration: 32
  },
  {
    code: 'JA-201',
    name: { en: 'Reading Decisions & Exception Queues', ar: 'قراءة القرارات وقوائم المراجعة' },
    desc: { en: 'How to interpret autonomous decisions and act on flagged exceptions.', ar: 'كيف تفهم القرارات التلقائية وتتعامل مع الحالات التي تحتاج مراجعة.' },
    duration: 28
  },
  {
    code: 'JA-202',
    name: { en: 'Intervening Without Breaking the Loop', ar: 'التدخل دون تعطيل سير العمل' },
    desc: { en: 'When to approve, override or reject — and what each action means downstream.', ar: 'متى تعتمد أو تتجاوز أو ترفض، وكيف يؤثر كل إجراء على ما بعده.' },
    duration: 22
  },
  {
    code: 'JA-301',
    name: { en: 'Executive Reading of Cross-Department State', ar: 'القراءة التنفيذية لحالة المنشأة' },
    desc: { en: 'Use the control center as a decision instrument for leadership.', ar: 'استخدم مركز التحكم كأداة قرار على مستوى القيادة.' },
    duration: 36
  },
  {
    code: 'JA-302',
    name: { en: 'Module Composition: An Engineering Brief', ar: 'تكوين الوحدات: نظرة هندسية' },
    desc: { en: 'A walkthrough of how Jarvis modules are wired into your systems.', ar: 'جولة على طريقة ربط وحدات جارفيس بأنظمة منشأتك.' },
    duration: 44
  },
  {
    code: 'JA-401',
    name: { en: 'Department Lead Calibration', ar: 'جلسات معايرة لقادة الأقسام' },
    desc: { en: 'Quarterly calibration cadence for department leads with their Jarvis engineer.', ar: 'لقاء ربع سنوي بين قائد القسم ومهندس جارفيس لمواءمة الأهداف.' },
    duration: 50
  }
]

export default function AcademyPage() {
  const t = useTranslations('academy')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const [open, setOpen] = useState<string | null>(null)

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('academy') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-10 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{t('eyebrow')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>
          {t('headline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {modules.map((m, i) => (
          <motion.article
            key={m.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="rounded-soft border border-border bg-surface shadow-soft hover:shadow-card transition-shadow p-6 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent-soft text-accent">
                <GraduationCap className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <span className="text-xs text-muted font-medium">{m.code}</span>
            </div>
            <h3 className="text-base font-semibold text-text leading-snug mt-1">{m.name[locale]}</h3>
            <p className="text-sm text-text-soft leading-relaxed">{m.desc[locale]}</p>
            <div className="mt-3 pt-4 border-t border-border flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.6} />
                {m.duration} {t('duration')}
              </span>
              <button
                type="button"
                onClick={() => setOpen(m.code)}
                className="inline-flex items-center gap-1.5 rounded-full bg-text text-bg hover:bg-accent transition-colors px-3 py-1.5 text-xs font-semibold"
              >
                <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                {t('launch')}
              </button>
            </div>
          </motion.article>
        ))}
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm flex items-center justify-center px-4"
            role="dialog"
            aria-modal
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-md w-full rounded-xl2 border border-border bg-surface shadow-float p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute top-3 end-3 inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-bg-soft transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-text-soft" strokeWidth={1.6} />
              </button>
              <div className="text-xs font-medium text-accent">{open}</div>
              <p className="text-base text-text mt-3">{t('comingSoon')}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
