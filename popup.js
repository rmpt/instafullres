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
    
    var aElement = document.createElement('a');
    aElement.setAttribute('href', url);
    aElement.setAttribute('target', '_blank');
    aElement.innerHTML = chrome.i18n.getMessage('open');
    iDiv.appendChild(aElement);
    
    bodyElement.appendChild(iDiv);
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
    console.log(msg);
    
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

