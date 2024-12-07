function loadNavbar() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;
            initializeNavigation();
        });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll("#nav-placeholder nav a");
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            navLinks.forEach(item => {
                item.querySelector('.opticon-sel').style.display = 'none';
                item.querySelector('.opticon').style.display = 'block';
                item.querySelector('.labl').classList.remove('labl-sel');
            });
            this.querySelector('.opticon-sel').style.display = 'block';
            this.querySelector('.opticon').style.display = 'none';
            this.querySelector('.labl').classList.add('labl-sel');

            if (this.getAttribute('href') === window.location.pathname.split('/').pop()) {
                event.preventDefault();
            }
        });
    });

    const currentPage = window.location.pathname.split('/').pop();
    const currentLink = document.querySelector(`#nav-placeholder nav a[href="${currentPage}"]`);
    if (currentLink) {
        currentLink.querySelector('.opticon-sel').style.display = 'block';
        currentLink.querySelector('.opticon').style.display = 'none';
        currentLink.querySelector('.labl').classList.add('labl-sel');
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);