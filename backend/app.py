from flask import Flask, request, jsonify
from flask_cors import CORS
from database import conectar, criar_tabelas

app = Flask(__name__)
CORS(app)  # permite que o frontend converse com o backend

# Cria as tabelas ao iniciar o app
criar_tabelas()

# ==================== RECEITAS ====================

@app.route("/receitas", methods=["GET"])
def listar_receitas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM receitas ORDER BY data DESC")
    receitas = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(receitas)

@app.route("/receitas", methods=["POST"])
def adicionar_receita():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO receitas (data, fonte, valor, observacao)
        VALUES (?, ?, ?, ?)
    """, (dados["data"], dados["fonte"], dados["valor"], dados.get("observacao", "")))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Receita adicionada com sucesso!"}), 201

@app.route("/receitas/<int:id>", methods=["DELETE"])
def deletar_receita(id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM receitas WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Receita removida!"})

# ==================== GASTOS ====================

@app.route("/gastos", methods=["GET"])
def listar_gastos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM gastos ORDER BY data DESC")
    gastos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(gastos)

@app.route("/gastos", methods=["POST"])
def adicionar_gasto():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO gastos (data, categoria, descricao, valor, forma_pagamento, tipo)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        dados["data"], dados["categoria"], dados["descricao"],
        dados["valor"], dados.get("forma_pagamento", ""), dados.get("tipo", "Variável")
    ))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Gasto adicionado com sucesso!"}), 201

@app.route("/gastos/<int:id>", methods=["DELETE"])
def deletar_gasto(id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM gastos WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Gasto removido!"})

# ==================== CARTÃO ====================

@app.route("/cartao", methods=["GET"])
def listar_cartao():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cartao ORDER BY data DESC")
    itens = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(itens)

@app.route("/cartao", methods=["POST"])
def adicionar_cartao():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO cartao (data, descricao, parcela, valor_total, valor_parcela, vencimento)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        dados["data"], dados["descricao"], dados.get("parcela", ""),
        dados["valor_total"], dados["valor_parcela"], dados.get("vencimento", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Lançamento de cartão adicionado!"}), 201

# ==================== INVESTIMENTOS ====================

@app.route("/investimentos", methods=["GET"])
def listar_investimentos():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investimentos ORDER BY data DESC")
    itens = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(itens)

@app.route("/investimentos", methods=["POST"])
def adicionar_investimento():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO investimentos (data, tipo, valor, instituicao, rentabilidade)
        VALUES (?, ?, ?, ?, ?)
    """, (
        dados["data"], dados["tipo"], dados["valor"],
        dados.get("instituicao", ""), dados.get("rentabilidade", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Investimento adicionado!"}), 201

# ==================== METAS ====================

@app.route("/metas", methods=["GET"])
def listar_metas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM metas")
    metas = [dict(row) for row in cursor.fetchall()]
    # Calcula o percentual concluído
    for m in metas:
        if m["valor_objetivo"] > 0:
            m["percentual"] = round((m["valor_atual"] / m["valor_objetivo"]) * 100, 1)
        else:
            m["percentual"] = 0
    conn.close()
    return jsonify(metas)

@app.route("/metas", methods=["POST"])
def adicionar_meta():
    dados = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO metas (meta, valor_objetivo, valor_atual, prazo)
        VALUES (?, ?, ?, ?)
    """, (
        dados["meta"], dados["valor_objetivo"],
        dados.get("valor_atual", 0), dados.get("prazo", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Meta adicionada!"}), 201

# ==================== DASHBOARD ====================

@app.route("/dashboard", methods=["GET"])
def dashboard():
    mes = request.args.get("mes", "")  # ex: "2026-05"
    conn = conectar()
    cursor = conn.cursor()

    # Filtro por mês
    filtro = f"{mes}%" if mes else "%"

    cursor.execute("SELECT COALESCE(SUM(valor), 0) FROM receitas WHERE data LIKE ?", (filtro,))
    total_receitas = cursor.fetchone()[0]

    cursor.execute("SELECT COALESCE(SUM(valor), 0) FROM gastos WHERE data LIKE ?", (filtro,))
    total_gastos = cursor.fetchone()[0]

    cursor.execute("SELECT COALESCE(SUM(valor), 0) FROM investimentos WHERE data LIKE ?", (filtro,))
    total_investimentos = cursor.fetchone()[0]

    # Gastos por categoria
    cursor.execute("""
        SELECT categoria, SUM(valor) as total
        FROM gastos
        WHERE data LIKE ?
        GROUP BY categoria
        ORDER BY total DESC
    """, (filtro,))
    por_categoria = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify({
        "receitas": total_receitas,
        "gastos": total_gastos,
        "investimentos": total_investimentos,
        "saldo": total_receitas - total_gastos - total_investimentos,
        "por_categoria": por_categoria
    })

# Inicia o servidor
if __name__ == "__main__":
    app.run(debug=True)
