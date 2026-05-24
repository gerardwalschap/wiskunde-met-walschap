exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { path, fileBase64, fileName, mimeType } = body;

    const { blobs } = await import('@netlify/blobs');
    const store = blobs.getStore('bestanden');
    
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    await store.set(path, fileBuffer);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, path })
    };
  } catch (e) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: e.message, stack: e.stack }) 
    };
  }
};
