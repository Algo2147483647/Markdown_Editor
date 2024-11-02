let dag = {};

async function get_file_graph() {
    const path = document.getElementById('path').value;
    const url = 'http://localhost:5000/file_system/get_file_graph';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        dag = JSON.parse((await response.json()).data);
        drawDAGBySVG("root", dag);
        renderFileList("root", dag); // Call the function to display file tree
    } catch (error) {
        console.error('Error:', error);
    }
}

async function file_operation(path, operator) {
    const url = 'http://localhost:5000/file_system/file_operation';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path, operator }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        dag = JSON.parse((await response.json()).data);
        drawDAGBySVG("root", dag);
        renderFileList(dag); // Call the function to display file tree
    } catch (error) {
        console.error('Error:', error);
    }
}