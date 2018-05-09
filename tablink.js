const KEY_NAME = 'TABLINK';
const watchers = {};
const subscribers = new Set();
const currentTabId = crypto.getRandomValues(new Uint16Array(5)).join('-');

window.addEventListener('storage', event);

function dispatch(type, message, includeOwnTab = false) {
	let data = {tabId: currentTabId, type, message};

	if (includeOwnTab) {
		delete data.tabId;
	}

	data = JSON.stringify(data);

	if (includeOwnTab) {
		event({key: KEY_NAME, newValue: data});
	}

	window.localStorage.setItem(KEY_NAME, data);
	localStorage.removeItem(KEY_NAME);
}

function on(type, cb) {
	if (!watchers[type]) {
		watchers[type] = new Set();
	}

	watchers[type].add(cb);

	return () => watchers[type].delete(cb);
}

function subscribe(cb) {
	subscribers.add(cb);
	return () => subscribers.delete(cb);
}

function event(storageEvent) {
	if (storageEvent.key === KEY_NAME && storageEvent.newValue !== null) {
		let {tabId, type, message} = JSON.parse(storageEvent.newValue);

		// The following condition exists for IE10 (not supported),
		// but just in case other browsers have the same bug
		if (currentTabId === tabId) {
			return;
		}

		(watchers[type] || []).forEach(cb => cb(message));

		subscribers.forEach(cb => cb(type, message));
	}
}

export default {
	dispatch,
	on,
	subscribe,
}
