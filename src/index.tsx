
import { h, render } from 'preact';
import App from './App';
import i18n from './services/i18n';

const rootElement = document.getElementById('root');
if (rootElement) {
  render(
      <App />
  , rootElement);
} else {
  console.error("Could not find root element to mount to");
}
