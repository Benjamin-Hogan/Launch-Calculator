function App() {
  const [inputs, setInputs] = React.useState({
    r1: '', r2: '', r3: '',
    v1: '', v2: '', v3: '',
    a: '', e: '',
    mu: 398600.4418
  });
  const [results, setResults] = React.useState(null);

  const placeholders = {
    r1: 'r₁ (km)',
    r2: 'r₂ (km)',
    r3: 'r₃ (km)',
    v1: 'v₁ (km/s)',
    v2: 'v₂ (km/s)',
    v3: 'v₃ (km/s)',
    a: 'a (km)',
    e: 'e',
    mu: 'μ (km³/s²)'
  };

  const display = {
    semi_major_axis: {label: 'a', unit: 'km'},
    eccentricity: {label: 'e', unit: ''},
    periapsis: {label: 'q', unit: 'km'},
    apoapsis: {label: 'Q', unit: 'km'},
    period: {label: 'T', unit: 's'},
    mean_motion: {label: 'n', unit: 'rad/s'},
    inclination: {label: 'i', unit: '\u00b0', convert: v => v * 180 / Math.PI},
    raan: {label: '\\Omega', unit: '\u00b0', convert: v => v * 180 / Math.PI},
    argument_of_periapsis: {label: '\\omega', unit: '\u00b0', convert: v => v * 180 / Math.PI},
    true_anomaly: {label: '\\nu', unit: '\u00b0', convert: v => v * 180 / Math.PI}
  };

  React.useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [results]);

  const handleChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value});
  };

  const submit = async () => {
    const payload = { mu: parseFloat(inputs.mu) };
    const r = [inputs.r1, inputs.r2, inputs.r3].map(Number);
    if (r.some(n => !isNaN(n))) payload.r = r;
    const v = [inputs.v1, inputs.v2, inputs.v3].map(Number);
    if (v.some(n => !isNaN(n))) payload.v = v;
    if (inputs.a) payload.a = parseFloat(inputs.a);
    if (inputs.e) payload.e = parseFloat(inputs.e);
    try {
      const res = await axios.post('/calculate', payload);
      setResults(res.data.results);
      drawOrbit(res.data.results);
      drawOrbit3D(res.data.results);
    } catch(err) {
      alert('Calculation failed');
    }
  };

  const drawOrbit = (data) => {
    if (!data.semi_major_axis || data.eccentricity >= 1) {
      Plotly.purge('plot');
      return;
    }
    const a = data.semi_major_axis;
    const e = data.eccentricity;
    const x = [];
    const y = [];
    for (let i = 0; i <= 360; i++) {
      const t = i * Math.PI / 180;
      const r = a * (1 - e * e) / (1 + e * Math.cos(t));
      x.push(r * Math.cos(t));
      y.push(r * Math.sin(t));
    }
    Plotly.newPlot(
      'plot',
      [{ x, y, mode: 'lines', name: 'Orbit' }],
      {
        title: 'Orbit in orbital plane',
        xaxis: { scaleanchor: 'y', color: '#eee' },
        yaxis: { color: '#eee' },
        plot_bgcolor: '#111',
        paper_bgcolor: '#111',
        font: { color: '#eee' }
      }
    );
  };

  const drawOrbit3D = (data) => {
    if (!data.semi_major_axis || data.eccentricity >= 1) {
      Plotly.purge('plot3d');
      return;
    }
    const a = data.semi_major_axis;
    const e = data.eccentricity;
    const inc = data.inclination || 0;
    const raan = data.raan || 0;
    const argp = data.argument_of_periapsis || 0;

    const cosO = Math.cos(raan), sinO = Math.sin(raan);
    const cosi = Math.cos(inc), sini = Math.sin(inc);
    const cosw = Math.cos(argp), sinw = Math.sin(argp);

    const R11 = cosO * cosw - sinO * sinw * cosi;
    const R12 = -cosO * sinw - sinO * cosw * cosi;
    const R21 = sinO * cosw + cosO * sinw * cosi;
    const R22 = -sinO * sinw + cosO * cosw * cosi;
    const R31 = sinw * sini;
    const R32 = cosw * sini;

    const x = [], y = [], z = [];
    for (let i = 0; i <= 360; i++) {
      const t = i * Math.PI / 180;
      const r = a * (1 - e * e) / (1 + e * Math.cos(t));
      const xp = r * Math.cos(t);
      const yp = r * Math.sin(t);
      x.push(R11 * xp + R12 * yp);
      y.push(R21 * xp + R22 * yp);
      z.push(R31 * xp + R32 * yp);
    }
    Plotly.newPlot(
      'plot3d',
      [{ x, y, z, mode: 'lines', type: 'scatter3d', name: 'Orbit' }],
      {
        title: 'Orbit in 3D',
        scene: {
          xaxis: { title: 'X', color: '#eee', backgroundcolor: '#000' },
          yaxis: { title: 'Y', color: '#eee', backgroundcolor: '#000' },
          zaxis: { title: 'Z', color: '#eee', backgroundcolor: '#000' }
        },
        plot_bgcolor: '#111',
        paper_bgcolor: '#111',
        font: { color: '#eee' }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-100">
      <h1 className="text-2xl font-bold mb-4">AstroCalc</h1>
      <div className="grid grid-cols-3 gap-2">
        {['r1','r2','r3','v1','v2','v3','a','e','mu'].map(f => (
          <input
            key={f}
            name={f}
            placeholder={placeholders[f]}
            value={inputs[f]}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 p-2"
          />
        ))}
      </div>
      <button onClick={submit} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">
        Calculate
      </button>
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div id="plot" className="mb-4" style={{height:'300px'}}></div>
          <div id="plot3d" className="mb-4" style={{height:'400px'}}></div>
          <table className="table-auto w-full text-sm"><tbody>
            {Object.entries(results).map(([k,v]) => {
              const info = display[k] || {label: k, unit: ''};
              const val = Array.isArray(v) ? v.join(', ') : (info.convert ? info.convert(v) : v);
              return (
                <tr key={k}>
                  <td className="border border-gray-700 px-2 py-1 font-medium" dangerouslySetInnerHTML={{__html: '$'+info.label+'$'}}></td>
                  <td className="border border-gray-700 px-2 py-1">{val}{info.unit?` ${info.unit}`:''}</td>
                </tr>
              );
            })}
          </tbody></table>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
