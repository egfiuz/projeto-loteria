import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const Navbar = ({ usuarioLogado, fazerLogout, abrirModal }) => (
  <nav style={styles.navbar}>
    <div style={styles.logoContainer}>
      <span style={styles.logoIcon}>🍀</span>
      <span style={styles.logoText}>SuperLoterias API</span>
    </div>
    <div style={styles.navLinks}>
      <a href="#inicio" style={styles.link}>Início</a>
      <a href="#teoremas" style={styles.link}>A Ciência</a>
      <a href="#contato" style={styles.link}>Contato</a>
      {usuarioLogado ? (
        <span style={styles.userSection}>
          Olá, {usuarioLogado}!
          <button onClick={fazerLogout} style={styles.btnLogout}>(Sair)</button>
        </span>
      ) : (
        <button onClick={abrirModal} style={styles.btnVip}>Entrar VIP</button>
      )}
    </div>
  </nav>
);

const LoteriaCard = ({ nome, sub, cor, qtd, max }) => {
  const [numeros, setNumeros] = useState([]);

  const gerarJogo = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert("⚠️ Acesso Exclusivo VIP! Faça login."); return; }

    try {
      const API_URL = "https://projeto-loteria-git-main-egfiuzas-projects.vercel.app";
      const resposta = await fetch(`${API_URL}/api/gerar?qtd=${qtd}&max=${max}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await respuesta.json();
      if (resposta.ok) setNumeros(dados.numeros);
      else alert(dados.erro);
    } catch (e) { alert("Erro de conexão com o servidor."); }
  };

  return (
    <div style={{ ...styles.card, borderTop: `5px solid ${cor}` }}>
      <h2 style={{ color: cor, margin: '10px 0' }}>{nome}</h2>
      <p style={styles.cardSub}>{sub}</p>
      <div style={styles.numerosContainer}>
        {numeros.length > 0 ? numeros.map((n, i) => (
          <span key={i} style={{ ...styles.bola, backgroundColor: cor }}>{n < 10 ? `0${n}` : n}</span>
        )) : <p style={styles.placeholder}>Nenhum jogo gerado ainda.<br />Clique no botão abaixo.</p>}
      </div>
      <button onClick={gerarJogo} style={{ ...styles.btn, backgroundColor: cor, color: '#fff' }}>
        Gerar Jogo Otimizado
      </button>
    </div>
  );
};

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const nome = localStorage.getItem('nome');
    if (nome) setUsuarioLogado(nome);
  }, []);

  return (
    <div style={styles.body}>
      <Navbar usuarioLogado={usuarioLogado} fazerLogout={() => { localStorage.clear(); setUsuarioLogado(null); }} abrirModal={() => setShowAuthModal(true)} />

      <header style={styles.header}>
        <h1 style={styles.titulo}>Super Loterias API</h1>
        <p style={styles.subtitulo}>Gere combinações numéricas otimizadas via Força Bruta aliada a Filtros Estatísticos de Alta Performance.</p>
      </header>

      <main style={styles.grid}>
        <LoteriaCard nome="MEGA-SENA" sub="Sorteia 6 de 60" cor="#20ac7b" qtd={6} max={60} />
        <LoteriaCard nome="LOTOFÁCIL" sub="Sorteia 15 de 25" cor="#d300b5" qtd={15} max={25} />
        <LoteriaCard nome="QUINA" sub="Sorteia 5 de 80" cor="#3b00a0" qtd={5} max={80} />
        <LoteriaCard nome="TIMEMANIA" sub="Sorteia 10 de 80" cor="#ffff00" qtd={10} max={80} />
        <LoteriaCard nome="LOTOMANIA" sub="Sorteia 50 de 100" cor="#ff6600" qtd={50} max={100} />
        <LoteriaCard nome="DUPLA SENA" sub="Sorteia 6 de 50" cor="#bf0000" qtd={6} max={50} />
        <LoteriaCard nome="DIA DE SORTE" sub="Sorteia 7 de 31" cor="#cb9300" qtd={7} max={31} />

        <section style={styles.infoSection}>
          <h3 style={styles.infoTitle}>Do código à realidade: Super Loterias API</h3>
          <p>Desenvolvi este sistema integrando um 'Cérebro' em Python para análise de dados estatísticos com um frontend moderno em React. O objetivo foi aplicar conceitos de Arquitetura MVC e Engenharia de Software para transformar palpites aleatórios em escolhas baseadas em dados.</p>
          <p>Utilizamos a Lei dos Grandes Números e filtros de alta performance para processar os sorteios históricos, garantindo que cada combinação gerada siga padrões matemáticos reais de frequência e distribuição.</p>
          <p>Este projeto é o resultado de muito estudo na FATEC e prática em desenvolvimento Full Stack. Otimize seus jogos com inteligência e veja a tecnologia trabalhando a seu favor!</p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p><strong>Super Loterias API</strong></p>
        <p>Desenvolvido com 💻 por Eliene Gomes Fiuza | Engenharia de Software Aplicada</p>
        <p>Tecnologias: React, Python (IA Estatística V3)</p>
        <div style={styles.pixBox}>
          <p>🚀 Apoie este Projeto! Se nossos números te ajudaram, considere pagar um café para a desenvolvedora!</p>
          <p style={styles.pixKey}>Chave PIX: egfiuza@gmail.com</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

const styles = {
  body: { backgroundColor: '#0e0e10', color: '#fff', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: '#18181b', borderBottom: '1px solid #333' },
  logoText: { fontSize: '1.5rem', fontWeight: 'bold', color: '#45f3ad', marginLeft: '10px' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#bbb', textDecoration: 'none' },
  btnVip: { backgroundColor: '#45f3ad', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  header: { textAlign: 'center', padding: '60px 20px' },
  titulo: { fontSize: '3.5rem', marginBottom: '10px' },
  subtitulo: { fontSize: '1.2rem', color: '#aaa', maxWidth: '800px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', padding: '0 5% 60px 5%' },
  card: { backgroundColor: '#18181b', padding: '30px', borderRadius: '15px', textAlign: 'center', transition: '0.3s' },
  cardSub: { color: '#888', marginBottom: '20px' },
  numerosContainer: { minHeight: '100px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  bola: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  placeholder: { color: '#555', fontSize: '0.9rem' },
  btn: { width: '100%', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  infoSection: { gridColumn: '1 / -1', backgroundColor: '#18181b', padding: '40px', borderRadius: '15px', borderLeft: '5px solid #45f3ad', lineHeight: '1.8', color: '#ccc' },
  infoTitle: { color: '#45f3ad', fontSize: '1.8rem', marginBottom: '20px' },
  footer: { textAlign: 'center', padding: '50px', backgroundColor: '#0a0a0c', borderTop: '1px solid #333' },
  pixBox: { marginTop: '30px', padding: '20px', border: '1px dashed #45f3ad', borderRadius: '10px', display: 'inline-block' },
  pixKey: { color: '#45f3ad', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '10px' }
};

export default App;