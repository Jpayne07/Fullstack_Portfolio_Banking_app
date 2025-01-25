import React, {use, useEffect, useState} from 'react'
import Nav from '../Components/Nav'
import AccountComponent from '../Components/AccountComponent'
function Accounts() {
    const [accountRaw, setAccountRaw] = useState([])
    useEffect(()=>{
        fetch('/api/accounts/')
        .then(r=>r.json())
        .then(data=>setAccountRaw(data))
    },[])



  return (
    <div>
        <Nav />
        <AccountComponent accountRaw = {accountRaw}/>
    </div>
  )
}

export default Accounts