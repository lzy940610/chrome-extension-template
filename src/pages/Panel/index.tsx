import React from 'react';
import { createRoot } from 'react-dom/client';

import Panel from './Panel';

const container = document.getElementById('app-container') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Panel />);
