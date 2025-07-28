const admin = require('firebase-admin');

class NotaFirebase {
  constructor() {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    this.db = admin.firestore();
    this.collection = 'notas';
  }

  // Garantir que a coleção existe
  async ensureCollection() {
    try {
      const docRef = this.db.collection(this.collection).doc('temp');
      await docRef.set({ exists: true, timestamp: new Date() });
      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Erro ao verificar/criar coleção de notas:', error.message);
      return false;
    }
  }

  // Buscar todas as notas de um usuário
  async buscarTodasPorUsuario(userId, filtros = {}) {
    try {
      console.log('🔥 Firebase - Iniciando busca de notas para usuário:', userId);
      console.log('🔍 Firebase - Filtros aplicados:', filtros);
      
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId);

      // Aplicar filtro de ativo apenas se especificado
      if (filtros.ativo !== undefined) {
        query = query.where('ativo', '==', filtros.ativo);
        console.log('🔍 Firebase - Filtro ativo aplicado:', filtros.ativo);
      }

      // Aplicar filtros
      if (filtros.topico) {
        query = query.where('topico', '==', filtros.topico);
        console.log('🔍 Firebase - Filtro tópico aplicado:', filtros.topico);
      }
      // if (filtros.favorito !== undefined) {
      //   query = query.where('favorito', '==', filtros.favorito);
      //   console.log('🔍 Firebase - Filtro favorito aplicado:', filtros.favorito);
      // }
      if (filtros.fixado !== undefined) {
        query = query.where('fixado', '==', filtros.fixado);
        console.log('🔍 Firebase - Filtro fixado aplicado:', filtros.fixado);
      }

      console.log('🔥 Firebase - Executando query no Firestore...');
      const snapshot = await query.get();
      console.log('✅ Firebase - Query executada com sucesso');
      console.log('📊 Firebase - Total de documentos encontrados:', snapshot.size);
      
      const notas = [];
      snapshot.forEach(doc => {
        const nota = {
          id: doc.id,
          ...doc.data()
        };
        notas.push(nota);
        console.log('📝 Firebase - Nota encontrada:', { id: doc.id, titulo: nota.titulo });
      });

      console.log('📊 Firebase - Total de notas processadas:', notas.length);

      // Ordenar: primeiro fixadas, depois por ordenação, depois por data de criação
      const notasOrdenadas = notas.sort((a, b) => {
        // Primeiro: fixadas no topo
        if (a.fixado && !b.fixado) return -1;
        if (!a.fixado && b.fixado) return 1;
        
        // Segundo: por ordenação (menor número primeiro)
        if (a.ordenacao !== b.ordenacao) {
          return (a.ordenacao || 0) - (b.ordenacao || 0);
        }
        
        // Terceiro: por data de criação (mais recente primeiro)
        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      });
      
      console.log('✅ Firebase - Busca concluída. Notas retornadas:', notasOrdenadas.length);
      return notasOrdenadas;
    } catch (error) {
      console.error('❌ Firebase - Erro ao buscar notas do usuário:', error.message);
      console.error('❌ Firebase - Stack trace:', error.stack);
      return [];
    }
  }

  // Buscar nota por ID (apenas do usuário)
  async buscarPorId(id, userId, incluirDeletadas = false) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (doc.exists) {
        const nota = {
          id: doc.id,
          ...doc.data()
        };
        
        // Verificar se a nota pertence ao usuário
        if (nota.userId === userId && (incluirDeletadas || nota.ativo)) {
          return nota;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar nota por ID:', error.message);
      return null;
    }
  }

  // Criar nova nota
  async criar(dados) {
    try {
      console.log('🔥 Firebase - Iniciando criação de nota');
      console.log('📝 NotaFirebase.criar - Dados recebidos:', dados);
      
      const docRef = this.db.collection(this.collection).doc();
      console.log('📝 NotaFirebase.criar - ID gerado:', docRef.id);
      
      const notaCompleta = {
        ...dados,
        id: docRef.id,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        ativo: true,
        // favorito: false, // DESABILITADO
        fixado: false,
        ordenacao: 0
      };
      
      console.log('📝 NotaFirebase.criar - Dados completos para salvar:', notaCompleta);
      
      await docRef.set(notaCompleta);
      console.log('✅ Firebase - Nota criada com sucesso no Firestore');
      
      // Verificar se foi realmente salva
      const docSalvo = await docRef.get();
      if (docSalvo.exists) {
        console.log('✅ Firebase - Confirmação: Nota existe no Firestore');
        console.log('📊 Firebase - Dados salvos:', docSalvo.data());
        return {
          id: docSalvo.id,
          ...docSalvo.data()
        };
      } else {
        console.error('❌ Firebase - Erro: Nota não foi salva corretamente');
        throw new Error('Falha ao salvar nota no Firebase');
      }
    } catch (error) {
      console.error('❌ NotaFirebase.criar - Erro:', error.message);
      throw error;
    }
  }

  // Atualizar nota
  async atualizar(id, dados, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId);
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      const docRef = this.db.collection(this.collection).doc(id);
      const dadosAtualizados = {
        ...dados,
        dataModificacao: new Date().toISOString()
      };
      
      await docRef.update(dadosAtualizados);
      return { id, ...dadosAtualizados };
    } catch (error) {
      console.error('Erro ao atualizar nota:', error.message);
      throw error;
    }
  }

  // Excluir nota (soft delete)
  async excluir(id, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId, true); // Incluir deletadas
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota:', error.message);
      throw error;
    }
  }

  // Excluir nota definitivamente (hard delete)
  async excluirDefinitivamente(id, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId, true); // Incluir deletadas
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      // Excluir o documento permanentemente
      await this.db.collection(this.collection).doc(id).delete();
      console.log('🗑️ Firebase - Nota excluída definitivamente do Firestore');
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota definitivamente:', error.message);
      throw error;
    }
  }

  // Restaurar nota
  async restaurar(id, userId) {
    try {
      // Verificar se a nota pertence ao usuário
      const notaExistente = await this.buscarPorId(id, userId, true); // Incluir deletadas
      if (!notaExistente) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      await this.db.collection(this.collection).doc(id).update({
        ativo: true,
        dataModificacao: new Date().toISOString()
      });
      
      return { ...notaExistente, ativo: true };
    } catch (error) {
      console.error('Erro ao restaurar nota:', error.message);
      throw error;
    }
  }

  // Buscar tópicos de um usuário
  async buscarTopicos(userId) {
    try {
      const snapshot = await this.db.collection(this.collection)
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .get();
      
      const topicos = new Set();
      snapshot.forEach(doc => {
        const nota = doc.data();
        if (nota.topico) {
          topicos.add(nota.topico);
        }
      });
      
      return Array.from(topicos).sort();
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error.message);
      return [];
    }
  }

  // Contar notas de um usuário
  async contarPorUsuario(userId, filtros = {}) {
    try {
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId);

      // Aplicar filtro de ativo apenas se especificado
      if (filtros.ativo !== undefined) {
        query = query.where('ativo', '==', filtros.ativo);
      }

      if (filtros.topico) {
        query = query.where('topico', '==', filtros.topico);
      }
      // if (filtros.favorito !== undefined) {
      //   query = query.where('favorito', '==', filtros.favorito);
      // }
      if (filtros.fixado !== undefined) {
        query = query.where('fixado', '==', filtros.fixado);
      }

      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar notas:', error.message);
      return 0;
    }
  }

  // Alternar favorito (DESABILITADO)
  // async alternarFavorito(id, userId) {
  //   try {
  //     const nota = await this.buscarPorId(id, userId);
  //     if (!nota) {
  //       throw new Error('Nota não encontrada ou não autorizada');
  //     }

  //     const novoFavorito = !nota.favorito;
  //     await this.db.collection(this.collection).doc(id).update({
  //       favorito: novoFavorito,
  //       dataModificacao: new Date().toISOString()
  //     });

  //     return { ...nota, favorito: novoFavorito };
  //   } catch (error) {
  //     console.error('Erro ao alternar favorito:', error.message);
  //     throw error;
  //   }
  // }

  // Alternar fixado
  async alternarFixado(id, userId) {
    try {
      const nota = await this.buscarPorId(id, userId);
      if (!nota) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      const novoFixado = !nota.fixado;
      await this.db.collection(this.collection).doc(id).update({
        fixado: novoFixado,
        dataModificacao: new Date().toISOString()
      });

      return { ...nota, fixado: novoFixado };
    } catch (error) {
      console.error('Erro ao alternar fixado:', error.message);
      throw error;
    }
  }

  // Atualizar ordenação
  async atualizarOrdenacao(id, userId, novaOrdenacao) {
    try {
      const nota = await this.buscarPorId(id, userId);
      if (!nota) {
        throw new Error('Nota não encontrada ou não autorizada');
      }

      await this.db.collection(this.collection).doc(id).update({
        ordenacao: novaOrdenacao,
        dataModificacao: new Date().toISOString()
      });

      return { ...nota, ordenacao: novaOrdenacao };
    } catch (error) {
      console.error('Erro ao atualizar ordenação:', error.message);
      throw error;
    }
  }

  // Atualizar múltiplas ordenações
  async atualizarMultiplasOrdenacoes(ordenacoes, userId) {
    try {
      const batch = this.db.batch();
      
      for (const { id, ordenacao } of ordenacoes) {
        // Verificar se a nota pertence ao usuário
        const nota = await this.buscarPorId(id, userId);
        if (!nota) {
          throw new Error(`Nota ${id} não encontrada ou não autorizada`);
        }

        const docRef = this.db.collection(this.collection).doc(id);
        batch.update(docRef, { 
          ordenacao, 
          dataModificacao: new Date().toISOString() 
        });
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar múltiplas ordenações:', error.message);
      throw error;
    }
  }

  // Buscar notas favoritas (DESABILITADO)
  // async buscarFavoritas(userId) {
  //   return this.buscarTodasPorUsuario(userId, { favorito: true });
  // }

  // Buscar notas fixadas
  async buscarFixadas(userId) {
    return this.buscarTodasPorUsuario(userId, { fixado: true });
  }
}

module.exports = NotaFirebase; 