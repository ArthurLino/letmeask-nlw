import copyImage from "../assets/images/copy.svg";

import "../styles/room-code.scss"

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {

    navigator.clipboard.writeText(props.code);

  }

  return (
    <button className="room-code">
      <div onClick={copyRoomCodeToClipboard}>
        <img src={copyImage} alt="Copy room code" />
      </div>

      <span> {props.code} </span>
    </button>
  );
}