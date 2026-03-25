import { useState } from 'react';

// --- COMPONENTE: NAVBAR ---
const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <span style={styles.logoIcon}>🍀</span>
        <span style={styles.logoText}>SuperLoterias API</span>
      </div>
      <div style={styles.navLinks}>
        <a href="#inicio" style={styles.link}>Início</a>
        <a href="#teoremas" style={styles.link}>A Ciência</a>
        <a href="#contato" style={styles.link}>Contato</a>
      </div>
    </nav>
  );
};

// --- COMPONENTE: CARD DE LOTERIA ---
const LoteriaCard = ({ nome, sub, cor, qtd, max }) => {
  const [numeros, setNumeros] = useState([]);

  const gerarJogo = async () => {
    try {
      const resposta = await fetch(`http://127.0.0.1:5000/api/gerar?qtd=${qtd}&max=${max}`);
      const dados = await resposta.json();
      setNumeros(dados.numeros);
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
      alert("Aviso de Sistema: O Cérebro Python está desligado! Verifique o terminal, CEO.");
    }
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

// --- COMPONENTE: FOOTER (RODAPÉ) ---
const Footer = () => {
  return (
    <footer id="contato" style={styles.footer}>
      <div style={styles.footerContent}>
        <h3 style={styles.footerTitle}>Super Loterias API</h3>
        <p style={styles.footerText}>
          Desenvolvido com 💻 por <strong>Eliene Fiuza</strong> | Engenharia de Software Aplicada
        </p>
        <p style={styles.footerTech}>
          🛠️ Tecnologias Aplicadas: React, Vite, Node.js & Python (Backend API com IA Estatística)
        </p>
        <div style={styles.contatoContainer}>
          <p style={styles.footerContato}>📧 Contato direto com a CEO:</p>
          <a href="mailto:egfiuza@gmail.com" style={styles.emailBtn}>egfiuza@gmail.com</a>
        </div>
      </div>
    </footer>
  );
};

// --- COMPONENTE PRINCIPAL: APP ---
function App() {
  return (
    <div style={styles.body}>
      <Navbar />

      <header id="inicio" style={styles.header}>
        <h1 style={styles.titulo}>Super Loterias API</h1>
        <p style={styles.subtitulo}>
          Gere combinações numéricas otimizadas via Força Bruta aliada a <br />
          Filtros Estatísticos de Alta Performance.
        </p>
      </header>

      <main style={styles.grid}>
        <LoteriaCard nome="MEGA-SENA" sub="Sorteia 6 de 60" cor="#20ac7b" qtd={6} max={60} />
        <LoteriaCard nome="LOTOFÁCIL" sub="Sorteia 15 de 25" cor="#d300b5" qtd={15} max={25} />
        <LoteriaCard nome="QUINA" sub="Sorteia 5 de 80" cor="#3b00a0" qtd={5} max={80} />
        <LoteriaCard nome="TIMEMANIA" sub="Sorteia 10 de 80" cor="#ffcc00" qtd={10} max={80} />
        <LoteriaCard nome="LOTOMANIA" sub="Sorteia 50 de 100" cor="#ff8800" qtd={50} max={100} />
        <LoteriaCard nome="DUPLA SENA" sub="Sorteia 6 de 50" cor="#bf1923" qtd={6} max={50} />
        <LoteriaCard nome="DIA DE SORTE" sub="Sorteia 7 de 31" cor="#cb821c" qtd={7} max={31} />
      </main>

      <Footer />
    </div>
  );
}

// --- ESTILOS VISUAIS (CSS in JS) ---
const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '15px 40px', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '1.8rem' },
  logoText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#45f3ad', letterSpacing: '1px' },
  navLinks: { display: 'flex', gap: '20px' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s' },
  footer: { backgroundColor: '#121214', borderTop: '1px solid #333', marginTop: '60px', padding: '40px 20px', textAlign: 'center' },
  footerContent: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  footerTitle: { color: '#45f3ad', fontSize: '1.5rem', marginBottom: '10px' },
  footerText: { color: '#aaa', fontSize: '1rem' },
  footerTech: { color: '#888', fontSize: '0.9rem', fontStyle: 'italic', margin: '10px 0' },
  contatoContainer: { marginTop: '20px', padding: '15px', backgroundColor: '#18181b', borderRadius: '8px', display: 'inline-block', alignSelf: 'center' },
  footerContato: { color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' },
  emailBtn: { backgroundColor: '#20ac7b', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-block' },
  body: { backgroundColor: '#0e0e10', minHeight: '100vh', padding: '0', fontFamily: 'sans-serif', color: '#fff' },
  header: { textAlign: 'center', margin: '60px 0 50px 0', padding: '0 20px' },
  titulo: { fontSize: '3rem', color: '#45f3ad', fontWeight: '900', textShadow: '0 0 10px rgba(69, 243, 173, 0.3)', margin: '0 0 15px 0' },
  subtitulo: { color: '#aaa', lineHeight: '1.6', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  card: { backgroundColor: '#18181b', borderRadius: '12px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  numerosContainer: { minHeight: '120px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '20px 0' },
  bola: { width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
  placeholder: { color: '#555', fontStyle: 'italic', fontSize: '0.85rem' },
  btn: { padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'filter 0.2s' }
};

export default App;