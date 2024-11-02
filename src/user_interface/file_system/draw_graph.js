function drawDAG(root, dag) {
    // init SVG
    const svgContainer = document.getElementById('svg-container');
    while (svgContainer.firstChild) {
        svgContainer.removeChild(svgContainer.firstChild);
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "10000");
    svg.setAttribute("height", "10000");
    svgContainer.appendChild(svg);

    let elements_num = Array(100).fill(0);
    for (let key in dag) {
        let coordinate = dag[key]["coordinate"];
        elements_num[coordinate[0]] = Math.max(elements_num[coordinate[0]], coordinate[1] + 1);
    }

    let elements_num_max = Math.max(...elements_num);
    for (let key in dag) {
        let coordinate = dag[key]["coordinate"];
        dag[key]["coordinate"][1] = (elements_num_max * 50) / elements_num[coordinate[0]] * (coordinate[1] + 0.5);
        dag[key]["coordinate"][0] = (coordinate[0] + 1) * 300 - 200;
    }

    drawByDFS(svg, root, dag, new Set());
}

function drawByDFS(svg, nodeKey, dag, visited) {
    visited.add(nodeKey);
    dag[nodeKey]["kids"].forEach(kidKey => {
        const radius = 8;
        drawEdge(svg,
            dag[nodeKey]["coordinate"][0] + radius, dag[nodeKey]["coordinate"][1],
            dag[kidKey] ["coordinate"][0] - radius, dag[kidKey] ["coordinate"][1]);

        if (!visited.has(kidKey)) {
            drawByDFS(svg, kidKey, dag, visited);
        }
    });

    [x, y] = dag[nodeKey]["coordinate"];
    drawNode(svg, x, y, nodeKey.split('\\').pop().split('.')[0], dag[nodeKey]["file_path"]);
}

function drawNode(svg, x, y, node_name, node_path) {
    const radius = 8;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "#FF8888");
    circle.setAttribute("stroke-width", "2");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + radius * 1.5);
    text.setAttribute("y", y + radius / 1.25);
    text.setAttribute("font-family", "Times New Roman");
    text.setAttribute("font-size", "20");
    text.textContent = node_name;

    const circleLink = document.createElementNS("http://www.w3.org/2000/svg", "a");
    circleLink.setAttribute("href", "javascript:void(0)");  // You can use this to prevent default link action
    circleLink.addEventListener('click', () => drawDAG(node_path, dag));

    const textLink = document.createElementNS("http://www.w3.org/2000/svg", "a");
    textLink.setAttribute("href", node_path);
    textLink.setAttribute("target", "_blank");

    circleLink.appendChild(circle);
    textLink.appendChild(text);
    svg.appendChild(circleLink);
    svg.appendChild(textLink);
}

function drawEdge(svg, x1, y1, x2, y2) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;

    path.setAttribute("d", d);
    path.setAttribute("stroke", "#8888FF");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "1");
    svg.appendChild(path);
}