import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.tsx'
import './index.css'
import useAuthStore from './stores/useAuthStore'


function AppWrapper() {
  const initAuthObserver = useAuthStore((state) => state.initAuthObserver);

  useEffect(() => {
    const unsub = initAuthObserver();
    return () => unsub();
  }, []);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
    <RouterProvider router={router} />
  </StrictMode>,
)
