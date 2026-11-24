import { ROUTE_SLUGS } from '../content/navigation';

/**
 * Works out where the app is hosted (e.g. "/" or "/hr/dialogue-hub") so the
 * router and media paths work from any folder of a static web server.
 */
function computeBasename(): string {
  let path = window.location.pathname.replace(/index\.html$/, '');
  const slugPattern = new RegExp(`/(${ROUTE_SLUGS.join('|')})/?$`);
  path = path.replace(slugPattern, '');
  return path.replace(/\/+$/, '');
}

export const BASENAME = computeBasename();

/** Absolute URL for a file in /public/media. */
export const media = (file: string) => `${BASENAME}/media/${file}`;
