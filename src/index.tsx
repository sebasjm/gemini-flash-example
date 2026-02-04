
import { h, render } from 'preact';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  render(
      <App />
  , rootElement);
} else {
  console.error("Could not find root element to mount to");
}
