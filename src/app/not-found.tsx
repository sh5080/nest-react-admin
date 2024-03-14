import React from 'react';
import { Link } from 'react-router-dom';

import { config } from '../config';
import { paths } from '../paths';

export const metadata = { title: `Not found | ${config.site.name}` };

export default function NotFound() {
  return (
    <main style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
      <div style={{ alignItems: 'center', maxWidth: 'md' }}>
        <div>
          <img
            alt="Under development"
            src="/assets/error-404.png"
            style={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
          />
        </div>
        <h3 style={{ textAlign: 'center' }}>404: The page you are looking for isn&apos;t here</h3>
        <p style={{ textAlign: 'center' }}>
          You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
        </p>
        <Link to={paths.home}>
          <button style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--icon-fontSize-md)', marginRight: '8px' }}>&lt;</span>
            Go back to home
          </button>
        </Link>
      </div>
    </main>
  );
}
