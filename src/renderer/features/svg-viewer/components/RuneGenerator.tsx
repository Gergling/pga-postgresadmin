type RuneConfig = {
  size: number;
  glowColor: string;
  coreColor: string;
};

const getStateStr = (state: boolean[]) => state.map(s => s ? '1' : '0').join('');

/**
 * Generates all possible boolean combinations for a set of dimensions.
 * @param dimensions - The number of "switches" (e.g., 6 segments in a rune).
 * @returns An array of boolean arrays representing every state.
 */
function generateRuneStates(dimensions: number): boolean[][] {
  const combinations: boolean[][] = [];
  const totalStates = Math.pow(2, dimensions);

  for (let i = 0; i < totalStates; i++) {
    // Convert the index to a binary string and pad with zeros
    const binary = i.toString(2).padStart(dimensions, '0');
    const state = binary.split('').map(bit => bit === '1');
    combinations.push(state);
  }

  return combinations;
}

const grid = generateRuneStates(6);

function generateRuneSVG(state: boolean[], config: RuneConfig): string {
  const { size, glowColor, coreColor } = config;
  
  // Define the 6 segments of a central-spine hexagon rune (like Bluetooth)
  // These coordinates assume a 100x100 viewbox
  const segments = [
    "M50 50 L50 5",   // Top Spine
    "M50 50 L50 95",  // Bottom Spine
    "M50 5 L85 25",   // Top-Right Diagonal
    "M85 25 L50 50",  // Mid-Right Return
    "M50 50 L85 75",  // Mid-Right Diagonal
    "M85 75 L50 95",  // Bottom-Right Return

    // "M50 95 L15 75",  // Bottom-Left Diagonal
    // "M15 75 L50 50",  // Mid-Left Return
    // "M50 50 L15 25",  // Mid-Left Diagonal
    // "M15 25 L50 5",   // Top-Left Return
  ];

  // Only render the paths where the state is 'true'
  const activePaths = segments
    .filter((_, index) => state[index])
    .join(" ");

  return `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="flicker-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke-linecap="round" stroke-linejoin="bevel" filter="url(#flicker-glow)">
        <path d="${activePaths}" stroke="${glowColor}" stroke-width="6" opacity="0.4" />
        <path d="${activePaths}" stroke="${coreColor}" stroke-width="2.5" />
        <path d="${activePaths}" stroke="#ffcc00" stroke-width="0.5" opacity="0.8" />
      </g>
    </svg>
  `;
}

export const RuneGenerator = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
      {grid.map((state, i) => (<div key={i} style={{ margin: 'auto' }}>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: generateRuneSVG(state, { size: 20, glowColor: '#700', coreColor: '#ff3300' }) 
          }} 
        />
        <div>{getStateStr(state)}</div>
      </div>
      ))}
    </div>
  );
};
