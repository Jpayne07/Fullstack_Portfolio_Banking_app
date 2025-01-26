import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from './routes';
import { AppProvider } from './AppContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(routes)
root.render(
<AppProvider>
    <RouterProvider router={router} />
  </AppProvider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
