import { useState, useEffect } from 'react';
import AuthModal from './AuthModal'; // <--- O modal flutuante importado aqui!

// --- COMPONENTE: NAVBAR ---
// Agora a Navbar recebe as propriedades (props) de login do componente pai!
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

        {/* --- A NOSSA PORTA VIP ENTRA AQUI! --- */}
        {usuarioLogado ? (
          <span style={{ color: '#45f3ad', marginLeft: '20px', fontWeight: 'bold' }}>
            Olá, {usuarioLogado}!
            <button onClick={fazerLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' }}>(Sair)</button>
          </span>
        ) : (
          <button onClick={abrirModal} style={{ marginLeft: '20px', backgroundColor: '#45f3ad', color: '#000', padding: '6px 15px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Entrar VIP
          </button>
        )}
      </div>
    </nav>
  );
};

// --- COMPONENTE: CARD DE LOTERIA ---
const LoteriaCard = ({ nome, sub, cor, qtd, max }) => {
  const [numeros, setNumeros] = useState([]);

  const gerarJogo = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("⚠️ Acesso Exclusivo VIP! Por favor, faça login ou cadastre-se no topo da página para gerar jogos com a Inteligência Artificial.");
      return;
    }

    try {
      const resposta = await fetch(`http://127.0.0.1:5000/api/gerar?qtd=${qtd}&max=${max}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert("🛑 " + dados.erro);
        return;
      }

      setNumeros(dados.numeros);

      if (dados.restantes !== undefined) {
        alert(`✅ Jogo gerado com sucesso! Restam ${dados.restantes} gerações VIP hoje.`);
      }

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

// --- COMPONENTE: FOOTER (RODAPÉ ATUALIZADO COM MONETIZAÇÃO) ---
const Footer = () => {
  return (
    <footer id="contato" style={styles.footer}>
      <div style={styles.footerContent}>
        <h3 style={styles.footerTitle}>Super Loterias API</h3>
        <p style={styles.footerText}>
          Desenvolvido com 💻 por <strong>Eliene Gomes Fiuza</strong> | Engenharia de Software Aplicada
        </p>
        <p style={styles.footerTech}>
          🛠️ Tecnologias: React, Python (IA Estatística V3)
        </p>

        <div style={styles.pixContainer}>
          <h4 style={styles.pixTitle}>🚀 Apoie este Projeto!</h4>
          <p style={styles.pixText}>
            Se nossos números otimizados te ajudaram, considere pagar um café para a desenvolvedora
            e ajudar a manter o servidor da IA online!
          </p>
          <div style={styles.pixDetails}>
            <div style={styles.qrPlaceholder}>
              <img src="/meu-pix.png" alt="QR Code PIX Eliene Fiuza" style={styles.qrImage} />
              <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '5px' }}>Scan para doar</p>
            </div>
            <div style={styles.pixKeyBox}>
              <p style={{ color: '#aaa', fontSize: '0.8rem' }}>Chave PIX (E-mail):</p>
              <p style={styles.pixKey}>egfiuza@gmail.com</p>
            </div>
          </div>
        </div>

        <div style={styles.contatoContainer}>
          <a href="mailto:egfiuza@gmail.com" style={styles.emailBtn}>Contato Direto</a>
        </div>
      </div>
    </footer>
  );
};

// --- COMPONENTE PRINCIPAL: APP ---
function App() {
  // --- OS NEURÔNIOS DE ESTADO DA TELA ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Assim que o site carrega, ele olha no "bolso" para ver se tem um crachá guardado
  useEffect(() => {
    const nome = localStorage.getItem('nome');
    if (nome) {
      setUsuarioLogado(nome);
    }
  }, []);

  // Função para rasgar o crachá e deslogar
  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    setUsuarioLogado(null);
    window.location.reload();
  };

  return (
    <div style={styles.body}>
      {/* Colocando a Navbar e passando as funções para ela */}
      <Navbar
        usuarioLogado={usuarioLogado}
        fazerLogout={fazerLogout}
        abrirModal={() => setShowAuthModal(true)}
      />

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

        <div style={styles.projetoTextoContainer}>
          <h4 style={styles.projetoTextoTitulo}>Do código à realidade: Super Loterias API</h4>
          <p style={styles.projetoTextoParagrafo}>
            Desenvolvi este sistema integrando um <strong>'Cérebro' em Python</strong> para análise de dados estatísticos com um frontend moderno em React. O objetivo foi aplicar conceitos de <strong>Arquitetura MVC</strong> e Engenharia de Software para transformar palpites aleatórios em escolhas baseadas em dados.
          </p>
          <p style={styles.projetoTextoParagrafo}>
            Utilizamos a <strong>Lei dos Grandes Números</strong> e filtros de alta performance para processar os sorteios históricos, garantindo que cada combinação gerada siga padrões matemáticos reais de frequência e distribuição.
          </p>
          <p style={{ ...styles.projetoTextoParagrafo, marginBottom: 0 }}>
            Este projeto é o resultado de muito estudo na FATEC e prática em desenvolvimento Full Stack. Otimize seus jogos com inteligência e veja a tecnologia trabalhando a seu favor! 📊🧠
          </p>
        </div>
      </main>

      <Footer />

      {/* A JANELA FLUTUANTE DE LOGIN E CADASTRO */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

// --- ESTILOS VISUAIS (CSS in JS) ---
const styles = {
  body: { backgroundColor: '#0e0e10', minHeight: '100vh', padding: '0', fontFamily: 'sans-serif', color: '#fff' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '15px 40px', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '1.8rem' },
  logoText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#45f3ad', letterSpacing: '1px' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s' },
  header: { textAlign: 'center', margin: '60px 0 50px 0', padding: '0 20px' },
  titulo: { fontSize: '3rem', color: '#45f3ad', fontWeight: '900', textShadow: '0 0 10px rgba(69, 243, 173, 0.3)', margin: '0 0 15px 0' },
  subtitulo: { color: '#aaa', lineHeight: '1.6', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  card: { backgroundColor: '#18181b', borderRadius: '12px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  numerosContainer: { minHeight: '120px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '20px 0' },
  bola: { width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
  placeholder: { color: '#555', fontStyle: 'italic', fontSize: '0.85rem' },
  btn: { padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'filter 0.2s' },
  projetoTextoContainer: { backgroundColor: '#18181b', borderRadius: '12px', padding: '30px', borderLeft: '3px solid #45f3ad', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', alignSelf: 'start', gridColumn: 'span 2' },
  projetoTextoTitulo: { color: '#45f3ad', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'left' },
  projetoTextoParagrafo: { color: '#bbb', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '15px', textAlign: 'left' },
  footer: { backgroundColor: '#121214', borderTop: '1px solid #333', marginTop: '60px', padding: '40px 20px', textAlign: 'center' },
  footerContent: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  footerTitle: { color: '#45f3ad', fontSize: '1.5rem', marginBottom: '10px' },
  footerText: { color: '#aaa', fontSize: '1rem' },
  footerTech: { color: '#888', fontSize: '0.9rem', fontStyle: 'italic', margin: '10px 0' },
  pixContainer: { marginTop: '30px', padding: '20px', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' },
  pixTitle: { color: '#45f3ad', fontSize: '1.2rem', marginBottom: '10px' },
  pixText: { color: '#bbb', fontSize: '0.9rem', maxWidth: '500px', marginBottom: '15px' },
  pixDetails: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#121214', padding: '15px', borderRadius: '8px', border: '1px solid #444' },
  qrPlaceholder: { textAlign: 'center' },
  qrImage: { width: '120px', height: '120px', border: '5px solid #fff', borderRadius: '4px' },
  pixKeyBox: { textAlign: 'left' },
  pixKey: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', padding: '5px 10px', backgroundColor: '#222', borderRadius: '4px', border: '1px solid #45f3ad', marginTop: '5px' },
  contatoContainer: { marginTop: '20px', padding: '15px', backgroundColor: '#18181b', borderRadius: '8px', display: 'inline-block', alignSelf: 'center' },
  emailBtn: { backgroundColor: '#20ac7b', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-block' }
};

export default App;