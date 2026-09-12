import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router does not reset scroll position on navigation by default.
 * Without this, clicking a Footer link (while scrolled to the bottom of a
 * long page) swaps the page content but leaves the viewport scrolled to
 * the bottom — so the new page looks "blank" until the user scrolls up
 * manually. This fixes that for every navigation, everywhere in the app.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
