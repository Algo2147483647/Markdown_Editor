async function hide_sidebar() {
    const sidebar = document.getElementById('sidebar');
    const showButton = document.getElementById('show_sidebar_button');

    sidebar.classList.add('collapsed');
    showButton.classList.add('show');
}

document.getElementById('show_sidebar_button').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');

    sidebar.classList.remove('collapsed');
    this.classList.remove('show');
});

