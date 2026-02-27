import { createBrowserRouter } from "react-router";
import { Root } from './Root';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: Shop },
      { path: "product/:id", Component: ProductDetails },
      { path: "*", Component: NotFound },
    ],
  },
]);
