const localStorage = window.localStorage;
const sessionStorage = window.sessionStorage;
const crypto = (window.crypto || window.msCrypto);
const storageName = 'tabLink';

const storedId = sessionStorage.getItem(storageName);
const currentTabId = storedId ? storedId : crypto.getRandomValues(new Uint16Array(3)).join('-');
if (!storedId) {
	sessionStorage.setItem(storageName, currentTabId);
}

ping();

if (document.hasFocus()) {
	dispatch('request-master');
}

window.addEventListener('storage', (storageEvent) => {
	const { key, newValue } = storageEvent;
	if (!key.startsWith(storageName) || !newValue) {
		return;
	}

	const { dispatcher, recipients, internalCommand, payload } = JSON.parse(newValue);

	if (recipients.length && !recipients.includes(currentTabId)) {
		return;
	}

	switch (internalCommand) {
		case 'ping':
			pong(dispatcher);
			break;
		case 'pong':
			break;
		case 'request-master':
			break;
	}
});

function ping() {
	dispatch('ping');
}

function pong(tabId) {
	dispatch('pong', null, [ tabId ]);
}

function dispatch(internalCommand, payload = {}, recipients = []) {
	const data = JSON.stringify({
		dispatcher: currentTabId,
		recipients,
		internalCommand,
		payload,
	});

	localStorage.setItem(storageName, data);
	localStorage.removeItem(storageName);
}
