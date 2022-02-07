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
	// Note: If there are exceptions (ie. other nodes without attributes) then they can also be excluded (but idk any as of right now)
	if (root.nodeType !== 3 && root.hasAttributes()) {
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
