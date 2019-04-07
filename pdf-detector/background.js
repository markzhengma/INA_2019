'use strict';

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    console.log("loading firebase");
}
script.src = 'https://www.gstatic.com/firebasejs/5.9.3/firebase.js';
head.appendChild(script);


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



    chrome.browserAction.setBadgeText({text: request.type});
    if(request.type == "PDF"){
      var resData = {};
      dbRef.once('value')
      .then(function(snapshot){
        var randomIndex = Math.floor(Math.random() * 3);
        console.log(snapshot.val()[randomIndex] || "not retreived.");
        resData = snapshot.val()[randomIndex];
        // chrome.runtime.sendMessage({resData: resData});
      })
      .then(function(){
      //   if(resData){
          sendResponse({
            bioName: resData.bioName,
            bioPic: resData.bioPic,
            bioBD: resData.bioBD,
            bioP: resData.bioP,
            bioLink: resData.bioLink,
            bioRace: resData.bioRace,
            bioGender: resData.bioGender,
            bioField: resData.bioField
          });
      //   }else{
      //     console.log("no data response from firebase");
      //   }
      })
      console.log(request.url);
    }
    return true;
  }
);