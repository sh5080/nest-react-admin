import React from 'react';
import { Link } from 'react-router-dom';

import { DynamicLogo } from '../../components/core/logo';
import { paths } from '../../paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
        <div style={{ padding: '16px' }}>
          <Link to={paths.home}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Link>
        </div>
        <div
          style={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', padding: '16px' }}
        >
          <div style={{ maxWidth: '450px', width: '100%' }}>{children}</div>
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: '#fff',
          display: 'none',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', lineHeight: '32px' }}>
            Welcome to <span style={{ color: '#15b79e' }}>Devias Kit</span>
          </h1>
          <p>A professional template that comes with ready-to-use MUI components.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <img
            alt="Widgets"
            src="/assets/auth-widgets.png"
            style={{ height: 'auto', width: '100%', maxWidth: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}
