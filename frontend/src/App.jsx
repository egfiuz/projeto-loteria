import { useState } from 'react'

function App() {
  const [numeros, setNumeros] = useState([])

  const gerarNumeros = () => {
    const sorteados = []
    while (sorteados.length < 6) {
      const num = Math.floor(Math.random() * 60) + 1
      if (!sorteados.includes(num)) {
        sorteados.push(num)
      }
    }
    // Organiza os números do menor para o maior
    setNumeros(sorteados.sort((a, b) => a - b))
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#20441a' }}>Gerador de Loteria 🍀</h1>
      <p>Clique no botão para gerar seus números da sorte!</p>

      <button
        onClick={gerarNumeros}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}
      >
        Gerar Números
      </button>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        {numeros.map((num, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              lineHeight: '50px',
              backgroundColor: '#fff',
              border: '3px solid #28a745',
              borderRadius: '50%',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#28a745'
            }}
          >
            {num < 10 ? `0${num}` : num}
          </div>
        ))}
      </div>

      {numeros.length > 0 && (
        <p style={{ marginTop: '20px', color: '#666' }}>Boa sorte na sua aposta! 🚀</p>
      )}
    </div>
  )
}

export default App