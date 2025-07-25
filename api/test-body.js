module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('=== TEST BODY DEBUG ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body raw:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'null');
  
  // Tentar diferentes formas de parse
  let parsedBody = {};
  
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body);
        console.log('Parse JSON string OK');
      } catch (e) {
        console.log('Erro parse JSON string:', e.message);
      }
    } else if (typeof req.body === 'object') {
      parsedBody = req.body;
      console.log('Body já é objeto');
    }
  }
  
  console.log('Body parsed:', parsedBody);
  
  res.status(200).json({
    success: true,
    debug: {
      method: req.method,
      bodyType: typeof req.body,
      bodyRaw: req.body,
      bodyParsed: parsedBody,
      headers: req.headers
    }
  });
} 