import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AwModule } from '../providers/aw-module/aw-module';
import { CircleController } from '../providers/aw-controller/circle-controller';
import { UserController } from '../providers/aw-controller/user-controller';
import { TraceController } from '../providers/aw-controller/trace-controller';
import { SfsModuleProvider } from '../providers/sfs-module/sfs-module';
import { ChatController } from '../providers/aw-controller/chat-controller';
import { FirebaseModule} from '../providers/firebase-module/firebase-module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyC3WriZ1dvKr8_rGSUSMq7JkH2J_sP-DTg",
    authDomain: "aia-anywhere.firebaseapp.com",
    databaseURL: "https://aia-anywhere.firebaseio.com",
    projectId: "aia-anywhere",
    storageBucket: "aia-anywhere.appspot.com",
    messagingSenderId: "580514950491"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AwModule,
    CircleController,
    UserController,
    TraceController,
    SfsModuleProvider,
    Network,
    ChatController,
    Keyboard,
    Clipboard,
    AngularFirestore,
    FirebaseModule
  ]
})
export class AppModule { }
