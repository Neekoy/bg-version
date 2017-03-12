$(function(){
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('.topNav').offset().top;

        $(window).scroll(function(){
                if( $(window).scrollTop() > stickyHeaderTop + 20 ) {
                        $('.topNav').css({position: 'fixed', top: '0px'});

                } else {
                        $('.topNav').css({position: 'static', top: '50px'});
                        $('.mainPageTop').css({'padding-top': '100px'});

                }
        });

        var mainPageTop = $('.mainPageTopDetailsButton').offset().top;

        $(window).scroll(function(){
                if( $(window).scrollTop() > 260 ) {
                        $('.mainPageTopDisappearMagic').css({opacity: '0'});
                } else {
                        $('.mainPageTopDisappearMagic').css({opacity: '1'});

                }
        });
});