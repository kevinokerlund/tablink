const localStorage = window.localStorage;
const sessionStorage = window.sessionStorage;
const crypto = (window.crypto || window.msCrypto);
const storageName = 'TABLINK';

let db = null;
let currentTabId = null;

loadStore();
registerTab();

window.addEventListener('storage', (storageEvent) => {
	const { key } = storageEvent;
	if (key === storageName) {
		loadStore();
	}
});

window.addEventListener('focus', () => {
	makeMaster();
});

window.addEventListener('unload', () => {
	delete db.byId[currentTabId];
	db.allIds = Object.keys(db.byId);
	if (db.masterTab === currentTabId) {
		db.masterTab = db.allIds[db.allIds.length - 1];
	}
	write();
});

function registerTab() {
	const storedId = sessionStorage.getItem(storageName);
	currentTabId = storedId ? storedId : crypto.getRandomValues(new Uint16Array(3)).join('-');
	if (!storedId) {
		sessionStorage.setItem(storageName, currentTabId);
	}

	db.masterTab = currentTabId;
	db.byId[currentTabId] = {
		id: currentTabId,
		channels: [],
	};
	db.allIds = Object.keys(db.byId);

	write();
}

function loadStore() {
	const stored = localStorage.getItem(storageName);
	db = stored ? JSON.parse(stored) : {
		masterTab: null,
		channelMasters: {},
		allIds: [],
		byId: {},
	};
}

function makeMaster() {
	const tab = db.byId[currentTabId];
	db.masterTab = currentTabId;
	tab.channels.forEach(channel => {
		db.channelMasters[channel] = currentTabId;
	});
	write();
}

function write() {
	localStorage.setItem(storageName, JSON.stringify(db));
}

export function channel(channelName) {
	const tab = db.byId[currentTabId];
	if (!tab.channels.includes(channelName)) {
		tab.channels.push(channelName);
	}
	db.channelMasters[channelName] = currentTabId;

	write();

	return {
		isMaster() {
			return db.channelMasters[channelName] === currentTabId;
		},
		on() {
		},
	}
}

export default {
	channel,
}
