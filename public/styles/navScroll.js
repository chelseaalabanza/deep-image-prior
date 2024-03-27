$(document).ready(function() {
    $(window).on('scroll', function() {
        var navbar = $('.navbar');
        if ($(window).scrollTop() > 0) {
            navbar.addClass('navbar-scrolled');
        } else {
            navbar.removeClass('navbar-scrolled');
        }
    });
});
