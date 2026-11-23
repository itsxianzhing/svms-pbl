import {AnimatePresence, motion} from 'motion/react';
import {
  CalendarCheck2,
  Clock,
  Building2,
  BarChart3,
  ReceiptText,
  Users,
} from 'lucide-react';
import type {FeatureItem} from '../../constants/svmsData';

export function FeatureIcon({iconKey}: {iconKey: FeatureItem['iconKey']}) {
  const cls = 'h-5 w-5';
  switch (iconKey) {
    case 'calendar-check':
      return <CalendarCheck2 className={cls} aria-hidden="true" />;
    case 'clock':
      return <Clock className={cls} aria-hidden="true" />;
    case 'building':
      return <Building2 className={cls} aria-hidden="true" />;
    case 'bar-chart':
      return <BarChart3 className={cls} aria-hidden="true" />;
    case 'receipt':
      return <ReceiptText className={cls} aria-hidden="true" />;
    case 'users':
      return <Users className={cls} aria-hidden="true" />;
  }
}

interface FeatureContentProps {
  feature: FeatureItem;
  index: number;
  total: number;
  animateSwap?: boolean;
  reducedMotion?: boolean;
}

export function FeatureContent({
  feature,
  index,
  total,
  animateSwap = true,
  reducedMotion = false,
}: FeatureContentProps) {
  const body = (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white dark:bg-[#182235] p-6 sm:p-7 shadow-[0_14px_34px_-16px_rgba(15,23,42,0.1)] dark:shadow-none">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
          <FeatureIcon iconKey={feature.iconKey} />
        </div>
        <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
          Modul 0{index + 1} / 0{total}
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-2xl [text-wrap:balance]">
        {feature.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
        {feature.capability}
      </p>

      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
        <p className="text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
          Manfaat untuk Pemilik Venue
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {feature.ownerBenefit}
        </p>
      </div>
    </div>
  );

  if (!animateSwap || reducedMotion) {
    return body;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={feature.id}
        initial={{opacity: 0, y: 14}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -12}}
        transition={{duration: 0.26, ease: [0.16, 1, 0.3, 1]}}
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
}
