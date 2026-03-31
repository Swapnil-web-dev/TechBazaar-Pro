import { request } from 'https';

const options = {
  hostname: 'api.github.com',
  path: '/repos/Swapnil-web-dev/TechBazaar-Pro/deployments',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js'
  }
};

const req = request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const deployments = JSON.parse(data);
      if (deployments && deployments.length > 0) {
        console.log('Latest deployment URL:', deployments[0].payload.web_url || deployments[0].environment);
        deployments.forEach((d, i) => console.log(`Env ${i}:`, d.environment));
      } else {
        console.log('No deployments found or API limited.', deployments.message || '');
      }
    } catch (e) { console.log('Error parsing:', e); }
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
