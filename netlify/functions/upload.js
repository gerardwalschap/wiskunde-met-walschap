exports.handler = async (event) => {
  console.log('Upload functie gestart');
  console.log('Method:', event.httpMethod);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Body lengte:', event.body ? event.body.length : 'geen body');
    
    const { getStore } = require('@netlify/blobs');
    const { path, fileBase64, fileName } = JSON.parse(event.body);
    
    console.log('Pad:', path);
    console.log('Bestandsnaam:', fileName);
    
    const store = getStore({ name: 'bestanden', siteID: process.env.SITE_ID, token: process.env.NETLIFY_BLOBS_CONTEXT });
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    await store.set(path, fileBuffer);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (e) {
    console.log('FOUT:', e.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: e.message })
    };
  }
};
