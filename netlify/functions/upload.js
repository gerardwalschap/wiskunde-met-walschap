const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { path, fileBase64, fileName, mimeType } = JSON.parse(event.body);
    const store = getStore('bestanden');
    
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    await store.set(path, fileBuffer, { metadata: { fileName, mimeType, uploadedAt: new Date().toISOString() } });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, path })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
