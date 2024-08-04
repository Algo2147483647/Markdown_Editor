function createButtonAdd(index, type) {
    const button = document.createElement('button');
    button.textContent = '+';
    button.className = 'button_add';
    button.style.position = 'absolute';

    if (type === "row") {
        button.addEventListener('click', function () {
            var table = document.getElementById('editableTable')
            var tbody = table.getElementsByTagName('tbody')[0];
            var thead = table.getElementsByTagName('thead')[0];

            var newRow = tbody.insertRow(index);
            var columnCount = thead.rows[0].cells.length;
            for (var i = 0; i < columnCount; i++) {
                var newCell = newRow.insertCell();
                newCell.contentEditable = "true";
                newCell.innerText = " ";
            }
            updateButtonContainer();
        });
    } else if (type === "col") {
        button.addEventListener('click', function () {
            var table = document.getElementById('editableTable');
            var tbody = table.getElementsByTagName('tbody')[0];
            var thead = table.getElementsByTagName('thead')[0];
            
            var rows = tbody.rows;
            var th = document.createElement('th');
            th.innerText = " "; // You can customize the header text
            thead.rows[0].appendChild(th);
        
            for (var i = 0; i < rows.length; i++) {
                var newCell = rows[i].insertCell(index);
                newCell.contentEditable = "true";
                newCell.innerText = " ";
            }
            updateButtonContainer();
        });
    }
    return button;
}

function createButtonDelete(index, type) {
    const button = document.createElement('button');
    button.style.position = 'absolute';

    if (type === "row") {
        button.className = 'button_delete_row';
        button.addEventListener('click', function () {
            var table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
            var row = table.rows[index];
            if (row) {
                table.deleteRow(index);
                updateButtonContainer(); 
            }
        });
    } else if (type === "col") {
        button.className = 'button_delete_col';
        button.addEventListener('click', function () {
            var table = document.getElementById('editableTable')
            var rows = table.getElementsByTagName('tr');
        
            if (index >= 0 && rows[0] && index < rows[0].cells.length) {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.cells[index]) {
                        row.deleteCell(index);
                    }
                }
                updateButtonContainer(); 
            }
        });
    }

    return button;
}

function updateButtonContainer() {
    const table = document.getElementById('editableTable');
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; 
    const rows = table.querySelectorAll('tbody tr');
    const cols = table.querySelectorAll('thead tr th');

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
    updateButtonContainer();
    window.addEventListener('resize', updateButtonContainer);
});   