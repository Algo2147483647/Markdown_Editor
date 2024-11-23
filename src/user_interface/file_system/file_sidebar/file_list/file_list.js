function renderFileListByDFS(dag, container, nodeKey, level, visits) {
    if (visits.has(nodeKey)) {
        return
    }else {
        visits.add(nodeKey);
    }

    let childrenContainer = renderFileListItem(dag, container, nodeKey, level)

    dag[nodeKey]["kids"].forEach(kidKey => {
        renderFileListByDFS(dag, childrenContainer, kidKey, level + 1, visits);
    });
}

function renderFileListItem(dag, container, nodeKey, level) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('file-item-container');
    itemContainer.style.paddingLeft = `${16 * level}px`; // Indent based on level


    // Create collapse icon
    const collapseIcon = document.createElement('span');
    collapseIcon.textContent = dag[nodeKey]["kids"].length == 0 ? "•" : "∟";
    collapseIcon.classList.add('collapse-icon');
    collapseIcon.style.cursor = 'pointer';
    collapseIcon.onclick = function () {
        childrenContainer.classList.toggle('hidden');
        collapseIcon.classList.toggle('rotated'); // Toggle rotation class
    };
    itemContainer.appendChild(collapseIcon);


    // Create file item link
    const itemLink = document.createElement('a');
    itemLink.textContent = nodeKey.split('\\').pop().split('.')[0].replace(/_/g, ' ');
    itemLink.href = "#";
    itemLink.onclick = function (event) {
        event.preventDefault();
        getFileContent(nodeKey);
    };
    itemLink.classList.add('file-item-text');
    itemContainer.appendChild(itemLink);

    container.appendChild(itemContainer);

    const childrenContainer = document.createElement('div');
    container.appendChild(childrenContainer);

    return childrenContainer;
}

function renderHtmlContent(htmlContent) {
    const contentContainer = document.getElementById('main-content');
    contentContainer.innerHTML = htmlContent;
}
