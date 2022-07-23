let duration = 1.4,
    delay = 0.5,
    delay2 = 2,
    delay3 = 2,
    mDuration = 1;

$(document).ready(function () {

    $("body").removeClass("preload");
    TweenMax.to(".loadingScreen", duration, {
        delay: delay,
        top: "-120%",
        ease: Expo.easeInOut
    });

    // $("a").on("click", function (e) {
    //     e.preventDefault();

    //     let href = $(this).attr("href");
    //     if (href.indexOf("mailto") > -1 || href.indexOf("tel") > -1)
    //         return (window.open(href, "_blank"));

    //     if ($(this).attr("target") == "_blank")
    //         return (window.open(href, "_blank"));

    //     setTimeout(function () {
    //         window.location = href;
    //     }, mDuration * 1000);

    //     TweenMax.fromTo(".loadingScreen", mDuration, {
    //         top: "100%",
    //         ease: Expo.easeInOut
    //     }, {
    //         top: "0",
    //         ease: Expo.easeInOut
    //     });

    // });
});