import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-join-circle',
  templateUrl: 'aw-join-circle.html',
})
export class AwJoinCirclePage {
  @ViewChild('code1') _code1: ElementRef;
  @ViewChild('code2') _code2: ElementRef;
  @ViewChild('code3') _code3: ElementRef;
  @ViewChild('code4') _code4: ElementRef;
  @ViewChild('code5') _code5: ElementRef;

  mTexts = {
    title: "Tham gia vòng kết nối",
    code: "Mã truy cập",
    message: "Nhập mã truy cập để tham gia vào vòng kết nối"
  }

  mDatas: {
    input: string;
    elements: Array<HTMLInputElement>;
    emptyValue: string;
  } = {
      input: "",
      elements: [],
      emptyValue: "_"
    }

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log("3_".match(/[^_]/)[0]);

    this.mDatas.elements = [this.code1, this.code2, this.code3, this.code4, this.code5];
    this.resetAll();
  }

  get code1() {
    return this._code1.nativeElement
  }

  get code2() {
    return this._code2.nativeElement
  }

  get code3() {
    return this._code3.nativeElement
  }

  get code4() {
    return this._code4.nativeElement
  }

  get code5() {
    return this._code5.nativeElement
  }

  onClickCodeContainer() {
    for (let i = 0; i < this.mDatas.elements.length; i++) {
      let element = this.mDatas.elements[i];

      if ((element.value == this.mDatas.emptyValue) || (i == (this.mDatas.elements.length - 1))) {
        element.focus();
        break;
      }
    }
  }

  changed(index: number) {
    let elm = this.mDatas.elements[index];
    elm.setSelectionRange(1, 1);
    if (elm.value == "" || elm.value == this.mDatas.emptyValue) {
      this.resetInput(elm);
      if (index != 0) {
        // if (index != this.mDatas.elements.length - 1) {
        //   this.resetInput(this.mDatas.elements[index - 1]);
        // }
        this.mDatas.elements[index - 1].focus();
      }
    }
    else {
      elm.value = elm.value.match(/[^_]/)[0];
      if (index != this.mDatas.elements.length - 1) {
        this.mDatas.elements[index + 1].focus();
      }
      else {
        this.mDatas.input = "";
        this.mDatas.elements.forEach(element => {
          this.mDatas.input += element.value;
        });

        this.onRequestJoinCircle(this.mDatas.input);;
      }
    }
  }

  onRequestJoinCircle(code: string){
    console.log(code);
    
  }

  resetInput(element: HTMLInputElement) {
    element.value = "_";
  }

  resetAll() {
    this.resetInput(this.code1);
    this.resetInput(this.code2);
    this.resetInput(this.code3);
    this.resetInput(this.code4);
    this.resetInput(this.code5);
  }

}
