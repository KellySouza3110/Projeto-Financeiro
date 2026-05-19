import sqlite3

def conectar():
    conn = sqlite3.connect("financeiro.db")
    conn.row_factory = sqlite3.Row  # retorna resultados como dicionário
    return conn

def criar_tabelas():
    conn = conectar()
    cursor = conn.cursor()

    # Tabela de Receitas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS receitas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            fonte TEXT NOT NULL,
            valor REAL NOT NULL,
            observacao TEXT
        )
    """)

    # Tabela de Gastos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            categoria TEXT NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            forma_pagamento TEXT,
            tipo TEXT
        )
    """)

    # Tabela de Cartão
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cartao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            descricao TEXT NOT NULL,
            parcela TEXT,
            valor_total REAL NOT NULL,
            valor_parcela REAL NOT NULL,
            vencimento TEXT
        )
    """)

    # Tabela de Investimentos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS investimentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            tipo TEXT NOT NULL,
            valor REAL NOT NULL,
            instituicao TEXT,
            rentabilidade TEXT
        )
    """)

    # Tabela de Metas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meta TEXT NOT NULL,
            valor_objetivo REAL NOT NULL,
            valor_atual REAL DEFAULT 0,
            prazo TEXT
        )
    """)

    conn.commit()
    conn.close()
    print("Tabelas criadas com sucesso!")
