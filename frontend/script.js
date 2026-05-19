const API = "http://localhost:5000";

// ========================
// NAVEGAÇÃO ENTRE SEÇÕES
// ========================
function mostrarSecao(id) {
    document.querySelectorAll(".secao").forEach(s => s.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    // Carrega os dados da seção ao abrir
    if (id === "dashboard") carregarDashboard();
    if (id === "receitas") carregarReceitas();
    if (id === "gastos") carregarGastos();
    if (id === "cartao") carregarCartao();
    if (id === "investimentos") carregarInvestimentos();
    if (id === "metas") carregarMetas();
}

// ========================
// FORMATAÇÃO DE MOEDA
// ========================
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

// ========================
// DASHBOARD
// ========================
async function carregarDashboard() {
    const mes = document.getElementById("filtroMes").value;
    const url = mes ? `${API}/dashboard?mes=${mes}` : `${API}/dashboard`;

    const res = await fetch(url);
    const dados = await res.json();

    document.getElementById("dash-receitas").textContent = formatarMoeda(dados.receitas);
    document.getElementById("dash-gastos").textContent = formatarMoeda(dados.gastos);
    document.getElementById("dash-investimentos").textContent = formatarMoeda(dados.investimentos);
    document.getElementById("dash-saldo").textContent = formatarMoeda(dados.saldo);

    const tbody = document.getElementById("tabela-categorias");
    tbody.innerHTML = "";

    if (dados.por_categoria.length === 0) {
        tbody.innerHTML = "<tr><td colspan='2'>Nenhum gasto registrado.</td></tr>";
        return;
    }

    dados.por_categoria.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.categoria}</td>
                <td>${formatarMoeda(item.total)}</td>
            </tr>
        `;
    });
}

// ========================
// RECEITAS
// ========================
async function carregarReceitas() {
    const res = await fetch(`${API}/receitas`);
    const dados = await res.json();
    const tbody = document.getElementById("tabela-receitas");
    tbody.innerHTML = "";

    if (dados.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Nenhuma receita registrada.</td></tr>";
        return;
    }

    dados.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.data}</td>
                <td>${r.fonte}</td>
                <td>${formatarMoeda(r.valor)}</td>
                <td>${r.observacao || "-"}</td>
                <td>
                    <button class="btn-excluir" onclick="excluirReceita(${r.id})">🗑 Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function salvarReceita(e) {
    e.preventDefault();
    const body = {
        data: document.getElementById("r-data").value,
        fonte: document.getElementById("r-fonte").value,
        valor: parseFloat(document.getElementById("r-valor").value),
        observacao: document.getElementById("r-obs").value
    };

    await fetch(`${API}/receitas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    document.getElementById("form-receita").reset();
    carregarReceitas();
    alert("Receita adicionada com sucesso!");
}

async function excluirReceita(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await fetch(`${API}/receitas/${id}`, { method: "DELETE" });
    carregarReceitas();
}

// ========================
// GASTOS
// ========================
async function carregarGastos() {
    const res = await fetch(`${API}/gastos`);
    const dados = await res.json();
    const tbody = document.getElementById("tabela-gastos");
    tbody.innerHTML = "";

    if (dados.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7'>Nenhum gasto registrado.</td></tr>";
        return;
    }

    dados.forEach(g => {
        tbody.innerHTML += `
            <tr>
                <td>${g.data}</td>
                <td>${g.categoria}</td>
                <td>${g.descricao}</td>
                <td>${formatarMoeda(g.valor)}</td>
                <td>${g.forma_pagamento || "-"}</td>
                <td>${g.tipo || "-"}</td>
                <td>
                    <button class="btn-excluir" onclick="excluirGasto(${g.id})">🗑 Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function salvarGasto(e) {
    e.preventDefault();
    const body = {
        data: document.getElementById("g-data").value,
        categoria: document.getElementById("g-categoria").value,
        descricao: document.getElementById("g-desc").value,
        valor: parseFloat(document.getElementById("g-valor").value),
        forma_pagamento: document.getElementById("g-forma").value,
        tipo: document.getElementById("g-tipo").value
    };

    await fetch(`${API}/gastos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    document.getElementById("form-gasto").reset();
    carregarGastos();
    alert("Gasto adicionado com sucesso!");
}

async function excluirGasto(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await fetch(`${API}/gastos/${id}`, { method: "DELETE" });
    carregarGastos();
}

// ========================
// CARTÃO
// ========================
async function carregarCartao() {
    const res = await fetch(`${API}/cartao`);
    const dados = await res.json();
    const tbody = document.getElementById("tabela-cartao");
    tbody.innerHTML = "";

    if (dados.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Nenhum lançamento registrado.</td></tr>";
        return;
    }

    dados.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.data}</td>
                <td>${c.descricao}</td>
                <td>${c.parcela || "-"}</td>
                <td>${formatarMoeda(c.valor_total)}</td>
                <td>${formatarMoeda(c.valor_parcela)}</td>
                <td>${c.vencimento || "-"}</td>
            </tr>
        `;
    });
}

async function salvarCartao(e) {
    e.preventDefault();
    const body = {
        data: document.getElementById("c-data").value,
        descricao: document.getElementById("c-desc").value,
        parcela: document.getElementById("c-parcela").value,
        valor_total: parseFloat(document.getElementById("c-total").value),
        valor_parcela: parseFloat(document.getElementById("c-parcela-valor").value),
        vencimento: document.getElementById("c-venc").value
    };

    await fetch(`${API}/cartao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    document.getElementById("form-cartao").reset();
    carregarCartao();
    alert("Lançamento adicionado!");
}

// ========================
// INVESTIMENTOS
// ========================
async function carregarInvestimentos() {
    const res = await fetch(`${API}/investimentos`);
    const dados = await res.json();
    const tbody = document.getElementById("tabela-investimentos");
    tbody.innerHTML = "";

    if (dados.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Nenhum investimento registrado.</td></tr>";
        return;
    }

    dados.forEach(i => {
        tbody.innerHTML += `
            <tr>
                <td>${i.data}</td>
                <td>${i.tipo}</td>
                <td>${formatarMoeda(i.valor)}</td>
                <td>${i.instituicao || "-"}</td>
                <td>${i.rentabilidade || "-"}</td>
            </tr>
        `;
    });
}

async function salvarInvestimento(e) {
    e.preventDefault();
    const body = {
        data: document.getElementById("i-data").value,
        tipo: document.getElementById("i-tipo").value,
        valor: parseFloat(document.getElementById("i-valor").value),
        instituicao: document.getElementById("i-inst").value,
        rentabilidade: document.getElementById("i-rent").value
    };

    await fetch(`${API}/investimentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    document.getElementById("form-invest").reset();
    carregarInvestimentos();
    alert("Investimento adicionado!");
}

// ========================
// METAS
// ========================
async function carregarMetas() {
    const res = await fetch(`${API}/metas`);
    const dados = await res.json();
    const lista = document.getElementById("lista-metas");
    lista.innerHTML = "";

    if (dados.length === 0) {
        lista.innerHTML = "<p>Nenhuma meta cadastrada ainda.</p>";
        return;
    }

    dados.forEach(m => {
        const perc = Math.min(m.percentual, 100);
        lista.innerHTML += `
            <div class="meta-card">
                <h4>🎯 ${m.meta}</h4>
                <p>Objetivo: ${formatarMoeda(m.valor_objetivo)}</p>
                <p>Atual: ${formatarMoeda(m.valor_atual)}</p>
                <p>Prazo: ${m.prazo || "Não definido"}</p>
                <p><strong>${perc}% concluída</strong></p>
                <div class="barra-progresso">
                    <div class="barra-progresso-fill" style="width: ${perc}%"></div>
                </div>
            </div>
        `;
    });
}

async function salvarMeta(e) {
    e.preventDefault();
    const body = {
        meta: document.getElementById("m-meta").value,
        valor_objetivo: parseFloat(document.getElementById("m-obj").value),
        valor_atual: parseFloat(document.getElementById("m-atual").value) || 0,
        prazo: document.getElementById("m-prazo").value
    };

    await fetch(`${API}/metas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    document.getElementById("form-meta").reset();
    carregarMetas();
    alert("Meta adicionada!");
}

// Carrega o dashboard ao abrir a página
carregarDashboard();
