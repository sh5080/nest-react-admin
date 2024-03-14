import './styles/global.css';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Page from './app/dashboard/page';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </div>
  );
}
