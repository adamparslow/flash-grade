import { RouteObject } from 'react-router-dom';
import { Home } from './pages/Home';
import { FlashCards } from './pages/FlashCards';
import { Layout } from './components/Layout';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'flash-cards',
        element: <FlashCards />,
      },
    ],
  },
]; 