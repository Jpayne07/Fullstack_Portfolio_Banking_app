import React from 'react'
import App from './App'
import Login from './Pages/Login'
import Home from './Pages/Home'
import TransactionsIndex from './Pages/AccountID'
import TransactionId from './Pages/Transaction_id'
import Signup from './Pages/Signup'
import Accountsv2 from './Pages/AccountsIndex'
import Insights from './Pages/Insights'
import AddNewAccount from './Pages/AddNewAccount'
import Error from './Pages/Error'


const routes = [
      {
        path: '/',
        element: <App />,
        errorElement:<Error />,
        
        children: [
              {
              path:"/",
              element: <Home />,
              errorElement:<Error />,
            }, 
            
            {
              path:'/login',
              element: <Login />,
              errorElement:<Error />,
            },
            {
              path:'/accounts',
              element: <Accountsv2 />,
              errorElement:<Error />,
            }, 
            {
              path:'/account/:id',
              element: <TransactionsIndex />,
              errorElement:<Error />,
            }, 
            {
              path:'/transactions/:id',
              element: <TransactionId />,
              errorElement:<Error />,
            }
            , 
          
            {
              path:'/insights',
              element: <Insights />,
              errorElement:<Error />,
            }, 
          
            {
              path:'/account/new',
              element: <AddNewAccount />,
              errorElement:<Error />,
            }
        ]
    }, 
    {
      path:'/signup',
      element: <Signup />
    }
]
 
export default routes