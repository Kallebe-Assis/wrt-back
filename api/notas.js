const admin = require('firebase-admin');

// Inicializar Firebase se não estiver inicializado
if (!admin.apps.length) {
  const serviceAccount = require('../wrtmin-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // GET - Buscar notas
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId obrigatório' 
        });
      }
      
      const notasQuery = await db.collection('notas').where('userId', '==', userId).get();
      const notas = [];
      
      notasQuery.forEach(doc => {
        notas.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      res.json({
        success: true,
        notas
      });
    }
    
    // POST - Criar nota
    else if (req.method === 'POST') {
      const { titulo, conteudo, userId } = req.body;
      
      if (!titulo || !conteudo || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Título, conteúdo e userId obrigatórios' 
        });
      }
      
      const docRef = await db.collection('notas').add({
        titulo,
        conteudo,
        userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      });
      
      res.status(201).json({
        success: true,
        nota: {
          id: docRef.id,
          titulo,
          conteudo,
          userId
        },
        message: 'Nota criada com sucesso'
      });
    }
    
    // PUT - Atualizar nota
    else if (req.method === 'PUT') {
      const { id } = req.query;
      const { titulo, conteudo } = req.body;
      
      if (!id || !titulo || !conteudo) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID, título e conteúdo obrigatórios' 
        });
      }
      
      await db.collection('notas').doc(id).update({
        titulo,
        conteudo,
        dataModificacao: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Nota atualizada com sucesso'
      });
    }
    
    // DELETE - Deletar nota
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      await db.collection('notas').doc(id).delete();
      
      res.json({
        success: true,
        message: 'Nota deletada com sucesso'
      });
    }
    
    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro nas notas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 