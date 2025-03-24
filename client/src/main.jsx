import { createRoot } from 'react-dom/client';
import './index.css';
import 'virtual:uno.css';
import App from './App.jsx';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')).render(<App />);
