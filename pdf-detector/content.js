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
      "height: fit-content; width: 180px; position: absolute; top: 0; right: 0; background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 5px;");
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
        regForm.appendChild(usernameRegInput);
        var passwordRegInput = document.createElement("INPUT");
        passwordRegInput.setAttribute("placeholder", "password");
        regForm.appendChild(passwordRegInput);
        var raceRegInput = document.createElement("INPUT");
        raceRegInput.setAttribute("placeholder", "race");
        regForm.appendChild(raceRegInput);
        var genderRegInput = document.createElement("INPUT");
        genderRegInput.setAttribute("placeholder", "gender");
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
    console.log("is pdf, url: " + url);
    chrome.runtime.sendMessage(
      {type: 'PDF', url: url}, 
      function(response){
        console.log(response);
          function setAttributes(el, attrs) {
            for(var key in attrs) {
              el.setAttribute(key, attrs[key]);
            }
          }
          var bioDiv = document.createElement("DIV");
          bioDiv.setAttribute("style", 
                              "height: fit-content; width: 180px; position: absolute; top: 30vh; right: 0; background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 5px;");
  
          var bioName = document.createElement("H4");
          bioName.innerHTML = response.bioName;
          bioDiv.appendChild(bioName);
  
          var bioPic = document.createElement("DIV");
          bioPic.style.backgroundImage = `url(${response.bioPic})`;
          bioPic.style.height = "100px";
          bioPic.style.width = "100px";
          bioPic.style.position = "center";
          bioPic.style.backgroundSize = "cover";
          bioDiv.appendChild(bioPic);
  
          var birthBD = document.createElement("P");
          birthBD.innerHTML = response.bioBD;
          bioDiv.appendChild(birthBD);
  
          var bioSuc = document.createElement("P");
          bioSuc.innerHTML = response.bioSuc;
          bioDiv.appendChild(bioSuc);
  
          var bioLink = document.createElement("A");
          bioLink.innerHTML = "More";
          bioLink.style.color = "white";
          setAttributes(bioLink, {
            "href": response.bioLink,
            "target": "_blank"
            // "style": "height: 30px; width: 50px; background-color: black; ",
          });
          bioDiv.appendChild(bioLink)
  
          document.body.appendChild(bioDiv);
      }
    );
  } else {
    console.log("is html");
    chrome.runtime.sendMessage({type: 'HTML'});
  }
});
oReq.open('GET', url);
oReq.send()
