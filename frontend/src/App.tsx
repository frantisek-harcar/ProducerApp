import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import NotFoundPage from './pages/NotFoundPage';
import UsersPage from './pages/UsersPage';
import HomePage from './pages/HomePage';
import AppLayout from './components/AppLayout';
import SettingsPage from './pages/SettingsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import FilesPage from './pages/FilesPage';
import PaymentSuccessfulPage from './pages/PaymentSuccessPage';
import CalendarPage from './pages/CalendarPage';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {

  const { i18n } = useTranslation();

  const defaultLanguage = navigator.language.startsWith('cs') ? 'cs' : 'en';

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route
        path='/'
        element={<HomePage />}
      />
      <Route
        path='/projects'
        element={<ProjectsPage />}
      />
      <Route
        path='/projectDetail/:id'
        element={<ProjectDetailPage />}
      />
      <Route
        path='/paymentSuccess'
        element={<PaymentSuccessfulPage />}
      />
      <Route
        path='/users'
        element={<UsersPage />}
      />
      <Route
        path='/files'
        element={<FilesPage />}
      />
      <Route
        path='/calendar'
        element={<CalendarPage />}
      />
      <Route
        path='/settings'
        element={<SettingsPage />}
      />
      <Route
        path='*'
        element={<NotFoundPage />}
      />
    </Route>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
