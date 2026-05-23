exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const token = process.env.DROPBOX_TOKEN;
  if (!token) return { statusCode: 500, body: JSON.stringify({ error: 'Token niet ingesteld' }) };

  try {
    const { path, fileBase64, fileName } = JSON.parse(event.body);
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    // Voor App Folder: pad mag niet beginnen met /Apps/... 
    // Dropbox App Folder gebruikt het pad relatief aan de app folder
    const cleanPath = path.startsWith('/') ? path : '/' + path;

    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({ 
          path: cleanPath, 
          mode: 'overwrite', 
          autorename: false,
          mute: true
        })
      },
      body: fileBuffer
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: responseText }) };
    }

    const result = JSON.parse(responseText);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, path: result.path_lower, name: result.name })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
