import copyImage from "../../assets/images/copy.svg";

import "./styles.scss"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {

    toast('Code Copied!', {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

    navigator.clipboard.writeText(props.code);

  }

  return (
    <>
    <ToastContainer 
      toastClassName="room-code-alert"
      position="bottom-center"
      autoClose={1000}
      hideProgressBar
      closeOnClick={false}
      pauseOnFocusLoss={false}
      rtl={false}
      draggable={false}
      pauseOnHover
      limit={1}
    />

    <button className="room-code">
      <div onClick={copyRoomCodeToClipboard}>
        <img src={copyImage} alt="Copy room code" />
      </div>

      <span> {props.code} </span>
    </button>
    </>
  );
}