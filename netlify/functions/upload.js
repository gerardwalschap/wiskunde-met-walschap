exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const token = process.env.DROPBOX_TOKEN;
  if (!token) return { statusCode: 500, body: JSON.stringify({ error: 'Token niet ingesteld' }) };

  try {
    const { path, fileBase64, fileName } = JSON.parse(event.body);
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({ path, mode: 'overwrite', autorename: false })
      },
      body: fileBuffer
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, path: result.path_lower, name: result.name })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
