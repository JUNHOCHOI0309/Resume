import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

const MotionContext = createContext({ enabled: true, toggle: () => {} })

export function MotionProvider({ children }: { children: ReactNode }) {
  const [disabled, setDisabled] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    try {
      setDisabled(localStorage.getItem('portfolio-motion') === 'off')
    } catch {
      /* Storage is optional. */
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const toggle = () => {
    setDisabled((current) => {
      try {
        localStorage.setItem('portfolio-motion', current ? 'on' : 'off')
      } catch {
        /* Storage is optional. */
      }
      return !current
    })
  }

  return (
    <MotionContext.Provider value={{ enabled: !disabled && !reduced, toggle }}>
      <div data-motion={disabled || reduced ? 'off' : 'on'}>{children}</div>
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)

export function useReveal(scope: RefObject<HTMLElement | null>, route: string) {
  const { enabled } = useMotion()
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    let revert = () => {}
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !scope.current) return
        gsap.registerPlugin(ScrollTrigger)
        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
            gsap.fromTo(
              element,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: element, start: 'top 94%', once: true },
              },
            )
          })
        }, scope)
        revert = () => context.revert()
      })
      .catch(() => {
        /* All content remains visible if motion cannot load. */
      })
    return () => {
      cancelled = true
      revert()
    }
  }, [enabled, scope, route])
}
