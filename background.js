
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        function modifyDOM() {
            const SEARCH_PAGE_URL_PREFIX = "https://www.ticketswap.fr/event/";
            const LISTING_PAGE_URL_PREFIX = "https://www.ticketswap.fr/listing/";
            const CART_PAGE_URL_PREFIX = "https://www.ticketswap.fr/cart";
            
            if (window.location.href.indexOf(SEARCH_PAGE_URL_PREFIX) !== -1) {
                const REFRESH_TIMER = 1000*(2+Math.floor(Math.random() * 3)); // milliseconds
                const TICKET_URL = "/listing/main-square-festival-2019/";
            
                let listingsCount = $('.container section.listings').length; 
                if (listingsCount < 2) {
                    // When there are tickets to sale, there are 2 lists : 1 for sold and 1 for sale
                    setTimeout(function () {
                        document.location.reload(true);
                    }, REFRESH_TIMER);

                    return;
                }

                let listingItems = $('.container section.listings:first .listings--items');
                let firstItem = listingItems.find('.listings-item:first-child');
             
                let relatedUrl =
                    firstItem.find('div.listings-item--title > h3 > a').attr('href');
             
                if (relatedUrl === undefined) {
                    setTimeout(function () {
                        document.location.reload(true);
                    }, REFRESH_TIMER);
                }
             
                // Ensure it is the good URL
                if (relatedUrl.indexOf(TICKET_URL) === -1) {
                    console.error("Ticket HREF does not match given URL");
                    // Stop extension, there is an error somewhere
                    return;
                } else {
                    console.log("Ticket has been found !");
                    window.location.href = relatedUrl;
                }            
            } else if (window.location.href.indexOf(LISTING_PAGE_URL_PREFIX) !== -1) {
                $('#listing-reserve-form button[type="submit"]').trigger("click");
            } else if (window.location.href.indexOf(CART_PAGE_URL_PREFIX) !== -1) {        
                $('#react-root > div.overlay-wrapper > div > div.overlay-submit > button').trigger('click');
                
                setTimeout(function () {
                    var data = {
                        service_id: 'gmail',
                        template_id: 'ticketswap',
                        user_id: 'user_nb49zn00fjPC4gzagzRoC',
                        template_params: {}
                    };
                    
                    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
                        type: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json'
                    }).done(function() {
                        console.log('Your mail is sent!');
                    }).fail(function(error) {
                        console.log('Oops... ' + JSON.stringify(error));
                    });
                }, 2000);
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

