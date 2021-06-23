import { Link, useHistory } from 'react-router-dom';

import { FormEvent, useState } from 'react';

import logoImage from '../assets/images/logo.svg';

import '../styles/auth.scss'

import { Button } from '../components/Button';
import { AuthAside } from '../components/AuthAside';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

export function NewRoom() {

  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState('');

  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {

    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomReference = database.ref('rooms');

    const firebaseRoom = await roomReference.push({
      title: newRoom.trim(),
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <section id="auth-page">
      <AuthAside />
      <main>
        <div className="main-content">
          <img src={logoImage} alt="Letmeask logo" />
          <h2>Crie uma nova sala, {user ? user.name : ''}.</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?
            <br />
            <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </section>
  );
}