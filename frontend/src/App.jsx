import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const Navbar = ({ usuarioLogado, fazerLogout, abrirModal }) => {
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
        {usuarioLogado ? (
          <span style={{ color: '#45f3ad', marginLeft: '20px', fontWeight: 'bold' }}>
            Olá, {usuarioLogado}!
            <button onClick={fazerLogout} style={styles.btnLogout}>(Sair)</button>
          </span>
        ) : (
          <button onClick={abrirModal} style={styles.btnVip}>Entrar VIP</button>
        )}
      </div>
    </nav>
  );
};

const LoteriaCard = ({ nome, sub, cor, qtd, max }) => {
  const [numeros, setNumeros] = useState([]);

  const gerarJogo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("⚠️ Acesso Exclusivo VIP! Faça login para usar a IA.");
      return;
    }

    try {
      // AJUSTE DE CEO: Aqui ele tenta usar a URL da nuvem, se não achar, usa o seu PC
      const API_URL = "https://projeto-loteria.vercel.app";

      const resposta = await fetch(`${API_URL}/api/gerar?qtd=${qtd}&max=${max}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const dados = await resposta.json();
      if (!resposta.ok) { alert("🛑 " + dados.erro); return; }

      setNumeros(dados.numeros);
      if (dados.restantes !== undefined) {
        alert(`✅ Sucesso! Restam ${dados.restantes} gerações hoje.`);
      }
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Aviso: O Cérebro Python na nuvem ainda está acordando. Tente novamente em instantes!");
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
          <p style={styles.placeholder}>Nenhum jogo gerado ainda.</p>
        )}
      </div>
      <button onClick={gerarJogo} style={{ ...styles.btn, backgroundColor: cor, color: nome === 'TIMEMANIA' ? '#000' : '#fff' }}>
        Gerar Jogo Otimizado
      </button>
    </div>
  );
};

const Footer = () => {
  return (
    <footer id="contato" style={styles.footer}>
      <div style={styles.footerContent}>
        <h3 style={styles.footerTitle}>Super Loterias API</h3>
        <p style={styles.footerText}>Desenvolvido com 💻 por <strong>Eliene Gomes Fiuza</strong></p>
        <div style={styles.pixContainer}>
          <h4 style={styles.pixTitle}>🚀 Apoie este Projeto!</h4>
          <div style={styles.pixDetails}>
            <img src="/meu-pix.png" alt="QR Code PIX" style={styles.qrImage} />
            <div style={styles.pixKeyBox}>
              <p style={{ color: '#aaa', fontSize: '0.8rem' }}>Chave PIX:</p>
              <p style={styles.pixKey}>egfiuza@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const nome = localStorage.getItem('nome');
    if (nome) setUsuarioLogado(nome);
  }, []);

  const fazerLogout = () => {
    localStorage.clear();
    setUsuarioLogado(null);
    window.location.reload();
  };

  return (
    <div style={styles.body}>
      <Navbar usuarioLogado={usuarioLogado} fazerLogout={fazerLogout} abrirModal={() => setShowAuthModal(true)} />
      <header id="inicio" style={styles.header}>
        <h1 style={styles.titulo}>Super Loterias API</h1>
        <p style={styles.subtitulo}>Inteligência Estatística aplicada a jogos lotéricos.</p>
      </header>
      <main style={styles.grid}>
        <LoteriaCard nome="MEGA-SENA" sub="Sorteia 6 de 60" cor="#20ac7b" qtd={6} max={60} />
        <LoteriaCard nome="LOTOFÁCIL" sub="Sorteia 15 de 25" cor="#d300b5" qtd={15} max={25} />
        <LoteriaCard nome="QUINA" sub="Sorteia 5 de 80" cor="#3b00a0" qtd={5} max={80} />

        <div style={styles.projetoTextoContainer}>
          <h4 style={styles.projetoTextoTitulo}>Do código à realidade: Super Loterias API</h4>
          <p style={styles.projetoTextoParagrafo}>
            Desenvolvi este sistema integrando um <strong>'Cérebro' em Python</strong> para análise de dados estatísticos com um frontend moderno em React.
          </p>
          <p style={styles.projetoTextoParagrafo}>
            O objetivo foi aplicar conceitos de <strong>Arquitetura MVC</strong> e Engenharia de Software para transformar palpites aleatórios em escolhas baseadas em dados.
          </p>
          <p style={{ ...styles.projetoTextoParagrafo, marginBottom: 0 }}>
            Este projeto é o resultado de muito estudo na FATEC. Otimize seus jogos com inteligência! 📊🧠
          </p>
        </div>
      </main>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

// Estilos mantidos conforme sua versão original
const styles = {
  body: { backgroundColor: '#0e0e10', minHeight: '100vh', padding: '0', fontFamily: 'sans-serif', color: '#fff' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '15px 40px', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100 },
  btnVip: { backgroundColor: '#45f3ad', color: '#000', padding: '6px 15px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  btnLogout: { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' },
  header: { textAlign: 'center', margin: '60px 0 50px 0' },
  titulo: { fontSize: '3rem', color: '#45f3ad', fontWeight: '900' },
  subtitulo: { color: '#aaa' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#18181b', borderRadius: '12px', padding: '25px', textAlign: 'center' },
  numerosContainer: { minHeight: '120px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' },
  bola: { width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  btn: { padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  projetoTextoContainer: { backgroundColor: '#18181b', borderRadius: '12px', padding: '30px', borderLeft: '3px solid #45f3ad', gridColumn: 'span 2' },
  projetoTextoTitulo: { color: '#45f3ad', fontSize: '1.4rem' },
  projetoTextoParagrafo: { color: '#bbb', lineHeight: '1.7' },
  footer: { backgroundColor: '#121214', marginTop: '60px', padding: '40px' },
  pixContainer: { marginTop: '20px', padding: '20px', backgroundColor: '#18181b', borderRadius: '12px' },
  qrImage: { width: '100px', border: '5px solid #fff' },
  pixKey: { color: '#45f3ad', fontWeight: 'bold' }
};

export default App;