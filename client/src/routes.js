import React from 'react'
import App from './App'
import Login from './Pages/Login'
import Cards from './Pages/Cards'
import Home from './Pages/Home'
import TransactionsIndex from './Pages/TransactionsIndex'
import TransactionId from './Pages/Transaction_id'
import Signup from './Pages/Signup'
import Accountsv2 from './Pages/Accountsv2'
import Insights from './Pages/Insights'


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
            },
            {
              path:'/accounts',
              element: <Accountsv2 />
            }, 
            {
              path:'/account/:id',
              element: <TransactionsIndex />
            }, 
            {
              path:'/transactions/:id',
              element: <TransactionId />
            }
            , 
            {
              path:'/cards',
              element: <Cards />
            }, 
            {
              path:'/insights',
              element: <Insights />
            }
        ]
    }, 
    {
      path:'/signup',
      element: <Signup />
    }
]
 
export default routes