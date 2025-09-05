import { useCallback, useEffect, useState } from 'react'
import './App.css'

const generateDemisphere = ({ numberOfCircles, startingRadius, radiusIncrement, offsetDistance, angleIncrement }) =>
  Array.from({ length: numberOfCircles }, (_, i) => ({
    cx: offsetDistance * Math.cos(i * angleIncrement),
    cy: offsetDistance * Math.sin(i * angleIncrement),
    r: startingRadius + (i * radiusIncrement),
  }));

const svgFromDemisphere = (
  { numberOfCircles, startingRadius, radiusIncrement, offsetDistance, angleIncrement },
  { width = 800, height = 600 },
) =>
`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${ width }" height="${ height}" viewBox="-${ width / 2 } -${ height / 2 } ${ width } ${ height }" 
     xmlns="http://www.w3.org/2000/svg"
     style="background: white; cursor: pointer;"
     onclick="toggleDirection()">
  <style>
    .rotary-group {
      animation: rotate-forward 2s infinite linear;
      transform-origin: 0 0;
    }
    .rotary-group.reverse {
      animation: rotate-reverse 2s infinite linear;
    }
    @keyframes rotate-forward {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes rotate-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    .circle {
      fill: none;
      stroke: black;
      stroke-width: 1;
    }
  </style>
  
  <script>
    <![CDATA[
    function toggleDirection() {
      const group = document.querySelector('.rotary-group');
      group.classList.toggle('reverse');
    }
    ]]>
  </script>
  
  <g class="rotary-group">
${generateDemisphere({ numberOfCircles, startingRadius, radiusIncrement, offsetDistance, angleIncrement }).map(({cx, cy, r}) => 
    `    <circle class="circle" cx="${cx}" cy="${cy}" r="${r}" />`
  ).join('\n')}
  </g>
  
  <!-- <text x="-950" y="530" font-family="Arial, sans-serif" font-size="16" fill="black">
    Rotary Demisphere • ${numberOfCircles} circles • Inspired by Marcel Duchamp
  </text> -->
</svg>`;

const downloadAsSVG = (content, filename = 'rotary-demisphere.svg') => {
  // Browser-safe download using Blob API
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Create temporary download link, trigger download, then remove and clean up blob URL
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  return content;
}

function SpiralControls({ currentSpiral, setCurrentSpiral, spiralDisplay, setSpiralDisplay }) {
  const handleSpiralChange = ({target}) => setCurrentSpiral({...currentSpiral, [target.name]: parseFloat(target.value)});
  
  const handleDownload = () => {
    const filename = `${currentSpiral.name.toLowerCase().replace(/\s+/g, '-')}-demisphere.svg`;
    downloadAsSVG(svgFromDemisphere(currentSpiral, { width: 1920, height: 1080 }), filename);
  };
  
  return <form onSubmit={ event => event.preventDefault() }>
    <select 
      onChange={({target}) => setCurrentSpiral(spirals.find(({name}) => name === target.value))} 
      value={currentSpiral.name}
    >
      {spirals.map(({name}) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
    <label htmlFor="numberOfCircles">
      Number of Circles
      <input
        type="number"
        name="numberOfCircles"
        value={currentSpiral.numberOfCircles}
        onChange={handleSpiralChange}
      />
    </label>
    <label htmlFor="startingRadius">
      Starting Radius
      <input
        type="number"
        step="any"
        name="startingRadius"
        value={currentSpiral.startingRadius}
        onChange={handleSpiralChange}
      />
    </label>
    <label htmlFor="radiusIncrement">
      Radius Increment
      <input
        type="number"
        step="any"
        name="radiusIncrement"
        value={currentSpiral.radiusIncrement}
        onChange={handleSpiralChange}
      />
      <aside>
        <button onClick={() => setCurrentSpiral({...currentSpiral, radiusIncrement: currentSpiral.radiusIncrement * Math.PI})}>×π</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, radiusIncrement: currentSpiral.radiusIncrement / Math.PI})}>÷π</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, radiusIncrement: currentSpiral.radiusIncrement * goldenRatio})}>×φ</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, radiusIncrement: currentSpiral.radiusIncrement / goldenRatio})}>÷φ</button>
      </aside>
    </label>
    <label htmlFor="offsetDistance">
      Offset Distance
      <input
        type="number"
        step="any"
        name="offsetDistance"
        value={currentSpiral.offsetDistance}
        onChange={handleSpiralChange}
      />
    </label>
    <label htmlFor="angleIncrement">
      Angle Increment
      <input
        type="number"
        step="any"
        name="angleIncrement"
        value={currentSpiral.angleIncrement}
        onChange={handleSpiralChange}
      />
      <aside>
        <button onClick={() => setCurrentSpiral({...currentSpiral, angleIncrement: currentSpiral.angleIncrement * Math.PI})}>×π</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, angleIncrement: currentSpiral.angleIncrement / Math.PI})}>÷π</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, angleIncrement: currentSpiral.angleIncrement * goldenRatio})}>×φ</button>
        <button onClick={() => setCurrentSpiral({...currentSpiral, angleIncrement: currentSpiral.angleIncrement / goldenRatio})}>÷φ</button>
      </aside>
    </label>
    <hr style={{width: '50%'}} />
    <label htmlFor="strokeWidth">
      Stroke Width
      <input
        type="number"
        step="any"
        name="strokeWidth"
        value={spiralDisplay.strokeWidth}
        onChange={({target}) => setSpiralDisplay({...spiralDisplay, strokeWidth: parseFloat(target.value)})}
      />
    </label>
    <aside>
      <label htmlFor="reverse">
        <input
          type="checkbox"
          name="reverse"
          checked={spiralDisplay.reverse}
          onChange={() => setSpiralDisplay({...spiralDisplay, reverse: !spiralDisplay.reverse})}
        />
        Reverse
      </label>
      <button type="button" onClick={handleDownload}>📥 Download</button>
      <a href="https://github.com/josh-frank/rotary-demisphere" target="_blank" rel="noopener noreferrer" title="View on GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
        </svg>
      </a>
    </aside>
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

    <SpiralControls 
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
        {generateDemisphere(currentSpiral).map(({cx, cy, r}, index) =>
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
  { name: 'Octagonal Mandala', numberOfCircles: 16, startingRadius: 16, radiusIncrement: 14, offsetDistance: 12, angleIncrement: Math.PI / 4 },
  { name: 'Chaos Theory', numberOfCircles: 24, startingRadius: 8, radiusIncrement: 7, offsetDistance: 18, angleIncrement: Math.PI / 7 },
  { name: 'Bauhaus Minimal', numberOfCircles: 6, startingRadius: 40, radiusIncrement: 30, offsetDistance: 5, angleIncrement: Math.PI / 6 },
];
