import React from 'react'

function AccountComponent({accountRaw}) {
    const accountElement = accountRaw.map(account=>{
        return(
            <div>
                
            </div>
        )
    })
  return (
    <div>AccountComponent</div>
  )
}

export default AccountComponent