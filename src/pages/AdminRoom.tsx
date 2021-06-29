import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Modal from 'react-modal'

import logoImage from '../assets/images/logo.svg';
import answeredImage from '../assets/images/answer.svg';
import checkedImage from '../assets/images/check.svg';
import deleteImage from '../assets/images/delete.svg';
import dangerImage from '../assets/images/dangerous.svg';

import { Button } from '../components/Button/index';
import { RoomCode } from '../components/RoomCode/index';
import { Question } from '../components/Question/index';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';
import '../styles/modals.scss';

import { EmptyQuestions } from '../components/EmptyQuestions';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
}

export function AdminRoom() {

  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();

  const { questions, title } = useRoom( roomId )

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Verifying user access level
  useEffect((() => {
    database.ref(`/rooms/${roomId}`).once('value', room => {

      const adminId = room.val().authorId;

      if ( adminId !== user?.id ) {
        return history.push(`/rooms/${roomId}`);
      }
    });
  }), [user?.id]);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }
  
  async function handleEndRoom() {
    database.ref(`/rooms/${roomId}`).once('value', room => {

      const adminId = room.val().authorId;

      if ( adminId === user?.id ) {
        database.ref(`rooms/${roomId}`).update({ 
          endedAt: new Date(),
        })
      }
    });

    history.push('/');
  }

  // async function handleDeleteQuestion(questionId: string) {
  //   const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  // }

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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
      >
        <img src={dangerImage} alt="tem certeza que deseja encerrar a sala?" />
        <h2>Encerrar Sala</h2>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div>
          <Button isGrey onClick={closeModal}>Cancelar</Button>
          <Button isDangerous onClick={handleEndRoom}>Sim, encerrar</Button>
        </div>
      </Modal>

      <header>

        <div className="content">

          <img src={logoImage} alt="Letmeask logo" />

          <div>

          <RoomCode code={roomId} />      

          <Button 
            id="endRoomButton"
            isOutlined
            onClick={openModal}
          >
            Encerrar Sala
          </Button>

          </div>

        </div>

      </header>

      <main>

        <div className="room-title">

          <h1>Sala: {title}</h1>
          {
            questions.length > 0 && <span>{questions.length} pergunta(s)</span>
          }

        </div>

        </main>

        <div className="questions-display">

        {
          questions.length > 0 ? (

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
                  
                  <button type="button">
                    <img src={deleteImage} alt="Remover pergunta" />
                  </button>
                </div>

              </Question>
            );
          })

          ):(
            <EmptyQuestions isAnAdminRoom/>
          )

        }

        </div>

      </section >
  );
}