'use strict';

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    console.log("loading firebase");
}
script.src = 'https://www.gstatic.com/firebasejs/5.9.3/firebase.js';
head.appendChild(script);

var auth = false;
var user = "";
var userData = {};

chrome.browserAction.onClicked.addListener(function(tab){
  // chrome.browserAction.setPopup({
  //   popup: 'popup.html'
  // });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "cool"});
    // if(chrome.browserAction.getBadgeBackgroundColor({}))
    // chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'})
  })
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var config = {
      apiKey: "AIzaSyCdUbJ3aJ6nglBmplBbGPTP5aCsJfmh-k0",
      authDomain: "ina-2019.firebaseapp.com",
      databaseURL: "https://ina-2019.firebaseio.com",
      projectId: "ina-2019",
      storageBucket: "ina-2019.appspot.com",
      messagingSenderId: "959132324422"
    };
    if(!firebase.apps.length){
      firebase.initializeApp(config);
    }

    var dbRef = firebase.database().ref('bio_library/');

    if(request.type == "reg"){
      console.log(request);
      firebase.database().ref('users/' + request.username).once('value')
      .then(function(snapshot){
        if(!snapshot.val()){
          firebase.database().ref('users/' + request.username).set({
            username: request.username,
            password: request.password,
            race: request.race,
            gender: request.gender
          });
          auth = true;
          user = request.username;
          userData = {
            username: request.username,
            password: request.password,
            race: request.race,
            gender: request.gender
          }
          sendResponse({
            auth: true,
            username: request.username
          })
        }else{
          sendResponse({
            auth: false,
            message: "Username already exist."
          })
        }
      })
    }

    if(request.type == "login"){
      console.log(request);
      firebase.database().ref('users/' + request.username).once('value')
      .then(function(snapshot){
        console.log(snapshot.val());
        if(snapshot.val() && snapshot.val().password == request.password){
          auth = true;
          user = request.username;
          userData = snapshot.val();
          console.log(userData);
          sendResponse({
            auth: true,
            username: request.username
          })
        }else{
          sendResponse({
            auth: false,
            message: "Login failed."
          })
        }
      })
    }

    if(request.type == "check"){
      sendResponse({
        auth: auth,
        user: user,
        userData: userData
      })
    }

    // chrome.browserAction.setBadgeText({text: request.type});
    if(request.type == "PDF"){
      console.log(request.topic);
      var resData = {};
      if(userData.gender == "Female"){
        dbRef.orderByChild("bioGender").equalTo("f").once('value')
        .then(function(snapshot){
          // Object.entries(snapshot.val());
            // console.log(Object.entries(snapshot.val())[0][1])
            var snapshotArr = Object.entries(snapshot.val());
            var selectedSnapshot = [];
            console.log(snapshotArr);
            for(var i = 0; i < snapshotArr.length; i ++){
              if(snapshotArr[i][1].bioField == request.topic){
                selectedSnapshot.push(snapshotArr[i]);
              }
            }
            var randomIndex = Math.floor(Math.random() * selectedSnapshot.length);
            console.log(selectedSnapshot[randomIndex][1] || "not retreived.");
            resData = selectedSnapshot[randomIndex][1];
            // chrome.runtime.sendMessage({resData: resData});
        })
        .then(function(){
        //   if(resData){
            sendResponse({
              bioName: resData.bioName,
              bioPic: resData.bioPic,
              bioBD: resData.bioBD,
              bioSuc: resData.bioSuc,
              bioStr: resData.bioStr,
              bioLink: resData.bioLink,
              bioRace: resData.bioRace,
              bioGender: resData.bioGender,
              bioField: resData.bioField
            });
        //   }else{
        //     console.log("no data response from firebase");
        //   }
        })
      }else{
        if(userData.race == "African American" || userData.race == "Latin"){
          dbRef.orderByChild("bioRace").equalTo(userData.race).once('value')
          .then(function(snapshot){
            // Object.entries(snapshot.val());
            // console.log(Object.entries(snapshot.val())[0][1])
            var snapshotArr = Object.entries(snapshot.val());
            var selectedSnapshot = [];
            console.log(snapshotArr);
            for(var i = 0; i < snapshotArr.length; i ++){
              if(snapshotArr[i][1].bioField == request.topic){
                selectedSnapshot.push(snapshotArr[i]);
              }
            }
            var randomIndex = Math.floor(Math.random() * selectedSnapshot.length);
            console.log(selectedSnapshot[randomIndex][1] || "not retreived.");
            resData = selectedSnapshot[randomIndex][1];
            // chrome.runtime.sendMessage({resData: resData});
          })
          .then(function(){
          //   if(resData){
              sendResponse({
                bioName: resData.bioName,
                bioPic: resData.bioPic,
                bioBD: resData.bioBD,
                bioSuc: resData.bioSuc,
                bioStr: resData.bioStr,
                bioLink: resData.bioLink,
                bioRace: resData.bioRace,
                bioGender: resData.bioGender,
                bioField: resData.bioField
              });
          //   }else{
          //     console.log("no data response from firebase");
          //   }
          })
        }else{
          dbRef.orderByChild("bioField").equalTo(request.topic).once('value')
          .then(function(snapshot){
            // Object.entries(snapshot.val());
            // console.log(Object.entries(snapshot.val())[0][1])
            var snapshotArr = Object.entries(snapshot.val());
            console.log(snapshotArr);
            var randomIndex = Math.floor(Math.random() * snapshotArr.length);
            resData = snapshotArr[randomIndex][1];
            console.log(resData || "not retreived.");
            // chrome.runtime.sendMessage({resData: resData});
          })
          .then(function(){
          //   if(resData){
              var bioGender = "Other";
              if(resData.bioGender == "m"){
                bioGender = "Male";
              }else if(resData.bioGender == "f"){
                bioGender = "Female";
              };
              sendResponse({
                bioName: resData.bioName,
                bioPic: resData.bioPic,
                bioBD: resData.bioBD,
                bioSuc: resData.bioSuc,
                bioStr: resData.bioStr,
                bioLink: resData.bioLink,
                bioRace: resData.bioRace,
                bioGender: bioGender,
                bioField: resData.bioField
              });
          //   }else{
          //     console.log("no data response from firebase");
          //   }
          })
        }
      }
      console.log(request.url);
    }
    return true;
  }
);