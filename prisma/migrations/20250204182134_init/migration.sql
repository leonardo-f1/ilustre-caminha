-- CreateTable
CREATE TABLE "Membros_Clube" (
    "Membros_ID" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Funcao" TEXT NOT NULL,
    "Foto" BYTEA,

    CONSTRAINT "Membros_Clube_pkey" PRIMARY KEY ("Membros_ID")
);

-- CreateTable
CREATE TABLE "Jogadores" (
    "Jogadores_ID" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Foto" BYTEA,

    CONSTRAINT "Jogadores_pkey" PRIMARY KEY ("Jogadores_ID")
);

-- CreateTable
CREATE TABLE "Estatisticas_Jogadores" (
    "Estatisticas_ID" SERIAL NOT NULL,
    "Jogadores_ID" INTEGER NOT NULL,
    "Carreira" TEXT,
    "Nome" TEXT,
    "Pe_Preferencial" TEXT,
    "Data_Nascimento" TIMESTAMP(3),
    "Local_Nascimento" TEXT,
    "Foto" BYTEA,
    "Posicao" TEXT,

    CONSTRAINT "Estatisticas_Jogadores_pkey" PRIMARY KEY ("Estatisticas_ID")
);

-- CreateTable
CREATE TABLE "Noticias" (
    "Noticias_ID" SERIAL NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Conteudo" TEXT NOT NULL,
    "Imagem" BYTEA,

    CONSTRAINT "Noticias_pkey" PRIMARY KEY ("Noticias_ID")
);

-- CreateTable
CREATE TABLE "Utilizadores" (
    "Utilizador_ID" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Senha_Hash" TEXT NOT NULL,
    "Nivel_Acesso" TEXT NOT NULL,

    CONSTRAINT "Utilizadores_pkey" PRIMARY KEY ("Utilizador_ID")
);

-- CreateTable
CREATE TABLE "Galeria" (
    "Galeria_ID" SERIAL NOT NULL,
    "Fotos" BYTEA,

    CONSTRAINT "Galeria_pkey" PRIMARY KEY ("Galeria_ID")
);

-- CreateTable
CREATE TABLE "Tabela_classificacao" (
    "Classificacao_ID" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Imagem" BYTEA,

    CONSTRAINT "Tabela_classificacao_pkey" PRIMARY KEY ("Classificacao_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilizadores_Email_key" ON "Utilizadores"("Email");

-- AddForeignKey
ALTER TABLE "Estatisticas_Jogadores" ADD CONSTRAINT "Estatisticas_Jogadores_Jogadores_ID_fkey" FOREIGN KEY ("Jogadores_ID") REFERENCES "Jogadores"("Jogadores_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
