function findByText(root, text) {
	const children = Array.from(root.childNodes),
		out = [];

	if (root.href && root.href.includes(text)) {
		out.push({ elem: root, attr: 'href' });
	}
	if (children.length > 0) {
		children.forEach((child) => out.push(...findByText(child, text)));
	} else if (root.textContent.includes(text)) {
		out.push({ elem: root, attr: 'textContent' });
	}
	return out;
}

for (const tag in globalNames) {
	const hasName = findByText(document.body, tag);
	hasName.forEach(({ elem, attr }) => {
		elem[attr] = elem[attr].replaceAll(tag, globalNames[tag]);
	});
}
