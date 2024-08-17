document.getElementById('exportTable').addEventListener('click', function() {
    var tableHtml = document.getElementById('editableTable').outerHTML;
    tableHtml = tableHtml.replace(/ contenteditable="[^"]*"/g, '');
    tableHtml = tableHtml.replace(/ id="[^"]*"/g, '');
    tableHtml = tableHtml.replace(/ class="[^"]*"/g, '');
    tableHtml = formatTableHTML(tableHtml)
    tableHtml = tableHtml.replace(/\n\n/g, "\n");
    tableHtml = tableHtml.replace(" xmlns=\"http://www.w3.org/1999/xhtml\"", "");
    document.getElementById('exportTextarea').value = tableHtml;
});   

document.getElementById('importTable').addEventListener('click', function() {
    var tableHtml = document.getElementById('exportTextarea').value;
    tableHtml = tableHtml.replace(/<table>/g, "<table id=\"editableTable\">");
    tableHtml = tableHtml.replace(/<th>/g, "<th contenteditable=\"true\">");
    tableHtml = tableHtml.replace(/<td/g, "<td contenteditable=\"true\"");
    document.getElementById('editableTable').outerHTML = tableHtml;
    update(); 
});  

function formatTableHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');
    if (table) {
        const serializer = new XMLSerializer();
        let formattedHtml = serializer.serializeToString(table);
        formattedHtml = formattedHtml.replace(/\>\s+\</g, '><');
        formattedHtml = formattedHtml.replace(/<\/(thead|tbody|tr|th|td)>/g, '$&\n');
        formattedHtml = formattedHtml.replace(/<(thead|tbody|tr|th|td)/g, '\n<$1');
        return formattedHtml.trim();
    }
    return htmlString;
}