import requests
from collections import Counter

def analisar_tendencias(loteria="megasena", qtd_concursos=10):
    url = f"https://loteriascaixa-api.herokuapp.com/api/{loteria}"
    
    try:
        print(f"Buscando os últimos {qtd_concursos} concursos de {loteria}...")
        response = requests.get(url)
        
        if response.status_code == 200:
            todos_resultados = response.json()
            # Pegamos apenas os últimos N concursos
            ultimos = todos_resultados[-qtd_concursos:]
            
            todas_dezenas = []
            for concurso in ultimos:
                # Transformamos as dezenas em inteiros para facilitar o cálculo
                todas_dezenas.extend([int(d) for d in concurso['dezenas']])
            
            # Contagem de frequência (O coração da estratégia "Quentes")
            contagem = Counter(todas_dezenas)
            
            # 10 Números mais frequentes (Quentes 🔥)
            quentes = [num for num, freq in contagem.most_common(10)]
            
            # 10 Números menos frequentes (Frios ❄️)
            todos_numeros = set(range(1, 61 if loteria == "megasena" else 26))
            frios = sorted(list(todos_numeros - set(quentes)))[:10]

            print(f"\n🔥 Números Quentes (Mais sorteados): {quentes}")
            print(f"❄️ Números Frios (Menos sorteados): {frios}")
            
            return {"quentes": quentes, "frios": frios}
            
    except Exception as e:
        print(f"Erro na análise: {e}")

if __name__ == "__main__":
    analisar_tendencias("megasena", 20)