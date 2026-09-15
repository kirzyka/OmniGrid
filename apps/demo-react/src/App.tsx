
import { OmniGrid } from '@omnigrid/react';
import '@omnigrid/style/index.css';

export function App() {

   const data = [
       {a: "011", b: "012", c: "013"},
       {a: "021", b: "022", c: "023"},
       {a: "031", b: "032", c: "033"},
   ] 

  return (
    <main className="demo-page">
      <h1>OmniGrid Demo</h1>
      <OmniGrid
        columns={[
          { id: 'a', field: 'a', header: 'A', width: 180 },
          { id: 'b', field: 'b', header: 'B', width: 180 },
          { id: 'c', field: 'c', header: 'C', width: 180 },
        ]}
        data={data}
        style={{ height: 240, width: '100%' }}
      />
    </main>
  );
}