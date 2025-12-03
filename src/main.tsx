import './polyfills';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import './index.css';
import useAuthStore from './stores/useAuthStore';

function AppWrapper() {
  useEffect(() => {
    // Use getState() to avoid subscribing this component to the store
    // which can cause re-renders when the auth state updates.
    const initAuthObserver = useAuthStore.getState().initAuthObserver;
    const unsub = initAuthObserver && initAuthObserver();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
