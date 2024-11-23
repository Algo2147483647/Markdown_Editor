function ShowWorkspaceInputBox() {
    const inputBox = document.getElementById('workspace_input_box_container');
    inputBox.style.display = inputBox.style.display === 'none' ? 'block' : 'none';
}

// Function to handle input submission
function HandleWorkspaceInputSubmit() {
    const inputField = document.getElementById('input-box');
    const inputValue = inputField.value;
    get_file_graph(inputValue)
}