import { IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import './Notification.css';
import { useState } from 'react';
import { arrowBack, informationCircle, mail, refreshOutline } from 'ionicons/icons';
interface Notification {
  numberTicket: number,
  name: string,
  description: string
}
interface Props {
  notification: Notification[]
}
function handleRefreshClick() {
  window.location.reload();
}
const Notification = (props: Props) => {
  const [isDetailPage, setIsDetailPage] = useState(false)
  const [notifToSee, setNotifToSee] = useState({} as Notification)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false);
  const beginDiscussion = (notif: Notification) => {
    setShowToast(true)
    var users = [] as Notification[];
    if (sessionStorage.getItem('users')) {
      users = JSON.parse(sessionStorage.getItem('users')!) as Notification[];
    }
    users.push(notif);
    sessionStorage.setItem('users', JSON.stringify(users))
  }
  const seeDetail = (notif: Notification) => {
    setNotifToSee(notif)
    setIsDetailPage(true)
  }
  return (
    <IonPage>
      <IonHeader style={{ background: '#0080FF' }}>
        <IonToolbar>
          {(isDetailPage === true) &&
            <IonButtons
              onClick={() => setIsDetailPage(false)}
              slot="start">
              <IonIcon
                aria-hidden="true"
                slot="start"
                ios={arrowBack}
                md={arrowBack} />
            </IonButtons>}
          <IonButtons onClick={() => handleRefreshClick()} slot="end">
            <IonIcon icon={refreshOutline} style={{ fontSize: '25px' }} />
          </IonButtons>
          <IonTitle>Notification</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ background: 'silver' }}>
        <IonToast
          isOpen={showToast}
          message="User added to chat"
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notification</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isDetailPage === false &&
          <IonList>
            {props.notification.map((notif, index) => (
              <IonItem
                key={index}
                button
                onClick={() => {
                  setShowModal(true);
                }}
                style={{ transition: 'background-color 0.3s ease-in-out' }}
              >
                {notif.name}
                <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal} className="custom-modal">
                  <IonContent>
                    <IonItem onClick={() => { seeDetail(notif) }}>
                      <IonIcon ios={informationCircle} md={informationCircle} />
                      <span style={{ marginLeft: '5px' }}>Show detail</span>
                    </IonItem>
                    <IonItem onClick={() => { beginDiscussion(notif); }}>
                      <IonIcon aria-hidden="true" ios={mail} md={mail} />
                      <span style={{ marginLeft: '5px' }}>Begin discussion</span>
                    </IonItem>
                  </IonContent>
                </IonModal>
              </IonItem>
            ))}
          </IonList>}
        {isDetailPage === true &&
          <IonCard style={{ backgroundColor: "silver", color: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 3px 6px #00000029" }}>

            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px", letterSpacing: "1px" }}>
              Name: {notifToSee.name}
            </h1>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px", letterSpacing: "1px" }}>
              Ticket Number: {notifToSee.numberTicket}
            </h1>
            <h2 style={{ fontSize: "25px", fontWeight: "normal", marginBottom: "5px", letterSpacing: "1px" }}>
              Description:{notifToSee.description}
            </h2>
          </IonCard>}
      </IonContent>
    </IonPage>

  );
};
export default Notification;
