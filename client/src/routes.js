import React from 'react'
import App from './App'
import Login from './Pages/Login'
// import Transactions from './Pages/Transactions'
import Accounts from './Pages/Accounts'
import Cards from './Pages/Cards'
import Home from './Pages/Home'
import TransactionsIndex from './Pages/TransactionsIndex'
import TransactionId from './Pages/Transaction_id'
import Signup from './Pages/Signup'


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
              element: <Accounts />
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
            }
        ]
    }, 
    {
      path:'/signup',
      element: <Signup />
    }
]
 
export default routes