// Copyright (C) 2026 Matt Duffield

import { useEffect, useState, type RefObject } from 'react';

/** Observe the actual nested scroll view, so sideways poster rails never hide navigation. */
export default function useScrollNavigation(
    contentRef: RefObject<HTMLElement>, navigationRef: RefObject<HTMLElement>, route?: string
) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;
        const touchLayout = window.matchMedia('(any-pointer: coarse)');
        let tracked: HTMLElement | null = null;
        let previous = 0;
        let travel = 0;
        const reveal = () => {
            travel = 0;
            setHidden(false);
        };
        reveal();

        const scroll = (event: Event) => {
            const target = event.target;
            if (!touchLayout.matches || !(target instanceof HTMLElement)
                || target.scrollHeight <= target.clientHeight + 1) return;
            // Clamp elastic bounce at BOTH ends; a rebound is not a direction change.
            const position = Math.max(0, Math.min(target.scrollTop, target.scrollHeight - target.clientHeight));
            if (tracked !== target) {
                tracked = target;
                previous = position;
                // A catalog refresh can replace its scroll view without changing the route.
                reveal();
                return;
            }
            const delta = position - previous;
            previous = position;
            if (position <= 8) {
                reveal();
                return;
            }
            if (!delta) return;
            travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
            // Small reversals/jitter do not flicker the bar. Upward travel reveals sooner.
            if (travel <= -12) reveal();
            else if (travel >= 36 && !navigationRef.current?.querySelector(':focus-visible')) {
                setHidden(true);
            }
        };
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Tab' || event.key.startsWith('Arrow') || event.key === 'Escape') reveal();
        };
        const restore = () => { tracked = null; reveal(); };
        content.addEventListener('scroll', scroll, { capture: true, passive: true });
        document.addEventListener('keydown', key);
        window.addEventListener('resize', restore);
        touchLayout.addEventListener('change', restore);
        navigationRef.current?.addEventListener('focusin', reveal);
        const navigation = navigationRef.current;
        return () => {
            content.removeEventListener('scroll', scroll, true);
            document.removeEventListener('keydown', key);
            window.removeEventListener('resize', restore);
            touchLayout.removeEventListener('change', restore);
            navigation?.removeEventListener('focusin', reveal);
        };
    }, [contentRef, navigationRef, route]);

    return hidden;
}
