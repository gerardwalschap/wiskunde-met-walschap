exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const token = process.env.DROPBOX_TOKEN;
  if (!token) return { statusCode: 500, body: JSON.stringify({ error: 'Token niet ingesteld' }) };

  try {
    const { path } = JSON.parse(event.body);

    const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path, recursive: false })
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ entries: result.entries || [] })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
