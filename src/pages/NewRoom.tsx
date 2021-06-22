import { Link } from 'react-router-dom';

import illustrationImage from '../assets/images/illustration.svg';
import logoImage from '../assets/images/logo.svg';

import '../styles/auth.scss'

import { Button } from '../components/Button';

// import { useAuth } from '../hooks/useAuth';

export function NewRoom() {

  // const { user } = useAuth();

  return (
    <section id="auth-page">
      <aside>
        <img src={illustrationImage} alt="questions and answers screen illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImage} alt="Letmeask logo" />
          <h2>Crie uma nova sala</h2>
          <form>
            <input 
            type="text" 
            placeholder="Nome da sala"
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?
            <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </section>
  );
}