# TabLink
Dispatch data and events to other browser tabs on the same domain.

```bash
npm install tablink
```

## API

### Dispatching
Send a message to all other open tabs.
If the optional argument `includeOwnTab` is set to `true`,
the event will also be handled in the current tab doing the dispatching.

```javascript
tablink.dispatch(type, payload[, includeOwnTab]);
```

**`type`**  
A case-sensitive string representing the event type.

**`payload`**  
A string or an object of data. Anything that can be sent through `JSON.stringify/parse`.

**`includeOwnTab`**  
Optional boolean. If `true`, the event will also be handled on the current tab.

**Example:**
```javascript
tablink.dispatch('DISPLAY_LOGOUT_MODAL', {
  type: 'SESSION_TIMEOUT'
}, true);
```

---

### Event listeners

```javascript
tablink.on(type, listener);
```

**`type`**_(String)_  
A case-sensitive string representing the event type to listen for.

**`listener`** _(Function)_  
A callback function that receives the `payload` as its argument.  

To remove the listener, invoke the function returned by `on`.

**Example:**
```javascript
let unsubscribe = tablink.on('DISPLAY_LOGOUT_MODAL', (payload) => {
  showModal(payload.type);
});

// to stop listening
unsubscribe();
```

### Subscribing to all events

```javascript
tablink.subscribe(listener)
```

**`listener`** _(Function)_  
The callback to be invoked any time an action has been dispatched

Adds a change listener. It will be called any time any action is dispatched.
To unsubscribe, invoke the function returned by subscribe.

**Example:**
```javascript
let unsubscribe = tablink.subscribe((type, payload) => {
	switch (type) {
		case 'TEST':
			// When a type of TEST is dispatched...
			break;
	}
});

// To unsubscribe
unsubscribe();
```
