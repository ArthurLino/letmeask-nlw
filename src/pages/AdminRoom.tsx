import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import logoImage from '../assets/images/logo.svg';
import answeredImage from '../assets/images/answer.svg';
import checkedImage from '../assets/images/check.svg';
import deleteImage from '../assets/images/delete.svg';

import { Button } from '../components/Button/index';
import { RoomCode } from '../components/RoomCode/index';
import { Question } from '../components/Question/index';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {

  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  // const { user } = useAuth();

  const { questions, title } = useRoom( roomId )

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({ 
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if ( window.confirm("Tem certeza que deseja excluir essa pergunta?") ) {
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).update(
      { isAnswered: true }
    );
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).update(
      { isHighlighted: true }
    );
  }

  return (
    <section id="room-page">

      <header>

        <div className="content">

          <img src={logoImage} alt="Letmeask logo" />

          <div>

          <RoomCode code={roomId} />      

          <Button 
            isOutlined
            onClick={handleEndRoom}
          >
            Encerrar Sala
          </Button>

          </div>

        </div>

      </header>

      <main>

        <div className="room-title">

          <h1>Sala {title}</h1>
          {
            questions.length > 0 && <span>{questions.length} pergunta(s)</span>
          }

        </div>

      </main>

      <section className="questions-display">

        {

          questions.map(question => {
            return (
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                
                <div className="question-buttons">

                  { !question.isAnswered && (

                    <>
                      <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                      <img src={checkedImage} alt="Maracar pergunta como respondida" />
                      </button>
                      <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                      >
                      <img src={answeredImage} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImage} alt="Remover pergunta" />
                  </button>
                </div>

              </Question>
            );
          })

        }

      </section>

    </section >
  );
}