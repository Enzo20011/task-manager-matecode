const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Get token from firebase-tools config
const credPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
const ACCESS_TOKEN = creds.tokens.access_token;
const PROJECT_ID = 'task-manager-matecode';

function request(hostname, urlPath, method, body) {
  const bodyStr = body ? JSON.stringify(body) : '';
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      path: urlPath,
      method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`${method} ${urlPath} -> ${res.statusCode}`);
        try { console.log(JSON.stringify(JSON.parse(data), null, 2).slice(0, 600)); } 
        catch { console.log(data.slice(0, 600)); }
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  // Get current authorized domains
  console.log('\n=== Getting current authorized domains ===');
  const res = await request(
    'identitytoolkit.googleapis.com',
    `/v1/projects/${PROJECT_ID}/config`,
    'GET',
    null
  );

  let config;
  try { config = JSON.parse(res.body); } catch { config = {}; }
  
  const currentDomains = config.authorizedDomains || [];
  console.log('Current domains:', currentDomains);

  // Add Vercel domain
  const newDomains = [...new Set([
    ...currentDomains,
    'task-manager-matecode.vercel.app',
    'localhost'
  ])];

  console.log('\n=== Adding Vercel domain ===');
  await request(
    'identitytoolkit.googleapis.com',
    `/v1/projects/${PROJECT_ID}/config?updateMask=authorizedDomains`,
    'PATCH',
    { authorizedDomains: newDomains }
  );
}

main().catch(console.error);
