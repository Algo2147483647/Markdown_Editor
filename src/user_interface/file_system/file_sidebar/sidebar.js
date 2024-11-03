function renderFileList(root, dag) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    renderFileListByDFS(sidebar, root, dag, 0, new Set()); // Include depth level for indentation
}

function renderFileListByDFS(sidebar, nodeKey, dag, level, visits) {
    if (visits.has(nodeKey)) {
        return
    }else {
        visits.add(nodeKey);
    }

    console.log(nodeKey);
    let childrenContainer = renderFileListItem(sidebar, nodeKey, dag, level)

    dag[nodeKey]["kids"].forEach(kidKey => {
        renderFileListByDFS(childrenContainer, kidKey, dag, level + 1, visits);
    });
}

function renderFileListItem(container, nodeKey, dag, level) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('file-item-container');
    itemContainer.style.paddingLeft = `${16 * level}px`; // Indent based on level

    // Create collapse icon
    const collapseIcon = document.createElement('span');
    collapseIcon.textContent = "〉";
    collapseIcon.classList.add('collapse-icon');
    collapseIcon.style.cursor = 'pointer';
    collapseIcon.onclick = function () {
        childrenContainer.classList.toggle('hidden');
        collapseIcon.classList.toggle('rotated'); // Toggle rotation class
    };

    // Create file item link
    const itemLink = document.createElement('a');
    itemLink.textContent = nodeKey.split('\\').pop().split('.')[0].replace(/_/g, ' ');
    itemLink.href = "#";
    itemLink.onclick = function (event) {
        event.preventDefault();
        fetchFileContent(nodeKey);
    };
    itemLink.classList.add('file-item-text');

    // Append icons and text to the item container
    itemContainer.appendChild(collapseIcon);
    itemContainer.appendChild(itemLink);
    container.appendChild(itemContainer);

    const childrenContainer = document.createElement('div');
    childrenContainer.classList.add('hidden');
    container.appendChild(childrenContainer);

    return childrenContainer;
}

function fetchFileContent(filePath) {
    const url = `http://localhost:5000/operate_file?path=${encodeURIComponent(filePath)}`;

    fetch(url)
        .then(response => response.text())
        .then(htmlContent => renderHtmlContent(htmlContent))
        .catch(error => console.error('Error fetching file content:', error));
}

function renderHtmlContent(htmlContent) {
    const contentContainer = document.getElementById('main-content');
    contentContainer.innerHTML = htmlContent;
}
