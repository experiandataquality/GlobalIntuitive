// Constructor method event listener (pub/sub type thing)
ContactDataServices.eventFactory = function(){
	// Create the events object
	var events = {};

	// Create an object to hold the collection of events
	events.collection = {};

	// Subscribe a new event
	events.on = function (event, action) {
        // Create the property array on the collection object
        events.collection[event] = events.collection[event] || [];
        // Push a new action for this event onto the array
        events.collection[event].push(action);
    };

    // Publish (trigger) an event
	events.trigger = function (event, data) {
        // If this event is in our collection (i.e. anyone's subscribed)
        if (events.collection[event]) {
            // Loop over all the actions for this event
            for (var i = 0; i < events.collection[event].length; i++) {
                // Create array with default data as 1st item
                var args = [data];

                // Loop over additional args and add to array
                for (var a = 2; a < arguments.length; a++){
                    args.push(arguments[a]);
                }

                // Call each action for this event type, passing the args
				try {
					events.collection[event][i].apply(events.collection, args);
				} catch (e) {
					// What to do? Uncomment the below to show errors in your event actions
					//console.error(e);
				}
            }
        }
    };

    // Return the new events object to be used by whoever invokes this factory
    return events;
};
