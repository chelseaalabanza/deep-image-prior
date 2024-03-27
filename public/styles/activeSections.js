$(document).ready(function(){
    $('.navbar-nav .nav-item a').click(function() {
        $('.navbar-nav .nav-item a').removeClass('active');
        $(this).addClass('active');
    });

    // Highlight nav-links based on visible sections
    $(window).scroll(function() {
        var scrollPos = $(window).scrollTop();
        $('.section').each(function() {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();
            if (scrollPos >= top && scrollPos <= bottom) {
                var sectionId = $(this).attr('id');
                $('.navbar-nav .nav-item a[href="#' + sectionId + '"]').addClass('active');
            } else {
                var sectionId = $(this).attr('id');
                $('.navbar-nav .nav-item a[href="#' + sectionId + '"]').removeClass('active');
            }
        });
    });
});
    