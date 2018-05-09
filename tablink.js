const KEY_NAME = 'TABLINK';
const watchers = {};
const currentTabId = crypto.getRandomValues(new Uint16Array(5)).join('-');

window.addEventListener('storage', event);

function addWatcher(type, watcher) {
	if (!watchers[type]) {
		watchers[type] = [];
	}

	watchers[type].push(watcher);
}

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
	addWatcher(type, cb);
	return {
		stop: stop.bind(null, type, cb),
	}
}

function stop(type, cb) {
	watchers[type] = watchers[type].filter(callback => callback !== cb);
}

function event(storageEvent) {
	if (storageEvent.key === KEY_NAME && storageEvent.newValue !== null) {
		let {tabId, type, message} = JSON.parse(storageEvent.newValue);

		// The following condition exists for IE10 (not supported),
		// but just in case other browsers have the same bug
		if (currentTabId === tabId) {
			return;
		}

		watchers[type].forEach(cb => {
			cb(message);
		});
	}
}

export default {
	dispatch,
	on,
	stop,
}
