const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = 5000;
const cors = require('cors');
require('dotenv').config(); // Para carregar variáveis de ambiente do .env
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "minhaChaveSecreta"; // Use uma chave forte no .env


app.use(cors({
    origin: 'http://127.0.0.1:5500', // Permite requisições do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json()); // Para permitir JSON no body

// Simulação de armazenamento de equipes (sem banco de dados)
const equipes = [];

// Rota POST para adicionar uma equipe
app.post('/equipes', (req, res) => {
    const { nome, cidade } = req.body;
    if (!nome || !cidade) {
        return res.status(400).json({ error: 'Nome e cidade são obrigatórios' });
    }

    const novaEquipe = { nome, cidade };
    equipes.push(novaEquipe);

    res.status(201).json(novaEquipe);
});

// Rota POST para adicionar um membro ao clube no banco de dados (Prisma)
app.post('/membros', async (req, res) => {
    try {
        const { Nome, Funcao } = req.body;

        if (!Nome || !Funcao) {
            return res.status(400).json({ error: 'Nome e função são obrigatórios' });
        }

        const novoMembro = await prisma.membros_Clube.create({
            data: {
                Nome,
                Funcao,
            },
        });

        res.status(201).json(novoMembro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar membro' });
    }
});

app.get('/', (req, res) => {
    res.send('API do Ilustre Caminha está a funcionar!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/membros', async (req, res) => {
    try {
        const membros = await prisma.membros_Clube.findMany();
        res.json(membros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar membros' });
    }
});

app.post('/jogadores', async (req, res) => {
    try {
        const { Nome } = req.body;

        if (!Nome) {
            return res.status(400).json({ error: 'O nome do jogador é obrigatório' });
        }

        const novoJogador = await prisma.jogadores.create({
            data: { Nome },
        });

        res.status(201).json(novoJogador);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar jogador' });
    }
});

app.get('/jogadores', async (req, res) => {
    try {
        const jogadores = await prisma.jogadores.findMany();
        res.json(jogadores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar jogadores' });
    }
});

app.post('/noticias', async (req, res) => {
    try {
        const { Titulo, Conteudo } = req.body;

        if (!Titulo || !Conteudo) {
            return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
        }

        const novaNoticia = await prisma.noticias.create({
            data: {
                Titulo,
                Conteudo,
            },
        });

        res.status(201).json(novaNoticia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar notícia' });
    }
});

app.get('/noticias', async (req, res) => {
    try {
        const noticias = await prisma.noticias.findMany();
        res.json(noticias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar notícias' });
    }
});


app.post('/utilizadores', async (req, res) => {
    try {
        const { Nome, Email, Senha_Hash, Nivel_Acesso } = req.body;

        if (!Nome || !Email || !Senha_Hash || !Nivel_Acesso) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Criar utilizador no banco de dados com Prisma
        const novoUtilizador = await prisma.utilizadores.create({
            data: {
                Nome,
                Email,
                Senha_Hash, // ⚠️ De preferência, armazene a senha criptografada!
                Nivel_Acesso
            }
        });

        res.status(201).json(novoUtilizador);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar utilizador' });
    }
});


app.post('/auth/login', async (req, res) => {
    try {
        const { Email, Senha_Hash } = req.body;

        if (!Email || !Senha_Hash) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
        }

        // Verificar se o utilizador existe
        const utilizador = await prisma.utilizadores.findUnique({
            where: { Email }
        });

        if (!utilizador) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        // Comparar a senha armazenada com a senha enviada
        const senhaValida = await bcrypt.compare(Senha_Hash, utilizador.Senha_Hash);
        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { Utilizador_ID: utilizador.Utilizador_ID, Nivel_Acesso: utilizador.Nivel_Acesso },
            SECRET_KEY,
            { expiresIn: "1h" } // Token válido por 1 hora
        );

        res.json({ token, user: { Nome: utilizador.Nome, Email: utilizador.Email, Nivel_Acesso: utilizador.Nivel_Acesso } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

app.post('/estatisticas', async (req, res) => {
    try {
        const { Jogadores_ID, Carreira, Nome, Pe_Preferencial, Data_Nascimento, Local_Nascimento, Posicao } = req.body;

        if (!Jogadores_ID) {
            return res.status(400).json({ error: 'O ID do jogador é obrigatório' });
        }

        // Criar estatísticas no banco de dados com Prisma
        const novaEstatistica = await prisma.estatisticas_Jogadores.create({
            data: {
                Jogadores_ID,
                Carreira,
                Nome,
                Pe_Preferencial,
                Data_Nascimento: Data_Nascimento ? new Date(Data_Nascimento) : null,
                Local_Nascimento,
                Posicao
            }
        });

        res.status(201).json(novaEstatistica);
    } catch (error) {
        console.error("Erro ao criar estatísticas:", error);
        res.status(500).json({ error: 'Erro ao criar estatísticas', details: error.message });
    }
});

app.get('/estatisticas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const estatisticas = await prisma.estatisticas_Jogadores.findMany({
            where: { Jogadores_ID: parseInt(id) }
        });

        if (!estatisticas || estatisticas.length === 0) {
            return res.status(404).json({ error: "Nenhuma estatística encontrada para esse jogador" });
        }

        res.json(estatisticas);
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ error: "Erro ao buscar estatísticas", details: error.message });
    }
});

app.post('/classificacao', async (req, res) => {
    try {
        const { Nome } = req.body;

        if (!Nome) {
            return res.status(400).json({ error: "O nome do time é obrigatório" });
        }

        // Criar classificação no banco de dados com Prisma
        const novaClassificacao = await prisma.tabela_classificacao.create({
            data: { Nome }
        });

        res.status(201).json(novaClassificacao);
    } catch (error) {
        console.error("Erro ao criar classificação:", error);
        res.status(500).json({ error: "Erro ao criar classificação", details: error.message });
    }
});

app.get('/classificacao', async (req, res) => {
    try {
        const classificacoes = await prisma.tabela_classificacao.findMany();
        
        if (classificacoes.length === 0) {
            return res.status(404).json({ error: "Nenhuma classificação encontrada" });
        }

        res.json(classificacoes);
    } catch (error) {
        console.error("Erro ao buscar classificações:", error);
        res.status(500).json({ error: "Erro ao buscar classificações", details: error.message });
    }
});

