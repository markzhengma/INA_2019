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

oReq.addEventListener('load', function() {
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
  
          var bioP = document.createElement("P");
          bioP.innerHTML = response.bioP;
          bioDiv.appendChild(bioP);
  
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
