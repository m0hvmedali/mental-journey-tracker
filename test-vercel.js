import handler from './api/index.ts';
async function test() {
  const req = { method: 'GET', url: '/api/health' };
  const res = { 
    on: (evt, cb) => {
       if (evt === 'finish') setTimeout(cb, 100);
    },
    status: (code) => { console.log('status', code); return res; },
    json: (data) => { console.log('json', data); res.on('finish', ()=>{}); return res; },
    end: () => console.log('end'),
    setHeader: () => {}
  };
  await handler(req, res);
}
test();
