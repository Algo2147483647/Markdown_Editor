function render_file_graph(path) {
    const mainContent = document.getElementById('main-content');
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    get_file_graph(path).then(dag => {
        console.log(dag);
        RenderDAGToSVG(dag, "root", mainContent)
    })
    .catch(error => {
        console.error('Error fetching file graph:', error); // 捕获错误
    });
}

window.render_file_graph = render_file_graph;