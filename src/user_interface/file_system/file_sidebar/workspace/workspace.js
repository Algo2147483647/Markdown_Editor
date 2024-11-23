function ShowWorkspaceInputBox() {
    const inputBox = document.getElementById('workspace_input_box_container');
    inputBox.style.display = inputBox.style.display === 'none' ? 'block' : 'none';
}

// Function to handle input submission
function HandleWorkspaceInputSubmit() {
    const inputField = document.getElementById('input-box');
    const path = inputField.value;

    dag = get_file_graph(path)
    const container = document.getElementById('sidebar_file_list_container');
    container.innerHTML = '';

    renderFileListByDFS(dag, container, "root", 0, new Set());

    render_file_graph(path)
}

async function render_file_graph(path) {
    try {
        // 调用父页面的方法
        if (window.parent.get_file_graph) {
            await window.parent.get_file_graph(path);
        } else {
            console.error('父页面未暴露 get_file_graph 方法');
        }
    } catch (error) {
        console.error('Error fetching file graph:', error);
    }
}