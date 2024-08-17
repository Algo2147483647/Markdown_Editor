document.getElementById('mergeCells').addEventListener('click', function() {
    var table = document.getElementById('editableTable');
    var selectedCells = Array.from(table.querySelectorAll('td.selected'));
    if (selectedCells.length > 1) {
        var minRowIndex = Math.min(...selectedCells.map(cell => cell.parentNode.rowIndex));
        var maxRowIndex = Math.max(...selectedCells.map(cell => cell.parentNode.rowIndex));
        var minCellIndex = Math.min(...selectedCells.map(cell => cell.cellIndex));
        var maxCellIndex = Math.max(...selectedCells.map(cell => cell.cellIndex));

        var mergeContent = '';
        selectedCells.forEach(function(cell) {
            mergeContent += cell.innerHTML + ' ';
            if (cell.rowSpan > 1) {
                var startRow = cell.parentNode.rowIndex;
                for (var i = 1; i < cell.rowSpan; i++) {
                    selectedCells.push(cell.parentNode.parentNode.rows[startRow + i].cells[cell.cellIndex]);
                }
            }
            if (cell !== selectedCells[0]) {
                cell.remove();
            }
        });
        var firstCell = selectedCells[0];
        firstCell.colSpan = maxCellIndex - minCellIndex + 1;
        firstCell.rowSpan = maxRowIndex - minRowIndex + 1;
        firstCell.innerHTML = mergeContent.trim();
    } else {
        alert('请至少选择两个单元格进行合并');
    }
    update();
    clearSelection();
});

document.getElementById('splitCell').addEventListener('click', function() {
    var table = document.getElementById('editableTable');
    var selectedCells = table.querySelectorAll('td.selected');
    if (selectedCells.length === 1) {
        var cell = selectedCells[0];
        var colSpan = cell.colSpan;
        var rowSpan = cell.rowSpan;
        if (colSpan > 1 || rowSpan > 1) {
            var rowIndex = cell.parentNode.rowIndex;
            var cellIndex = cell.cellIndex;
            cell.colSpan = 1;
            cell.rowSpan = 1;

            for (var i = 0; i < rowSpan; i++) {
                for (var j = 0; j < colSpan; j++) {
                    if (i === 0 && j === 0) continue;
                    var targetRow = table.rows[rowIndex + i];
                    var newCell = targetRow.insertCell(cellIndex + j);
                    newCell.contentEditable = "true";
                    newCell.innerHTML = '';
                }
            }
        } else {
            alert('请先选择一个已合并的单元格进行拆分');
        }
    } else {
        alert('请先选择一个已合并的单元格进行拆分');
    }
    update();
    clearSelection();
});


function clearSelection() {
    document.querySelectorAll('td.selected').forEach(function(cell) {
        cell.classList.remove('selected');
    });
}

let isSelecting = false;
let startCell = null;

document.addEventListener('mousedown', function(event) {
    if (event.target.tagName === 'TD' && event.target.contentEditable === "true") {
        clearSelection();
        isSelecting = true;
        startCell = event.target;
        event.target.classList.add('selected');
    }
});

document.addEventListener('mousemove', function(event) {
    if (isSelecting && event.target.tagName === 'TD' && event.target.contentEditable === "true") {
        clearSelection();
        let endCell = event.target;
        let startRowIndex = startCell.parentNode.rowIndex - 1;
        let endRowIndex = endCell.parentNode.rowIndex - 1;
        let startCellIndex = startCell.cellIndex;
        let endCellIndex = endCell.cellIndex;

        let minRowIndex = Math.min(startRowIndex, endRowIndex);
        let maxRowIndex = Math.max(startRowIndex, endRowIndex);
        let minCellIndex = Math.min(startCellIndex, endCellIndex);
        let maxCellIndex = Math.max(startCellIndex, endCellIndex);

        for (let i = minRowIndex; i <= maxRowIndex; i++) {
            for (let j = minCellIndex; j <= maxCellIndex; j++) {
                let cell = document.querySelector(`tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
                if (cell && cell.contentEditable === "true") {
                    cell.classList.add('selected');
                }
            }
        }
    }
});

document.addEventListener('mouseup', function(event) {
    isSelecting = false;
    startCell = null;
});

