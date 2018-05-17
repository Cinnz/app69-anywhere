import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
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
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule
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
    Keyboard
  ]
})
export class AppModule { }
