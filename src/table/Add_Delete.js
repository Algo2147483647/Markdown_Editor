function createButtonAdd(index, type) {
    const button = document.createElement('button');
    button.textContent = '+';
    button.className = 'button_add';
    button.style.position = 'absolute';
    button.addEventListener('click', function () {
        var table = document.getElementById('editableTable')
        var tbody = table.getElementsByTagName('tbody')[0];
        var thead = table.getElementsByTagName('thead')[0];

        if (type === "row") {   
            var newRow = tbody.insertRow(index);
            var columnCount = thead.rows[0].cells.length;

            for (var i = 0; i < columnCount; i++) {
                var newCell = newRow.insertCell();
                newCell.contentEditable = "true";
                newCell.innerText = " ";
            }
        } else if (type === "col") {
            var rows = tbody.rows;
            var th = document.createElement('th');
            th.innerText = " "; // You can customize the header text
            thead.rows[0].appendChild(th);

            for (var i = 0; i < rows.length; i++) {
                var newCell = rows[i].insertCell(index);
                newCell.contentEditable = "true";
                newCell.innerText = " ";
            }
        }
        update();
    });
    return button;
}

function createButtonDelete(index, type) {
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.className = 'button_delete_' + type;
    button.addEventListener('click', function () {
        cells = getCells(index, type)
        cells.forEach(cell => {
            let rowSpan = cell.rowSpan || 1;
            let colSpan = cell.colSpan || 1;

            if (rowSpan > 1 && type === 'row') {
                cell.rowSpan = rowSpan - 1;
            } else if (colSpan > 1 && type === 'col') {
                cell.colSpan = colSpan - 1;
            } else {
                cell.remove();
            }
        });
        update(); 
    });
    return button;
}
