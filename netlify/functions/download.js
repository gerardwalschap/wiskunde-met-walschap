exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { path, fileName } = JSON.parse(event.body);

    const response = await fetch(
      `https://uawwrtqznncylnbwmajt.supabase.co/storage/v1/object/bestanden/${encodeURIComponent(path)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd3dydHF6bm5jeWxuYndtYWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Nzk1MTEsImV4cCI6MjA5NTE1NTUxMX0.9e_LPfgV_RXHGUpCylpwJBn7VSyOARnn0wvmWk0KuFA`
        }
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err }) };
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      },
      body: base64,
      isBase64Encoded: true
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
