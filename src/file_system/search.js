async function search() {
    const path = document.getElementById('path').value;
    const keyword = document.getElementById('search').value;
    const url = 'http://localhost:5000/file_system/search';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path, keyword }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        results = (await response.json())["data"];
    } catch (error) {
        console.error('Error:', error);
        return
    }

    const searchResultsElement = document.getElementById('searchResults');
    searchResultsElement.innerHTML = ''; // Clear previous results

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const fileHeader = headerRow.insertCell(0);
    fileHeader.textContent = 'File';
    const lineNumberHeader = headerRow.insertCell(1);
    lineNumberHeader.textContent = 'Line Number';
    const textHeader = headerRow.insertCell(2);
    textHeader.textContent = 'Text';

    for (const item in results) {
        if (results.hasOwnProperty(item)) {
            results[item].forEach((line) => {
                const [lineNumber, content] = line;
                const row = table.insertRow();

                const fileCell = row.insertCell(0);
                const fileLink = document.createElement('a');
                fileLink.href = item;
                fileLink.textContent = item.split('\\').pop().split('.').slice(0, -1).join('.');
                fileCell.appendChild(fileLink);

                const lineNumberCell = row.insertCell(1);
                lineNumberCell.textContent = lineNumber;

                const textCell = row.insertCell(2);
                textCell.innerHTML = highlightKeyword(content, keyword);

            });
        }
    }

    searchResultsElement.appendChild(table);
}

function highlightKeyword(text, keyword) {
    const regex = new RegExp(keyword, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}