import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
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
  const [questionModalIsOpen, setquestionModalIsOpen] = useState(false);

  // Verifying user access level
  useEffect((() => {
    database.ref(`/rooms/${roomId}`).once('value', room => {

      const adminId = room.val().authorId;

      if ( adminId !== user?.id ) {
        return history.push(`/rooms/${roomId}`);
      }
    });
  }), [user?.id]);

  useEffect((() => {
    database.ref(`/rooms/${roomId}`).once('value', room => {

      const isRoomEnded = room.val().endedAt;

      if ( isRoomEnded ) {
        history.push(`/`);
      }
    });
  }), [ database.ref(`/rooms/${roomId}/endedAt`)]);

  function openDeleteQuestionModal() {
    setquestionModalIsOpen(true);
  }

  function closeDeleteQuestionModal() {
    setquestionModalIsOpen(false);
  }

  function openEndRoomModal() {
    setModalIsOpen(true);
  }

  function closeEndRoomModal() {
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

  async function handleDeleteQuestion(questionId: string) {
    const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    setquestionModalIsOpen(false);
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeEndRoomModal}
        className="Modal"
        overlayClassName="Overlay"
      >
        <img src={dangerImage} alt="tem certeza que deseja encerrar a sala?" />
        <h2>Encerrar Sala</h2>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div>
          <Button isGrey onClick={closeEndRoomModal}>Cancelar</Button>
          <Button isDangerous onClick={handleEndRoom}>Sim, encerrar</Button>
        </div>
      </Modal>

      <header>

        <div className="content">

          <Link to='/'>
            <img src={logoImage} className="logo" alt="Letmeask logo" />
          </Link>

          <div>

          <RoomCode code={roomId} />      

          <Button 
            id="endRoomButton"
            isOutlined
            onClick={openEndRoomModal}
          >
            <span>Encerrar Sala</span>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.6599 18.34L18.3399 29.66" stroke="#835afd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M29.6599 29.66L18.3399 18.34" stroke="#835afd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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

              <>

              <Modal
                isOpen={questionModalIsOpen}
                onRequestClose={closeDeleteQuestionModal}
                className="Modal"
                overlayClassName="Overlay"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5.99988H5H21" stroke="#E73F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#E73F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        
                <h2>Excluir pergunta</h2>
                <p>Tem certeza que você deseja excluir esta pergunta?</p>
                <div>
                  <Button isGrey onClick={closeDeleteQuestionModal}>Cancelar</Button>
                  <Button isDangerous onClick={() => handleDeleteQuestion(question.id)}>Sim, excluir</Button>
                </div>
              </Modal>
              
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
                  onClick={openDeleteQuestionModal}
                  >
                    <img src={deleteImage} alt="Remover pergunta" />
                  </button>
                </div>

              </Question>

              </>
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