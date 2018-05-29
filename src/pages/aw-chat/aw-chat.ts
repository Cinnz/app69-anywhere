import { ChatBox } from './../../providers/anywhere/aw-classes/chat-box';
import { AwModule } from './../..//providers/anywhere/aw-module/aw-module';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-aw-chat',
  templateUrl: 'aw-chat.html',
})
export class AwChatPage {
  @ViewChild(Content) content: Content;
  mTexts = {
    title: "Chat nhóm",
    inputPlaceholder: "Nhập tin nhắn..."
  }

  mDatas: {
    myId: string,
    circleId: string,
    chatBox: ChatBox,
    msgContent: string
  } = {
      myId: "",
      circleId: "",
      chatBox: null,
      msgContent: ""
    }

  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    private mKeyboard: Keyboard,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mKeyboard.onKeyboardShow().subscribe(()=>{
      console.log("onKeyboardShow");
      
      this.scrollContentBottom();
    });
    this.mDatas.myId = this.mAwModule.user.id;
    if (this.navParams.data['circleId']) {
      this.mDatas.circleId = this.navParams.data['circleId'];
      this.getChatMessages();
    }
    else {
      this.mDatas.myId = "u00001";
      this.mDatas.chatBox = new ChatBox("chat01");
      let arrMsgs = [
        {
          uId: "u00001",
          uAvatar: "./assets/imgs/logo.png",
          name: "Hoài Nam",
          time: 1525403520000,
          content: "This plugin is designed to  "
        },
        {
          uId: "u00001",
          uAvatar: "./assets/imgs/logo.png",
          name: "Hoài Nam",
          time: 1525403700000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00001",
          uAvatar: "./assets/imgs/logo.png",
          name: "Hoài Nam",
          time: 1525576500000,
          content: "This plugin is designed to "
        },
        {
          uId: "u00002",
          uAvatar: "./assets/imgs/logo.png",
          name: "Một ai đó",
          time: 1525605300000,
          content: "T"
        },
        {
          uId: "u00002",
          uAvatar: "./assets/imgs/logo.png",
          name: "Một ai đó",
          time: 1525619700000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00003",
          uAvatar: "./assets/imgs/logo.png",
          name: "Sơn Tùng",
          time: 1525620600000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00001",
          uAvatar: "./assets/imgs/logo.png",
          name: "Hoài Nam",
          time: 1525620720000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00003",
          uAvatar: "./assets/imgs/logo.png",
          name: "Sơn Tùng",
          time: 1525624320000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00003",
          uAvatar: "./assets/imgs/logo.png",
          name: "Sơn Tùng",
          time: 1526142720000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00003",
          uAvatar: "./assets/imgs/logo.png",
          name: "Sơn Tùng",
          time: 1525624320000,
          content: "This plugin is designed to support Android "
        },
        {
          uId: "u00001",
          uAvatar: "./assets/imgs/logo.png",
          name: "Hoài Nam",
          time: 1525620720000,
          content: "This plugin is designed to support Android "
        },
      ]
      this.mDatas.chatBox.addNewMessages(arrMsgs)
    }
    console.log(this.mDatas.chatBox);
    console.log(this.mDatas.myId);
  }

  getChatMessages() {
    this.mDatas.chatBox = this.mAwModule.getCircleChatById(this.mDatas.circleId);
  }

  get messages() {
    if (this.mDatas.chatBox) {
      return this.mDatas.chatBox.messages;
    }
    else {
      return null;
    }
  }

  showKeyboard(){
    this.mKeyboard.show();
  }

  scrollContentBottom() {
    this.content.scrollToBottom(0);
  }

  onClickClose() {
    this.navCtrl.pop();
  }

  onClickMore() {

  }

  onClickTitle() {

  }

}
