import {useEffect, useRef, useState} from 'react';
import {motion, useInView} from 'motion/react';
import {
  Monitor,
  Smartphone,
  ExternalLink,
  RotateCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {PROTOTYPE_URL} from '../constants/svmsData';

type PreviewMode = 'desktop' | 'mobile';
type LoadStatus = 'loading' | 'loaded' | 'slow' | 'error';

const LIVE_PROTOTYPE_SRC = `${PROTOTYPE_URL}/`;

export function ProductShowcaseSection() {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, {once: true, margin: '-100px'});
  const isPending = loadStatus === 'loading' || loadStatus === 'slow';

  useEffect(() => {
    if (!isInView || !isPending) {
      return;
    }

    const slowTimer = window.setTimeout(() => {
      setLoadStatus((prev) => (prev === 'loading' ? 'slow' : prev));
    }, 6000);

    const errorTimer = window.setTimeout(() => {
      setLoadStatus((prev) => (prev === 'loaded' ? prev : 'error'));
    }, 18000);

    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(errorTimer);
    };
  }, [isInView, isPending, reloadKey]);

  const handleIframeLoad = () => {
    setLoadStatus('loaded');
  };

  const handleIframeError = () => {
    setLoadStatus('error');
  };

  const handleRetry = () => {
    setLoadStatus('loading');
    setReloadKey((prev) => prev + 1);
  };

  const isDesktop = previewMode === 'desktop';

  return (
    <section
      ref={sectionRef}
      id="product-showcase"
      className="py-16 sm:py-24 bg-white dark:bg-[#111827] border-y border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Controls */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              LIVE PRODUCT PROTOTYPE
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] sm:text-3xl [text-wrap:balance]">
              Explore SVMS in Action
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Experience how SVMS helps venue owners manage bookings, courts, customers, and business operations through one dashboard.
            </p>
          </div>

          {/* Preview Mode Toggle & Open in New Tab */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Pilih mode tampilan pratinjau"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#182235] p-1"
            >
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                aria-pressed={isDesktop}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isDesktop
                    ? 'bg-white dark:bg-[#253149] text-indigo-700 dark:text-indigo-300 shadow-xs dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Desktop Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                aria-pressed={!isDesktop}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  !isDesktop
                    ? 'bg-white dark:bg-[#253149] text-indigo-700 dark:text-indigo-300 shadow-xs dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Mobile Preview</span>
              </button>
            </div>

            <a
              href={LIVE_PROTOTYPE_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#182235] px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs dark:shadow-none transition-all duration-150 hover:border-indigo-300 dark:hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-300 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#111827]"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        {/* Live Prototype Viewport Container */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-60px'}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          className="mt-10 flex justify-center"
        >
          <div
            data-cursor-card="true"
            className={`w-full overflow-hidden transition-all duration-300 ease-out ${
              isDesktop
                ? 'max-w-full rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F6F7FB] dark:bg-[#0B1020] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]'
                : 'max-w-[390px] rounded-[2.5rem] border-[6px] border-slate-900 dark:border-slate-800 bg-slate-900 dark:bg-slate-800 p-1.5 shadow-[0_28px_64px_-20px_rgba(15,23,42,0.28)] dark:shadow-[0_28px_64px_-20px_rgba(0,0,0,0.7)]'
            }`}
          >
            {/* Subtle Smartphone Earpiece Indicator only in Mobile Mode */}
            {!isDesktop && (
              <div
                aria-hidden="true"
                className="flex items-center justify-center py-2 bg-slate-900 dark:bg-slate-800"
              >
                <span className="h-1.5 w-16 rounded-full bg-slate-700 dark:bg-slate-600" />
              </div>
            )}

            <div
              className={`relative w-full overflow-hidden bg-white ${
                isDesktop
                  ? 'h-[480px] sm:h-[560px] lg:aspect-[16/9] lg:h-auto lg:min-h-[600px]'
                  : 'h-[660px] sm:h-[720px] max-h-[78vh] rounded-[1.85rem]'
              }`}
            >
              {/* Persistent Interactive Iframe (never remounted on mode toggle) */}
              {loadStatus !== 'error' && (
                <iframe
                  key={reloadKey}
                  src={LIVE_PROTOTYPE_SRC}
                  title="SVMS Live Prototype"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="clipboard-read; clipboard-write; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full border-0 bg-white"
                />
              )}

              {/* Loading / Slow-Load Overlay */}
              {(loadStatus === 'loading' || loadStatus === 'slow') && (
                <div
                  aria-live="polite"
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F6F7FB]/95 dark:bg-[#151D30]/95 px-6 text-center backdrop-blur-xs"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-indigo-300 shadow-xs">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-display text-sm font-semibold text-slate-900 dark:text-[#F8FAFC] sm:text-base">
                    {loadStatus === 'slow'
                      ? 'Prototype masih dimuat...'
                      : 'Memuat SVMS Live Prototype...'}
                  </p>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                    {loadStatus === 'slow'
                      ? 'Koneksi ke server prototype membutuhkan waktu lebih lama dari biasanya. Anda dapat menunggu sebentar atau membukanya langsung di tab baru.'
                      : 'Menghubungkan pratinjau interaktif ke aplikasi SVMS yang telah dideploy.'}
                  </p>

                  {loadStatus === 'slow' && (
                    <a
                      href={LIVE_PROTOTYPE_SRC}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}

              {/* Clean Fallback UI if Iframe Fails to Load */}
              {loadStatus === 'error' && (
                <div
                  role="alert"
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F6F7FB] dark:bg-[#151D30] px-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-indigo-300 shadow-xs">
                    <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-[#F8FAFC] sm:text-lg">
                    Pratinjau Tersemat Tidak Dapat Dimuat
                  </h3>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                    Tampilan embed di halaman ini belum merespons atau dibatasi oleh pengaturan browser Anda. Anda tetap dapat mencoba seluruh fitur prototype SVMS secara langsung di tab terpisah.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={LIVE_PROTOTYPE_SRC}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 whitespace-nowrap"
                    >
                      <span>Open Prototype</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-[#253149] whitespace-nowrap"
                    >
                      <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Coba Muat Ulang</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
