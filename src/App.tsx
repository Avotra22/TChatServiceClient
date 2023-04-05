import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { help, mail, notifications } from 'ionicons/icons';
import Message from './pages/Message';
import Notif from './pages/Notification';
import Tab3 from './pages/About';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import socket from './socket/socket';
/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';

setupIonicReact();
interface Notification {
  numberTicket: number,
  name: string,
  description: string
}
interface Mess {
  numberTicket: number,
  name: string,
  description: string,
  message: string,
  type: number,
  destination: number
}
const App = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationReceived, setNotificationReceived] = useState([] as Notification[]);
  const [ReceivedMessage, setReceivedMessage] = useState([] as Mess[])

  useEffect(() => {
    const notifications = JSON.parse(sessionStorage.getItem('notification') || "[]");
    setNotificationCount(notifications.length);
    window.addEventListener('storage', () => {
      const newNotifications = JSON.parse(sessionStorage.getItem('notification') || "[]");
      setNotificationCount(newNotifications.length);
    });
  }, []);

  useEffect(()=>{
    if(sessionStorage.getItem("notification"))
    {
      if (notificationReceived.length === 0) {
        var notif: Notification[] = [];
        notif = JSON.parse(sessionStorage.getItem("notification")!);
        setNotificationReceived(notif);
      }
    }
  },[])

  useEffect(() => {

    socket.on('notification', (notif: Notification) => {
      var newNotif: Notification[] = [];
      if (sessionStorage.getItem('notification')) {
        newNotif = JSON.parse(sessionStorage.getItem("notification")!);
      }
      newNotif.push(notif);
      sessionStorage.setItem("notification", JSON.stringify(newNotif));
      setNotificationReceived(newNotif)
    })
    socket.on('message0', (data: Mess) => {
      const mess: Mess = {
        message: data.message,
        type: 2,
        description: data.description,
        name: data.name,
        numberTicket: data.numberTicket,
        destination: data.numberTicket
      }
      var arr: Mess[] = [];
      if (sessionStorage.getItem("message")) {
        arr = JSON.parse(sessionStorage.getItem("message")!) as Mess[];
      }
      arr.push(mess)
      sessionStorage.setItem("message", JSON.stringify(arr));
      setReceivedMessage(arr)
    });
    return () => {
      socket.off('notification');
      socket.off('message0');
    }
  }, [socket,[]]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/Message">
              <Message messages={ReceivedMessage} />
            </Route>
            <Route exact path="/Notification">
              <Notif notification={notificationReceived} />
            </Route>
            <Route path="/tab3">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/Message" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="Message" href="/Message">
              <IonIcon aria-hidden="true" icon={mail} style={{ fontSize: '25px' }} />
            </IonTabButton>
            <IonTabButton tab="Notification" href="/Notification">
              <div style={{ position: 'relative' }}>
                <IonIcon icon={notifications} style={{ fontSize: '25px' }} />
                {notificationCount > 0 && (
                  <IonBadge color={"danger"} style={{ position: 'absolute', top: '-3px', right: '-5px', padding: '1px' }}>
                    {notificationCount}
                  </IonBadge>
                )}
              </div>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={help} style={{ fontSize: '25px' }} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;