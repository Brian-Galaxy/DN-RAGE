// Handle events from client
function trigger(eventName, args) { // eslint-disable-line
    mp.trigger('chatMsg', 'CEF trigger'); // eslint-disable-line
    mp.trigger('chatMsg', eventName); // eslint-disable-line
    mp.trigger('chatMsg', args); // eslint-disable-line
    mp.trigger('chatMsg', JSON.parse(args)); // eslint-disable-line
    var handlers = window.EventManager.events[eventName];
    handlers.forEach(handler => handler(args));
}
