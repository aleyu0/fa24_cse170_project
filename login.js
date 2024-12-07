document.addEventListener('DOMContentLoaded', function() {
    // Guest Login button
    document.querySelector('.action-left-button').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'map.html';
    });

    // Regular Login button
    document.getElementById('proceedtoapp').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'map.html';
    });
});
