import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  console.log("App rendered with RouterProvider");
  return <RouterProvider router={router} />;
}
