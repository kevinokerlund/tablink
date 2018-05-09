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

Parameter | Description
--- | ---
`type` | A case-sensitive string representing the event type.
`payload` | A string or an object of data. Anything that can be sent through `JSON.stringify/parse`.
`includeOwnTab` | Optional boolean. If `true`, the event will also be handled on the current tab.

**Example:**
```javascript
tablink.dispatch('DISPLAY_LOGOUT_MODAL', {type: 'SESSION_TIMEOUT'}, true);
```


### Event listeners

```javascript
tablink.on(type, listener);
```

Parameter | Description
--- | ---
`type` | A case-sensitive string representing the event type to listen for.
`listener` | A callback function that receives the `payload` as its argument.

**Example:**
```javascript
tablink.on('DISPLAY_LOGOUT_MODAL', (payload) => {
  logout();
  showModal(payload.type);
});
```

### Removing an event listener
There are two ways to remove an event listener:

Option 1: Pass the event type and same function reference to the `stop` function:
```javascript
tablink.on(type, listener);
tablink.stop(type, listener);
```

Option 2: Store the listener to a variable, and later call `.stop()`. 
```javascript
let listener = tablink.on(type, handler);
listener.stop();
```
