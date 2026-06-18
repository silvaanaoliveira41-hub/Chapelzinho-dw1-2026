const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // CORS - Verificação de origem

// Configuração da conexão com o PostgreSQL / pgAdmin
const pool = new Pool({
    user: 'postgres',           // Seu usuário padrão do Postgres
    host: 'localhost',
    database: 'dw1-db-2026',   // Nome do banco de dados criado no pgAdmin
    password: 'postgres',   // SUA SENHA DO PGADMIN AQUI
    port: 3000,            // Porta padrão do Postgres (ou 3001 se configurou diferente)
});

// ROTA CENTRALIZADA: Chamada pelo seu HTML
app.post('/api/mensagens', async (req, res) => {
    const { mensaje, mensagem } = req.body;
    
    // Aceita tanto 'mensagem' quanto 'mensaje' para evitar problemas
    const textoBilhete = mensagem || mensaje;

    if (!textoBilhete) {
        return res.status(400).json({
            status: "erro",
            mensagem: "Não envie bilhetes em branco!"
        });
    }

    // Tratamento de mensagens
    switch (textoBilhete.toLowerCase().trim()) {
        
        // NOVO BILHETE SOLICITADO: 'bolo'
        case 'bolo':
            try {
                // Busca todos os produtos para listar o estoque atual
                const resultado = await pool.query('SELECT nome_produto, quantidade_produto FROM produto ORDER BY id_produto');
                const produtos = resultado.rows;

                let respostaEstoque = "Quantidades atuais na Dispensa Básica (DB):\n";
                
                // Monta o texto listando cada item e sua quantidade
                produtos.forEach(prod => {
                    respostaEstoque += `• ${prod.nome_produto}: ${prod.quantidade_produto} unidades em estoque\n`;
                });

                return res.json({
                    status: "sucesso",
                    mensagem: respostaEstoque
                });

            } catch (err) {
                console.error("Erro no Banco de Dados:", err);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao tentar consultar as quantidades no pgAdmin."
                });
            }

        // --- OUTROS BILHETES ---
        case 'vovó':
        case 'vovo':
            return res.json({
                status: "sucesso",
                mensagem: "Oi, em que posso ajudar?"
            });

        case 'chegou':
            return res.json({
                status: "sucesso",
                mensagem: "A Chapeuzinho chegou aqui com o bilhete."
            });

        case 'situacao':
        case 'situação':
            try {
                const resultado = await pool.query('SELECT * FROM produto ORDER BY id_produto');
                const produtos = resultado.rows;
                
                let respostaTexto = "Relatório da Dispensa Básica (DB):\n";
                let precisaRepor = false;

                produtos.forEach(prod => {
                    if (prod.quantidade_produto < prod.quantidade_minima_produto) {
                        precisaRepor = true;
                        const quantidadeNecessaria = prod.quantidade_maxima_produto - prod.quantidade_produto;
                        respostaTexto += `• ${prod.nome_produto}: Estoque baixo (${prod.quantidade_produto}). Precisamos de mais ${quantidadeNecessaria} unidades!\n`;
                    }
                });

                if (!precisaRepor) {
                    respostaTexto += "Tudo limpo! Nenhum produto precisa ser reposto por enquanto.";
                }

                return res.json({
                    status: "sucesso",
                    mensagem: respostaTexto
                });

            } catch (err) {
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao tentar abrir a porta da Dispensa Básica (DB)."
                });
            }

        case 'voupreparareenviar':
            return res.json({
                status: "sucesso",
                mensagem: "pedidoRecebido"
            });

        // Resposta padrão caso não conheça o comando
        default:
            return res.json({
                status: "sucesso",
                mensagem: "Mensagem não entendida."
            });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Vovó ativo em http://localhost:${PORT}`);
});