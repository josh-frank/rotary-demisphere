import { useCallback, useEffect, useState } from 'react'
import './App.css'

function generateConcentricCircles({ numberOfCircles, startingRadius, radiusIncrement, offsetDistance, angleIncrement }) { 
  return Array.from({ length: numberOfCircles }, (_, i) => ({
    cx: offsetDistance * Math.cos(i * angleIncrement),
    cy: offsetDistance * Math.sin(i * angleIncrement),
    r: startingRadius + (i * radiusIncrement),
  }));
}

function SpiralForm( { currentSpiral, setCurrentSpiral, spiralDisplay, setSpiralDisplay } ) {
  const handleSpiralChange = ({target}) => setCurrentSpiral({...currentSpiral, [target.name]: parseFloat(target.value)});
  return <form>
    <select 
      onChange={({target}) => setCurrentSpiral(spirals.find(({name}) => name === target.value))} 
      value={currentSpiral.name}
    >
      {spirals.map(({name}) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
    <label htmlFor="numberOfCircles">Number of Circles</label>
    <input
      type="number"
      name="numberOfCircles"
      value={currentSpiral.numberOfCircles}
      onChange={handleSpiralChange}
    />
    <label htmlFor="startingRadius">Starting Radius</label>
    <input
      type="number"
      step="any"
      name="startingRadius"
      value={currentSpiral.startingRadius}
      onChange={handleSpiralChange}
    />
    <label htmlFor="radiusIncrement">Radius Increment</label>
    <input
      type="number"
      step="any"
      name="radiusIncrement"
      value={currentSpiral.radiusIncrement}
      onChange={handleSpiralChange}
    />
    <label htmlFor="offsetDistance">Offset Distance</label>
    <input
      type="number"
      step="any"
      name="offsetDistance"
      value={currentSpiral.offsetDistance}
      onChange={handleSpiralChange}
    />
    <label htmlFor="angleIncrement">Angle Increment</label>
    <input
      type="number"
      step="any"
      name="angleIncrement"
      value={currentSpiral.angleIncrement}
      onChange={handleSpiralChange}
    />
    <hr style={{width: '50%'}} />
    <label htmlFor="strokeWidth">Stroke Width</label>
    <input
      type="number"
      step="any"
      name="strokeWidth"
      value={spiralDisplay.strokeWidth}
      onChange={({target}) => setSpiralDisplay({...spiralDisplay, strokeWidth: parseFloat(target.value)})}
    />
    <label htmlFor="reverse">
      <input
        type="checkbox"
        name="reverse"
        checked={spiralDisplay.reverse}
        onChange={() => setSpiralDisplay({...spiralDisplay, reverse: !spiralDisplay.reverse})}
      />
      Reverse
    </label>
  </form>;
}

function App() {

  const [clientDimensions, setClientDimensions] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  const handleResize = useCallback((/*resizeEvent*/) => {
    setClientDimensions({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const [currentSpiral, setCurrentSpiral] = useState(spirals[0]);
  
  const [spiralDisplay, setSpiralDisplay] = useState({
    reverse: false,
    strokeWidth: 1,
  });

  return <>

    <SpiralForm 
      currentSpiral={currentSpiral} 
      setCurrentSpiral={setCurrentSpiral} 
      spiralDisplay={spiralDisplay} 
      setSpiralDisplay={setSpiralDisplay} 
    />

    <svg
      width="100%"
      height="100%"
      viewBox={`${clientDimensions.width/-2} ${clientDimensions.height/-2} ${clientDimensions.width} ${clientDimensions.height}`}
      preserveAspectRatio="xMidYMid slice"
      zoomAndPan="disable"
      contentScriptType="text/ecmascript"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      
    >
      <g className={spiralDisplay.reverse ? "reverse" : "forward"}>
        {generateConcentricCircles(currentSpiral).map(({cx, cy, r}, index) =>
          <circle key={index} cx={cx} cy={cy} r={r} strokeWidth={spiralDisplay.strokeWidth} />
        )}
      </g>

    </svg>

  </>;

}

export default App;

const goldenRatio = (1 + Math.sqrt(5))/2;

const spirals = [
  { name: 'Divine Proportion', numberOfCircles: 11, startingRadius: 16, radiusIncrement: 16 * goldenRatio, offsetDistance: 13, angleIncrement: (Math.PI * 2) / goldenRatio },
  { name: 'Classic Duchamp Spiral', numberOfCircles: 12, startingRadius: 25, radiusIncrement: 20, offsetDistance: 7.5, angleIncrement: Math.PI / 3 },
  { name: 'Golden Ratio Spiral', numberOfCircles: 10, startingRadius: 20, radiusIncrement: 20 * goldenRatio, offsetDistance: 15, angleIncrement: Math.PI / 5 },
  { name: 'Tight Hypnotic Spiral', numberOfCircles: 20, startingRadius: 15, radiusIncrement: 8, offsetDistance: 12, angleIncrement: Math.PI / 12 },
  { name: 'Square Wave Pattern', numberOfCircles: 8, startingRadius: 30, radiusIncrement: 25, offsetDistance: 20, angleIncrement: Math.PI / 2 },
  { name: 'Fibonacci Spiral', numberOfCircles: 13, startingRadius: 13, radiusIncrement: 21, offsetDistance: 8, angleIncrement: Math.PI / 8 },
  { name: 'Pentagon Bloom', numberOfCircles: 15, startingRadius: 18, radiusIncrement: 12, offsetDistance: 10, angleIncrement: (2 * Math.PI) / 5 },
  { name: 'Crystalline Hexagon', numberOfCircles: 12, startingRadius: 22, radiusIncrement: 18, offsetDistance: 14, angleIncrement: Math.PI / 3 },
  { name: 'Whispered Spiral', numberOfCircles: 25, startingRadius: 10, radiusIncrement: 4, offsetDistance: 2, angleIncrement: Math.PI / 16 },
  { name: 'Nautilus Shell', numberOfCircles: 8, startingRadius: 12, radiusIncrement: 35, offsetDistance: 25, angleIncrement: Math.PI / 4 },
  { name: 'DNA Helix', numberOfCircles: 30, startingRadius: 8, radiusIncrement: 3, offsetDistance: 6, angleIncrement: Math.PI / 24 },
  // { name: 'Zen Circles', numberOfCircles: 10, startingRadius: 20, radiusIncrement: 15, offsetDistance: 0, angleIncrement: 0 },
  { name: 'Octagonal Mandala', numberOfCircles: 16, startingRadius: 16, radiusIncrement: 14, offsetDistance: 12, angleIncrement: Math.PI / 4 },
  { name: 'Chaos Theory', numberOfCircles: 24, startingRadius: 8, radiusIncrement: 7, offsetDistance: 18, angleIncrement: Math.PI / 7 },
  { name: 'Bauhaus Minimal', numberOfCircles: 6, startingRadius: 40, radiusIncrement: 30, offsetDistance: 5, angleIncrement: Math.PI / 6 },
  // { name: 'Whitehead Spiral', numberOfCircles: 10, startingRadius: 20, radiusIncrement: 20, offsetDistance: 10, angleIncrement: Math.PI / 5 },
];
