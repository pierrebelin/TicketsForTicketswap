
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        function modifyDOM() {

            const TICKET_URL = "/listing/main-square-festival-2019/";
            const REFRESH_TIMER = 1*1000; // milliseconds
    
            let listingItems = $('.container section.listings:first .listings--items');
            let firstItem = listingItems.find('.listings-item:first-child');
         
            let relatedUrl = firstItem.find('div.listings-item--title > h3 > a').attr('href');
    
            if (relatedUrl === undefined) {
                setTimeout(function () {
                    console.log("Ticket not found !");
    
                    document.location.reload(true);
                }, REFRESH_TIMER);
            }      
         
            // Ensure it is the good URL
            if (relatedUrl.indexOf(TICKET_URL) === -1) {
                console.error("Ticket HREF does not match given URL");
                return;
            } else {
                console.log("Ticket has been found !");
                window.location.href = relatedUrl;
            }
        }
    
    
        chrome.tabs.executeScript({
            code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            //Here we have just the innerHTML and not DOM structure
            console.log('Popup script:')
        });
    }
  })