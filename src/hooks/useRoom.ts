import { useEffect, useState } from "react";

import { database } from "../services/firebase";

import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  }
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean,
  likes: Record<string, {authorId: string}>,
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
  likeCount: number,
  likeId: string | undefined,
}

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');

  const { user } = useAuth();
  
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
          likeCount: Object.values(value.likes?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(questionsArray);

    })

    return () => { 
      roomRef.off('value');
    }

  }, [roomId, user?.id]);

  return { questions, title }

}