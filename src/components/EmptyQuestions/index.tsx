import emptyQuestionsImage from "../../assets/images/empty-questions.svg";

import "./styles.scss"

type EmptyQuestionsProps = {
  userIsLoggedIn: boolean
}

export function EmptyQuestions(props: EmptyQuestionsProps) {
  return (

    <div className="empty-messages">

      <img src={emptyQuestionsImage} alt="Não há nenhuma pergunta" />
      <h4>Nenhuma pergunta por aqui...</h4>

      { props.userIsLoggedIn ?

        (<p>Seja o primeiro a perguntar.</p>) :
        (<p>Faça Login e seja o primeiro a perguntar.</p>)  
      
      }   

    </div>

  );
}