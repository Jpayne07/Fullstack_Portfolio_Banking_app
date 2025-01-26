import React from 'react'
import App from './App'
import Login from './Pages/Login'
import Transactions from './Pages/Transactions'
import Accounts from './Pages/Accounts'
import Cards from './Pages/Cards'
import Home from './Pages/Home'


const routes = [
      {
        path: '/',
        element: <App />,
        children: [
              {
              path:"/",
              element: <Home />
            }, 
            {
              path:'/login',
              element: <Login />
            }
            , 
            {
              path:'/transactions',
              element: <Transactions />
            }
            , 
            {
              path:'/accounts',
              element: <Accounts />
            }
            , 
            {
              path:'/cards',
              element: <Cards />
            }
        ]
    }
]
 
export default routes