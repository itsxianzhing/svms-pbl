import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {flushSync} from 'react-dom';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface RevealOrigin {
  x: number;
  y: number;
}

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isTransitioning: boolean;
  setThemePreference: (pref: ThemePreference, origin?: RevealOrigin) => void;
  toggleTheme: (origin?: RevealOrigin) => void;
}

const STORAGE_KEY = 'svms-theme';

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolvedTheme: 'light',
  isTransitioning: false,
  setThemePreference: () => {},
  toggleTheme: () => {},
});

function getStoredPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'system';
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveThemeValue(pref: ThemePreference): ResolvedTheme {
  return pref === 'system' ? getSystemTheme() : pref;
}

function applyThemeToDocument(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function ThemeProvider({children}: {children: ReactNode}) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    typeof window !== 'undefined' ? getStoredPreference() : 'system'
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    typeof window !== 'undefined' ? resolveThemeValue(getStoredPreference()) : 'light'
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionLockRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);

  // Sync DOM immediately on mount & listen for system preference changes
  useEffect(() => {
    const nextResolved = resolveThemeValue(preference);
    setResolvedTheme(nextResolved);
    applyThemeToDocument(nextResolved);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (preference === 'system') {
        const updated = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(updated);
        applyThemeToDocument(updated);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [preference]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const triggerSettlingPhase = useCallback(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-settling', 'true');
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      root.removeAttribute('data-theme-settling');
    }, 950);
  }, []);

  const commitTheme = useCallback(
    (nextPref: ThemePreference, origin?: RevealOrigin) => {
      if (transitionLockRef.current) return;

      const nextResolved = resolveThemeValue(nextPref);

      try {
        localStorage.setItem(STORAGE_KEY, nextPref);
      } catch {
        // Ignore storage write errors
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const docWithTransition = document as Document & {
        startViewTransition?: (cb: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      // Phase 2: Circular View Transition if supported & motion is enabled
      if (docWithTransition.startViewTransition && !prefersReduced && nextResolved !== resolvedTheme) {
        transitionLockRef.current = true;
        setIsTransitioning(true);

        const x = origin?.x ?? window.innerWidth - 48;
        const y = origin?.y ?? 32;
        const maxR = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const root = document.documentElement;
        root.style.setProperty('--theme-reveal-x', `${Math.round(x)}px`);
        root.style.setProperty('--theme-reveal-y', `${Math.round(y)}px`);
        root.style.setProperty('--theme-reveal-r', `${Math.ceil(maxR)}px`);

        triggerSettlingPhase();

        try {
          const transition = docWithTransition.startViewTransition(() => {
            flushSync(() => {
              setPreferenceState(nextPref);
              setResolvedTheme(nextResolved);
            });
            applyThemeToDocument(nextResolved);
          });

          transition.finished
            .catch(() => {})
            .finally(() => {
              transitionLockRef.current = false;
              setIsTransitioning(false);
            });
        } catch {
          setPreferenceState(nextPref);
          setResolvedTheme(nextResolved);
          applyThemeToDocument(nextResolved);
          transitionLockRef.current = false;
          setIsTransitioning(false);
        }
        return;
      }

      // Fallback for unsupported browsers or reduced motion
      if (!prefersReduced) {
        triggerSettlingPhase();
      }
      setPreferenceState(nextPref);
      setResolvedTheme(nextResolved);
      applyThemeToDocument(nextResolved);
    },
    [resolvedTheme, triggerSettlingPhase]
  );

  const toggleTheme = useCallback(
    (origin?: RevealOrigin) => {
      const nextPref: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
      commitTheme(nextPref, origin);
    },
    [commitTheme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        preference,
        resolvedTheme,
        isTransitioning,
        setThemePreference: commitTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
