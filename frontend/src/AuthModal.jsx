import React, { useState } from 'react';

export default function AuthModal({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('Carregando...');

        // Decide se vai bater na porta de login ou de registrar do Python
        const endpoint = isLogin ? '/login' : '/registrar';
        const payload = isLogin ? { email, senha } : { nome, email, senha };

        try {
            // AQUI ESTÁ A CORREÇÃO: Apontando para a API na nuvem!
            const API_URL = "https://projeto-loteria-git-main-egfiuzas-projects.vercel.app";
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem(data.mensagem || 'Sucesso!');
                if (isLogin && data.token) {
                    // O Python devolveu o crachá! Vamos guardar no cofre do navegador:
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('nome', data.nome);

                    // Fecha a janela e atualiza o site para mostrar o nome do usuário
                    setTimeout(() => {
                        onClose();
                        window.location.reload();
                    }, 1000);
                } else {
                    // Se for cadastro, limpa a tela e muda para a aba de Login
                    setTimeout(() => setIsLogin(true), 1500);
                }
            } else {
                setMensagem(data.erro || 'Erro na requisição');
            }
        } catch (error) {
            setMensagem('Erro de conexão. O servidor Python está ligado?');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modalBox}>
                <button onClick={onClose} style={styles.closeBtn}>X</button>
                <h2 style={styles.titulo}>{isLogin ? 'Entrar no Sistema' : 'Criar Conta VIP'}</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input
                            type="text" placeholder="Seu Nome" required
                            value={nome} onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                        />
                    )}
                    <input
                        type="email" placeholder="Seu E-mail" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password" placeholder="Sua Senha" required
                        value={senha} onChange={(e) => setSenha(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.btnSubmit}>
                        {isLogin ? 'Acessar API' : 'Cadastrar'}
                    </button>
                </form>

                {mensagem && <p style={styles.mensagem}>{mensagem}</p>}

                <p style={styles.toggleText}>
                    {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{' '}
                    <span onClick={() => { setIsLogin(!isLogin); setMensagem(''); }} style={styles.link}>
                        {isLogin ? "Cadastre-se" : "Faça Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}

// Estilos sombrios e neon para combinar com seu império!
const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalBox: { backgroundColor: '#18181b', padding: '30px', borderRadius: '12px', border: '1px solid #45f3ad', width: '90%', maxWidth: '400px', position: 'relative', textAlign: 'center' },
    closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' },
    titulo: { color: '#45f3ad', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2a2a2f', color: '#fff', fontSize: '1rem', outline: 'none' },
    btnSubmit: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#45f3ad', color: '#000', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
    toggleText: { color: '#bbb', marginTop: '20px', fontSize: '0.9rem' },
    link: { color: '#45f3ad', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' },
    mensagem: { color: '#ff4d4d', marginTop: '15px', fontWeight: 'bold' }
};