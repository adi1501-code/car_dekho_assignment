import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout/common-layout'
import RecommendPage from './pages/recommend'
import HistoryPage from './pages/history'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <RecommendPage />,
        },
        {
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
