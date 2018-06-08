// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var bodyElement;

function addUrl(url){
    var iDiv = document.createElement('div');
    iDiv.className = 'block';
    
    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', url);
    imgElement.setAttribute('class', 'img-thumb');
    iDiv.appendChild(imgElement);
    
    var actionsDiv = document.createElement('div');
    
    var aImgElement = document.createElement('a');
    aImgElement.setAttribute('href', url);
    aImgElement.setAttribute('target', '_blank');
    aImgElement.innerHTML = chrome.i18n.getMessage('open');
    actionsDiv.appendChild(aImgElement);
    
    var separatorSpan = document.createElement('span');
    separatorSpan.innerHTML = '&nbsp;';
    actionsDiv.appendChild(separatorSpan);
    
    var aCopyElement = document.createElement('a');
    aCopyElement.setAttribute('href', '#');
    aCopyElement.innerHTML = chrome.i18n.getMessage('copy');
    aCopyElement.addEventListener('click', function(event) {
        event.preventDefault();
        copyToClipboard(url);
    });
    actionsDiv.appendChild(aCopyElement);
    
    
    iDiv.appendChild(actionsDiv);
    
    bodyElement.appendChild(iDiv);
}

function copyToClipboard(url) {
    console.log(url);
    var inputClipboardElement = document.createElement("input");
    document.body.appendChild(inputClipboardElement);
    inputClipboardElement.setAttribute('value', url);
    inputClipboardElement.select();
    document.execCommand("copy");
    document.body.removeChild(inputClipboardElement);
}

document.addEventListener('DOMContentLoaded', function () {
    bodyElement = document.getElementsByTagName('body')[0];
    
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        var msg = {
            from: 'popup',
            subject: 'GetInstaPics'
        };
        chrome.tabs.sendMessage(activeTab.id, msg);
    });
    
});


chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    
    if (msg.from != 'contentscript') return;
    
    if(msg.subject == 'InstaPic'){
        
        if(!msg.url) return;
        
        addUrl(msg.url);
        
        window.scrollTo(0, document.body.scrollHeight);
    }
    else if(msg.subject == 'InstaPics'){
        
        if(!msg.urls) return;
        
        msg.urls.forEach(function(url){
            addUrl(url);
        });
        window.scrollTo(0, document.body.scrollHeight);
    }
});

