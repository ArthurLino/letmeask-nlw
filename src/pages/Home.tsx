import { useHistory } from 'react-router-dom';

import illustrationImage from '../assets/images/illustration.svg';
import logoImage from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg'

import '../styles/auth.scss'

import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

export function Home() {

  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {

    if ( !user ) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

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
          <button className="btn-google" onClick={handleCreateRoom}>
            <img src={googleIconImage} alt="Google logo" />
            Crie uma sala usando uma conta Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form>
            <input 
            type="text" 
            placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Enviar
            </Button>
          </form>
        </div>
      </main>
    </section>
  );
}