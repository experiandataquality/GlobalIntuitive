// Method to handle showing of UA (User Assistance) content
ContactDataServices.ua = {
	banner: {
        show: function(html){
            // Retrieve the existing banner
            var banner = document.querySelector(".ua-banner");
            
            // Create a new banner if necessary
            if(!banner){
                var firstChildElement = document.querySelector("body").firstChild;
                banner = document.createElement("div");
                banner.classList.add("ua-banner");            
                firstChildElement.parentNode.insertBefore(banner, firstChildElement.nextSibling);
            }

            // Apply the HTML content
            banner.innerHTML = html;
        },
        hide: function(){
            var banner = document.querySelector(".ua-banner");
            if(banner) {
                banner.parentNode.removeChild(banner);
            }
        }
    }
};
