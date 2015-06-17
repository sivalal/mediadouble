

document.domain = 'yaveo.com';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    //document.cookie = cname + "=" + cvalue + "; " + expires;
    document.cookie = cname + "=" + cvalue + ";domain=yaveo.com;path=/; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}


function ChangeLanguage(key,url)
{
    setCookie("RTN_Lang",key,1);
    window.location = url;
}

var RTN_Lang="";
if(getCookie("RTN_Lang")!="")
{
    RTN_Lang=getCookie("RTN_Lang");
    setCookie("RTN_Lang","",1);
}

var DIRECTV = DIRECTV ? DIRECTV : new Object();
DIRECTV.SiteIntegration = DIRECTV.SiteIntegration ? DIRECTV.SiteIntegration : new Object();
DIRECTV.SiteIntegration.Client = DIRECTV.SiteIntegration.Client ? DIRECTV.SiteIntegration.Client : new Object();
DIRECTV.SiteIntegration.Bridge = DIRECTV.SiteIntegration.Bridge ? DIRECTV.SiteIntegration.Bridge : new Object();
DIRECTV.SiteIntegration.Bridge.options = new Object();


DIRECTV.SiteIntegration.Client.initialize = function () {
    var dtvDataDiv = document.getElementById('dtv_tup');
    var webkitFix = document.createElement('iFrame');
    webkitFix.height = 0;
    webkitFix.width = 0;
    webkitFix.border = 0;
    webkitFix.style.display = 'none';
    webkitFix.src = 'about:blank';
    dtvDataDiv.insertBefore(webkitFix, dtvDataDiv.firstChild);

    var iframe = document.createElement('iFrame');
    iframe.src = DIRECTV.SiteIntegration.Bridge.options.hostUrl + '/rightnow/siteintegration';
    iframe.height = 0;
    iframe.width = 0;
    iframe.border = 0;
    iframe.style.display = 'none';
    dtvDataDiv.insertBefore(iframe, webkitFix);

    var spacerDiv = document.createElement('div');
    spacerDiv.id = 'dtv-topnav-temp';
    spacerDiv.style.height = '107px';
    dtvDataDiv.insertBefore(spacerDiv, iframe);

    DIRECTV.SiteIntegration.Client.commFrame = iframe;
    DIRECTV.SiteIntegration.Client.reportPageData();

    if (window.attachEvent) {
        document.body.attachEvent('onclick', DIRECTV.SiteIntegration.Client._reformatDtvUrl);
    } else {
        document.body.addEventListener('click', DIRECTV.SiteIntegration.Client._reformatDtvUrl, false);
    }

};

DIRECTV.SiteIntegration.Client.addHeader = function () {
    var loaded = false;
    try {
        if (DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV) {
            DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV.SiteIntegration.Comm.getData(
                    "/rightnow/topnav", DIRECTV.SiteIntegration.Client._writeHeader,RTN_Lang);
            loaded = true;
        }
    } catch (e) {}

    if (!loaded) {
        setTimeout(DIRECTV.SiteIntegration.Client.addHeader, 10);
    }
};


DIRECTV.SiteIntegration.Client._writeHeader = function (headerData) {
    var topNavTemp = document.getElementById('dtv-topnav-temp');

    if ('outerHTML' in document.documentElement) {
        topNavTemp.outerHTML = headerData;
    } else {
        var range = document.createRange();
        range.selectNode(topNavTemp);
        var documentFragment = range.createContextualFragment(headerData);
        topNavTemp.parentNode.replaceChild(documentFragment, topNavTemp);
    }

};


DIRECTV.SiteIntegration.Client.addFooter = function () {
  var loaded = false;
  try {
    if (DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV) {
      DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV.SiteIntegration.Comm.getData(
        "/rightnow/footer", DIRECTV.SiteIntegration.Client._writeFooter,RTN_Lang);
      loaded = true;
    }
  } catch (e) {}

  if (!loaded) {
    setTimeout(DIRECTV.SiteIntegration.Client.addFooter, 50);
  }
};

DIRECTV.SiteIntegration.Client._writeFooter = function (footerData) {
    var dtvDataDiv = document.getElementById('dtv_tup');
    var nextSibling = dtvDataDiv.nextSibling;
    var footerDataDiv = null;

    if (!document.createRange) {
        footerDataDiv = document.createElement('div');
        footerDataDiv.innerHTML = footerData;
        var childNodes = footerDataDiv.childNodes;
        for (var i = 0, j = childNodes.length; i < j; i++) {
            var current = childNodes[i];
            if (current) {
                document.body.appendChild(current);
            }
        }
    } else {
        var range = document.createRange();
        range.selectNode(dtvDataDiv);

        footerDataDiv = range.createContextualFragment(footerData);
        if (nextSibling) {
            dtvDataDiv.parentNode.insertBefore(footerDataDiv, nextSibling);
        } else {
            dtvDataDiv.parentNode.appendChild(footerDataDiv);
        }
    }
}


DIRECTV.SiteIntegration.Client._getQueryParams = function (queryString) {
    var queryItems = {};

    if (queryString) {
        var pairs = queryString.split('&');
        for (var i = 0, j = pairs.length; i < j; i++) {
            var current = pairs[i];
            if (current) {
                var items = current.split('=');
                if (items && items.length > 0) {
                    queryItems[items[0]] = (items.length == 2) ? items[1] : '';
                }
            }
        }
    }

    return queryItems;
}

DIRECTV.SiteIntegration.Client._toParamString = function (params) {
    var queryItems = [];

    for (var key in params) {
        if (typeof params[key] === "string") {
            queryItems[queryItems.length] = key + '=' + encodeURIComponent(params[key]);
        }
    }

    return queryItems.join('&');
}

DIRECTV.SiteIntegration.Client._getAnswerID = function (url) {

    var pairs = url.split('/'),
        aid = 0,
        next = false;
    for (var i = 0, j = pairs.length; i < j; i++) {
        var current = pairs[i];
        if (next) {
            aid = current;
        }
        next = false
        if (current) {
            if (current == 'a_id') {
                next = true;
            }
        }
    }

    return aid;
}

DIRECTV.SiteIntegration.Client.sendReportingData = function (config) {
    try {
        var s = Reporting.getReportingObject(config.accountId);
        s.pageName = document.title;
        s.prop7 = config.userType;

        if (!!window.location.href.match(/^support.directv.com\/app\/tips_tricks/)) {
            // Add Answer Station config
            s.pageName = 'Help:Support:Tips and Tricks';
            s.prop1 = 'Help';
            s.prop2 = 'Help:Support';
            s.prop3 = 'Help:Support:Tips and Tricks';
        } else if (!!window.location.host.match(/^support.directv.com/)) {
            // Add Answer Station config
            s.pageName = 'Help:Support:Answer Center:' + document.title;
            s.prop1 = 'Help';
            s.prop2 = 'Help:Support';
            s.prop3 = 'Help:Support:Answer Center';
            s.prop4 = 'Help:Support:Answer Center:' + DIRECTV.SiteIntegration.Client._getAnswerID(window.location.href);
        } else if (!!window.location.host.match(/^forums.directv.com/)) {
            // Add Tech Forum config
            s.pageName = 'Help:Support:Technical Forums';
            s.prop1 = 'Help';
            s.prop2 = 'Help:Support';
            s.prop3 = 'Help:Support:Technical Forums';
        }
        if (!!window.location.host.match(/^news.directv.com/)) {
            /* don't send reporting data for wordpress */
        } else {
            var s_code = s.t();
            if (s_code) document.write(s_code);
        }
    } catch (e) {}
}

DIRECTV.SiteIntegration.Client.reportPageData = function () {
    var loaded = false;
    try {
        if (DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV) {
            DIRECTV.SiteIntegration.Client.sendReportingData(DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV.SiteIntegration.getReportingConfig(document.location.host));
            loaded = true;
        }
    } catch (e) {}

    if (!loaded) {
        setTimeout(DIRECTV.SiteIntegration.Client.reportPageData, 50);
    }
}

DIRECTV.SiteIntegration.Client.fixCms2Skins = function () {
    var loaded = false;
    try {
        if (DIRECTV.SiteIntegration.Client.commFrame.contentWindow.DIRECTV) {
            var aDivs = document.getElementsByTagName('div');
            for (var i = 0; i < aDivs.length; i++) {
                var divClassName = ogClassName = aDivs[i].className;
                if (divClassName.indexOf('stroke-only') != -1) {
                    divClassName += " border-only has-border";
                } else if (divClassName.indexOf('stroke-solid') != -1) {
                    divClassName += " border-solid has-border";
                } else if (divClassName.indexOf('stroke-gradient') != -1) {
                    divClassName += " border-gradient has-border";
                }
                if ((divClassName.indexOf('border-') != -1 || divClassName.indexOf('-gradient') != -1) && divClassName.indexOf('has-border') == -1) {
                    divClassName += " has-border";
                }
                if (divClassName != ogClassName) {
                    aDivs[i].className = divClassName;
                }
            }
            loaded = true;
        }
    } catch (e) {}

    if (!loaded) {
        setTimeout(DIRECTV.SiteIntegration.Client.fixCms2Skins, 50);
    }
}
new function () {

    var scripts = document.getElementsByTagName("script");
    for (var i = 0, j = scripts.length; i < j; i++) {
        var currentScript = scripts[i];
        if (/\/resources\/js\/integration\/integration.js/.test(currentScript.src)) {
            var items = currentScript.src.split('?');
            if (items.length > 1) {
                var queryString = items[1];
                var queryItems = queryString.split('&');
                for (var x = 0, y = queryItems.length; x < y; x++) {
                    var params = queryItems[x].split('=');
                    if (params) {
                        DIRECTV.SiteIntegration.Bridge.options[params[0]] = params[1];
                    }
                }
            }
            break;
        }
    }

    if (!!!DIRECTV.SiteIntegration.Bridge.options.hostUrl) {
        // Replace the host url with the domain name where hott web is hosted
        //        example, if URL is http://directv.demo.accedo.tv
        //        then hostUrl=directv.demo.accedo.tv
        DIRECTV.SiteIntegration.Bridge.options.hostUrl = "http://local.hottdirectv.com";


    }
   // document.write(' <link rel="stylesheet" href="%s/styles/rightnow.css">'.replace('%s', DIRECTV.SiteIntegration.Bridge.options.hostUrl));
    document.write('<script src="%s/scripts/rightnow.js"/></script>'.replace('%s', DIRECTV.SiteIntegration.Bridge.options.hostUrl));

}();


var headerInterval = setInterval(function () {
    if (typeof document.getElementById('dtv_topnav_sections_nav') == 'object') {
        var iMaxWidth = 980;
        var oNavSection = document.getElementById('dtv_topnav_sections_nav');
        var oNavCustomer = document.getElementById('dtv_topnav_util_nav');
        // Co-branded sites - top nav not always present
        if (oNavSection != undefined && oNavCustomer != undefined) {
            clearInterval(headerInterval);
            var iDelta = iMaxWidth - oNavCustomer.offsetWidth - oNavSection.offsetWidth;
            if (Math.abs(iDelta) < 140) {
                var oNavSectionListEls = oNavSection.getElementsByTagName('ul')[0].childNodes;
                var aNavSectionLIs = [];
                for (var i = 0; i < oNavSectionListEls.length; i++) {
                    if (oNavSectionListEls[i].nodeName.toUpperCase() == 'LI') {
                        aNavSectionLIs.push(oNavSectionListEls[i]);
                    }
                }
                var iPolarity = (iDelta > 0) ? -1 : 1;
                var iLeftOrRight = -1;
                var iNavIndex = 0;
                var aNavSectionLiPaddingLeft = [];
                var aNavSectionLiPaddingRight = [];

                for (var i = 0; i < aNavSectionLIs.length; i++) {
                    if (aNavSectionLIs[i].currentStyle) {
                        aNavSectionLiPaddingLeft[i] = parseInt(aNavSectionLIs[i].getElementsByTagName('div')[0].currentStyle['paddingLeft']);
                        aNavSectionLiPaddingRight[i] = parseInt(aNavSectionLIs[i].getElementsByTagName('div')[0].currentStyle['paddingRight']);
                    } else if (window.getComputedStyle) {
                        aNavSectionLiPaddingLeft[i] = parseInt(document.defaultView.getComputedStyle(aNavSectionLIs[i].getElementsByTagName('div')[0], null).getPropertyValue('padding-left'));
                        aNavSectionLiPaddingRight[i] = parseInt(document.defaultView.getComputedStyle(aNavSectionLIs[i].getElementsByTagName('div')[0], null).getPropertyValue('padding-right'));
                    } else {
                        aNavSectionLiPaddingLeft[i] = 0;
                        aNavSectionLiPaddingRight[i] = 0;
                    }
                }

                for (var i = Math.abs(iDelta); i > 0; i--) {
                    if (i % aNavSectionLIs.length == 0) {
                        iLeftOrRight = iLeftOrRight * -1;
                    }
                    iNavIndex = i % aNavSectionLIs.length;
                    if (iLeftOrRight < 0) {
                        aNavSectionLiPaddingLeft[iNavIndex] = aNavSectionLiPaddingLeft[iNavIndex] - iPolarity;
                    } else {
                        aNavSectionLiPaddingRight[iNavIndex] = aNavSectionLiPaddingRight[iNavIndex] - iPolarity;
                    }
                }

                for (var i = 0; i < aNavSectionLIs.length; i++) {
                    aNavSectionLIs[i].getElementsByTagName('div')[0].style.paddingLeft = aNavSectionLiPaddingLeft[i] + 'px';
                    aNavSectionLIs[i].getElementsByTagName('div')[0].style.paddingRight = aNavSectionLiPaddingRight[i] + 'px';
                }
            }
        }
    } else if (headerInterval > 50) {
        clearInterval(headerInterval);
    }
}, 100);