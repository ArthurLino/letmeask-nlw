import { useHistory } from 'react-router-dom';

import { FormEvent, useState } from 'react';

import logoImage from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg'
import loginImage from '../assets/images/login.svg'

import '../styles/auth.scss'

import { Button } from '../components/Button/index';
import { AuthAside } from '../components/AuthAside/index';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

export function Home() {

  const history = useHistory();

  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {

    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }    
    
    if ( roomRef.val().authorId == user?.id ) {

      history.push(`/admin/rooms/${roomCode}`);
      return;

    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <section id="auth-page">
      <AuthAside />
      <main>
        <div className="main-content">
          <img src={logoImage} alt="Letmeask logo" />
          <button className="btn-google" onClick={handleCreateRoom}>
            <img src={googleIconImage} alt="Google logo" />
            Criar sala usando uma conta Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <img src={loginImage} alt="icone de entrar" />
              Entrar na Sala
            </Button>
          </form>
        </div>
      </main>
    </section>
  );
}