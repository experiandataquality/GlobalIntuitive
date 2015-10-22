// Use this to initiate and track XMLHttpRequests
ContactDataServices.requestFactory = function(){
	var request = {
		currentRequest: null,
		get: function(url, callback){
			request.currentRequest = new XMLHttpRequest();
			request.currentRequest.open('GET', url, true);
			request.currentRequest.timeout = 5000; // 5 seconds

			request.currentRequest.onload = function() {
				if (request.currentRequest.status >= 200 && request.currentRequest.status < 400) {
				    // Success!
				    var data = JSON.parse(request.currentRequest.responseText);
				    console.log(data);
				    callback(data);
				}
			};

			request.currentRequest.onerror = function() {
			  // There was a connection error of some sort
			};

			request.currentRequest.ontimeout = function() {
			  // There was a connection timeout			  
			};

			request.currentRequest.send();
		}
	};

	return request;
};	