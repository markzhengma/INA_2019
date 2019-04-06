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
    chrome.runtime.sendMessage({type: 'PDF', url: url});
  } else {
    console.log("is html");
    chrome.runtime.sendMessage({type: 'HTML'});
  }
});
oReq.open('GET', url);
oReq.send()
