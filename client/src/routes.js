import React from 'react'
import App from './App'
import Login from './Pages/Login'
import Transactions from './Pages/Transactions'
import Accounts from './Pages/Accounts'
import Cards from './Pages/Cards'
import Home from './Pages/Home'
import Transactionsv2 from './Pages/Transactionsv2'


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
            }, 
            {
              path:'/account/:id',
              element: <Transactionsv2 />
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