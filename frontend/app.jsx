function OrbitCalc({goHome}) {
  const [inputs, setInputs] = React.useState({
    r1: '', r2: '', r3: '',
    v1: '', v2: '', v3: '',
    a: '', e: '',
    mu: 398600.4418
  });
  const [results, setResults] = React.useState(null);
  const [tab, setTab] = React.useState('visual');

  const placeholders = {
    r1: 'r₁ (km)', r2: 'r₂ (km)', r3: 'r₃ (km)',
    v1: 'v₁ (km/s)', v2: 'v₂ (km/s)', v3: 'v₃ (km/s)',
    a: 'a (km)', e: 'e', mu: 'μ (km³/s²)'
  };
  const display = {
    semi_major_axis: {label:'a',unit:'km'}, eccentricity:{label:'e',unit:''},
    periapsis:{label:'q',unit:'km'}, apoapsis:{label:'Q',unit:'km'},
    period:{label:'T',unit:'s'}, mean_motion:{label:'n',unit:'rad/s'},
    inclination:{label:'i',unit:'\u00b0',convert:v=>v*180/Math.PI},
    raan:{label:'\Omega',unit:'\u00b0',convert:v=>v*180/Math.PI},
    argument_of_periapsis:{label:'\omega',unit:'\u00b0',convert:v=>v*180/Math.PI},
    true_anomaly:{label:'\nu',unit:'\u00b0',convert:v=>v*180/Math.PI},
    r:{label:'\vec{r}',unit:'km'}, v:{label:'\vec{v}',unit:'km/s'},
    h_vec:{label:'\vec{h}',unit:'km^2/s'}, node_vec:{label:'\vec{N}',unit:'km^2/s'},
    eccentricity_vec:{label:'\vec{e}',unit:''}
  };

  React.useEffect(() => { if(window.MathJax) window.MathJax.typesetPromise(); }, [results, tab]);

  const handleChange = (e) => setInputs({...inputs,[e.target.name]:e.target.value});

  const submit = async () => {
    const payload = { mu: parseFloat(inputs.mu) };
    const r = [inputs.r1,inputs.r2,inputs.r3].map(Number);
    if(r.some(n => !isNaN(n))) payload.r = r;
    const v = [inputs.v1,inputs.v2,inputs.v3].map(Number);
    if(v.some(n => !isNaN(n))) payload.v = v;
    if(inputs.a) payload.a = parseFloat(inputs.a);
    if(inputs.e) payload.e = parseFloat(inputs.e);
    try {
      const res = await axios.post('/calculate', payload);
      setResults(res.data.results);
      drawOrbit(res.data.results);
      drawOrbit3D(res.data.results);
    } catch(err){ alert('Calculation failed'); }
  };

  const drawOrbit = (data) => {
    if(!data.semi_major_axis || data.eccentricity >= 1){ Plotly.purge('plot'); return; }
    const a=data.semi_major_axis,e=data.eccentricity;
    const x=[],y=[];
    for(let i=0;i<=360;i++){ const t=i*Math.PI/180; const r=a*(1-e*e)/(1+e*Math.cos(t)); x.push(r*Math.cos(t)); y.push(r*Math.sin(t)); }
    const traces=[{x,y,mode:'lines',name:'Orbit'}];
    if(data.r) traces.push({x:[0,data.r[0]],y:[0,data.r[1]],mode:'lines+markers',name:'r'});
    if(data.v&&data.r){ const scale=a*0.1; traces.push({x:[data.r[0],data.r[0]+data.v[0]*scale],y:[data.r[1],data.r[1]+data.v[1]*scale],mode:'lines+markers',name:'v'}); }
    Plotly.newPlot('plot',traces,{title:'Orbit in orbital plane',xaxis:{scaleanchor:'y',color:'#eee'},yaxis:{color:'#eee'},plot_bgcolor:'#111',paper_bgcolor:'#111',font:{color:'#eee'}});
  };

  const drawOrbit3D = (data) => {
    if(!data.semi_major_axis || data.eccentricity>=1){ Plotly.purge('plot3d'); return; }
    const EARTH_RADIUS=6378.137; const a=data.semi_major_axis,e=data.eccentricity; const inc=data.inclination||0; const raan=data.raan||0; const argp=data.argument_of_periapsis||0;
    const cosO=Math.cos(raan),sinO=Math.sin(raan); const cosi=Math.cos(inc),sini=Math.sin(inc); const cosw=Math.cos(argp),sinw=Math.sin(argp);
    const R11=cosO*cosw - sinO*sinw*cosi, R12=-cosO*sinw - sinO*cosw*cosi; const R21=sinO*cosw + cosO*sinw*cosi, R22=-sinO*sinw + cosO*cosw*cosi; const R31=sinw*sini, R32=cosw*sini;
    const x=[],y=[],z=[]; for(let i=0;i<=360;i++){ const t=i*Math.PI/180; const r=a*(1-e*e)/(1+e*Math.cos(t)); const xp=r*Math.cos(t), yp=r*Math.sin(t); x.push(R11*xp+R12*yp); y.push(R21*xp+R22*yp); z.push(R31*xp+R32*yp); }
    const latSteps=20, lonSteps=20, ex=[],ey=[],ez=[]; for(let i=0;i<=latSteps;i++){ const theta=i*Math.PI/latSteps; const rowX=[],rowY=[],rowZ=[]; for(let j=0;j<=lonSteps;j++){ const phi=j*2*Math.PI/lonSteps; rowX.push(EARTH_RADIUS*Math.sin(theta)*Math.cos(phi)); rowY.push(EARTH_RADIUS*Math.sin(theta)*Math.sin(phi)); rowZ.push(EARTH_RADIUS*Math.cos(theta)); } ex.push(rowX); ey.push(rowY); ez.push(rowZ); }
    const traces=[{x:ex,y:ey,z:ez,opacity:0.5,showscale:false,colorscale:'Blues',type:'surface',name:'Earth'},{x,y,z,mode:'lines',type:'scatter3d',name:'Orbit'}];
    if(data.r) traces.push({x:[0,data.r[0]],y:[0,data.r[1]],z:[0,data.r[2]],mode:'lines+markers',type:'scatter3d',name:'r'});
    if(data.v&&data.r){ const scale=a*0.1; traces.push({x:[data.r[0],data.r[0]+data.v[0]*scale],y:[data.r[1],data.r[1]+data.v[1]*scale],z:[data.r[2],data.r[2]+data.v[2]*scale],mode:'lines+markers',type:'scatter3d',name:'v'}); }
    Plotly.newPlot('plot3d',traces,{title:'Orbit in 3D',scene:{xaxis:{title:'X',color:'#eee',backgroundcolor:'#000'},yaxis:{title:'Y',color:'#eee',backgroundcolor:'#000'},zaxis:{title:'Z',color:'#eee',backgroundcolor:'#000'}},plot_bgcolor:'#111',paper_bgcolor:'#111',font:{color:'#eee'}});
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-100">
      <button onClick={goHome} className="mb-2 text-blue-400">&larr; Home</button>
      <h1 className="text-2xl font-bold mb-4">Orbit Elements</h1>
      <div className="grid grid-cols-3 gap-2">
        {['r1','r2','r3','v1','v2','v3','a','e','mu'].map(f => (
          <input key={f} name={f} placeholder={placeholders[f]} value={inputs[f]} onChange={handleChange} className="border border-gray-700 bg-gray-800 p-2" />
        ))}
      </div>
      <button onClick={submit} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Calculate</button>
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div className="flex space-x-2 mb-4">
            <button onClick={()=>setTab('visual')} className={tab==='visual'?'bg-blue-600 text-white px-3 py-1 rounded':'bg-gray-700 px-3 py-1 rounded'}>Visuals</button>
            <button onClick={()=>setTab('table')} className={tab==='table'?'bg-blue-600 text-white px-3 py-1 rounded':'bg-gray-700 px-3 py-1 rounded'}>Table</button>
          </div>
          {tab==='visual' && (<>
            <div id="plot" className="mb-4" style={{height:'300px'}}></div>
            <div id="plot3d" className="mb-4" style={{height:'400px'}}></div>
            <p className="text-sm">Visualization showing radius and velocity vectors.</p>
          </>)}
          {tab==='table' && (
            <table className="table-auto w-full text-sm"><tbody>
              {Object.entries(results).map(([k,v]) => {
                const info = display[k] || {label:k,unit:''};
                let val = Array.isArray(v)? v.map(n=>Number(n).toFixed(3)).join(', ') : (info.convert?info.convert(v):v);
                const valHtml = Array.isArray(v) ? `\\left[${val}\\right]` : val;
                return (
                  <tr key={k}>
                    <td className="border border-gray-700 px-2 py-1 font-medium" dangerouslySetInnerHTML={{__html:`\\(${info.label}\\)`}}></td>
                    <td className="border border-gray-700 px-2 py-1" dangerouslySetInnerHTML={{__html:Array.isArray(v)?`\\(${valHtml}\\)${info.unit?`\\,${info.unit}`:''}`:`${valHtml}${info.unit?` ${info.unit}`:''}`}}></td>
                  </tr>
                );
              })}
            </tbody></table>
          )}
        </div>
      )}
    </div>
  );
}

function HohmannCalc({goHome}) {
  const [r1,setR1] = React.useState('');
  const [r2,setR2] = React.useState('');
  const [mu,setMu] = React.useState(398600.4418);
  const [res,setRes] = React.useState(null);

  React.useEffect(() => { if(window.MathJax) window.MathJax.typesetPromise(); }, [res]);

  const submit = async () => {
    try {
      const payload={r1:parseFloat(r1),r2:parseFloat(r2),mu:parseFloat(mu)};
      const resp=await axios.post('/hohmann',payload);
      setRes(resp.data);
      draw(resp.data);
    } catch(e){ alert('Calculation failed'); }
  };

  const draw = (data) => {
    const r1v=parseFloat(r1), r2v=parseFloat(r2);
    if(!r1v || !r2v){ Plotly.purge('hohmann'); return; }
    const a=(r1v+r2v)/2; const e=(r2v-r1v)/(r1v+r2v);
    const circ=(r)=>{const x=[],y=[]; for(let i=0;i<=360;i++){const t=i*Math.PI/180; x.push(r*Math.cos(t)); y.push(r*Math.sin(t)); } return {x,y};};
    const t1=circ(r1v), t2=circ(r2v);
    const xe=[], ye=[]; for(let i=0;i<=180;i++){ const t=i*Math.PI/180; const r=a*(1-e*e)/(1+e*Math.cos(t)); xe.push(r*Math.cos(t)); ye.push(r*Math.sin(t)); }
    Plotly.newPlot('hohmann',[
      {...t1,mode:'lines',name:'Initial'},
      {...t2,mode:'lines',name:'Final'},
      {x:xe,y:ye,mode:'lines',name:'Transfer'}],
      {title:'Hohmann Transfer',xaxis:{scaleanchor:'y',color:'#eee'},yaxis:{color:'#eee'},plot_bgcolor:'#111',paper_bgcolor:'#111',font:{color:'#eee'}});
  };

  return (
    <div className="max-w-md mx-auto text-gray-100">
      <button onClick={goHome} className="mb-2 text-blue-400">&larr; Home</button>
      <h1 className="text-2xl font-bold mb-4">Hohmann Transfer</h1>
      <div className="grid grid-cols-3 gap-2">
        <input placeholder="r₁ (km)" value={r1} onChange={e=>setR1(e.target.value)} className="border border-gray-700 bg-gray-800 p-2" />
        <input placeholder="r₂ (km)" value={r2} onChange={e=>setR2(e.target.value)} className="border border-gray-700 bg-gray-800 p-2" />
        <input placeholder="μ (km³/s²)" value={mu} onChange={e=>setMu(e.target.value)} className="border border-gray-700 bg-gray-800 p-2" />
      </div>
      <button onClick={submit} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Calculate</button>
      {res && (
        <div className="mt-4">
          <div id="hohmann" className="mb-4" style={{height:'300px'}}></div>
          <table className="table-auto w-full text-sm"><tbody>
            <tr><td className="border px-2 py-1">ΔV₁</td><td className="border px-2 py-1">{res.delta_v1.toFixed(3)} km/s</td></tr>
            <tr><td className="border px-2 py-1">ΔV₂</td><td className="border px-2 py-1">{res.delta_v2.toFixed(3)} km/s</td></tr>
            <tr><td className="border px-2 py-1">Total ΔV</td><td className="border px-2 py-1">{res.total_delta_v.toFixed(3)} km/s</td></tr>
            <tr><td className="border px-2 py-1">Transfer time</td><td className="border px-2 py-1">{res.transfer_time.toFixed(1)} s</td></tr>
          </tbody></table>
        </div>
      )}
    </div>
  );
}

function Menu({setPage}){
  return (
    <div className="max-w-md mx-auto text-gray-100">
      <h1 className="text-2xl font-bold mb-4">AstroCalc</h1>
      <div className="space-y-2">
        <button onClick={()=>setPage('orbit')} className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Orbit Elements</button>
        <button onClick={()=>setPage('hohmann')} className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Hohmann Transfer</button>
      </div>
    </div>
  );
}

function App(){
  const [page,setPage] = React.useState('menu');
  if(page==='orbit') return <OrbitCalc goHome={()=>setPage('menu')}/>;
  if(page==='hohmann') return <HohmannCalc goHome={()=>setPage('menu')}/>;
  return <Menu setPage={setPage}/>;
}

ReactDOM.render(<App />, document.getElementById('root'));
