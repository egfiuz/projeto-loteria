from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online",
        "mensagem": "Super Loterias API com Inteligência de Dados V3 operando, CEO!"
    })

# --- O CÉREBRO 3.0: CIÊNCIA DE DADOS APLICADA ---
def validar_jogo_inteligente(numeros, qtd, max_val):
    # 1. REGRA DE PARES E ÍMPARES
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

    # 2. REGRA DOS CONSECUTIVOS (Evitar escadinhas como 12, 13, 14, 15)
    consecutivos = 1
    max_consecutivos = 1
    for i in range(1, len(numeros)):
        if numeros[i] == numeros[i-1] + 1:
            consecutivos += 1
            if consecutivos > max_consecutivos:
                max_consecutivos = consecutivos
        else:
            consecutivos = 1
            
    if max_consecutivos > 3: # Se tiver 4 ou mais números colados, reprova!
        return False

    # 3. REGRA DA SOMA TOTAL (A Curva de Gauss)
    soma = sum(numeros)
    if qtd == 6 and max_val == 60: # Mega-Sena
        if soma < 120 or soma > 240: return False
    elif qtd == 15 and max_val == 25: # Lotofácil
        if soma < 170 or soma > 225: return False

    # Se passou por todos os testes, o jogo é de altíssimo nível!
    return True

# --- ROTA UNIVERSAL ---
@app.route('/api/gerar', methods=['GET'])
def gerar_jogo():
    qtd = int(request.args.get('qtd', 6))
    max_val = int(request.args.get('max', 60))
    
    tentativas = 0
    while True:
        tentativas += 1
        numeros = random.sample(range(1, max_val + 1), qtd)
        numeros.sort()
        
        # Agora passamos qtd e max_val para a inteligência saber qual a loteria
        if validar_jogo_inteligente(numeros, qtd, max_val):
            soma_total = sum(numeros)
            print(f"✅ Jogo de {qtd} números aprovado! Força Bruta: {tentativas} simulações. (Soma: {soma_total})")
            break 
            
    return jsonify({
        "numeros": numeros
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)