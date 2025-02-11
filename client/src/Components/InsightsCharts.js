import React, {useState} from 'react'
import AppContext from '../AppContext'
import { useContext } from 'react'
import { PieChart } from 'react-minimal-pie-chart';



function InsightsCharts() {
  const [hovered, setHovered] = useState(null);
    const {categories} = useContext(AppContext)
    const colors = [
      "#2BFF5C", // Base Bright Green
      "#1EAA46", // Darker Green for Depth
      "#FF5733", // Bold Reddish-Orange (High Contrast)
      "#FFC300", // Bright Yellow (Vibrant)
      "#335CFF", // Deep Blue (Strong Contrast)
      "#2A2A2A", // Charcoal Gray (Dark, Sleek)
      "#F5F5F5", // Soft Off-White (Clean Design)
      "#FF69B4", // Vibrant Pink (Energetic)
      "#8A2BE2"  // Rich Purple (Sophisticated Touch)
    ];
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
            labelStyle={{
              fontSize: "3px",
              fill: "#fff",
              fontWeight: "bold",
            }}
            radius={42}
            // lineWidth={25}
            paddingAngle={5}
            // rounded
            animate
            
            // segmentsShift={(index) => (index === 0 ? 7 : 2)}
            labelPosition={75} // Adjusts label position
/>
</div>
  )
}

export default InsightsCharts