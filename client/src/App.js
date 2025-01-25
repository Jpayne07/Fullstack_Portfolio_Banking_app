import React, {useState, useEffect} from 'react'
import './App.css';
import Nav from './Components/Nav';
import TransactionModule from './Components/Transaction_Module';
import BankComponent from './Components/BankComponent';
import {useNavigate } from 'react-router-dom';
import Login from './Pages/Login';


function App() {
  // const [storeJson, setStoreJson] = useState([])
  const [transactions, settransactions] = useState([])
  const [banks, setBanks] = useState([])
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  const handleLogin =(user) =>{
    setUser(user)
  }

  useEffect(()=> {
    fetch('/api')
    .then(r=>r.json())
    .then(data=>{
      console.log(data)
    })  
},[])
  useEffect(()=> {
    fetch('/api/transaction')
    .then(r=>r.json())
    .then(data=>{
      settransactions(data)
    })  
  },[])

  useEffect(()=> {
    fetch('/api/banks')
    .then(r=>r.json())
    .then(data=>{
      setBanks(data)
    })  
},[])

useEffect(()=> {
  fetch('/api/check_session')
  .then((r)=>{
    if(r.ok){
      r.json()
      .then(user =>{
        setUser(user)
      })
    }
    else{
      navigate('/login')
    }
    })
   
},[navigate])
  if (!user) return <Login setUser={handleLogin} />;
  return (
    <main>
    <Nav user = {user}/>
    <div className='home_wrapper'>
      <div className='background_wrapper'>
        <div className='_wrapper'>
          <h2>Bank Name</h2>
          <div className='bank_id'>
            <h3 id = "bank_name"><BankComponent banks = {banks}/></h3>
          </div>
        </div>
        
      </div>
      
          <div className='background_wrapper'>
          <div className='_wrapper'>  

            <h2 className='transaction_header'>Transactions</h2>
            
          <TransactionModule transactions = {transactions}/>
          </div>
        </div>
    </div>
    </main>
  )
}

export default App
