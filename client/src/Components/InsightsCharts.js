import React, {useState} from 'react'
import AppContext from '../AppContext'
import { useContext } from 'react'
import { PieChart } from 'react-minimal-pie-chart';



function InsightsCharts() {
  const [hovered, setHoveredTitle] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
    const {insights} = useContext(AppContext)
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
    const arrofObjects = Object.entries(insights).map(([key, value],index) => ({
      title: key,
      value: value,
      color: colors[index % colors.length]
  }));

return (
  <div style={{ width: '300px', height: '300px', position: 'relative' }}>
    {/* The PieChart itself */}
    <PieChart
    //     label={({ dataEntry }) => (hovered === dataEntry.title ? `${dataEntry.title}: ${dataEntry.value}` : dataEntry.value)}

      data={arrofObjects}
      onMouseOver={(_, index) => {
        setHoveredTitle(arrofObjects[index].title)
        setHoveredValue(arrofObjects[index].value)}}
      onMouseOut={() => {
        setHoveredTitle(null)
        setHoveredValue(null)}}
      lineWidth={30}
      paddingAngle={2}
      rounded
      segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
      segmentsShift={1}
    />

    {/* The center label */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none', // ensures the label doesn't block chart hover
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{hovered}:</div>
      <div style={{ fontSize: '2rem' }}> ${hoveredValue}</div>
    </div>
  </div>
);
}

export default InsightsCharts