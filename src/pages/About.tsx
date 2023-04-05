import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const About: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>About</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>Welcome to our application</h1>
                    <p style={{ fontSize: "24px", marginBottom: "40px" }}>This application was created with Ionic and React.</p>
                    <p style={{ fontSize: "20px", marginBottom: "20px" }}>Creator:</p><p style={{ fontSize: "25px", marginBottom: "40px" }}> RIVOMANDIMBISOA Avotra.</p>
                    <p style={{ fontSize: "20px" }}>Version 1.0.0</p>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default About;



