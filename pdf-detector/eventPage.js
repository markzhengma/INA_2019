'use strict';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.browserAction.setBadgeText({text: request.type});
    console.log(request.url);
  }
);