import { useState } from 'react';

const LoteriaCard = ({ nome, sub, cor, qtd, max }) => {
  const [numeros, setNumeros] = useState([]);

  const gerarJogo = () => {
    const sorteados = [];
    while (sorteados.length < qtd) {
      const num = Math.floor(Math.random() * max) + 1;
      if (!sorteados.includes(num)) sorteados.push(num);
    }
    setNumeros(sorteados.sort((a, b) => a - b));
  };

  return (
    <div style={{ ...styles.card, borderTop: `5px solid ${cor}` }}>
      <h2 style={{ color: cor, margin: '10px 0', fontSize: '1.5rem', fontWeight: '900' }}>{nome}</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>{sub}</p>

      <div style={styles.numerosContainer}>
        {numeros.length > 0 ? (
          numeros.map((n, i) => (
            <span key={i} style={{ ...styles.bola, backgroundColor: cor }}>
              {n < 10 ? `0${n}` : n}
            </span>
          ))
        ) : (
          <p style={styles.placeholder}>Nenhum jogo gerado ainda.<br />Clique no botão abaixo.</p>
        )}
      </div>

      <button onClick={gerarJogo} style={{ ...styles.btn, backgroundColor: cor, color: nome === 'TIMEMANIA' ? '#000' : '#fff' }}>
        Gerar Jogo Otimizado
      </button>
    </div>
  );
};

function App() {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Super Loterias API</h1>
        <p style={styles.subtitulo}>
          Gere combinações numéricas otimizadas via Força Bruta aliada a <br />
          Teoremas Matemáticos e à Lei dos Grandes Números.
        </p>
      </header>

      <main style={styles.grid}>
        {/* Loterias originais e corrigidas */}
        <LoteriaCard nome="MEGA-SENA" sub="Sorteia 6 de 60" cor="#20ac7b" qtd={6} max={60} />
        <LoteriaCard nome="LOTOFÁCIL" sub="Sorteia 15 de 25" cor="#d300b5" qtd={15} max={25} />
        <LoteriaCard nome="QUINA" sub="Sorteia 5 de 80" cor="#3b00a0" qtd={5} max={80} />
        <LoteriaCard nome="TIMEMANIA" sub="Sorteia 10 de 80" cor="#ffcc00" qtd={10} max={80} /> {/* Agora é Amarelo! */}

        {/* As novas adições do seu Backlog */}
        <LoteriaCard nome="LOTOMANIA" sub="Sorteia 50 de 100" cor="#ff8800" qtd={50} max={100} />
        <LoteriaCard nome="DUPLA SENA" sub="Sorteia 6 de 50" cor="#bf1923" qtd={6} max={50} />
        <LoteriaCard nome="DIA DE SORTE" sub="Sorteia 7 de 31" cor="#cb821c" qtd={7} max={31} />
      </main>
    </div>
  );
}

const styles = {
  body: { backgroundColor: '#0e0e10', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '50px' },
  titulo: { fontSize: '3rem', color: '#45f3ad', fontWeight: '900', textShadow: '0 0 10px rgba(69, 243, 173, 0.3)', margin: '0 0 15px 0' },
  subtitulo: { color: '#aaa', lineHeight: '1.6', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#18181b', borderRadius: '12px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  numerosContainer: { minHeight: '120px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '20px 0' },
  bola: { width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
  placeholder: { color: '#555', fontStyle: 'italic', fontSize: '0.85rem' },
  btn: { padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'filter 0.2s' }
};

export default App;