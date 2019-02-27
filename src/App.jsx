import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase'
class App extends Component {
  constructor(props){
    super(props)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.handleVerification=this.handleVerification.bind(this)
    this.state={
      phoneNumber:'',
      captchaRespone:'',
      showVerification:false,
      verificationCode:''
    }
  }
  handleSubmit(e){
    e.preventDefault()
    const { phoneNumber } = this.state;
    if(this.state.captchaRespone.length>0){
      let appVerifier = window.recaptchaVerifier
      firebase.auth().signInWithPhoneNumber(phoneNumber,appVerifier)
      .then((confirmResult) => {
        // This means that the SMS has been sent to the user
        // You need to:
        //   1) Save the `confirmResult` object to use later
        this.setState({ confirmResult,showVerification:true });
        //   2) Hide the phone number form
        //   3) Show the verification code form
      })
      .catch((error) => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
    }
  }
  handleChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  handleVerification(e){
    e.preventDefault()
    const { confirmResult, verificationCode } = this.state;
  confirmResult.confirm(verificationCode)
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
      console.log(user)
      this.setState({
        verificationCode:''
      })
    })
    .catch((error) => {
      const { code, message } = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
  }
  componentDidMount(){
    if(!firebase.apps.length){
      var config = {
        apiKey: "AIzaSyDevJziMzAlMpErfarI9Q1DcBGU6JF-EF8",
        authDomain: "explorefirebase-80b58.firebaseapp.com",
        databaseURL: "https://explorefirebase-80b58.firebaseio.com",
        projectId: "explorefirebase-80b58",
        storageBucket: "explorefirebase-80b58.appspot.com",
        messagingSenderId: "994024778201"
      };
      firebase.initializeApp(config); 
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.recaptcha, {
      'size': 'normal',
      'callback': (response)=> {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log(response)
        this.setState({
        captchaRespone:response
        })
      },
      'expired-callback': function () {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
   });
   window.recaptchaVerifier.render().then(function (widgetId) {
     window.recaptchaWidgetId = widgetId;
   });
  }
  render() {
    return (
      <div className="container">
      {!this.state.showVerification&&<div>

      <h2 style={{textAlign:'center'}}>Firebase Phone Auth</h2>
      <div ref={(ref)=>this.recaptcha=ref}></div>
      <div className="input-group mb-3">
  <input name='phoneNumber' autoFocus={true} onChange={this.handleChange} type="text" value={this.state.phoneNumber} autoComplete='off' className="form-control" onSubmit={this.handleSubmit} placeholder="Phone Number"/>
  <div className="input-group-append">
    <button className="btn btn-success" onClick={this.handleSubmit} type="submit">Go</button> 
  </div>
  </div>
</div>}
{this.state.showVerification&&<div>
  <h2 style={{textAlign:'center'}}>Enter Verification Code</h2>
  <div className="input-group mb-3">
  <input name='verificationCode' onChange={this.handleChange} type="text" value={this.state.verificationCode} autoComplete='off' autoFocus={true} className="form-control" placeholder="Verification Number"/>
  <div className="input-group-append">
    <button className="btn btn-primary" onClick={this.handleVerification} type="submit">Verify</button> 
  </div>
  </div>
</div>}
      </div>
    );
  }
}

export default App;
