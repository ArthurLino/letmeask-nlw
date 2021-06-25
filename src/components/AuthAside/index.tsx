import illustrationImage from "../../assets/images/illustration.svg";

import "./styles.scss"

export function AuthAside() {
  return (
    <aside>
      <img src={illustrationImage} alt="questions and answers screen illustration" />
      <strong>Crie salas de Q&amp;A ao-vivo</strong>
      <p>Tire as dúvidas da sua audiência em tempo-real</p>
    </aside>
  );
}