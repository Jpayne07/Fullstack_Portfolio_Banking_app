import React, {useState} from 'react'
import AppContext from '../AppContext'
import { useContext } from 'react'
import { PieChart } from 'react-minimal-pie-chart';



function InsightsCharts() {
  const [hovered, setHovered] = useState(null);
    const {categories} = useContext(AppContext)
    const colors = ['#E38627', '#C13C37', '#6A2135', '#8A2BE2', '#2E8B57']; 
    const arrofObjects = Object.entries(categories).map(([key, value],index) => ({
      title: key,
      value: value,
      color: colors[index % colors.length]
  }));

  return (<div>
    <h2>Spending</h2>
    <PieChart
    data={arrofObjects}
    // background={color}
    label={({ dataEntry }) => (hovered === dataEntry.title ? `${dataEntry.title}: ${dataEntry.value}` : dataEntry.value)}
            onMouseOver={(_, index) => setHovered(arrofObjects[index].title)}
            onMouseOut={() => setHovered(null)}
            labelStyle={{ fontSize: '5px', fontWeight: 'bold', fill: 'white' }}
            style={{ height: '300px' }}
            
            segmentsShift={(index) => (index === 0 ? 7 : 2)}
            labelPosition={90} // Adjusts label position
/>
</div>
  )
}

export default InsightsCharts