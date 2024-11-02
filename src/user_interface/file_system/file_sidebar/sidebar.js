function renderFileList(root, dag) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    renderFileListByDFS(sidebar, root, dag, new Set(), 0); // Include depth level for indentation
}

function renderFileListByDFS(sidebar, nodeKey, dag, level) {
    let childrenContainer = renderFileListItem(sidebar, nodeKey, dag, level)

    dag[nodeKey]["kids"].forEach(kidKey => {
        renderFileListByDFS(childrenContainer, kidKey, dag, level + 1);
    });
}

function renderFileListItem(sidebar, nodeKey, dag, visited, level) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('file-item-container');
    itemContainer.style.paddingLeft = `${16 * level}px`; // Indent based on level

    // Create collapse icon
    const collapseIcon = document.createElement('span');
    collapseIcon.textContent = "<";
    collapseIcon.classList.add('collapse-icon');
    collapseIcon.style.cursor = 'pointer';
    collapseIcon.onclick = function () {
        childrenContainer.classList.toggle('hidden');
    };

    // Create file item text
    const itemText = document.createElement('span');
    itemText.textContent = nodeKey.split('\\').pop().split('.')[0].replace(/_/g, ' ');
    itemText.classList.add('file-item-text');

    // Append icons and text to the item container
    itemContainer.appendChild(collapseIcon);
    itemContainer.appendChild(itemText);
    sidebar.appendChild(itemContainer);

    const childrenContainer = document.createElement('div');
    childrenContainer.classList.add('hidden');
    sidebar.appendChild(childrenContainer);

    return childrenContainer
}