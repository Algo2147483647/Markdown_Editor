function render_file_graph(path) {
    dag = get_file_graph(path)

    const mainContent = document.getElementById('main-content');
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    RenderDAGToSVG(dag, "root", mainContent)
}

window.render_file_graph = render_file_graph;