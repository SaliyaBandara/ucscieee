$('.menu-toggle').on('click', function () {
    $('body').toggleClass('open');
    $(".navLogo, .egoSurfDev").delay(700).fadeToggle(300)
});

function getNum(text) {
    return text.replace(/\D/g, "");
}

let selectedSize = {};

function formatNumber(num) {
    return parseFloat((num.toString()).replace(/\D/g, "")).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatThousand(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(date) {
    return new Date(date.replace(/-/g, "/"))
}


// clock start

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        var t = getTimeRemaining(endtime);

        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}

// clock end

// console.log(formatter.format(2500))
// console.log(formatNumber(2500))
// console.log(formatNumber(2500.564))
// console.log(formatNumber(2500654654.1))
// console.log(formatNumber(2500))

const getHostname = (url) => {
    try {
        url = new URL(url);
    } catch (_) {
        return false;
    }
    return new URL(url).hostname;
}


function isMobile() {
    if (window.innerHeight > window.innerWidth)
        return true;
    return false;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
            return decodeURIComponent(sParameterName[1]);
    }
}

function alertUser(type, desc) {
    $('.alert').remove();
    var $div = $("<div>", {
        class: "alert " + type + "-alert"
    });
    // $div.append("<h3>" + desc + "</h3\><div><a class='close'>\&times\;</a></div>")
    $div.append("<h3>" + desc + "</h3\>")
    $("body").prepend($div);
    $(".alert").delay(3000).fadeOut()
}
