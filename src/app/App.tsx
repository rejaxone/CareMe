import { RouterProvider } from 'react-router';
import { router } from './routes';

/**
 * App renders RouterProvider at the root.
 * AuthProvider lives inside RootLayout (a route component) so that it
 * participates in React Router's rendering pipeline and HMR correctly.
 */
export default function App() {
  return <RouterProvider router={router} />;
}