var loginDivBtn = document.getElementById('login-btn');
var regDivBtn = document.getElementById('reg-btn');
var loginContainer = document.getElementById('login-div');
var regContainer = document.getElementById('reg-div');
var loginBtnContainer = document.getElementById('login-btn-div');
var regBtnContainer = document.getElementById('reg-btn-div');
var loginSubBtn = document.getElementById('login-submit-btn');
var regSubBtn = document.getElementById('reg-submit-btn');

var afterLoginDiv = document.getElementById('after-login-div');
var beforeLoginDiv = document.getElementById('before-login-div');

var isLoggedIn = false;

loginDivBtn.addEventListener('click', function(){
    // if(loginContainer.style.height == 0){
        console.log("login");
        loginContainer.style.height = "80px";
        regContainer.style.height = 0;
        loginBtnContainer.style.height = 0;
        regBtnContainer.style.height = "30px"
    // }
});
regDivBtn.addEventListener('click', function(){
    // if(regContainer.style.height == 0){
        console.log("reg");
        regContainer.style.height = "120px";
        loginContainer.style.height = 0;
        regBtnContainer.style.height = 0;
        loginBtnContainer.style.height = "30px"
    // }
});
loginSubBtn.addEventListener('click', function(){
  afterLoginDiv.style.height = "200px";
  beforeLoginDiv.style.height = 0;
});
regSubBtn.addEventListener('click', function(){
  afterLoginDiv.style.height = "200px";
  beforeLoginDiv.style.height = 0;
})