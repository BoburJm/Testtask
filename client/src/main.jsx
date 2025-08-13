import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TestPage from './pages/TestPage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './styles.css'

const router = createBrowserRouter([
  { path: '/', element: <TestPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '/admin', element: <AdminPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


