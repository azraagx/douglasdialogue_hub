import { Icon } from '../components/Icon';
import { SmartLink } from '../components/SmartLink';

export function NotFound() {
  return (
    <section className="section notfound">
      <div className="container">
        <p className="eyebrow">Page not found</p>
        <h1 className="display">This page isn’t part of the dialogue.</h1>
        <p className="lead">The address may have changed. Start again from the Dashboard.</p>
        <SmartLink to="/" className="btn btn--dark">Go to the Dashboard <Icon name="arrow" size={18} /></SmartLink>
      </div>
    </section>
  );
}
