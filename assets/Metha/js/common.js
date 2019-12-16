/*
 * Hamburger menu
 * Countdown
 * Autoresize Textarea
 * PopUp Subscribe
 * PopUp Video Presentation
 * Gallery
 * Contacts
 * Subscribe
 * AJAX MailChimp
 * Overlay
*/

"use strict";

(function($) {
    
    //loader
    
    (function() {
        $(window).on('load', function() {

            /*
            =========================================================================================
            1. Spinner 
            =========================================================================================
            */
            $(".outslider_loading").fadeOut("slow");

        });
    }());
    
    // Hamburger menu
    $('.navbar-toggle').on('click', function(){
        $(this).toggleClass("open");
    });

    // Countdown
    $("#countdown_dashboard").countdown("2020/01/11", function(event){
        $(this).html(event.strftime('<div class="dash"><span class="dash_title">days</span><div class="digit">%D</div></div> <div class="dash"><span class="dash_title">hours</span><div class="digit">%H</div></div> <div class="clearfix"></div><div class="dash"><span class="dash_title">minutes</span><div class="digit">%M</div></div> <div class="dash"><span class="dash_title">seconds</span><div class="digit">%S</div></div>'));
    });

    // Autoresize textarea
    $("textarea").each(function(){
        autosize(this);
    });

    // PopUp Subscribe
    $('.popup-subscription').magnificPopup({
        type: 'inline',

        fixedContentPos: true,
        fixedBgPos: true,

        overflowY: 'hidden',

        closeBtnInside: true,
        preloader: true,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });

    // PopUp Video Presentation
    $('.video').magnificPopup({
        type: 'iframe',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'hidden',

        closeBtnInside: true,
        preloader: false,

        removalDelay: 300,

        midClick: true,
        mainClass: 'my-mfp-slide-bottom',

        iframe: {
            markup:
                '<div class="mfp-iframe-scaler zoom-anim-dialog">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>'
        }
    });

    // Gallery
    $('.gallery-items').magnificPopup({
        delegate: 'a',
        type: 'image',
        removalDelay: 500,
        closeOnContentClick: false,
        midClick: false,
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        callbacks: {
            beforeOpen: function() {
                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        gallery: {
            enabled:true
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
                return element.find('img');
            }
        }
    });

    // Contacts
    $("#contactForm, #subscribeForm").validator({
        disable: false,
        focus: false
    });

    $("#contactForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formError();
            submitMSG(false, "Did you fill in the form properly?");
        } else {
            // everything looks good!
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm(){
        // Initiate Variables With Form Content
        var name = $("#name").val();
        var email = $("#email").val();
        var message = $("#message").val();

        $.ajax({
            type: "POST",
            url: "php/form-contact.php",
            data: "name=" + name + "&email=" + email + "&message=" + message,
            success : function(text){
                if (text == "success"){
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false,text);
                }
            }
        });
    }

    // Valid messages
    function formSuccess(){
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!");
    }

    function formError(){
        $("#contactForm").removeClass().addClass("shake animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
            $(this).removeClass();
        });
    }

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "style-text-success";
        } else {
            var msgClasses = "style-text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }

    // Subscribe
    $("#subscribeForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formErrorSub();
            submitMSGSub(false, "Please, enter your email.");
        } else {
            // everything looks good!
            event.preventDefault();
        }
    });

    function callbackFunction (resp) {
        if (resp.result === "success") {
            formSuccessSub();
        }
        else {
            formErrorSub();
            //submitMSGSub(false, valid.msg); // Messages from mailchimp
        }
    }

    // Valid messages
    function formSuccessSub(){
        $("#subscribeForm")[0].reset();
        submitMSGSub(true, "Excellent! Check your email.");
        setTimeout(function() {
            $("#msgSubmitSub").addClass('hide');
        }, 4000)
    }

    function formErrorSub(){
        $(".mfp-content").addClass("animated shake");
		setTimeout(function() {
            $(".mfp-content").removeClass("animated shake");
        }, 1000)
    }

    function submitMSGSub(valid, msg){
        if(valid){
            var msgClasses = "style-text-success";
        } else {
            var msgClasses = "style-text-danger";
        }
        $("#msgSubmitSub").removeClass().addClass(msgClasses).text(msg);
    }

    // AJAX MailChimp
    $("#subscribeForm").ajaxChimp({
        url: "https://life.us17.list-manage.com/subscribe/post?u=f3dc56dcdc6102d15ebf74a0d&amp;id=b45c9f6353",
        callback: callbackFunction
    });

	//Overlay
    var pageWrap = document.getElementById('pagewrap'),
    pages = [].slice.call(pageWrap.querySelectorAll('section.page')),
    currentPage = 0, triggerLoading = [].slice.call(pageWrap.querySelectorAll('a.pageload-link')),
    loader = new SVGLoader(document.getElementById('loader'), {
        speedIn: 400,
        easingIn: mina.easeinout
    });

    function init() {
        triggerLoading.forEach(function (trigger,i) {
            trigger.addEventListener('click', function (ev) {
                ev.preventDefault();
                loader.show();

                setTimeout(function () {
                    loader.hide();
                    classie.removeClass(pages[currentPage], 'show');
                    currentPage = currentPage ? 0 : i + 1;
                    classie.addClass(pages[currentPage], 'show');
                }, 1400);
            });
        });
    }
    init();

})(jQuery);

