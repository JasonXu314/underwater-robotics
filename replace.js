function findByText(root, text) {
	const children = Array.from(root.childNodes),
		out = [];

	let matched = false;
	const match = {
		elem: root,
		attrs: []
	};

	// root.nodeType = 3 would mean that the node is a text node (see https://developer.mozilla.org/en-US/docs/Web/API/Node)
	// and therefore doesn't have attributes
	// root.nodeType = 8 is a comment node
	// Note: If there are exceptions (ie. other nodes without attributes) then they can also be excluded (but idk any as of right now)
	if (root.nodeType !== 3 && root.nodeType !== 8 && root.hasAttributes()) {
		for (const attr of root.getAttributeNames()) {
			if (root.getAttribute(attr).includes(text)) {
				match.attrs.push(attr);

				if (!matched) {
					out.push(match);
					matched = true;
				}
			}
		}
	}
	if (children.length > 0) {
		children.forEach((child) => out.push(...findByText(child, text)));
	} else if (root.textContent.includes(text)) {
		out.push(match);
	}
	return out;
}

function addSuffix(place) {
	if (place % 10 === 1 && place % 100 !== 11) {
		return place + 'st';
	} else if (place % 10 === 2 && place % 100 !== 12) {
		return place + 'nd';
	} else if (place % 10 === 3 && place % 100 !== 13) {
		return place + 'rd';
	} else {
		return place + 'th';
	}
}

for (const tag in globalNames) {
	const matches = findByText(document.body, tag);
	matches.forEach(({ elem, attrs }) => {
		// if the node is a text node, we know we just have to replace the textContent
		if (elem.nodeType === 3) {
			elem.textContent = elem.textContent.replaceAll(tag, globalNames[tag]);
		} else {
			attrs.forEach((attr) => {
				elem.setAttribute(attr, elem.getAttribute(attr).replaceAll(tag, globalNames[tag]));
			});
		}
	});
}

function sleep(millis) {
	return new Promise((resolve) => {
		setTimeout(resolve, millis);
	});
}

function fetchAndReplace() {
	new Promise((resolve) => {
		axios.get('https://charitable-chads-bot.herokuapp.com/scraper/nums').then((res) => {
			const { goal, raised, donors } = res.data;

			const [{ elem }] = findByText(document.body, '$PROGRESS$');

			elem.textContent = elem.textContent
				.replace('$PROGRESS$', raised)
				.replace('$GOAL$', goal)
				.replace('$DONATION_PLACE$', addSuffix(donors + 1));
			resolve();
		});
	}).then(() => {
		sleep(5000).then(fetchAndReplace);
	});
}

if (location.pathname.includes('crowdfunding')) {
	fetchAndReplace();
}
