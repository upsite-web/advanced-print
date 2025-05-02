import { createRoot } from 'react-dom/client';
import Editor from './editor';

const container = document.getElementById('advanced-print-editor');

if (container) {
  const root = createRoot(container);
  root.render(<Editor />);
}
