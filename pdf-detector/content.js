/**
  * Check if the request is a PDF file.
  * @param {Object} details First argument of the webRequest.onHeadersReceived
  *                         event. The properties "responseHeaders" and "url"
  *                         are read.
  * @return {boolean} True if the resource is a PDF file.
  */
function isPdfFile(response, url) {
  var header = response.getResponseHeader('content-type');
  console.log(header);
  if (header) {
    var headerValue = header.toLowerCase().split(';', 1)[0].trim();
    return (headerValue === 'application/pdf' ||
            headerValue === 'application/octet-stream' &&
            url.toLowerCase().indexOf('.pdf') > 0);
  }
}

var oReq = new XMLHttpRequest();
var url = window.location.toString();
var auth = false;
var user = "";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.action == "cool"){
    if(!document.getElementById("user-div")){
      var userDiv = document.createElement("DIV");
      userDiv.setAttribute("style", 
      "height: fit-content; width: 180px; position: absolute; top: 0; right: 0; background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 5px; border: 2px solid white;");
      userDiv.setAttribute("id", "user-div");

      if(auth == false){
        var nonAuthDiv = document.createElement("DIV");
        nonAuthDiv.setAttribute("style", "height: 200px; overflow: hidden; transition: height 0.5s;");

        var loginDivBtnContainer = document.createElement("DIV");
        loginDivBtnContainer.setAttribute("style", "height: 30px; overflow: hidden; transition: height 0.5s;");
        var loginDivBtn = document.createElement("BUTTON");
        loginDivBtn.innerHTML = "Login";
        loginDivBtn.addEventListener('click', function(){
            // if(loginContainer.style.height == 0){
                console.log("login");
                loginFormContainer.style.height = "80px";
                regFormContainer.style.height = 0;
                loginDivBtnContainer.style.height = 0;
                regDivBtnContainer.style.height = "30px"
            // }
        });
        loginDivBtnContainer.appendChild(loginDivBtn);
        nonAuthDiv.appendChild(loginDivBtnContainer);
    
        var loginFormContainer = document.createElement("DIV");
        loginFormContainer.setAttribute("style", "height: 0; overflow: hidden; transition: height 0.5s;");
        var loginForm = document.createElement("FORM");
        loginForm.setAttribute("style",
        "display: flex; flex-direction: column; justify-content: center;");
        var usernameLoginInput = document.createElement("INPUT");
        usernameLoginInput.setAttribute("placeholder", "username");
        loginForm.appendChild(usernameLoginInput);
        var passwordLoginInput = document.createElement("INPUT");
        passwordLoginInput.setAttribute("placeholder", "password");
        loginForm.appendChild(passwordLoginInput);
        var btnLoginInput = document.createElement("INPUT");
        btnLoginInput.setAttribute("type", "button");
        btnLoginInput.setAttribute("value", "Login");
        btnLoginInput.addEventListener("click", function(){
          chrome.runtime.sendMessage({
            type: "login", 
            username: usernameLoginInput.value,
            password: passwordLoginInput.value
          }, 
          function(response){
            console.log(response);
            if(response.auth == true){
              auth = true;
              user = response.username;

              var msgDiv = document.createElement("DIV");
              msgDiv.innerHTML = "Hello, " + user;
              authDiv.appendChild(msgDiv);

              nonAuthDiv.style.height = 0;
              authDiv.style.height = "200px";
            }else if(response.auth == false){
              alert(response.message);
            }
          })
        })
        loginForm.appendChild(btnLoginInput);
        loginFormContainer.appendChild(loginForm);
        nonAuthDiv.appendChild(loginFormContainer);
  
        var regDivBtnContainer = document.createElement("DIV");
        regDivBtnContainer.setAttribute("style", "height: 30px; overflow: hidden; transition: height 0.5s;");
        var regDivBtn = document.createElement("BUTTON");
        regDivBtn.innerHTML = "Register";
        regDivBtn.addEventListener('click', function(){
            // if(loginContainer.style.height == 0){
                console.log("reg");
                regFormContainer.style.height = "160px";
                loginFormContainer.style.height = 0;
                regDivBtnContainer.style.height = 0;
                loginDivBtnContainer.style.height = "30px"
            // }
        });
        regDivBtnContainer.appendChild(regDivBtn);
        nonAuthDiv.appendChild(regDivBtnContainer);
  
        var regFormContainer = document.createElement("DIV");
        regFormContainer.setAttribute("style", "height: 0; overflow: hidden; transition: height 0.5s;");
        var regForm = document.createElement("FORM");
        regForm.setAttribute("style",
        "display: flex; flex-direction: column; justify-content: center;");

        var usernameRegInput = document.createElement("INPUT");
        usernameRegInput.setAttribute("placeholder", "username");
        usernameRegInput.setAttribute("type", "text");
        regForm.appendChild(usernameRegInput);

        var passwordRegInput = document.createElement("INPUT");
        passwordRegInput.setAttribute("placeholder", "password");
        passwordRegInput.setAttribute("type", "password");
        regForm.appendChild(passwordRegInput);

        var raceRegInput = document.createElement("SELECT");
        var aaOption = document.createElement("option");
        aaOption.setAttribute("value", "African American");
        aaOption.innerHTML = "African American";
        raceRegInput.appendChild(aaOption);
        var latOption = document.createElement("option");
        latOption.setAttribute("value", "Latin");
        latOption.innerHTML = "Latin";
        raceRegInput.appendChild(latOption);
        var otherOption = document.createElement("option");
        otherOption.setAttribute("value", "Other");
        otherOption.innerHTML = "Other";
        raceRegInput.appendChild(otherOption);
        regForm.appendChild(raceRegInput);

        var genderRegInput = document.createElement("SELECT");
        var maleOption = document.createElement("option");
        maleOption.setAttribute("value", "Male");
        maleOption.innerHTML = "Male";
        genderRegInput.appendChild(maleOption);
        var femaleOption = document.createElement("option");
        femaleOption.setAttribute("value", "Female");
        femaleOption.innerHTML = "Female";
        genderRegInput.appendChild(femaleOption);
        var otherOption = document.createElement("option");
        otherOption.setAttribute("value", "Other");
        otherOption.innerHTML = "Other";
        genderRegInput.appendChild(otherOption);
        regForm.appendChild(genderRegInput);

        var btnRegInput = document.createElement("INPUT");
        btnRegInput.setAttribute("type", "button");
        btnRegInput.setAttribute("value", "Register");
        btnRegInput.addEventListener("click", function(){
          chrome.runtime.sendMessage({
            type: "reg", 
            username: usernameRegInput.value,
            password: passwordRegInput.value,
            race: raceRegInput.value,
            gender: genderRegInput.value
          }, 
          function(response){
            console.log(response);
            if(response.auth == true){
              auth = true;
              user = response.username;

              var msgDiv = document.createElement("DIV");
              msgDiv.innerHTML = "Hello, " + user;
              authDiv.appendChild(msgDiv);

              nonAuthDiv.style.height = 0;
              authDiv.style.height = "200px";
            }else if(response.auth == false){
              alert(response.message);
            }
          })
        })
        regForm.appendChild(btnRegInput);
        regFormContainer.appendChild(regForm);
        nonAuthDiv.appendChild(regFormContainer);
        userDiv.appendChild(nonAuthDiv);

        var authDiv = document.createElement("DIV");
        authDiv.setAttribute("style", "height: 0; overflow: hidden; transition: height 0.5s;");
        userDiv.appendChild(authDiv);
    
      }else{
        var msgDiv = document.createElement("DIV");
        msgDiv.innerHTML = "Hello, " + user;
        userDiv.appendChild(msgDiv);
      }
      document.body.appendChild(userDiv);

    }else{
      var userDiv = document.getElementById("user-div");
      document.body.removeChild(userDiv);
    }
  }
})

oReq.addEventListener('load', function() {
  chrome.runtime.sendMessage(
    {type: "check"}, 
    function(response){
      auth = response.auth;
      user = response.user;
      console.log(response.userData);
    }
  )
  if (isPdfFile(this, url)) {
    oReq.open("GET", "http://localhost:5218/topic?abstract=" + url);
    oReq.send();
    var topic = "";
    oReq.onreadystatechange = (e) => {
      switch (oReq.responseText){
        case '["Physics"]':
          topic = "ph";
          console.log(topic);
          sendDataToBackend();
          break;
        case '["Chemistry"]':
          topic = "ch";
          console.log(topic);
          sendDataToBackend();
          break;
        case '["Computer Science"]':
          topic = "cs";
          console.log(topic);
          sendDataToBackend();
          break;
        default:
          break;
      }
    }
    var callTimes = 0;
    console.log("is pdf, url: " + url);
    function sendDataToBackend(){
      if(callTimes === 0){
        callTimes += 1;
        console.log(callTimes);
        chrome.runtime.sendMessage(
          {type: 'PDF', url: url, topic: topic}, 
          function(response){
            console.log(response);
              function setAttributes(el, attrs) {
                for(var key in attrs) {
                  el.setAttribute(key, attrs[key]);
                }
              }
              var bioDiv = document.createElement("DIV");
              bioDiv.setAttribute("style", 
                                  "height: fit-content; width: 200px; position: absolute; top: 30vh; right: 0; background: rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px; border: 2px solid white; overflow: hidden; transition: width 0.5s;");
            
              var bioPic = document.createElement("DIV");
              bioPic.style.backgroundImage = `url(${response.bioPic})`;
              bioPic.style.height = "120px";
              bioPic.style.width = "120px";
              bioPic.style.marginTop = "50px";
              bioPic.style.position = "center";
              bioPic.style.backgroundSize = "cover";
              bioPic.style.borderRadius = "50%";
              bioPic.style.border = "2px solid white"
              bioDiv.appendChild(bioPic);
              
              var bioTitle = document.createElement("DIV");
              bioTitle.style.paddingTop = "20px";
              bioTitle.style.paddingBottom = "20px";
              bioTitle.style.paddingLeft = "10px";
              bioTitle.style.backgroundColor = "white";
              bioTitle.style.marginTop = "20px";
              bioTitle.style.marginBottom = "20px";
              bioTitle.style.width = "90%";
              var bioName = document.createElement("B");
              bioName.innerHTML = response.bioName;
              bioTitle.appendChild(bioName);
              var bioJob = document.createElement("SMALL");
              bioJob.innerHTML = "<br/>" + response.bioSuc;
              bioTitle.appendChild(bioJob);
              bioDiv.appendChild(bioTitle);

              var bioDesc = document.createElement("DIV");
              bioDesc.style.paddingTop = "10px";
              bioDesc.style.paddingBottom = "10px";
              bioDesc.style.paddingLeft = "10px";
              bioDesc.style.backgroundColor = "white";
              bioDesc.style.marginBottom = "20px";
              bioDesc.style.width = "90%";
              bioDesc.style.fontSize = "11px";

              bioDesc.innerHTML = "<b>Ethnicity Affiliation: </b>" + response.bioRace + "<br/>" + "<b>Gender: </b>" + response.bioGender + "<br/>" + "<b>Birth Date: </b>" + response.bioBD + "<br/><br/><br/>" + response.bioSuc;
              var showStr = false;
              bioDesc.addEventListener("click", function(){
                if(showStr === false){
                  showStr = true;
                  bioDesc.style.fontSize = "13px";
                  bioDesc.innerHTML = response.bioStr;
                }else if(showStr === true){
                  showStr = false;
                  bioDesc.style.fontSize = "11px";
                  bioDesc.innerHTML = "<b>Ethnicity Affiliation: </b>" + response.bioRace + "<br/>" + "<b>Gender: </b>" + response.bioGender + "<br/>" + "<b>Birth Date: </b>" + response.bioBD + "<br/><br/><br/>" + response.bioSuc;
                }
              })
              bioDesc.addEventListener("mouseover", function(){
                bioDesc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                bioDesc.style.cursor = "pointer";
              })
              bioDesc.addEventListener("mouseout", function(){
                bioDesc.style.backgroundColor = "white";
              })
              
              bioDiv.appendChild(bioDesc);

              // var birthBD = document.createElement("P");
              // birthBD.innerHTML = response.bioBD;
              // bioDiv.appendChild(birthBD);
              
              // var bioSucDiv = document.createElement("DIV");
              // bioSucDiv.style.borderBottom = "2px solid white";
              // bioSucDiv.style.width = "180px";
              // var bioSuc = document.createElement("P");
              // bioSuc.innerHTML = response.bioSuc;
              // bioSucDiv.appendChild(bioSuc);
              // bioSucDiv.addEventListener("click", function(){
              //   if(bioSuc.innerHTML == response.bioSuc){
              //     bioSuc.innerHTML = response.bioStr;
              //   }else if(bioSuc.innerHTML == response.bioStr){
              //     bioSuc.innerHTML = response.bioSuc;
              //   }
              // })
              // bioSucDiv.addEventListener("mouseover", function(){
              //   bioSucDiv.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
              //   bioSucDiv.style.cursor = "pointer";
              // })
              // bioSucDiv.addEventListener("mouseout", function(){
              //   bioSucDiv.style.backgroundColor = "rgba(0, 0, 0, 0)";
              // })
              // bioDiv.appendChild(bioSucDiv);
      
              // var bioLink = document.createElement("A");
              // bioLink.innerHTML = "More";
              // bioLink.style.color = "white";
              // setAttributes(bioLink, {
              //   "href": bioLink,
              //   "target": "_blank"
              //   // "style": "height: 30px; width: 50px; background-color: black; ",
              // });
              // bioDiv.appendChild(bioLink)
    
              // var bioIframe = document.createElement("IFRAME");
              // bioIframe.src = "localhost:5218/topic?abstract=" + url;
              // bioIframe.style.height = 0;
              // bioIframe.style.width = 0;
              // bioIframe.style.frameBorder = 0;
              // bioDiv.appendChild(bioIframe);
      
              document.body.appendChild(bioDiv);
          }
        );
      }
    }
    
  } else {
    console.log("is html");
    chrome.runtime.sendMessage({type: 'HTML'});
  }
});
oReq.open('GET', url);
oReq.send()