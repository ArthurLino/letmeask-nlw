import emptyQuestionsImage from "../../assets/images/empty-questions.svg";

import "./styles.scss"

type EmptyQuestionsProps = {
  isAnAdminRoom?: boolean;
  userIsLoggedIn?: boolean
}

export function EmptyQuestions({isAnAdminRoom, userIsLoggedIn}: EmptyQuestionsProps) {
  return (

    <div className="empty-messages">

      <img src={emptyQuestionsImage} alt="Não há nenhuma pergunta" />
      <h4>Nenhuma pergunta por aqui...</h4>

      { !isAnAdminRoom ?

        ( <>

        { userIsLoggedIn ?

          (<p>Seja o primeiro a perguntar.</p>) :
          (<p>Faça Login e seja o primeiro a perguntar.</p>)  
        
        }   

        </> 
        ):(
          <p>Convide pessoas para entrarem na sua sala!</p>
        )    
      }

    </div>

  );
}