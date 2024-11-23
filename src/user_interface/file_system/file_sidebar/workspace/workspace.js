function ShowWorkspaceInputBox() {
    const inputBox = document.getElementById('workspace_input_box_container');
    inputBox.style.display = inputBox.style.display === 'none' ? 'block' : 'none';
}

// Function to handle input submission
function HandleWorkspaceInputSubmit() {
    const inputField = document.getElementById('input-box');
    const path = inputField.value;
    const container = document.getElementById('sidebar_file_list_container');
    container.innerHTML = '';

    get_file_graph(path).then(dag => {
        renderFileListByDFS(dag, container, "root", 0, new Set());
    })
    .catch(error => {
        console.error('Error fetching file graph:', error); // 捕获错误
    });

    render_file_graph(path)
}

async function render_file_graph(path) {
    try {
        // 调用父页面的方法
        if (window.parent.render_file_graph) {
            await window.parent.render_file_graph(path);
        } else {
            console.error('父页面未暴露 render_file_graph 方法');
        }
    } catch (error) {
        console.error('Error fetching file graph:', error);
    }
}