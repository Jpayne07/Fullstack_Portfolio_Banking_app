import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from './routes';
import { AppProvider } from './AppContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(routes, {
  basename: "/Fullstack_Portfolio_Banking_app"
})
root.render(
<AppProvider>
    <RouterProvider router={router} />
  </AppProvider>);

reportWebVitals();
