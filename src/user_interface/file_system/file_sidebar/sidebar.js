function displayFileTree(dag) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    displayFileTreeByDFS(sidebar, "root", dag, new Set(), 0); // Include depth level for indentation
}

function toggleVisibility(event) {
    const childrenContainer = event.currentTarget.nextElementSibling;
    if (childrenContainer) {
        childrenContainer.classList.toggle('hidden');
    }
}

function displayFileTreeByDFS(sidebar, nodeKey, dag, visited, level) {
    if (visited.has(nodeKey)) return;
    visited.add(nodeKey);

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

    // Create add file icon
    const addIcon = document.createElement('span');
    addIcon.textContent = "+";
    addIcon.classList.add('add-icon');
    addIcon.style.cursor = 'pointer';
    addIcon.onclick = function () {
        // Implement logic to add a file (e.g., prompt user for file name)
        const fileName = prompt("Enter file name:");
        if (fileName) {
            const path = nodeKey + fileName;
            file_operation(path, "create");
            displayFileTreeByDFS(childrenContainer, fileName, dag, visited, level + 1);
        }
    };

    // Create file item text
    const itemText = document.createElement('span');
    itemText.textContent = nodeKey.split('\\').pop().split('.')[0].replace(/_/g, ' ');
    itemText.classList.add('file-item-text');

    // Append icons and text to the item container
    itemContainer.appendChild(collapseIcon);
    itemContainer.appendChild(addIcon);
    itemContainer.appendChild(itemText);
    sidebar.appendChild(itemContainer);

    const childrenContainer = document.createElement('div');
    childrenContainer.classList.add('hidden');
    sidebar.appendChild(childrenContainer);

    dag[nodeKey]["kids"].forEach(kidKey => {
        displayFileTreeByDFS(childrenContainer, kidKey, dag, visited, level + 1);
    });
}
