import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import "./App.css";
import Home from './pages/home'
import AppLayout from './layout/AppLayout'
import Category from './pages/category'
import GifPage from './pages/singleGif'
import SearchPage from './pages/search'
import Favorites from './pages/favorites'
import {GifProvider} from './context/GifContext'



const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element:<Home/>
      },
      {
        path: "/:type/:slug",
        element: <GifPage />,
      },
      {
        path: "/:category",
        element: <Category />,
      },
      {
        path: "/search/:query",
        element: <SearchPage />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
    ],
  },
]);

const App = () => {
  return (
    <GifProvider>
      <RouterProvider router={router} />
    </GifProvider>
  )
}

export default App
