import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Message.css';
import { useEffect, useState } from 'react';
import { arrowBack, paperPlaneOutline, refreshOutline } from 'ionicons/icons';
import socket from '../socket/socket';
interface User {
  name: string,
  description: string,
  numberTicket: number
}
interface Mess {
  numberTicket: number,
  name: string,
  description: string,
  message: string,
  type: number,
  destination: number
}
interface Props {
  messages: Mess[]
}
function handleRefreshClick() {
  window.location.reload();
}

const Message = (props: Props) => {
  const [users, setUsers] = useState([] as User[])
  const [isMessagePage, setIsMessagePage] = useState(false)
  const [currentUser, setCurrentUser] = useState({} as User)
  const [sendOrReceivedMessage, setSendOrReceivedMessage] = useState([] as Mess[])
  const [message, setMessage] = useState("")
  useEffect(() => {
    setSendOrReceivedMessage(props.messages.filter(mess => mess.numberTicket === currentUser.numberTicket))
  }, [props])
  const sendMessages = () => {
    let mes: Mess = {
      description: "",
      name: "",
      numberTicket: currentUser.numberTicket,
      message: message,
      type: 2,
      destination: currentUser.numberTicket
    }
    socket.emit('message', mes);
    mes.type = 1
    var arr: Mess[] = [];
    if (sessionStorage.getItem("message")) {
      arr = JSON.parse(sessionStorage.getItem("message")!) as Mess[];
    }
    arr.push(mes)
    sessionStorage.setItem("message", JSON.stringify(arr));
    setSendOrReceivedMessage(arr)
    setMessage("")
  }
  const discussion = (user: User) => {
    setIsMessagePage(true);
    setCurrentUser(user)
  }
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("message");
    if (savedMessages) {
      const parsedMessages: Mess[] = JSON.parse(savedMessages);
      setSendOrReceivedMessage(parsedMessages.filter(mess => mess.numberTicket === currentUser.numberTicket));
    }
  }, [currentUser.numberTicket, sessionStorage.getItem("message")]);

  useEffect(() => {
    const users = sessionStorage.getItem("users");
    if (users) {
      const parsedUsers = JSON.parse(users);
      setUsers(parsedUsers)
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {(isMessagePage === true) &&
            <IonButtons
              onClick={() => setIsMessagePage(false)}
              slot="start">
              <IonIcon
                aria-hidden="true"
                slot="start"
                ios={arrowBack}
                md={arrowBack} />
            </IonButtons>}
          {isMessagePage === false &&
            <IonButtons onClick={() => handleRefreshClick()} slot="end">
              <IonIcon icon={refreshOutline} style={{ fontSize: '25px' }} />
            </IonButtons>}
          {isMessagePage === true &&
            <h2 style={{ marginLeft: '10px' }}>{currentUser.name}</h2>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          {isMessagePage === false &&
            <IonToolbar>
              <IonTitle size="large">Message</IonTitle>
            </IonToolbar>}
        </IonHeader>
        {isMessagePage === false &&
          <><IonList>
            {users.length > 0 &&
              users.map((user, index) => (
                <IonItem onClick={() => { discussion(user) }} key={index}>{user.name}</IonItem>
              ))}
          </IonList>
            {users.length === 0 &&
              <div style={{ textAlign: 'center' }}>
                <p style={{fontSize:'25px',color:'#0080FF'}}>NO DISCUSSION...</p>
                <IonButton onClick={() => handleRefreshClick()} style={{ background: '#0080FF' }}><IonIcon icon={refreshOutline} style={{ fontSize: '25px' }} /></IonButton>
              </div>
            }
          </>}
        {isMessagePage === true &&
          <IonContent>
            {(sendOrReceivedMessage.length > 0 &&
              <IonList style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                {sendOrReceivedMessage.map((mess, index) => (
                  <IonItem
                    lines='none'
                    color={"#fff"}
                    className={mess.type === 1 ? 'yourMessage' : 'receivedMessage'}
                    key={index}>
                    {mess.message}
                  </IonItem>))}
              </IonList>)}
            <div className='card' style={{ backgroundColor: "silver", color: "#0080FF", padding: "20px", borderRadius: "10px", boxShadow: "0px 3px 6px #00000029" }}>
              <div className="input-container" style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
                <input
                  onChange={(e) => setMessage(e.target.value!.toString())}
                  value={message}
                  placeholder='Send a Message...'
                  style={{ backgroundColor: "#fff", color: "#0080FF", borderRadius: "20px", padding: "10px", width: "100%", marginRight: "10px", border: "none" }}
                />
                <button
                  onClick={() => { sendMessages() }}
                  color={"rgb(89, 45, 177)"}
                  style={{ backgroundColor: "#fff", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 3px 6px #00000029", cursor: "pointer" }}>
                  <IonIcon
                    ios={paperPlaneOutline}
                    md={paperPlaneOutline}
                    style={{ color: "#0080FF" }}
                  />
                </button>
              </div>
            </div>
          </IonContent>}
      </IonContent>
    </IonPage>

  );
};

export default Message;
