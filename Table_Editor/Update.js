


function getMergeCellsArray() {
    var table = document.getElementById("editableTable");
    const rows = table.rows;
    MergeCellsArray = Set()

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].cells.length; j++) {
            let cell = rows[i].cells[j];
            let rowSpan = cell.rowSpan || 1;
            let colSpan = cell.colSpan || 1;

            if (rowSpan > 1 || colSpan > 1) {
                MergeCellsArray.add([i, j, i + rowSpan, j + colSpan,text])
            }
        }
    }
    return MergeCellsArray;
}



function update() {
    updateCellAttributes();
    updateButtonContainer();
}

function updateCellAttributes() {
    var table = document.getElementById("editableTable");
    const rows = table.rows;
    const processed = Array.from({ length: rows.length }, () => []);

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].cells.length; j++) {
            if (processed[i][j]) continue;  // Skip already processed cells

            let cell = rows[i].cells[j];
            let rowSpan = cell.rowSpan || 1;
            let colSpan = cell.colSpan || 1;

            if (rowSpan > 1 || colSpan > 1) {
                let positions = [];
                for (let r = 0; r < rowSpan; r++) {
                    for (let c = 0; c < colSpan; c++) {
                        positions.push(`(${i + r}, ${j + c})`);
                        processed[i + r][j + c] = true;
                    }
                }
                cell.setAttribute('data-position', `[${positions.join(', ')}]`);
            } else {
                cell.setAttribute('data-position', `(${i}, ${j})`);
                processed[i][j] = true;
            }
        }
    }
}

// Update cell attributes after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    updateCellAttributes();
});


function updateButtonContainer() {
    const table = document.getElementById('editableTable');
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; 
    const rows = table.querySelectorAll('tr');
    const cols = table.querySelectorAll('thead th');

    rows.forEach((row, index) => {
        {
            const button = createButtonAdd(index, "row");
            button.style.top = `${row.offsetTop - 7}px`;
            buttonContainer.appendChild(button);
        }
        {
            const button = createButtonDelete(index, "row");
            const rect = row.getBoundingClientRect();
            button.style.top = `${row.offsetTop}px`;
            button.style.height = `${rect.height}px`;
            button.style.left = `${row.offsetLeft + 18 - 10}px`;
            button.style.width = "8px"
            buttonContainer.appendChild(button);
        }
    });
    cols.forEach((col, index) => {
        {
            const button = createButtonAdd(index, "col");
            button.style.top = `${col.offsetTop - 18}px`;
            button.style.left = `${col.offsetLeft + 20 - 7}px`;
            buttonContainer.appendChild(button);
        }
        {
            const button = createButtonDelete(index, "col");
            const rect = col.getBoundingClientRect();
            button.style.top = `${col.offsetTop - 8}px`;
            button.style.left = `${col.offsetLeft + 20}px`;
            button.style.width = `${rect.width}px`;
            button.style.height = "8px"
            buttonContainer.appendChild(button);
        }
    });

    {
        {
            const lastRow = rows[rows.length - 1];
            const button = createButtonAdd(rows.length, "row");
            button.style.top = `${lastRow.offsetTop + lastRow.offsetHeight - 7}px`;
            buttonContainer.appendChild(button);
        }
        {
            const lastCol = cols[cols.length - 1];
            const button = createButtonAdd(cols.length, "col");
            button.style.top = `${lastCol.offsetTop - 18}px`;
            button.style.left = `${lastCol.offsetLeft + lastCol.offsetWidth + 20 - 7}px`;
            buttonContainer.appendChild(button);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    update();
    window.addEventListener('resize', updateButtonContainer);
});   

function getCells(index, type) {
    const cells = document.querySelectorAll('#editableTable td, #editableTable th');
    const result = new Set();

    cells.forEach(cell => {
        const position = cell.getAttribute('data-position');
        if (position) {
            const positionsArray = JSON.parse(position.replace(/\(/g, '[').replace(/\)/g, ']'));

            if (Array.isArray(positionsArray[0])) {
                positionsArray.forEach(pos => {
                    if ((type === 'row' && pos[0] === index) || 
                        (type === 'col' && pos[1] === index)) {
                        result.add(cell);
                    }
                });
            } else {
                if ((type === 'row' && positionsArray[0] === index) || 
                    (type === 'col' && positionsArray[1] === index)) {
                    result.add(cell);
                }
            }
        }
    });

    return Array.from(result);
}
