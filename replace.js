function findByText(root, text) {
	const children = Array.from(root.children),
		out = [];
	if (children.length > 0) {
		children.forEach((child) => out.push(...findByText(child, text)));
	} else if (root.textContent.includes(text)) {
		out.push(root);
	}
	return out;
}

for (const tag in globalNames) {
	const hasName = findByText(document.body, tag);
	console.log(hasName);
	hasName.forEach((elem) => {
		elem.textContent = elem.textContent.replaceAll(tag, globalNames[tag]);
	});
}
