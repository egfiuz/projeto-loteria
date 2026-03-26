from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import sqlite3
import jwt
import bcrypt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÕES DE SEGURANÇA E BANCO DE DADOS ---
app.config['SECRET_KEY'] = 'super_senha_secreta_eliene_ceo_2026'

def iniciar_banco():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            geracoes_hoje INTEGER DEFAULT 0,
            data_ultima_geracao TEXT
        )
    ''')
    conn.commit()
    conn.close()

iniciar_banco()

# --- O SEGURANÇA VIP (DECORADOR) ---
def token_obrigatorio(f):
    @wraps(f)
    def decorado(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'erro': 'Acesso negado! Faça login para gerar jogos.'}), 401
        
        try:
            dados = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            usuario_id = dados['id']
        except:
            return jsonify({'erro': 'Crachá inválido ou vencido! Faça login novamente.'}), 401
            
        return f(usuario_id, *args, **kwargs)
    return decorado


# --- ROTA: STATUS DO SERVIDOR ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online",
        "mensagem": "Super Loterias API com Inteligência de Dados operando, CEO!"
    })


# --- O CÉREBRO 3.0: CIÊNCIA DE DADOS APLICADA ---
def validar_jogo_inteligente(numeros, qtd, max_val):
    pares = sum(1 for n in numeros if n % 2 == 0)
    impares = qtd - pares
    if qtd == 6: 
        if pares < 2 or impares < 2: return False
    elif qtd == 15: 
        if pares < 6 or impares < 6: return False
    elif qtd == 50: 
        if pares < 20 or impares < 20: return False
    elif qtd == 5: 
        if pares < 1 or impares < 1: return False
    else: 
        lim_min = int(qtd * 0.3)
        if pares < lim_min or impares < lim_min: return False

    consecutivos = 1
    max_consecutivos = 1
    for i in range(1, len(numeros)):
        if numeros[i] == numeros[i-1] + 1:
            consecutivos += 1
            if consecutivos > max_consecutivos:
                max_consecutivos = consecutivos
        else:
            consecutivos = 1
            
    if max_consecutivos > 3: 
        return False

    soma = sum(numeros)
    if qtd == 6 and max_val == 60: 
        if soma < 120 or soma > 240: return False
    elif qtd == 15 and max_val == 25: 
        if soma < 170 or soma > 225: return False

    return True


# --- ROTA: GERAR JOGO COM TRAVA FREEMIUM ---
@app.route('/api/gerar', methods=['GET'])
@token_obrigatorio
def gerar_jogo(usuario_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    hoje = datetime.date.today().isoformat()
    
    cursor.execute('SELECT geracoes_hoje, data_ultima_geracao FROM usuarios WHERE id = ?', (usuario_id,))
    usuario = cursor.fetchone()
    
    geracoes_hoje = usuario[0]
    data_ultima_geracao = usuario[1]
    
    if data_ultima_geracao != hoje:
        geracoes_hoje = 0
        
    if geracoes_hoje >= 3:
        conn.close()
        return jsonify({"erro": "Limite atingido! Você já gerou seus 3 jogos de hoje. Volte amanhã!"}), 403
        
    cursor.execute('''
        UPDATE usuarios 
        SET geracoes_hoje = ?, data_ultima_geracao = ? 
        WHERE id = ?
    ''', (geracoes_hoje + 1, hoje, usuario_id))
    conn.commit()
    conn.close()

    qtd = int(request.args.get('qtd', 6))
    max_val = int(request.args.get('max', 60))
    
    tentativas = 0
    while True:
        tentativas += 1
        numeros = random.sample(range(1, max_val + 1), qtd)
        numeros.sort()
        
        if validar_jogo_inteligente(numeros, qtd, max_val):
            soma_total = sum(numeros)
            print(f"✅ Usuário {usuario_id} gerou jogo ({geracoes_hoje + 1}/3)! Força Bruta: {tentativas} simulações.")
            break 
            
    return jsonify({
        "numeros": numeros,
        "restantes": 3 - (geracoes_hoje + 1)
    })


# --- ROTA: CADASTRO DE CLIENTE ---
@app.route('/registrar', methods=['POST'])
def registrar():
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    senha_pura = dados.get('senha')

    if not nome or not email or not senha_pura:
        return jsonify({"erro": "Preencha todos os campos!"}), 400

    senha_criptografada = bcrypt.hashpw(senha_pura.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        ''', (nome, email, senha_criptografada))
        conn.commit()
        conn.close()
        return jsonify({"mensagem": "Cliente cadastrado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Este e-mail já está cadastrado no sistema."}), 400


# --- ROTA: LOGIN DO CLIENTE ---
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha_pura = dados.get('senha')

    if not email or not senha_pura:
        return jsonify({"erro": "Preencha e-mail e senha!"}), 400

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, nome, senha FROM usuarios WHERE email = ?', (email,))
    usuario = cursor.fetchone()
    conn.close()

    if usuario and bcrypt.checkpw(senha_pura.encode('utf-8'), usuario[2]):
        token = jwt.encode({
            'id': usuario[0],
            'nome': usuario[1],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "mensagem": "Login aprovado!", 
            "token": token,
            "nome": usuario[1]
        }), 200
    else:
        return jsonify({"erro": "E-mail ou senha incorretos."}), 401


if __name__ == '__main__':
    app.run(debug=True, port=5000)