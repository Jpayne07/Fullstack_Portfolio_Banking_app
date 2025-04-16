import React from 'react'
import InsightComponent from '../Components/InsightsComponent'
import InsightsCharts from '../Components/InsightsCharts'

function Insights() {
  // insights displays all of the transactions and the spend based on the category
  return (
    <div className='page_wrapper' style={{display:"flex", flexWrap:"wrap"}}>
      <div className='background_wrapper' id='test'>
        <div className='_wrapper' id='test'>
          <InsightComponent/>
        </div>
      </div>
      <div className='background_wrapper' id='test' >
        <div className='_wrapper' style={{display:"flex", justifyContent:"center"}}><InsightsCharts/></div>
      </div>
    </div>
  )
}

export default Insights