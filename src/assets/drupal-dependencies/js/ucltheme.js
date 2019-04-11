jQuery(document).ready(function($) {

    function css2json(css){
        var s = {};
        if(!css) return s;
        if(css instanceof CSSStyleDeclaration) {
            for(var i in css) {
                if((css[i]).toLowerCase) {
                    s[(css[i]).toLowerCase()] = (css[css[i]]);
                }
            }
        } else if(typeof css == "string") {
            css = css.split("; ");
            for (var i in css) {
                var l = css[i].split(": ");
                s[l[0].toLowerCase()] = (l[1]);
            };
        }
        return s;
    }

    function json2css(json) {
      var stl = '';

      for (var i in json ) {
        if ( json[i] ) {
          stl += i + ':' + json[i] + ';';
        }
      }

      // remove the double semicolumn that appears sometimes...
      stl = stl.replace(/\;\;/g, ';');

      return stl;
    }

    // fix image style for mobile
    $('.region-content img').each(
      function() {
        if ( $(this).attr('style') ) {
          // $(this).attr('style', 'max-width:' + $(this).width() + 'px; width: 100%; height: auto');
          var style_obj = css2json($(this).attr('style'));
          style_obj.width = '100%';
          style_obj.height = 'auto';
          style_obj['max-width'] = $(this).width()+'px';
          $(this).attr('style',json2css(style_obj));
        }
      }
    );

    // mobile aside menu
    $('.asidemenu__action').click(function() {
        $(this).toggleClass('active');
        $('.uclblock-col_menu').toggleClass('active');
    });

    $('#contents-landing .col').click(function () {
        var link = $(this).find('.content a.more');
        if(link) {
            window.location = link.attr('href');
        }
    });

    var windowsHeight = $( window ).height() - 235;
    if  (windowsHeight < 500){
        windowsHeight = 500;
    }
    $('#accueil-etudiants, #accueil-etudiants .img-bg, .column , .column .img-bg, #contents-landing .col').css("height" , windowsHeight );


    if ($('.accueil-etudiants-wrapper').length) {

        resizeImageLanding();
        $(window).resize(function() {
            resizeImageLanding();
        });

        if ($.browser.msie && $.browser.version == "8.0") {
            $('#contents-landing .col').addClass('active');
        } else {
            activateLandingSlideshow();
            //setTimeout( activateLandingSlideshow, 4000);
        }
    }

    function activateLandingSlideshow() {

        $('#contents-landing .col').mouseenter(function(e) {

            var windowWidth = $(window).width();

            $('#contents-landing .col').removeClass('active').addClass('notActive');
            $(this).removeClass('notActive').addClass('active');

            var indexOpen = $(this).index();
            var leftRight = [[100, 0], [0, 0], [0, 100]];
            $('#accueil-etudiants .column').removeClass('active');
            $('#accueil-etudiants .column:eq(' + indexOpen + ')').stop(true, false).animate({
                left: "0",
                right: "0"
            }, 500 ).addClass('active');

            if (indexOpen != 1)
            {
                $('#accueil-etudiants .column:not(.active)').stop(true, false).animate({
                    left: (windowWidth/100)*leftRight[indexOpen][0],
                    right: (windowWidth/100)*leftRight[indexOpen][1],
                }, 500 );
            } else {
                $('#accueil-etudiants .column:eq(0):not(.active)').stop(true, false).animate({
                    left: "0",
                    right: windowWidth
                },  500 );
                $('#accueil-etudiants .column:eq(2):not(.active)').stop(true, false).animate({
                    left: windowWidth,
                    right: "0"
                }, 500 );
            }
        });

        $('.accueil-etudiants-wrapper').mouseleave(function(e) {
            resetPositionCol(500);
        });

    }

    function resizeImageLanding() {
        var windowWidth = $(window).width();

        resetPositionCol(0);

        if (windowWidth <= 1440) {
            //$('.img-bg').css("background-size", "auto " + windowWidth + "px");
        } else {
            $('.img-bg').css("background-size", "" + windowWidth + "px auto");
        }
    }

    function resetPositionCol(duration) {
        var windowWidth = $(window).width();

        var leftRight = [[0, 66.6666],[33.3333, 33.3333], [66.6666, 0]];
        for(var i = 0; i < 3; i++) {
            $('#accueil-etudiants .column:eq('+i+')').stop(true, false).animate({
                left: (windowWidth/100)*leftRight[i][0],
                right: (windowWidth/100)*leftRight[i][1]
            }, duration ).removeClass('active');
        }
        $('#contents-landing .col').removeClass('active').removeClass('notActive');
    }

    $('.uclblock-parcours .row-0 .small').hide();
    $('.uclblock-parcours .row-1 .text, .uclblock-parcours .row-1 .pull-right').hide();
    $('.uclblock-parcours .row-2 .text, .uclblock-parcours .row-2 .pull-right').hide();

    $('.uclblock-parcours .item .small').click(function() {
        $(this).parent().parent().find('.bigger .pull-right, .bigger .text').hide();
        $(this).parent().parent().find('.bigger .small').show();
        $(this).parent().find('.small').hide();
        $(this).parent().find('.pull-right, .text').show();
        $(this).parent().prependTo($(this).closest('.uclblock-parcours .items'));
        $(this).parent().parent().find('.bigger').removeClass('bigger').addClass('smaller');
        $(this).parent().removeClass('smaller').addClass('bigger');

    });

    $('.carousel-icon').slick({
        infinite: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 3,
        slidesToScroll: 2,
        touchMove: true,
        prevArrow: "<button type=\"button\" class=\"slick-prev\"><div class=\"circle\"><span class=\"sr-only\">Previous</span></div></button>",
        nextArrow: "<button type=\"button\" class=\"slick-next\"><div class=\"circle\"></div><span class=\"sr-only\">Next</span></button>",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.carousel-chiffres').slick({
        infinite: true,
        centerMode: true,
//        nextArrow:'<button class="slick-prev"><i class="fa fa-long-arrow-right"></i></button>',
//        centerPadding: '23%',
        centerPadding: '288px',
        slidesToShow: 3,
        slidesToScroll: 4,
        touchMove: true,
        prevArrow: "<button type=\"button\" class=\"slick-prev\"><div class=\"circle\"><span class=\"sr-only\">Previous</span></div></button>",
        nextArrow: "<button type=\"button\" class=\"slick-next\"><div class=\"circle\"></div><span class=\"sr-only\">Next</span></button>",
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    centerMode: true,
                    centerPadding: '100px',
                    slidesToShow: 3,
                    infinite: true,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    centerMode: true,
                    centerPadding: '100px',
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    centerMode: true,
                    centerPadding: '80px',
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    var current = $('.carousel-chiffres').slick('slickCurrentSlide');
    setSlickCenterClass(current);
    $('.carousel-chiffres').on('afterChange', function(event, slick, currentSlide) {
        setSlickCenterClass(currentSlide);
    });

    function setSlickCenterClass(currentSlide)
    {
        if ($(window).width() >= 1100)
        {
            $('.carousel-chiffres div.slick-slide[data-slick-index="' + (currentSlide + 1) + '"]').addClass('slick-center');
            $('.carousel-chiffres div.slick-slide[data-slick-index="' + (currentSlide - 1) + '"]').addClass('slick-center');
        } else if ($(window).width() < 1100 && $(window).width() >= 600)
        {
            //$('.center div.slick-slide[data-slick-index="'+currentSlide+'"]').removeClass("slick-center");
            //$('.center div.slick-slide[data-slick-index="'+(currentSlide+1)+'"]').addClass('slick-center');
            $('.carousel-chiffres div.slick-slide[data-slick-index="' + (currentSlide - 1) + '"]').addClass('slick-center');
        }
    }

    $('.counter').counterUp();

//        $('.carousel-chiffres').slick('slickAdd', "<div></div>");


    /*$('.carousel-intranet').slick({
        infinite: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 1,
        slidesToScroll: 1,
        touchMove: true,
        prevArrow: "<button type=\"button\" class=\"slick-prev\"><div class=\"circle\"><span class=\"sr-only\">Previous</span></div></button>",
        nextArrow: "<button type=\"button\" class=\"slick-next\"><div class=\"circle\"></div><span class=\"sr-only\">Next</span></button>",
    });*/



    if ($('div').hasClass('page-album'))
    {
        $('.carousel-album').slick({
            infinite: true,
            centerMode: true,
            centerPadding: '50px',
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            touchMove: true,
            prevArrow: "<button type=\"button\" class=\"slick-prev\"><div class=\"circle\"><span class=\"sr-only\">Previous</span></div></button>",
            nextArrow: "<button type=\"button\" class=\"slick-next\"><div class=\"circle\"></div><span class=\"sr-only\">Next</span></button>",
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
            ]
        });
    }

    $('.polaroids').slick({
        infinite: true,
        centerMode: true,
        centerPadding: '300px',
        slidesToShow: 3,
        slidesToScroll: 4,
        touchMove: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1555,
                settings: {
                    centerMode: true,
                    centerPadding: '120px',
                    slidesToShow: 3,
                    infinite: true,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    centerMode: true,
                    centerPadding: '380px',
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1079,
                settings: {
                    centerMode: true,
                    centerPadding: '320px',
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 959,
                settings: {
                    centerMode: true,
                    centerPadding: '220px',
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 758,
                settings: {
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
//            {
//                breakpoint: 768,
//                settings: {
//                    centerMode: true,
//                    centerPadding: '80px',
//                    slidesToShow: 2,
//                    slidesToScroll: 2
//                }
//            },
//            {
//                breakpoint: 600,
//                settings: {
//                    centerMode: true,
//                    centerPadding: '20px',
//                    slidesToShow: 1,
//                    slidesToScroll: 1
//                }
//            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    // gallery
    $(".page-album .image").on("click", function(event) {

        var id = $(this).attr('id');
        var uniqid = $(this).data('uniqid');

        $("#carousel-modal[data-uniqid='" + uniqid + "']").addClass("active");

        $("body").addClass("modalbox-active");

        $("#carousel-modal[data-uniqid='" + uniqid + "']" + ' .carousel-album').slick('slickGoTo', parseInt(id)).slick('setPosition');

        $("#carousel-modal[data-uniqid='" + uniqid + "']" + " .modalbox-close").on("click", function(event) {
            $("#carousel-modal[data-uniqid='" + uniqid + "']").removeClass("active");
            $("body").removeClass("modalbox-active");
        });

        $(document).keyup(function(e){
            if(e.which == 27){
                $("#carousel-modal[data-uniqid='" + uniqid + "']" + " .modalbox-close").click();
            }
        });

    });


    // Accordion Intranet Valves
    $(".valves .accordion .annee").click(function() {
        $(this).parent().find(".infos").slideToggle("slow");
        $(this).toggleClass("active");
    });

    $(".valves .accordion .infos").hide();
    $(".valves .accordion:first-child .annee").addClass('active');
    $(".valves .accordion:first-child .infos").show();


    // uclblock-text_video
    $(".uclblock-text_video").each(function () {
        var $_element = $(this);
        resize_content_video_text($_element);
        $(window).resize(function () {
            resize_content_video_text($_element);
        });
    });

    function resize_content_video_text($_element) {
        var content_text_video_height = $_element.find('.content .block-content-summary').height();
        var content_text_video_marginTop = parseInt($_element.find('.content').css('margin-top'));
        var content_text_video_marginBottom = parseInt($_element.find('.content').css('margin-bottom'));
        var content_text_video_outerHeight = content_text_video_height + content_text_video_marginTop + content_text_video_marginBottom
        var content_type_width = $_element.find('.content .block-content-type span').outerWidth(true);
        if ((content_type_width + content_text_video_marginTop) > content_text_video_outerHeight) {
            var content_text_video_new_height = (((content_type_width + content_text_video_marginTop) - content_text_video_outerHeight) + content_text_video_height);
            $_element.find('.content').height(content_text_video_new_height);
        } else {
            $_element.find('.content').height(content_text_video_height);
        }
    }

    // shown and hide second level of filers search
    $('.search-filter span.collapseMenu').each(function() {
        $(this).click(function () {
            $(this).toggleClass('open').parent().find('ul').slideToggle("slow");
            $(this).toggleClass('collapsed');
        });
        $(this).parent().find('input').closest('li').each(function(){
            $(this).click(function(){
                if($(this).find('input').is(':checked')) {
                    $(this).find('input').prop('checked', false);
                }
                else{
                    $(this).find('input').prop('checked', true);
                    alert('Selected filter : '+$(this).find('input').val());
                }
            }).css('cursor', 'pointer');
        });
    });

    /*$('.menu-parcours span.dropdown-toggle').each(function() {
        // shown and hide second level of sidebar menu
        $(this).click(function () {
            $(this).toggleClass('open').parent().find('ul').slideToggle("slow");
            $(".menu-parcours span.dropdown-toggle").not(this).removeClass('open');
            $(".menu-parcours span.dropdown-toggle").not(this).parent().find('ul.dropdown-menu').hide();
        });
    });*/


    $('.uclblock-col_menu span.collapseMenu').each(function() {
        // shown and hide second level of sidebar menu
        $(this).click(function () {
            $(this).toggleClass('open').parent().find('ul').slideToggle("slow");
            $(this).prev('a').toggleClass('collapsed');
        });
        // Adapte height of arrow for second level of sidebar menu
        $(this).css('height', $(this).prev().innerHeight());
    });

    // On load, show second level if first level element is active
    $('.uclblock-col_menu ul.menu>li>a.active').each(function() {
        if($(this).next('span.collapseMenu').length > 0) {
            $(this).removeClass('active');
            $(this).toggleClass('collapsed');
            $(this).next('span.collapseMenu').toggleClass('open').parent().find('ul').slideToggle("slow");
        }
    });


    // shown and hide second level of main menu on mobile device
    $('.navbar-collapse span.collapseMenu').each(function() {
        $(this).click(function() {
            $(this).toggleClass('open').parent().find('ul').slideToggle("slow");
            $(this).prev('a').toggleClass('collapsed');
        });
    });

    $('.myucl-menu a.myucl-toggle').click(function() {
        $(this).toggleClass("active").parent().find('ul.dropdown-menu').slideToggle("slow");
    });

    // shown and hide second level of myucl menu
    /*
    $('.myucl-menu span.collapseMenu').each(function() {
        $(this).click(function() {
            $(this).toggleClass('open').parent().children('ul.collapse').slideToggle("slow");
            $(this).prev('a').toggleClass('collapsed');
        });
    });
    */

    // Open and close burger button
    $(".hamburger-slim").click(function() {
        $(this).toggleClass('active');
    });

//    $(".myucl-toggle").click(function() {
//        $(this).toggleClass("active");
//    });

//    $(document).click(function() {
//        $('.myucl-toggle').removeClass('active');
//    });

    $(".profile-toggle").click(function() {
        $(this).toggleClass('active');
    });

    // Open and close tools menu
    $('.mobile-uclmenu_header .dropdown a').click(function() {
        if ($(this).closest('.dropdown').hasClass('open'))
        {
            $(this).find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        } else {
            $(this).find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    });

    // Transform tabs in accordion for mobile devices
    $('#tab').tabCollapse({
        tabsClass: 'hidden-xs',
        accordionClass: 'visible-xs'
    });


    // Text in two columns in Block text
    if ($(window).width() >= 767)
    {
        $('.uclblock-texts .block-content-summary').columnize({
            columns: 2
        });
    }


    //Link extensions
    $('.all').click(function() {
        var val1 = $(this).find('.more-link a').attr('href');
        window.location.href = $val1;
    });

    $('.uclblock-mosaique .row').click(function() {
        var val2 = $(this).find('a.more').attr('href');
        window.location.href = val2;
    });

    $('.uclblock-chiffres .col').each(function() {
        var val4 = $(this).find('a.more').attr('href');
        $(this).wrap('<a class="wrapper-element" href="' + val4 + '"></a>');
    });

    $('.uclblock-links .col').click(function() {
        var val5 = $(this).find('a').attr('href');
        window.location.href = val5;
    });

    $('.uclblock-list_1_sticky .col').click(function() {
        var val5 = $(this).find('a.more').attr('href');
        window.location.href = val5;
    });



    var $window = $(window);

    function checkWidth() {
        var windowsize = $window.width();
        return windowsize < 768;
    }

    $(".uclblock-links_list_grid h3").click(function() {
        if ( checkWidth() ) {

            $(this).parent().find("ul").slideToggle("slow");
            $(this).toggleClass("active");
        }
    });

    $(".uclblock-links_list h2").click(function() {
        if ( checkWidth() ) {

            $(this).parent().find(".down").slideToggle("slow");
            $(this).toggleClass("active");
        }
    });

    // Bind event listener
    $(window).resize(function() {

        if ( !checkWidth() ) {

            $(".uclblock-links_list_grid ul").show();
            $(".uclblock-links_list h2").show();
        }
        else {

            $(".uclblock-links_list_grid h3").each(function() {

              if ( $(this).hasClass('active') == false ) {

                  $(this).parent().find("ul").hide();
              }
            });

            if ( $(".uclblock-links_list h2").hasClass('active') == false ) {

                $(this).parent().find(".down").hide();
            }
        }
    });





    // Links list in accordion for mobile devices
    if ($(window).width() < 768) {
        // $(".uclblock-links_list h2").click(function() {
        //     $(this).parent().find(".down").slideToggle("slow");
        //     $(this).toggleClass("active");
        // });
        // $(".uclblock-links_list_grid h3").click(function() {
        //     $(this).parent().find("ul").slideToggle("slow");
        //     $(this).toggleClass("active");
        // });
    };
    if($(window).width() > 991 && $(".uclblock-links_list").length) {
        $(".uclblock-links_list ul").matchHeight({byRow: false });
    }
    else {
        $(".uclblock-links_list ul").css('height', '');
    }

    //Load more for Actu & agenda
    size = $(".uclblock-list_1_sticky .row.list").size();
    x = 3;
    $('.uclblock-list_1_sticky .row.list:lt(' + x + ')').show();
    $('#loadMore').click(function() {
        x = (x + 5 <= size) ? x + 5 : size;
        $('.uclblock-list_1_sticky .row.list:lt(' + x + ')').show();
    });

    //Load more for Search list results
    $('.uclblock-list_search .row.item').hide();
    size2 = $(".uclblock-list_search .row.item").size();
    y = 7;
    $('.uclblock-list_search .row.item:lt(' + y + ')').show();
    $('#loadMore-search').click(function() {
        y = (y + 5 <= size2) ? y + 5 : size2;
        $('.uclblock-list_search .row.item:lt(' + y + ')').show();
    });

    // add active class to current menu
//    var loc = window.location.href;
//    $(".menu li a").each(function () {
//        if (loc.indexOf($(this).attr("href")) !== -1) {
//            $(this).parent().addClass("active");
//            $(this).addClass("active");
//        }
//    });

    $.fn.vAlign = function() {
        return this.each(function(i) {
            $(this).children().wrapAll('<div class="nitinh-vAlign" style="position:relative;"></div>');
            var div = $(this).children('div.nitinh-vAlign');
            var ph = $(this).innerHeight();
            var dh = div.height();
            var mh = (ph - dh) / 2;
            div.css('top', mh);
        });
    };

    // Titles Vertical align (Fac homepage)
    $(".uclblock-name_left .right").vAlign();




    //Slide remove line if no type text
    $('.uclblock-slide .carousel-inner .title .slide-content .block-content-pretitle span').each(function() {
        if ($(this).html().length == 0) {
            $(this).parent().hide();
            $(this).parent().parent().find('.block-content-title').css("margin-top", "59px");
        }
    });

    //Slide remove line if no type text
    $('.uclblock-slide-intranet .carousel-inner .title .slide-content .block-content-pretitle span').each(function() {
        if ($(this).html().length == 0) {
            $(this).parent().hide();
            $(this).parent().parent().find('.block-content-title').css("margin-top", "59px");
        }
    });

    $.fn.matchHeight._update();

});

(function ($) {
    Drupal.behaviors.burgermenu = {
       attach: function (context, settings) {
         // shown and hide second level of myucl menu
         $('.myucl-menu span.collapseMenu').each(function() {
           if (!$(this).hasClass('burger_processed')) {
               $(this).click(function() {
                   $(this).toggleClass('open').parent().children('ul.collapse').slideToggle("slow");
                   $(this).prev('a').toggleClass('collapsed');
               });
           $(this).addClass('burger_processed');
           }
         });
       }
    };
}(jQuery));
