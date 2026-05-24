const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { path, fileName } = JSON.parse(event.body);
    const store = getStore('bestanden');
    
    const blob = await store.get(path, { type: 'arrayBuffer' });
    if (!blob) return { statusCode: 404, body: JSON.stringify({ error: 'Bestand niet gevonden' }) };

    const base64 = Buffer.from(blob).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`
      },
      body: base64,
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
