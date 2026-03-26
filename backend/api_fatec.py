from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# A MÁGICA DOS ACENTOS: Desliga o bloqueio americano e libera o Português (UTF-8)
app.json.ensure_ascii = False 

CORS(app)

# --- BANCO DE DADOS SIMULADO: FATEC TRILHÕES ---
fatec_academic_info = {
    "estudante": {
        "nome": "Eliene Gomes Fiuza",
        "curso": "Análise e Desenvolvimento de Sistemas com IA",
        "instituicao": "FATEC São Paulo",
        "duracao": "6 Semestres (3 Anos)",
        "periodo": "Noturno"
    },
    "quadro_tarefas": {
        "a_fazer": [
            {"titulo": "Lista de Estatística", "descricao": "Resolver 10 exercícios da faculdade", "status": "Pendente"},
            {"titulo": "TCC", "descricao": "Definição do escopo do projeto final", "status": "Futuro"},
            {"titulo": "Estágio Supervisionado", "descricao": "Buscar documentação e oportunidades", "status": "Futuro"}
        ],
        "em_progresso": [
            {"titulo": "Projeto Loterias Vercel", "descricao": "Finalizar QR Code do PIX e marketing", "disciplina": "Projetos"},
            {"titulo": "API FATEC Trilhões", "descricao": "Desenvolvendo o Model no Backend", "disciplina": "Engenharia de Software"}
        ],
        "concluido": [
            {"titulo": "Requisitos de Software", "descricao": "Atividade do aplicativo de Delivery", "nota": "0,25 ✅"},
            {"titulo": "Configuração index.html", "descricao": "Nome da CEO na aba do navegador", "status": "Concluído ✅"}
        ]
    },
    "curriculo_destaque": {
        "disciplinas_chave": ["IA Aplicada", "Cálculo", "Banco de Dados SQL", "Engenharia de Software", "Cybersegurança"],
        "projetos_portfolio": ["Super Loterias API (MVC/Flask)", "API FATEC Trilhões"]
    },
    "unidades_referencia_sp": [
        {"unidade": "FATEC São Paulo", "local": "Bom Retiro - Capital"},
        {"unidade": "FATEC Carapicuíba", "local": "Carapicuíba"},
        {"unidade": "FATEC São José dos Campos", "local": "SJC"},
        {"unidade": "FATEC Sorocaba", "local": "Sorocaba"}
    ]
}

# --- ROTA RAIZ DA API FATEC ---
@app.route('/', methods=['GET'])
def home_fatec():
    return jsonify({
        "status": "Online",
        "sistema": "API FATEC Trilhões V1 - Desenvolvido por Eliene Gomes",
        "mensagem": "A base de dados acadêmica e geográfica da FATEC está operando!"
    })

# --- ROTA: DADOS ACADÊMICOS (O MODEL) ---
@app.route('/api/academic', methods=['GET'])
def get_academic_data():
    return jsonify(fatec_academic_info)

if __name__ == '__main__':
    # Usando a porta 5001 para não dar conflito com a Loteria (que usa a 5000)
    app.run(debug=True, port=5001)