import './index.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Router from './routes/Route.jsx';
import store from './store/store.js';

import { injectStoreInAxios } from './api/axiosInstance.js';
import { SocketProvider } from './contexts/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SocketProvider>
      <Router />
    </SocketProvider>
  </Provider>,
)

injectStoreInAxios(store);