exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { path, fileBase64, fileName, mimeType } = JSON.parse(event.body);
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    const response = await fetch(
      `https://uawwrtqznncylnbwmajt.supabase.co/storage/v1/object/bestanden/${encodeURIComponent(path)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd3dydHF6bm5jeWxuYndtYWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Nzk1MTEsImV4cCI6MjA5NTE1NTUxMX0.9e_LPfgV_RXHGUpCylpwJBn7VSyOARnn0wvmWk0KuFA`,
          'Content-Type': mimeType || 'application/octet-stream',
          'x-upsert': 'true'
        },
        body: fileBuffer
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err }) };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, path })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
