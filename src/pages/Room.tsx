import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImage from '../assets/images/logo.svg';
import emptyQuestionsImage from '../assets/images/empty-questions.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  }
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean,
}>

type Questions = {
  id: string,
  author: {
    name: string,
    avatar: string,
  }
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean,
}

export function Room() {

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {

      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const questionsArray = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(questionsArray);

    })
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <section id="room-page">

      <header>

        <div className="content">

          <img src={logoImage} alt="Letmeask logo" />

          <RoomCode code={roomId} />

        </div>

      </header>

      <main>

        <div className="room-title">

          <h1>Sala {title}</h1>
          {
            questions.length > 0 && <span>{questions.length} pergunta(s)</span>
          }

        </div>

        <form onSubmit={handleSendQuestion}>

          <textarea
            placeholder="Qual é a sua pergunta?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">

            {user ? (

              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>

            ) : (

              <span> Para enviar uma pergunta, <button>faça seu login</button>.</span>

            )
            }

            <Button type="submit" disabled={!user}> Enviar pergunta </Button>

          </div>

        </form>

      </main>

      <section className="questions-display">

        <img src={emptyQuestionsImage} alt="" />
        <h4>Nenhuma pergunta por aqui...</h4>

        {
          user ?
            <p>Seja o primeiro a perguntar.</p>
            :
            <p>Faça login e seja o primeiro a perguntar.</p>
        }

      </section>

    </section >
  );
}