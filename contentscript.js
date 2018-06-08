
var EVENT_CHROME_EXTENSION_REQUEST     = 'Ciberbit_ChromeExtensionRequest';
var PARSED_CLASS = 'IFSP';
var INSTA_THUMB_CLASS = 'v1Nh3 kIKUG  _bz0w';


var parsedUrls = [];


/*********************************************
 * on page loaded handler
 ********************************************/
window.onload = function () {
    // set document tag to check chrome extension existence
    var div = document.createElement("div");
    div.setAttribute('id', 'citizen-card-chrome-extension-tag');
    div.setAttribute('style', 'display: none');
    document.body.appendChild(div);
    
    var articleElement = document.getElementsByTagName('article')[0].childNodes[0].childNodes[0];

    // watch for article dynamic loading
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type != 'childList' || !mutation.addedNodes || mutation.addedNodes.length == 0)  return;
            
            console.log('added nodes: ', mutation.addedNodes.length);
            
            mutation.addedNodes.forEach(function(addedNode){
                var images = getThumbs(addedNode);
                if(images == null) return;

                parseImages(images);
            });
        });
    });
    var config = { attributes: false, childList: true, characterData: false }
    observer.observe(articleElement, config);

    // parse existing thumbs
    var images = getThumbs(document);
    if(images == null) return;

    parseImages(images);
}

var getThumbs = function(parentElement){
    var elementsCollection = parentElement.getElementsByClassName(INSTA_THUMB_CLASS);
    if(!elementsCollection || elementsCollection.length == 0) return null;
    
    return [].slice.call(elementsCollection);
}

var parseImages = function(images){
    images.forEach(function(image){
        var imgElement = image.getElementsByTagName('img')[0];
        var imgSrc = imgElement.getAttribute('src');
        if(!imgSrc) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type != 'attributes' || mutation.attributeName != 'src')  return;

                    var imgSrc = imgElement.getAttribute('src');
                    sendParsedUrlsToPopup(image, imgSrc);
                    
                    observer.disconnect();
                });
            });
            var config = { attributes: true, childList: false, characterData: false }
            observer.observe(imgElement, config);

            return;
        }
        
        sendParsedUrlsToPopup(image, imgSrc);
    });
};

var sendParsedUrlsToPopup = function(thumb, imgSrc){
    parsedUrls.push(imgSrc);
    
    var msg = {
        from: 'contentscript',
        subject: 'InstaPic',
        url: imgSrc
    };
    chrome.runtime.sendMessage(msg, function(response) {});
};

chrome.runtime.onMessage.addListener(function (msg, sender, response) {

    if (msg.from != 'popup' || msg.subject != 'GetInstaPics') return;
    
    var msg = {
        from: 'contentscript',
        subject: 'InstaPics',
        urls: parsedUrls
    };
    chrome.runtime.sendMessage(msg, function(response) {});
});