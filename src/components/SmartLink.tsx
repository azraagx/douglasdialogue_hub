import { Link, type LinkProps } from 'react-router-dom';

/** Internal link that understands "/path#anchor" and "/path?query". */
export function SmartLink({ to, ...rest }: Omit<LinkProps, 'to'> & { to: string }) {
  const [pathAndQuery, hash] = to.split('#');
  const [pathname, search] = pathAndQuery.split('?');
  return <Link to={{ pathname: pathname || '/', search: search ? `?${search}` : '', hash: hash ? `#${hash}` : '' }} {...rest} />;
}
