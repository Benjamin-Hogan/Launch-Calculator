function App() {
  const [inputs, setInputs] = React.useState({
    r1: '', r2: '', r3: '',
    v1: '', v2: '', v3: '',
    a: '', e: '',
    mu: 398600.4418
  });
  const [results, setResults] = React.useState(null);

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
    for (let i=0;i<=360;i++) {
      const t = i * Math.PI / 180;
      const r = a * (1 - e*e) / (1 + e*Math.cos(t));
      x.push(r * Math.cos(t));
      y.push(r * Math.sin(t));
    }
    Plotly.newPlot('plot', [{x,y,mode:'lines',name:'Orbit'}], {
      title: 'Orbit in orbital plane',
      xaxis: {scaleanchor:'y'},
      yaxis: {}
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AstroCalc</h1>
      <div className="grid grid-cols-3 gap-2">
        {['r1','r2','r3'].map((f,i)=>(
          <input key={f} name={f} placeholder={'r'+(i+1)} value={inputs[f]} onChange={handleChange} className="border p-2" />
        ))}
        {['v1','v2','v3'].map((f,i)=>(
          <input key={f} name={f} placeholder={'v'+(i+1)} value={inputs[f]} onChange={handleChange} className="border p-2" />
        ))}
        <input name="a" placeholder="a" value={inputs.a} onChange={handleChange} className="border p-2" />
        <input name="e" placeholder="e" value={inputs.e} onChange={handleChange} className="border p-2" />
        <input name="mu" placeholder="mu" value={inputs.mu} onChange={handleChange} className="border p-2 col-span-3" />
      </div>
      <button onClick={submit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Calculate</button>
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div id="plot" className="mb-4" style={{height:'300px'}}></div>
          <table className="table-auto w-full"><tbody>
            {Object.entries(results).map(([k,v])=> (
              <tr key={k}><td className="border px-2 py-1 font-medium">{k}</td><td className="border px-2 py-1">{Array.isArray(v)?v.join(', '):v}</td></tr>
            ))}
          </tbody></table>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
