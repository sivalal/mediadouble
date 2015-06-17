// <script type="text/javascript" src="//smartplugin.youbora.com/1.3/js/libs/youbora-data.min.js"></script>
function YouboraData() {
    try {
        this.debug = !1, this.accountCode = "demosite", this.service = "https://nqs.nice264.com", this.username = "default", this.mediaResource = "", this.transaction = "", this.live = !1, this.contentId = "", this.isBalanced = !1, this.properties = {
            filename: "",
            content_id: "",
            content_metadata: {
                title: "",
                genre: "",
                language: "",
                year: "",
                cast: "",
                director: "",
                owner: "",
                duration: "",
                parental: "",
                price: "",
                rating: "",
                audioType: "",
                audioChannels: ""
            },
            transaction_type: "",
            quality: "",
            content_type: "",
            device: {
                manufacturer: "",
                type: "",
                year: "",
                firmware: ""
            }
        }, this.concurrencySessionId = Math.random(), this.concurrencyProperties = {
            enabled: !1,
            concurrencyService: "https://pc.youbora.com/cping/",
            concurrencyCode: "",
            concurrencyMaxCount: 0,
            concurrencyRedirectUrl: "",
            concurrencyIpMode: !1
        }, this.resumeProperties = {
            resumeEnabled: !1,
            resumeService: "https://pc.youbora.com/resume/",
            playTimeService: "https://pc.youbora.com/playTime/",
            resumeCallback: function() {
                console.log("YouboraData :: Default Resume Callback")
            }
        }, this.balanceProperties = {
            balanceType: "balance",
            enabled: !1,
            service: "https://smartswitch.youbora.com/",
            zoneCode: "",
            originCode: "",
            niceNVA: "",
            niceNVB: "",
            token: "",
            niceTokenIp: null,
            live: !1
        }, this.extraParams = {
            extraparam1: void 0,
            extraparam2: void 0,
            extraparam3: void 0,
            extraparam4: void 0,
            extraparam5: void 0,
            extraparam6: void 0,
            extraparam7: void 0,
            extraparam8: void 0,
            extraparam9: void 0,
            extraparam10: void 0
        }, this.jwplayerOverlayText = "", this.jwplayerOverlayEnabled = !1, this.jwplayerOverlayTime = 9e4, this.jwplayerOverlayDuration = 5e3, this.jwplayerOverlayTextColor = void 0, this.jwplayerOverlayBackgroundColor = void 0, this.jwplayerStreamMode = !1, this.silverlightMediaElementName = void 0, this.silverlightPlayer = void 0, this.enableAnalytics = !0, this.enableBalancer = !0, this.cdn_node_data = !1, this.hashTitle = !0, this.text_cdn = "", this.text_ip = "", this.text_isp = "", this.nqsDebugServiceEnabled = !1, this.httpSecure = !1, this.ooyalaNameSpace = void 0, this.pluginVersion = {
            thePlatformHtml5: "2.1.0",
            thePlatformFlash: "2.1.0"
        }, this.init()
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [Function] :: " + err)
    }
}
YouboraData.prototype.init = function() {
    try {
        return this.debug && console.log("YouboraData :: Initialized"), this.collectParams(), !0
    } catch (t) {
        this.debug && console.log("YouboraData :: Init Error: " + t)
    }
}, YouboraData.prototype.collectParams = function() {
    try {
        for (var t = document.getElementsByTagName("script"), e = 0, r = 0; r < t.length; r++) - 1 != t[r].src.indexOf("youbora-data") && (e = r);
        for (var o = t[e], a = o.src.replace(/^[^\?]+\??/, ""), n = a.split(/[;&]/), r = 0; r < n.length; r++) {
            var c = n[r].split("=");
            if (c && 2 == c.length) {
                var s = unescape(c[0]),
                    i = unescape(c[1]);
                i = i.replace(/\+/g, " "), "true" == i && (i = !0), "false" == i && (i = !1), "debug" == s && this.setDebug(i), "accountCode" == s && this.setAccountCode(i), "service" == s && this.setService(i), "username" == s && this.setUsername(i), "mediaResource" == s && this.setMediaResource(i), "transaction" == s && this.setTransaction(i), "live" == s && this.setLive(i), "contentId" == s && this.setContentId(i), "hashTitle" == s && this.setHashTitle(i), "cdn" == s && this.setCDN(i), "isp" == s && this.setISP(i), "ip" == s && this.setIP(i), "properties" == s && this.setProperties(i), "propertyFileName" == s && this.setPropertyFileName(i), "propertyContentId" == s && this.setPropertyContentId(i), "propertyTransactionType" == s && this.setPropertyTransactionType(i), "propertyQuality" == s && this.setPropertyQuality(i), "propertyContentType" == s && this.setPropertyContentType(i), "propertyDeviceManufacturer" == s && this.setPropertyDeviceManufacturer(i), "propertyDeviceType" == s && this.setPropertyDeviceType(i), "propertyDeviceYear" == s && this.setPropertyDeviceYear(i), "propertyDeviceFirmware" == s && this.setPropertyDeviceFirmware(i), "propertyMetaTitle" == s && this.setPropertyMetaTitle(i), "propertyMetaGenre" == s && this.setPropertyMetaGenre(i), "propertyMetaLanguage" == s && this.setPropertyMetaLanguage(i), "propertyMetaYear" == s && this.setPropertyMetaYear(i), "propertyMetaCast" == s && this.setPropertyMetaCast(i), "propertyMetaDirector" == s && this.setPropertyMetaDirector(i), "propertyMetaOwner" == s && this.setPropertyMetaOwner(i), "propertyMetaDuration" == s && this.setPropertyMetaDuration(i), "propertyMetaParental" == s && this.setPropertyMetaParental(i), "propertyMetaPrice" == s && this.setPropertyMetaPrice(i), "propertyMetaRating" == s && this.setPropertyMetaRating(i), "propertyMetaAudioType" == s && this.setPropertyMetaAudioType(i), "propertyMetaAudioChannels" == s && this.setPropertyMetaAudioChannels(i), "concurrencyProperties" == s && this.setConcurrencyProperties(i), "concurrencyEnabled" == s && this.setConcurrencyEnabled(i), "concurrencyCode" == s && this.setConcurrencyCode(i), "concurrencyService" == s && this.setConcurrencyService(i), "concurrencyMaxCount" == s && this.setConcurrencyMaxCount(i), "concurrencyRedirectUrl" == s && this.setConcurrencyRedirectUrl(i), "concurrencyIpMode" == s && this.setConcurrencyIpMode(i), "resumeProperties" == s && this.setResumeProperties(i), "resumeEnabled" == s && this.setResumeEnabled(i), "resumeCallback" == s && this.setResumeCallback(i), "resumeService" == s && this.setResumeService(i), "playTimeService" == s && this.setPlayTimeService(i), "balanceProperties" == s && this.setBalanceProperties(i), "balanceEnabled" == s && this.setBalanceEnabled(i), "balanceType" == s && this.setBalanceType(i), "balanceService" == s && this.setBalanceService(i), "balanceZoneCode" == s && this.setBalanceZoneCode(i), "balanceOriginCode" == s && this.setBalanceOriginCode(i), "balanceNVA" == s && this.setBalanceNVA(i), "balanceNVB" == s && this.setBalanceNVB(i), "balanceToken" == s && this.setBalanceToken(i), "balanceLive" == s && this.setBalanceLive(i), "extraparam1" == s && this.setExtraParam(1, i), "extraparam2" == s && this.setExtraParam(2, i), "extraparam3" == s && this.setExtraParam(3, i), "extraparam4" == s && this.setExtraParam(4, i), "extraparam5" == s && this.setExtraParam(5, i), "extraparam6" == s && this.setExtraParam(6, i), "extraparam7" == s && this.setExtraParam(7, i), "extraparam8" == s && this.setExtraParam(8, i), "extraparam9" == s && this.setExtraParam(9, i), "extraparam10" == s && this.setExtraParam(10, i), "jwplayerOverlayText" == s && this.setJwplayerOverlayText(i), "jwplayerOverlayEnabled" == s && this.setJwplayerOverlayEnabled(i), "jwplayerOverlayTime" == s && this.setJwplayerOverlayTime(i), "jwplayerOverlayDuration" == s && this.setJwplayerOverlayDuration(i), "cdnNodeData" == s && this.setCDNNodeData(i), "nqsDebugServiceEnabled" == s && this.setNqsDebugServiceEnabled(i), "httpSecure" == s && this.setHttpSecure(i), this.debug && console.log("YouboraData :: collectParams :: " + s + " = " + i)
            }
        }
    } catch (u) {
        this.debug && console.log("YouboraData :: collectParams :: Error :: " + u)
    }
}, YouboraData.prototype.setAccountCode = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.accountCode = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setAccountCode] :: " + e)
    }
}, YouboraData.prototype.getAccountCode = function() {
    try {
        return this.accountCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getAccountCode] :: " + t)
    }
}, YouboraData.prototype.setService = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.service = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setService] :: " + e)
    }
}, YouboraData.prototype.getService = function() {
    try {
        return this.service
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getService] :: " + t)
    }
}, YouboraData.prototype.setMediaResource = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.mediaResource = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setMediaResource] :: " + e)
    }
}, YouboraData.prototype.getMediaResource = function() {
    try {
        return this.mediaResource
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getMediaResource] :: " + t)
    }
}, YouboraData.prototype.setTransaction = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.transaction = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setTransaction] :: " + e)
    }
}, YouboraData.prototype.getTransaction = function() {
    try {
        return this.transaction
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getTransaction] :: " + error)
    }
}, YouboraData.prototype.setUsername = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.username = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setUserName] :: " + e)
    }
}, YouboraData.prototype.getUsername = function() {
    try {
        return this.username
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getUserName] :: " + error)
    }
}, YouboraData.prototype.setLive = function(t) {
    try {
        "undefined" == typeof t || 1 != t && 0 != t || (this.live = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setLive] :: " + e)
    }
}, YouboraData.prototype.getLive = function() {
    try {
        return this.live
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getLive] :: " + t)
    }
}, YouboraData.prototype.setResume = function(t) {
    try {
        "undefined" == typeof t || 1 != t && 0 != t || (this.resume = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setResume] :: " + e)
    }
}, YouboraData.prototype.getResume = function() {
    try {
        return this.resume
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getResume] :: " + t)
    }
}, YouboraData.prototype.setContentId = function(t) {
    try {
        "undefined" != typeof t && t.length > 1 && (this.contentId = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setContentId] :: " + e)
    }
}, YouboraData.prototype.getContentId = function() {
    try {
        return this.contentId
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getContentId] :: " + t)
    }
}, YouboraData.prototype.setProperties = function(t) {
    try {
        "string" == typeof t && (t = JSON.parse(t)), "object" == typeof t && (this.properties = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setProperties] :: " + e)
    }
}, YouboraData.prototype.getProperties = function() {
    try {
        return this.properties
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getProperties] :: " + t)
    }
}, YouboraData.prototype.getPropertiesString = function() {
    try {
        return this.properties
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getProperties] :: " + t)
    }
}, YouboraData.prototype.setPropertyFileName = function(t) {
    try {
        this.properties.filename = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyFileName] :: " + e)
    }
}, YouboraData.prototype.getPropertyFileName = function() {
    try {
        return this.properties.filename
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyFileName] :: " + t)
    }
}, YouboraData.prototype.setPropertyContentId = function(t) {
    try {
        this.properties.content_id = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyContentId] :: " + e)
    }
}, YouboraData.prototype.getPropertyContentId = function() {
    try {
        return this.properties.content_id
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyContentId] :: " + t)
    }
}, YouboraData.prototype.setPropertyTransactionType = function(t) {
    try {
        this.properties.transaction_type = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyTransactionType] :: " + e)
    }
}, YouboraData.prototype.getPropertyTransactionType = function() {
    try {
        return this.properties.transaction_type
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyTransactionType] :: " + t)
    }
}, YouboraData.prototype.setPropertyQuality = function(t) {
    try {
        this.properties.quality = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyQuality] :: " + e)
    }
}, YouboraData.prototype.getPropertyQuality = function() {
    try {
        return this.properties.transaction_type
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyQuality] :: " + t)
    }
}, YouboraData.prototype.setPropertyContentType = function(t) {
    try {
        this.properties.content_type = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyContentType] :: " + e)
    }
}, YouboraData.prototype.getPropertyContentType = function() {
    try {
        return this.properties.transaction_type
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyContentType] :: " + t)
    }
}, YouboraData.prototype.setPropertyDeviceManufacturer = function(t) {
    try {
        this.properties.device.manufacturer = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyDeviceManufacturer] :: " + e)
    }
}, YouboraData.prototype.getPropertyDeviceManufacturer = function() {
    try {
        return this.properties.device.manufacturer
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyDeviceManufacturer] :: " + t)
    }
}, YouboraData.prototype.setPropertyDeviceType = function(t) {
    try {
        this.properties.device.type = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyDeviceType] :: " + e)
    }
}, YouboraData.prototype.getPropertyDeviceType = function() {
    try {
        return this.properties.device.type
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyDeviceType] :: " + t)
    }
}, YouboraData.prototype.setPropertyDeviceYear = function(t) {
    try {
        this.properties.device.year = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyDeviceYear] :: " + e)
    }
}, YouboraData.prototype.getPropertyDeviceYear = function() {
    try {
        return this.properties.device.year
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyDeviceYear] :: " + t)
    }
}, YouboraData.prototype.setPropertyDeviceFirmware = function(t) {
    try {
        this.properties.device.firmware = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyDeviceFirmware] :: " + e)
    }
}, YouboraData.prototype.getPropertyDeviceFirmware = function() {
    try {
        return this.properties.device.firmware
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyDeviceFirmware] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaTitle = function(t) {
    try {
        this.properties.content_metadata.title = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaTitle] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaTitle = function() {
    try {
        return this.properties.content_metadata.title
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaTitle] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaGenre = function(t) {
    try {
        this.properties.content_metadata.genre = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaGenre] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaGenre = function() {
    try {
        return this.properties.content_metadata.genre
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaGenre] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaLanguage = function(t) {
    try {
        this.properties.content_metadata.language = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaLanguage] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaLanguage = function() {
    try {
        return this.properties.content_metadata.language
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaLanguage] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaYear = function(t) {
    try {
        this.properties.content_metadata.year = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaYear] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaYear = function() {
    try {
        return this.properties.content_metadata.year
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaYear] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaCast = function(t) {
    try {
        this.properties.content_metadata.cast = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaCast] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaCast = function() {
    try {
        return this.properties.content_metadata.cast
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaCast] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaDirector = function(t) {
    try {
        this.properties.content_metadata.director = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaDirector] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaDirector = function() {
    try {
        return this.properties.content_metadata.director
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaDirector] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaOwner = function(t) {
    try {
        this.properties.content_metadata.owner = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaOwner] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaOwner = function() {
    try {
        return this.properties.content_metadata.owner
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaOwner] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaDuration = function(t) {
    try {
        this.properties.content_metadata.duration = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaDuration] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaDuration = function() {
    try {
        return this.properties.content_metadata.duration
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaDuration] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaParental = function(t) {
    try {
        this.properties.content_metadata.parental = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaParental] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaParental = function() {
    try {
        return this.properties.content_metadata.parental
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaParental] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaPrice = function(t) {
    try {
        this.properties.content_metadata.price = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaPrice] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaPrice = function() {
    try {
        return this.properties.content_metadata.price
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaPrice] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaRating = function(t) {
    try {
        this.properties.content_metadata.rating = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaRating] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaRating = function() {
    try {
        return this.properties.content_metadata.rating
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaRating] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaAudioType = function(t) {
    try {
        this.properties.content_metadata.audioType = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaAudioType] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaAudioType = function() {
    try {
        return this.properties.content_metadata.audioType
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaAudioType] :: " + t)
    }
}, YouboraData.prototype.setPropertyMetaAudioChannels = function(t) {
    try {
        this.properties.content_metadata.audioChannels = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPropertyMetaAudioChannels] :: " + e)
    }
}, YouboraData.prototype.getPropertyMetaAudioChannels = function() {
    try {
        return this.properties.content_metadata.audioChannels
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPropertyMetaAudioChannels] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayText = function(t) {
    try {
        this.jwplayerOverlayText = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerOverlayText] :: " + e)
    }
}, YouboraData.prototype.getJwplayerOverlayText = function() {
    try {
        return this.jwplayerOverlayText
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getJwplayerOverlayText] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayEnabled = function(t) {
    try {
        "undefined" == typeof t || 1 != t && 0 != t || (this.jwplayerOverlayEnabled = t)
    } catch (e) {
        console.log("YouboraData :: Error [setJwplayerOverlayEnabled] :: " + err)
    }
}, YouboraData.prototype.getJwplayerOverlayEnabled = function() {
    try {
        return this.jwplayerOverlayEnabled
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getJwplayerOverlayEnabled] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayTime = function(t) {
    try {
        this.jwplayerOverlayTime = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerOverlayTime] :: " + e)
    }
}, YouboraData.prototype.getJwplayerOverlayTime = function() {
    try {
        return this.jwplayerOverlayTime
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getJwplayerOverlayTime] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayDuration = function(t) {
    try {
        this.jwplayerOverlayDuration = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerOverlayDuration] :: " + e)
    }
}, YouboraData.prototype.getJwplayerOverlayDuration = function() {
    try {
        return this.jwplayerOverlayDuration
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getJwplayerOverlayDuration] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayTextColor = function(t) {
    try {
        this.jwplayerOverlayTextColor = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerOverlayTextColor] :: " + e)
    }
}, YouboraData.prototype.getJwplayerOverlayTextColor = function() {
    try {
        return this.jwplayerOverlayTextColor
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getjwplayerOverlayTextColor] :: " + t)
    }
}, YouboraData.prototype.setJwplayerOverlayBackgroundColor = function(t) {
    try {
        this.jwplayerOverlayBackgroundColor = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerOverlayBackgroundColor] :: " + e)
    }
}, YouboraData.prototype.getJwplayerOverlayBackgroundColor = function() {
    try {
        return this.jwplayerOverlayBackgroundColor
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getJwplayerOverlayBackgroundColor] :: " + t)
    }
}, YouboraData.prototype.setJwplayerStreamMode = function(t) {
    try {
        this.jwplayerStreamMode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setJwplayerStreamMode] :: " + e)
    }
}, YouboraData.prototype.getJwplayerStreamMode = function() {
    try {
        return this.jwplayerStreamMode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [setJwplayerStreamMode] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyProperties = function(t) {
    try {
        "string" == typeof t && (t = JSON.parse(t)), "undefined" != typeof t && (this.concurrencyProperties.enabled = !0, this.concurrencyProperties = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyProperties] :: " + e)
    }
}, YouboraData.prototype.getConcurrencyProperties = function() {
    try {
        return this.concurrencyProperties
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyProperties] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyEnabled = function(t) {
    try {
        this.concurrencyProperties.enabled = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyEnabled] :: " + error)
    }
}, YouboraData.prototype.getConcurrencyEnabled = function() {
    try {
        return this.concurrencyProperties.enabled
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyEnabled] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyCode = function(t) {
    try {
        this.concurrencyProperties.enabled = !0, this.concurrencyProperties.concurrencyCode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyCode] :: " + error)
    }
}, YouboraData.prototype.getConcurrencyCode = function() {
    try {
        return this.concurrencyProperties.concurrencyCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyCode] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyService = function(t) {
    try {
        this.concurrencyProperties.enabled = !0, this.concurrencyProperties.concurrencyService = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyService] :: " + error)
    }
}, YouboraData.prototype.getConcurrencyService = function() {
    try {
        return this.concurrencyProperties.concurrencyService
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyService] :: " + t)
    }
}, YouboraData.prototype.getConcurrencySessionId = function() {
    try {
        return this.concurrencySessionId
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencySessionId] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyMaxCount = function(t) {
    try {
        this.concurrencyProperties.enabled = !0, this.concurrencyProperties.concurrencyMaxCount = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyMaxCount] :: " + e)
    }
}, YouboraData.prototype.getConcurrencyMaxCount = function() {
    try {
        return this.concurrencyProperties.concurrencyMaxCount
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyMaxCount] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyRedirectUrl = function(t) {
    try {
        this.concurrencyProperties.enabled = !0, this.concurrencyProperties.concurrencyRedirectUrl = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyRedirectUrl] :: " + e)
    }
}, YouboraData.prototype.getConcurrencyRedirectUrl = function() {
    try {
        return this.concurrencyProperties.concurrencyRedirectUrl
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyRedirectUrl] :: " + t)
    }
}, YouboraData.prototype.setConcurrencyIpMode = function(t) {
    try {
        this.concurrencyProperties.enabled = !0, this.concurrencyProperties.concurrencyIpMode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setConcurrencyIpMode] :: " + e)
    }
}, YouboraData.prototype.getConcurrencyIpMode = function() {
    try {
        return this.concurrencyProperties.concurrencyIpMode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getConcurrencyIpMode] :: " + t)
    }
}, YouboraData.prototype.setBalanceProperties = function(t) {
    try {
        "string" == typeof t && (t = JSON.parse(t)), "undefined" != typeof t && (this.balanceProperties = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceProperties] :: " + e)
    }
}, YouboraData.prototype.getBalanceProperties = function() {
    try {
        return this.balanceProperties
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceProperties] :: " + t)
    }
}, YouboraData.prototype.setBalanceLive = function(t) {
    try {
        this.balanceProperties.live = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceLive] :: " + e)
    }
}, YouboraData.prototype.getBalanceLive = function() {
    try {
        return this.balanceProperties.live
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceLive] :: " + t)
    }
}, YouboraData.prototype.setBalanceType = function(t) {
    try {
        this.balanceProperties.balanceType = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceType] :: " + e)
    }
}, YouboraData.prototype.getBalanceType = function() {
    try {
        return this.balanceProperties.balanceType
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceType] :: " + t)
    }
}, YouboraData.prototype.setBalanceEnabled = function(t) {
    try {
        this.balanceProperties.enabled = t, this.enableBalancer = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceEnabled] :: " + e)
    }
}, YouboraData.prototype.getBalanceEnabled = function() {
    try {
        return this.balanceProperties.enabled
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceEnabled] :: " + t)
    }
}, YouboraData.prototype.setBalanceService = function(t) {
    try {
        this.balanceProperties.service = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceService] :: " + e)
    }
}, YouboraData.prototype.getBalanceService = function() {
    try {
        return this.balanceProperties.service
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceService] :: " + t)
    }
}, YouboraData.prototype.setBalanceZoneCode = function(t) {
    try {
        this.balanceProperties.zoneCode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceZoneCode] :: " + e)
    }
}, YouboraData.prototype.getBalanceZoneCode = function() {
    try {
        return this.balanceProperties.zoneCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceZoneCode] :: " + t)
    }
}, YouboraData.prototype.setBalanceOriginCode = function(t) {
    try {
        this.balanceProperties.originCode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceOriginCode] :: " + e)
    }
}, YouboraData.prototype.getBalanceOriginCode = function() {
    try {
        return this.balanceProperties.originCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceOriginCode] :: " + t)
    }
}, YouboraData.prototype.setBalanceNVA = function(t) {
    try {
        this.balanceProperties.niceNVA = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceNVA] :: " + e)
    }
}, YouboraData.prototype.getBalanceNVA = function() {
    try {
        return this.balanceProperties.niceNVA
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceNVA] :: " + t)
    }
}, YouboraData.prototype.setBalanceNVB = function(t) {
    try {
        this.balanceProperties.niceNVB = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceNVB] :: " + e)
    }
}, YouboraData.prototype.getBalanceNVB = function() {
    try {
        return this.balanceProperties.niceNVB
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceNVB] :: " + t)
    }
}, YouboraData.prototype.setBalanceToken = function(t) {
    try {
        this.balanceProperties.token = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalanceToken] :: " + e)
    }
}, YouboraData.prototype.getBalanceToken = function() {
    try {
        return this.balanceProperties.token
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalanceToken] :: " + t)
    }
}, YouboraData.prototype.setResumeProperties = function(t) {
    try {
        "string" == typeof t && (t = JSON.parse(t)), "undefined" != typeof t && (this.resumeProperties = t)
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setResumeProperties] :: " + e)
    }
}, YouboraData.prototype.getResumeProperties = function() {
    try {
        return this.resumeProperties
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getResumeProperties] :: " + t)
    }
}, YouboraData.prototype.setResumeEnabled = function(t) {
    try {
        this.resumeProperties.resumeEnabled = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setResumeEnabled] :: " + e)
    }
}, YouboraData.prototype.getResumeEnabled = function() {
    try {
        return this.resumeProperties.resumeEnabled
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getResumeEnabled] :: " + t)
    }
}, YouboraData.prototype.setResumeCallback = function(t) {
    try {
        this.resumeProperties.resumeCallback = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setResumeCallback] :: " + e)
    }
}, YouboraData.prototype.getResumeCallback = function() {
    try {
        return this.resumeProperties.resumeCallback
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getResumeCallback] :: " + t)
    }
}, YouboraData.prototype.setResumeService = function(t) {
    try {
        this.resumeProperties.resumeService = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setResumeService] :: " + e)
    }
}, YouboraData.prototype.getResumeService = function() {
    try {
        return this.resumeProperties.resumeService
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getResumeService] :: " + t)
    }
}, YouboraData.prototype.setPlayTimeService = function(t) {
    try {
        this.resumeProperties.playTimeService = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setPlayTimeService] :: " + e)
    }
}, YouboraData.prototype.getPlayTimeService = function() {
    try {
        return this.resumeProperties.playTimeService
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getPlayTimeService] :: " + t)
    }
}, YouboraData.prototype.setDebug = function(t) {
    try {
        this.debug = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setDebug] :: " + e)
    }
}, YouboraData.prototype.getDebug = function() {
    try {
        return this.debug
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getDebug] :: " + t)
    }
}, YouboraData.prototype.setZoneCode = function(t) {
    try {
        this.zoneCode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setZoneCode] :: " + e)
    }
}, YouboraData.prototype.getZoneCode = function() {
    try {
        return this.zoneCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getZoneCode] :: " + t)
    }
}, YouboraData.prototype.setOriginCode = function(t) {
    try {
        this.originCode = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setOriginCode] :: " + e)
    }
}, YouboraData.prototype.getOriginCode = function() {
    try {
        return this.originCode
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getOriginCode] :: " + t)
    }
}, YouboraData.prototype.setCDNNodeData = function(t) {
    try {
        this.cdn_node_data = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setCDNNodeData] :: " + e)
    }
}, YouboraData.prototype.getCDNNodeData = function() {
    try {
        return this.cdn_node_data
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getCDNNodeData] :: " + t)
    }
}, YouboraData.prototype.setCDN = function(t) {
    try {
        this.text_cdn = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setCDN] :: " + e)
    }
}, YouboraData.prototype.getCDN = function() {
    try {
        return this.text_cdn
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getCDN] :: " + t)
    }
}, YouboraData.prototype.setISP = function(t) {
    try {
        this.text_isp = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setISP] :: " + e)
    }
}, YouboraData.prototype.getISP = function() {
    try {
        return this.text_isp
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getISP] :: " + t)
    }
}, YouboraData.prototype.setIP = function(t) {
    try {
        this.text_ip = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setIP] :: " + e)
    }
}, YouboraData.prototype.getIP = function() {
    try {
        return this.text_ip
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getIP] :: " + t)
    }
}, YouboraData.prototype.setHashTitle = function(t) {
    try {
        this.hashTitle = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setHashTitle] :: " + e)
    }
}, YouboraData.prototype.getHashTitle = function() {
    try {
        return this.hashTitle
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getHashTitle] :: " + t)
    }
}, YouboraData.prototype.setNiceTokenIp = function(t) {
    try {
        this.balanceProperties.niceTokenIp = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [niceTokenIp] :: " + e)
    }
}, YouboraData.prototype.getNiceTokenIp = function() {
    try {
        return this.balanceProperties.niceTokenIp
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getNiceTokenIp] :: " + t)
    }
}, YouboraData.prototype.setExtraParam = function(t, e) {
    try {
        switch (t) {
            case 1:
                this.extraParams.extraparam1 = e;
                break;
            case 2:
                this.extraParams.extraparam2 = e;
                break;
            case 3:
                this.extraParams.extraparam3 = e;
                break;
            case 4:
                this.extraParams.extraparam4 = e;
                break;
            case 5:
                this.extraParams.extraparam5 = e;
                break;
            case 6:
                this.extraParams.extraparam6 = e;
                break;
            case 7:
                this.extraParams.extraparam7 = e;
                break;
            case 8:
                this.extraParams.extraparam8 = e;
                break;
            case 9:
                this.extraParams.extraparam9 = e;
                break;
            case 10:
                this.extraParams.extraparam10 = e
        }
    } catch (r) {
        this.debug && console.log("YouboraData :: Error [setExtraParam] :: " + r)
    }
}, YouboraData.prototype.getExtraParam = function(t) {
    try {
        switch (t) {
            case 1:
                return this.extraParams.extraparam1;
            case 2:
                return this.extraParams.extraparam2;
            case 3:
                return this.extraParams.extraparam3;
            case 4:
                return this.extraParams.extraparam4;
            case 5:
                return this.extraParams.extraparam5;
            case 6:
                return this.extraParams.extraparam6;
            case 7:
                return this.extraParams.extraparam7;
            case 8:
                return this.extraParams.extraparam8;
            case 9:
                return this.extraParams.extraparam9;
            case 10:
                return this.extraParams.extraparam10
        }
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [getExtraParam] :: " + e)
    }
}, YouboraData.prototype.getExtraParams = function() {
    try {
        return this.extraParams
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getExtraParams] :: " + t)
    }
}, YouboraData.prototype.setEnableAnalytics = function(t) {
    try {
        this.enableAnalytics = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setEnableAnalytics] :: " + e)
    }
}, YouboraData.prototype.getEnableAnalytics = function() {
    try {
        return this.enableAnalytics
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getEnableAnalytics] :: " + t)
    }
}, YouboraData.prototype.setEnableBalancer = function(t) {
    try {
        this.enableBalancer = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setEnableBalancer] :: " + e)
    }
}, YouboraData.prototype.getEnableBalancer = function() {
    try {
        return this.enableBalancer
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getEnableBalancer] :: " + t)
    }
}, YouboraData.prototype.getBalancedResource = function() {
    try {
        return this.isBalanced
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getBalancedResource] :: " + t)
    }
}, YouboraData.prototype.setBalancedResource = function(t) {
    try {
        this.isBalanced = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setBalancedResource] :: " + e)
    }
}, YouboraData.prototype.setSilverlightMediaElementName = function(t) {
    try {
        this.silverlightMediaElementName = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setSilverlightMediaElementName] :: " + e)
    }
}, YouboraData.prototype.getSilverlightMediaElementName = function() {
    try {
        return this.silverlightMediaElementName
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getSilverlightMediaElementName] :: " + t)
    }
}, YouboraData.prototype.setSilverlightPlayer = function(t) {
    try {
        this.silverlightPlayer = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [setSilverlightMediaElementName] :: " + e)
    }
}, YouboraData.prototype.getSilverlightPlayer = function() {
    try {
        return this.silverlightPlayer
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [getSilverlightPlayer] :: " + t)
    }
}, YouboraData.prototype.getNqsDebugServiceEnabled = function() {
    try {
        return this.nqsDebugServiceEnabled
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [GET nqsDebugServiceEnabled] :: " + t)
    }
}, YouboraData.prototype.setNqsDebugServiceEnabled = function(t) {
    try {
        this.nqsDebugServiceEnabled = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [SET nqsDebugServiceEnabled] :: " + e)
    }
}, YouboraData.prototype.getHttpSecure = function() {
    try {
        return this.httpSecure
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [GET nqsDebugServiceEnabled] :: " + t)
    }
}, YouboraData.prototype.setHttpSecure = function(t) {
    try {
        this.httpSecure = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [SET nqsDebugServiceEnabled] :: " + e)
    }
}, YouboraData.prototype.getOoyalaNamespace = function() {
    try {
        return this.ooyalaNameSpace
    } catch (t) {
        this.debug && console.log("YouboraData :: Error [GET ooyalaNameSpace] :: " + t)
    }
}, YouboraData.prototype.setOoyalaNamespace = function(t) {
    try {
        this.ooyalaNameSpace = t
    } catch (e) {
        this.debug && console.log("YouboraData :: Error [SET ooyalaNameSpace] :: " + e)
    }
}, YouboraData.prototype.log = function(t) {
    1 == youboraData.getDebug() && console.log(t)
}, YouboraData.prototype.redirectFunction = function(t) {
    window.location = t
};
var youboraData = new YouboraData;
youboraData.setHttpSecure(true);
youboraData.setOoyalaNamespace('MPLAYER_3');
// <script type="text/javascript" src="//smartplugin.youbora.com/1.3/js/pc-ooyala/3.2.0/sp.min.js"></script>
var nameSpace = {};
nameSpace = void 0 != youboraData.ooyalaNameSpace ? "string" == typeof youboraData.getOoyalaNamespace() ? eval(youboraData.getOoyalaNamespace()) : youboraData.getOoyalaNamespace() : OO, nameSpace.plugin("SmartPlugin", function(e) {
    function a() {
        0 == v && 0 == _ && "" != f && (_ = !0, i())
    }

    function n() {
        R = !1, _ = !1, B = !1, H = !1, I = !1, V = 0, L = 0, w = 0, v = !1, f = "", clearTimeout(Y), Y = null, M = 0, G = 0
    }

    function t(e) {
        var a = new Date,
            n = 0;
        e == S.BUFFER_BEGIN ? L = a.getTime() : e == S.BUFFER_END ? w = a.getTime() : e != S.JOIN_SEND || B || (B = !0, n = w - L, 0 >= n && (n = 10), void 0 == x && (x = 0), N.sendJoin(Math.round(x), n))
    }

    function i() {
        try {
            var e = new Date;
            N.sendStart(0, window.location.href, c(), U, f, J, youboraData.getTransaction()), o(), T || b(), M = e.getTime()
        } catch (a) {
            youboraData.log(a)
        }
    }

    function o() {
        Y = setTimeout(function() {
            r()
        }, O)
    }

    function r() {
        new Date;
        clearTimeout(Y);
        try {
            v ? N.sendPingTotalBitrate(W, Math.round(M)) : (N.sendPingTotalBitrate(s(), Math.round(x)), M = Math.round(x), W = s()), o()
        } catch (e) {
            youboraData.log(e)
        }
    }

    function s() {
        return 0 == k || void 0 == k ? -1 : 1024 * k
    }

    function c() {
        var e = JSON.stringify(youboraData.getProperties()),
            a = encodeURI(e);
        return a
    }

    function l() {
        N.sendResume()
    }

    function u() {
        N.sendStop(), clearTimeout(Y), Y = null, n()
    }

    function d(e) {
        var a = new Date,
            n = 0,
            t = 0;
        e == S.BUFFER_BEGIN ? V = a.getTime() : e == S.BUFFER_END && (n = a.getTime(), t = n - V, N.sendBuffer(Math.round(x), t))
    }

    function m(e) {
        var a = X[e];
        void 0 == a && (a = a), N.sendErrorWithParameters(a, "", 0, window.location.href, c(), U, f, J, youboraData.getTransaction()), clearTimeout(Y), Y = null
    }

    function b() {
        Z = setTimeout(function() {
            h()
        }, 250)
    }

    function h() {
        j >= E.currentTime && !I && !H && !z && (d(S.BUFFER_BEGIN), H = !0), j = E.currentTime, b()
    }
    var y = {},
        E = {},
        S = {
            BUFFER_BEGIN: 1,
            BUFFER_END: 0,
            JOIN_SEND: 2
        },
        p = "",
        N = null,
        D = "",
        g = {},
        A = "",
        v = !1,
        P = null,
        T = !1,
        f = "",
        F = "1.3.3.2.0_ooyala",
        C = "HTML5_OoyalaPlayer",
        _ = !1,
        B = !1,
        R = !1,
        H = !1,
        I = !1,
        U = !1,
        V = 0,
        L = 0,
        w = 0,
        k = 0,
        O = 0,
        M = 0,
        G = 0,
        Y = null,
        W = -1,
        z = !1,
        x = 0,
        J = 0 / 0,
        K = !1,
        q = {},
        Q = 0,
        Z = {},
        j = 0,
        X = {
            network: "4000",
            generic: "4001",
            geo: "4002",
            domain: "4003",
            future: "4004",
            past: "4005",
            device: "4006",
            concurrentStreams: "4007",
            invalidHeartbeat: "4008",
            contentTree: "4009",
            metadata: "4010",
            generic: "4011",
            stream: "4012",
            livestream: "4013",
            network: "4014",
            unplayableContent: "4015",
            invalidExternalId: "4016",
            emptyChannel: "4017",
            emptyChannelSet: "4018",
            channelContent: "4019",
            streamPlayFailed: "4020",
            adobePassAuthenticate: "4021",
            adobePassToken: "4022",
            accountDisabled: "4023",
            adobePassAssetNotAuthenticated: "4024",
            adobePassLibraryNotDefined: "4025",
            adobePassRequireJavascript: "4026",
            adobePassUserNotAuthorized: "4027",
            afterFlightTime: "4028",
            apiDynamicAdSetIsNotEnabledForProvider: "4029",
            apiExpirationInPast: "4030",
            apiExpirationNotInWholeHours: "4031",
            apiExpirationTooFarInFuture: "4032",
            apiInvalidDynamicAdSetAssignment: "4033",
            apiInvalidAdSetCode: "4034",
            apiStandaloneAdSetIsEmpty: "4035",
            badResponse: "4036",
            badSecureStreamingResponse: "4037",
            beforeFlightTime: "4038",
            cannotContactSas: "4039",
            cannotContactServer: "4040",
            cannotDownloadThirdPartyModule: "4041",
            cannotFetchPayPerCiewStatus: "4042",
            cannotFetchSecureStreamingToken: "4043",
            cannotParsePayPerViewStatusResponse: "4044",
            cannotRetrieveDomain: "4045",
            cannotSecurelyStreamVideo: "4046",
            contentOverCap: "4047",
            contentUnavailable: "4048",
            corruptedNetstream: "4049",
            apiDynamicAdSetIsNotEnabledForProvider: "4050",
            flashAccessLicenseUnavailable: "4051",
            internalError: "4052",
            internalPlayerError: "4053",
            invalidApiUsage: "4054",
            invalidContent: "4055",
            invalidCcontentSegment: "4056",
            invalidDynamicAdSetAssignment: "4057",
            invalidDynamicAdSetCode: "4058",
            invalidDynamicChannelUsage: "4059",
            invalidFlashAccessLicense: "4060",
            invalidResponse: "4061",
            invalidSasResponse: "4062",
            invalidServerResponse: "4063",
            invalidToken: "4064",
            liveStreamNotFound: "4065",
            liveStreamFinished: "4066",
            liveStreamFinishedTitle: "4067",
            liveStreamUnavailable: "4068",
            liveStreamUnavailableAfterPayment: "4069",
            longBeforeFlightTime: "4070",
            lostConnection: "4071",
            noConnectionPlayer: "4072'",
            noConnectionVideo: "4073",
            noMovieSpecifiedForLabels: "4074",
            noQueryStringCode: "4075",
            ppvAlreadyPaid: "4076",
            ppvCancelPurchase: "4077",
            ppvChangeMind: "4078",
            ppvCheckoutError: "4079",
            ppvDefaultMessage: "4080",
            ppvIsExpired: "4081",
            ppvNeedsToPay: "4082",
            ppvNeedsToPayAtStart: "4083",
            ppvNoMorePlaysToday: "4084",
            ppvPrepurchase: "4085",
            ppvPrepurchaseThankYou: "4086",
            ppvPurchaseInProgress: "4087",
            ppvSupportMessage: "4088",
            ppvViewUnauthorized: "4089",
            ppvWatchVideo: "4090",
            processingContent: "4091",
            proxyClassesDontWork: "4092",
            removedContent: "4093",
            sasAuthFailed: "4094",
            sasHeartbeatFailed: "4095",
            sasTooManyActiveStreams: "4096",
            secureStreamingAuthFailed: "4097",
            standaloneAdSetIsEmpty: "4098",
            streamFileNotFound: "4099",
            tokenExpired: "4100",
            unauthorizedDevice: "4101",
            unauthorizedDomain: "4102",
            unauthorizedDynamicChannel: "4103",
            unauthorizedLocation: "4104",
            unauthorizedParent: "4105",
            unauthorizedPayPerView: "4106",
            unauthorizedUsage: "4107",
            unknownAccount: "4108",
            unknownContent: "4109",
            unknownDomain: "4110",
            unknownSasContent: "4111",
            version: "4112",
            versionNotSupported: "4113",
            versionUpgradeLink: "4114",
            versionUpgradeText: "4115"
        };
    return y.SmartPluginAnalytics = function(e, a) {
        this.mb = e, this.id = a, J = 0 / 0, K = !1, this.init()
    }, y.SmartPluginAnalytics.prototype = {
        init: function() {
            try {
                P = nameSpace.__internal.playerParams.platform, T = P.indexOf("flash") > -1 ? !0 : !1
            } catch (e) {
                youboraData.log(e)
            }
            try {
                this.mb.subscribe(nameSpace.EVENTS.PLAYER_CREATED, "NiceAnalytics", this.onPlayerCreate), this.mb.subscribe(nameSpace.EVENTS.PAUSED, "NiceAnalytics", this.onPauseHandler, this), this.mb.subscribe(nameSpace.EVENTS.PLAYING, "NiceAnalytics", this.onPlayingHandler, this), this.mb.subscribe(nameSpace.EVENTS.AUTHORIZATION_FETCHED, "NiceAnalytics", this.onAuthorizationFetched, this), this.mb.subscribe(nameSpace.EVENTS.PLAYED, "NiceAnalytics", this.onStopHandler, this), this.mb.subscribe(nameSpace.EVENTS.ERROR, "NiceAnalytics", this.onErrorHandler), this.mb.subscribe(nameSpace.EVENTS.PLAY, "NiceAnalytics", this.onPlayHandler), this.mb.subscribe(nameSpace.EVENTS.PLAY_STREAM, "NiceAnalytics", this.onPlayStreamHandler), this.mb.subscribe(nameSpace.EVENTS.BUFFERED, "NiceAnalytics", this.onBufferedHandler), this.mb.subscribe(nameSpace.EVENTS.BUFFERING, "NiceAnalytics", this.onBufferingHandler), this.mb.subscribe(nameSpace.EVENTS.PLAYBACK_READY, "NiceAnalytics", this.onPlaybackReadyHandler), this.mb.subscribe(nameSpace.EVENTS.PLAYHEAD_TIME_CHANGED, "NiceAnalytics", this.onPlayheadChangedHandler), this.mb.subscribe(nameSpace.EVENTS.SEEK, "NiceAnalytics", this.onSeekHandler), this.mb.subscribe(nameSpace.EVENTS.SCRUBBING, "NiceAnalytics", this.onSeekHandler), this.mb.subscribe(nameSpace.EVENTS.SCRUBBED, "NiceAnalytics", this.onSeekHandler), this.mb.subscribe(nameSpace.EVENTS.EMBED_CODE_CHANGED, "NiceAnalytics", this.onEmbedCodeChanged, this), this.mb.subscribe(nameSpace.EVENTS.BITRATE_CHANGED, "NiceAnalytics", this.onBitrateChanged, this), this.mb.subscribe(nameSpace.EVENTS.PRELOAD_STREAM, "NiceAnalytics", this.onPreloadStream), this.mb.subscribe(nameSpace.EVENTS.DOWNLOADING, "NiceAnalytics", this.onDownloading), this.mb.subscribe("contentTreeFetched", "NiceAnalytics", this.onContentTreeFetchedHandler), this.mb.subscribe(nameSpace.EVENTS.ADS_PLAYED, "NiceAnalytics", this.adsPlayed), this.mb.subscribe(nameSpace.EVENTS.WILL_PLAY_ADS, "NiceAnalytics", this.adsWillPlay), this.mb.subscribe(nameSpace.EVENTS.WILL_PLAY_SINGLE_AD, "NiceAnalytics", this.adsWillPlay), this.mb.subscribe(nameSpace.EVENTS.WILL_PLAY, "NiceAnalytics", this.videoWillPlay)
            } catch (e) {
                youboraData.log(e)
            }
        },
        onPlayerCreate: function() {
            T || (E = document.getElementsByTagName("video")[0])
        },
        onDownloading: function(e, n, t, i, o, r) {
            ("" == f || void 0 == f) && (f = r), T && a()
        },
        eventDebug: function(e, a, n, t, i, o) {
            youboraData.log("       " + e + " : "), youboraData.log(a), youboraData.log(n), youboraData.log(t), youboraData.log(i), youboraData.log(o)
        },
        onContentTreeFetchedHandler: function(e, a) {
            try {
                "" == youboraData.properties.content_metadata.title && (youboraData.properties.content_metadata.title = a.title)
            } catch (n) {
                youboraData.log(n)
            }
            try {
                J = T ? a.time : a.duration / 1e3
            } catch (n) {
                youboraData.log(n)
            }
        },
        onBitrateChanged: function(e, a) {
            k = a.videoBitrate
        },
        onBitrateChanged: function(e, a) {
            try {
                k = a.videoBitrate
            } catch (n) {
                youboraData.log(n)
            }
        },
        onAuthorizationFetched: function(e, a) {
            try {
                void 0 != a && void 0 != a.streams[0] && (k = a.streams[0].video_bitrate)
            } catch (n) {}
        },
        onPreloadStream: function(e, a) {
            f = a
        },
        onPlayingHandler: function() {
            0 == v && (_ ? I && (I = !1, l()) : (_ = !0, i()), _ && !B && H && !v ? (t(S.BUFFER_END), H = !1, t(S.JOIN_SEND)) : _ && B && H && !z && !v && (d(S.BUFFER_END), z = !1)), H = !1
        },
        onPauseHandler: function() {
            !_ || I || z || (I = !0, N.sendPause())
        },
        onStopHandler: function() {
            R || (R = !0, u())
        },
        onErrorHandler: function(e, a) {
            console.log(e), m(a.code), R || (R = !0, u())
        },
        onPlayHandler: function() {
            B || H || (H = !0, t(S.BUFFER_BEGIN))
        },
        onPlayStreamHandler: function() {
            0 == T && a()
        },
        onBufferingHandler: function() {
            try {
                B || H ? B && !H && (z || (H = !0, d(S.BUFFER_BEGIN))) : (H = !0, t(S.BUFFER_BEGIN))
            } catch (e) {
                youboraData.log(e)
            }
        },
        onBufferedHandler: function() {
            B || !H || v || t(S.BUFFER_END)
        },
        onPlaybackReadyHandler: function() {},
        onSeekHandler: function() {
            z = !0
        },
        onEmbedCodeChanged: function(e, a) {
            try {
                J = a.time, D = youboraData.getAccountCode(), A = youboraData.getUsername(), g = youboraData.getProperties(), p = youboraData.getService(), q.username = A, U = youboraData.getLive(), N = new YouboraCommunication(youboraData.getAccountCode(), p, q, F, C), O = N.getPingTime(), 0 == O && (O = 5e3), n()
            } catch (t) {
                youboraData.log(t)
            }
        },
        onPlayheadChangedHandler: function(e, a, n) {
            Q = 0, null != J && "undefinded" != J && 0 / 0 != J || 0 != v || (J = n), x = Math.round(a), B || !H || v ? _ && B && H && !z && !v && (d(S.BUFFER_END), z = !1, H = !1) : (t(S.BUFFER_END), H = !1, t(S.JOIN_SEND))
        },
        adsWillPlay: function() {
            v = !0
        },
        adsPlayed: function() {
            v = !1
        },
        videoWillPlay: function() {},
        __end_marker: !0
    }, y.SmartPluginAnalytics
});
// <script type="text/javascript" src="//smartplugin.youbora.com/1.3/js/libs/youbora-api.min.js"></script>
function YouboraCommunication(t, a, o, e, r) {
    try {
        this.system = t, this.service = a, this.bandwidth = o, this.pluginVersion = e, this.targetDevice = r, this.outputFormat = "xml", this.xmlHttp = null, this.isXMLReceived = !1, this.pamBufferUnderrunUrl = "", this.pamJoinTimeUrl = "", this.pamStartUrl = "", this.pamStopUrl = "", this.pamPauseUrl = "", this.pamResumeUrl = "", this.pamPingUrl = "", this.pamErrorUrl = "", this.pamCode = "", this.pamCodeOrig = "", this.pamCodeCounter = 0, this.pamPingTime = 5e3, this.lastPingTime = 0, this.diffTime = 0, this.canSendEvents = !1, this.eventQueue = [], this.startSent = !1, this.fastDataValid = !1, this.debug = youboraData.getDebug(), this.debugHost = "";
        var n = this;
        this.concurrencyTimer = "", this.resumeInterval = "", this.currentTime = 0, this.wasResumed = 0, this.balancedUrlsCallback = function() {}, this.balancedCallback = function() {}, this.l3dataStart = {
            host: "",
            type: ""
        }, this.l3dataPing = {
            host: "",
            type: ""
        }, this.l3types = {
            UNKNOWN: 0,
            TCP_HIT: 1,
            TCP_MISS: 2,
            TCP_MEM_HIT: 3,
            TCP_IMS_HIT: 4
        }, this.l3IsNodeSend = !1, this.resourcePath, this.protocol = "http://", 1 == youboraData.getHttpSecure() && (this.protocol = "https://"), "undefined" != typeof youboraData ? (youboraData.concurrencyProperties.enabled ? (this.concurrencyTimer = setInterval(function() {
            n.checkConcurrencyWork()
        }, 1e4), youboraData.log("YouboraCommunication :: Concurrency :: Enabled")) : youboraData.log("YouboraCommunication :: Concurrency :: Disabled"), youboraData.resumeProperties.resumeEnabled ? (this.checkResumeState(), youboraData.log("YouboraCommunication :: Resume :: Enabled")) : youboraData.log("YouboraCommunication :: Resume :: Disabled"), youboraData.log(1 == youboraData.cdn_node_data ? "YouboraCommunication :: Level3 :: Enabled" : "YouboraCommunication :: Level3 :: Disabled"), youboraData.log(youboraData.getBalanceEnabled() ? "YouboraCommunication :: Balancer :: Enabled" : "YouboraCommunication :: Balancer :: Disabled")) : youboraData.log("YouboraCommunication :: Unable to reach youboraData :: Concurrency / Resume / Level3 :: Disabled"), 1 == youboraData.getHttpSecure() && (this.protocol = "https://"), this.init()
    } catch (i) {
        this.debug && youboraData.log("YouboraCommunication :: Error: " + i)
    }
}

function YouboraCommunicationURL(t, a) {
    this.params = a, this.eventType = t
}
if (YouboraCommunication.prototype.getLevel3Header = function() {
        if ("undefined" != typeof youboraData && this.fastDataValid) {
            if (youboraData.getMediaResource().length > 0) try {
                this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
                    try {
                        var a = t.target.getResponseHeader("X-WR-DIAG").toString();
                        this.context.parseL3Header(a, 1)
                    } catch (o) {
                        youboraData.log("YouboraCommunication :: Level3 :: Error parsing header" + o)
                    }
                }, !0), this.xmlHttp.addEventListener("error", function() {
                    this.context.getAkamaiHeader()
                }, !0), this.xmlHttp.open("head", youboraData.getMediaResource(), !0), this.xmlHttp.setRequestHeader("X-WR-Diag", "host"), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP LEVEL3 Header Request :: " + youboraData.getMediaResource())
            } catch (t) {
                youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Level3 :: Error with header, disabling header check")
            } else youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Level3 :: No mediaResource specified, disabling first header check")
        }
    }, YouboraCommunication.prototype.getAkamaiHeader = function() {
        try {
            this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
                try {
                    this.context.parseAkamaiHeader(t.target.getResponseHeader("X-Cache"))
                } catch (a) {
                    youboraData.log("YouboraCommunication :: Akamai :: Error parsing header" + a)
                }
            }, !0), this.xmlHttp.open("head", youboraData.getMediaResource(), !0), this.xmlHttp.send()
        } catch (t) {
            youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Akamai :: Error with header, disabling header check")
        }
    }, YouboraCommunication.prototype.checkResumeState = function() {
        var t = youboraData.getResumeService(),
            a = youboraData.getContentId(),
            o = youboraData.getUsername();
        if (t = this.protocol + t.split("//")[1], youboraData.getResumeEnabled())
            if (a.length > 0)
                if (o.length > 0) try {
                    this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
                        this.context.validateResumeStatus(t)
                    }, !1);
                    var e = t + "?contentId=" + a + "&userId=" + o + "&random=" + Math.random();
                    this.xmlHttp.open("GET", e, !0), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: checkResumeState :: HTTP Reusme Request :: " + e), youboraData.log("YouboraCommunication :: checkResumeState :: Resume :: Enabled")
                } catch (r) {
                    clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: checkResumeState :: Error while performig resume petition ::" + r)
                } else youboraData.log("YouboraCommunication :: checkResumeState :: Resume enabled without username defined :: Resume Disabled");
                else youboraData.log("YouboraCommunication :: checkResumeState :: Resume enabled without contentId defined :: Resume Disabled");
        else youboraData.log("YouboraCommunication :: checkResumeState :: Resume disabled in data. ")
    }, YouboraCommunication.prototype.validateResumeStatus = function(httpEvent) {
        try {
            if (4 == httpEvent.target.readyState) {
                var response = httpEvent.target.response.toString();
                if (response > 0) {
                    var resumeCallback = youboraData.getResumeCallback();
                    youboraData.log("YouboraCommunication :: Resume :: Available ::"), "function" == typeof resumeCallback ? (this.wasResumed = 1, resumeCallback(response), youboraData.log("YouboraCommunication :: Resume :: Executed Function")) : "string" == typeof resumeCallback ? eval(resumeCallback) : youboraData.log("YouboraCommunication :: Unable to determine callback type!")
                } else "0" == response ? youboraData.log("YouboraCommunication :: Resume :: No previous state...") : (clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: Resume :: Empty response... stoping rsume."))
            }
        } catch (error) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: validateResumeStatus :: Error: " + error)
        }
    }, YouboraCommunication.prototype.sendPlayTimeStatus = function() {
        var t = youboraData.getPlayTimeService(),
            a = youboraData.getContentId(),
            o = youboraData.getUsername();
        t = this.protocol + t.split("//")[1];
        try {
            if (youboraData.getResumeEnabled()) {
                this.xmlHttp = new XMLHttpRequest, this.xmlHttp.addEventListener("load", function() {}, !1);
                var e = t + "?contentId=" + a + "&userId=" + o + "&playTime=" + Math.round(this.currentTime) + "&random=" + Math.random();
                this.xmlHttp.open("GET", e, !0), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP Resume Request :: " + e)
            } else youboraData.log("YouboraCommunication :: sendPlayTimeStatus :: Resume disabled in data.")
        } catch (r) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: sendPlayTimeStatus :: Error: " + r)
        }
    }, YouboraCommunication.prototype.enableResume = function() {
        try {
            youboraData.setResumeEnabled(!0);
            var t = this;
            clearInterval(this.resumeInterval), this.resumeInterval = setInterval(function() {
                t.sendPlayTimeStatus()
            }, 6e3), this.checkResumeState(), youboraData.log("YouboraCommunication :: enableResume :: Resume is now enabled")
        } catch (a) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: enableResume :: Error: " + error)
        }
    }, YouboraCommunication.prototype.disableResume = function() {
        try {
            youboraData.setResumeEnabled(!1), clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: disableResume :: Resume is now disabled")
        } catch (t) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: disableResume :: Error: " + error)
        }
    }, YouboraCommunication.prototype.getPingTime = function() {
        return this.pamPingTime
    }, YouboraCommunication.prototype.parseL3Header = function(t, a) {
        try {
            var o = t;
            return o = o.split(" "), o.host = o[0].replace("Host:", ""), o.type = o[1].replace("Type:", ""), "TCP_HIT" == o.type ? o.type = this.l3types.TCP_HIT : "TCP_MISS" == o.type ? o.type = this.l3types.TCP_MISS : "TCP_MEM_HIT" == o.type ? o.type = this.l3types.TCP_MEM_HIT : "TCP_IMS_HIT" == o.type ? o.type = this.l3types.TCP_IMS_HIT : (youboraData.log("YouboraCommunication :: Level3 :: Unknown type received: " + o.type), o.type = this.l3types.UNKNOWN), 1 == a ? (this.l3dataStart.host = o.host, this.l3dataStart.type = o.type, youboraData.log("YouboraCommunication :: Level3 :: onLoad :: Host: " + this.l3dataStart.host + " :: Type: " + this.l3dataStart.type)) : (this.l3dataPing.host = o.host, this.l3dataPing.type = o.type, youboraData.log("YouboraCommunication :: Level3 :: beforeStart :: Host: " + this.l3dataPing.host + " :: Type: " + this.l3dataPing.type)), !0
        } catch (e) {
            return youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Level3 :: Error with header, disabling header check" + e), !1
        }
    }, YouboraCommunication.prototype.parseAkamaiHeader = function(t) {
        try {
            var a = t;
            return a = a.split(" "), a.type = a[0].replace("Type:", ""), a.host = a[3].split("/")[1].replace(")", ""), "TCP_HIT" == a.type ? a.type = this.l3types.TCP_HIT : "TCP_MISS" == a.type ? a.type = this.l3types.TCP_MISS : "TCP_MEM_HIT" == a.type ? a.type = this.l3types.TCP_MEM_HIT : "TCP_IMS_HIT" == a.type ? a.type = this.l3types.TCP_IMS_HIT : (youboraData.log("YouboraCommunication :: Akamai :: Unknown type received: " + a.type), a.type = this.l3types.UNKNOWN), this.l3dataStart.host = a.host, this.l3dataStart.type = a.type, this.l3dataPing.host = a.host, this.l3dataPing.type = a.type, youboraData.log("YouboraCommunication :: Akamai :: onLoad :: Host: " + this.l3dataStart.host + " :: Type: " + this.l3dataStart.type), !0
        } catch (o) {
            return youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Akamai :: Error with header, disabling header check" + o), !1
        }
    }, YouboraCommunication.prototype.sendStartL3 = function(t, a, o, e, r, n, i) {
        try {
            (void 0 == i || "undefined" == i || "" == i) && (i = youboraData.getTransaction()), (void 0 == n || "undefined" == n) && (n = 0), this.bandwidth.username = youboraData.getUsername();
            var s = new Date,
                u = "?pluginVersion=" + this.pluginVersion + "&pingTime=" + this.pamPingTime / 1e3 + "&totalBytes=" + t + "&referer=" + encodeURIComponent(a) + "&user=" + this.bandwidth.username + "&properties=" + encodeURIComponent(JSON.stringify(youboraData.getProperties())) + "&live=" + e + "&transcode=" + i + "&system=" + this.system + "&resource=" + encodeURIComponent(r) + "&duration=" + n;
            if (u += this.getExtraParamsUrl(youboraData.getExtraParams()), 1 == youboraData.cdn_node_data && this.fastDataValid && (u += this.l3dataStart.host == this.l3dataPing.host ? "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataStart.type : "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataPing.type), u += youboraData.isBalanced ? "&isBalanced=1" : "&isBalanced=0", u += youboraData.hashTitle ? "&hashTitle=true" : "&hashTitle=false", "" != youboraData.getCDN() && (u += "&cdn=" + youboraData.getCDN()), "" != youboraData.getISP() && (u += "&isp=" + youboraData.getISP()), "" != youboraData.getIP() && (u += "&ip=" + youboraData.getIP()), u += "&isResumed=" + this.wasResumed, this.canSendEvents ? this.sendAnalytics(this.pamStartUrl, u, !1) : this.addEventToQueue(YouboraCommunicationEvents.START, u), youboraData.getResumeEnabled()) {
                var c = this;
                youboraData.log("YouboraCommunication :: Resume :: Enabled"), this.sendPlayTimeStatus(), this.resumeInterval = setInterval(function() {
                    c.sendPlayTimeStatus()
                }, 6e3)
            }
            this.startSent = !0, this.lastPingTime = s.getTime()
        } catch (m) {
            youboraData.log("YouboraCommunication :: sendStartL3 :: Error: " + m)
        }
    }, YouboraCommunication.prototype.sendStart = function(t, a, o, e, r, n, i) {
        if (1 == youboraData.cdn_node_data && this.fastDataValid) try {
            this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(s) {
                try {
                    var u = s.target.getResponseHeader("X-WR-DIAG").toString();
                    this.context.parseL3Header(u, 2) ? this.context.sendStartL3(t, a, o, e, r, n, i) : (youboraData.log("YouboraCommunication :: Level3 :: Error parsing header"), this.context.sendStartL3(t, a, o, e, r, n, i))
                } catch (c) {
                    youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Level3 :: Error with header, disabling header check")
                }
            }, !0), this.xmlHttp.addEventListener("error", function() {
                this.context.getAkamaiHeader(), this.context.sendStartL3(t, a, o, e, r, n, i)
            }, !0), this.xmlHttp.open("HEAD", r, !0), this.xmlHttp.setRequestHeader("X-WR-DIAG", "host"), this.xmlHttp.send()
        } catch (s) {
            youboraData.setCDNNodeData(!1), youboraData.log("YouboraCommunication :: Level3 :: Error with header, disabling header check")
        } else try {
            (void 0 == i || "undefined" == i || "" == i) && (i = youboraData.getTransaction()), (void 0 == n || "undefined" == n) && (n = 0), this.bandwidth.username = youboraData.getUsername();
            var u = new Date,
                c = "?pluginVersion=" + this.pluginVersion + "&pingTime=" + this.pamPingTime / 1e3 + "&totalBytes=" + t + "&referer=" + encodeURIComponent(a) + "&user=" + this.bandwidth.username + "&properties=" + encodeURIComponent(JSON.stringify(youboraData.getProperties())) + "&live=" + e + "&transcode=" + i + "&system=" + this.system + "&resource=" + encodeURIComponent(r) + "&duration=" + n;
            if (c += this.getExtraParamsUrl(youboraData.getExtraParams()), c += youboraData.isBalanced ? "&isBalanced=1" : "&isBalanced=0", c += youboraData.hashTitle ? "&hashTitle=true" : "&hashTitle=false", "" != youboraData.getCDN() && (c += "&cdn=" + youboraData.getCDN()), "" != youboraData.getISP() && (c += "&isp=" + youboraData.getISP()), "" != youboraData.getIP() && (c += "&ip=" + youboraData.getIP()), c += "&isResumed=" + this.wasResumed, this.canSendEvents ? this.sendAnalytics(this.pamStartUrl, c, !1) : this.addEventToQueue(YouboraCommunicationEvents.START, c), youboraData.getResumeEnabled()) {
                var m = this;
                youboraData.log("YouboraCommunication :: Resume :: Enabled"), this.sendPlayTimeStatus(), this.resumeInterval = setInterval(function() {
                    m.sendPlayTimeStatus()
                }, 6e3)
            }
            this.startSent = !0, this.lastPingTime = u.getTime()
        } catch (s) {
            youboraData.log("YouboraCommunication :: sendStart :: Error: " + s)
        }
    }, YouboraCommunication.prototype.sendError = function(t, a) {
        try {
            if ("undefined" != typeof t && parseInt(t) >= 0) {
                var o = "?errorCode=" + t + "&msg=" + a;
                this.sendAnalytics(this.pamErrorUrl, o, !1)
            } else {
                var o = "?errorCode=9000&msg=" + a;
                this.sendAnalytics(this.pamErrorUrl, o, !1)
            }
        } catch (e) {
            youboraData.log("YouboraCommunication :: Error Msg: " + e)
        }
    }, YouboraCommunication.prototype.sendErrorWithParameters = function(t, a, o, e, r, n, i, s) {
        try {
            ("undefined" == typeof t || parseInt(t) < 0) && (t = 9e3);
            var u = "?errorCode=" + t + "&msg=" + a;
            u += this.createParamsUrl(o, e, n, i, s), this.sendAnalytics(this.pamErrorUrl, u, !1)
        } catch (c) {
            youboraData.log("YouboraCommunication :: Error Msg: " + c)
        }
    }, YouboraCommunication.prototype.sendAdvancedError = function(t, a, o, e, r, n, i, s, u) {
        try {
            var c = "?errorCode=" + encodeURIComponent(t) + "&msg=" + encodeURIComponent(o);
            c += "&player=" + a, c += this.createParamsUrl(e, r, i, s, u), this.sendAnalytics(this.pamErrorUrl, c, !1)
        } catch (m) {
            youboraData.log("YouboraCommunication :: Error Msg: " + m)
        }
    }, YouboraCommunication.prototype.createParamsUrl = function(t, a, o, e, r) {
        try {
            transcode = youboraData.getTransaction(), (void 0 == r || "undefined" == r) && (r = 0);
            var n = (new Date, "&pluginVersion=" + this.pluginVersion + "&pingTime=" + this.pamPingTime / 1e3 + "&totalBytes=" + t + "&referer=" + encodeURIComponent(a) + "&user=" + this.bandwidth.username + "&properties=" + encodeURIComponent(JSON.stringify(youboraData.getProperties())) + "&live=" + o + "&transcode=" + transcode + "&system=" + this.system + "&resource=" + encodeURIComponent(e) + "&duration=" + r);
            return n += this.getExtraParamsUrl(youboraData.getExtraParams()), 1 == youboraData.cdn_node_data && this.fastDataValid && (n += this.l3dataStart.host == this.l3dataPing.host ? "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataStart.type : "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataPing.type), n += youboraData.isBalanced ? "&isBalanced=1" : "&isBalanced=0", n += youboraData.hashTitle ? "&hashTitle=true" : "&hashTitle=false", "" != youboraData.getCDN() && (n += "&cdn=" + youboraData.getCDN()), "" != youboraData.getISP() && (n += "&isp=" + youboraData.getISP()), "" != youboraData.getIP() && (n += "&ip=" + youboraData.getIP()), n
        } catch (i) {
            youboraData.log("YouboraCommunication :: Error Msg: " + i)
        }
    }, YouboraCommunication.prototype.sendPingTotalBytes = function(t, a) {
        try {
            if (0 == this.startSent) return;
            a > 0 && (this.currentTime = a);
            var o = new Date;
            0 != this.lastPingTime && (this.diffTime = o.getTime() - this.lastPingTime), this.lastPingTime = o.getTime();
            var e = "?diffTime=" + this.diffTime + "&totalBytes=" + t + "&pingTime=" + this.pamPingTime / 1e3 + "&dataType=0&time=" + a;
            1 == youboraData.cdn_node_data && this.fastDataValid && 0 == this.l3IsNodeSend && (e += this.l3dataStart.host == this.l3dataPing.host ? "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataStart.type : "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataPing.type, this.l3IsNodeSend = !0), this.canSendEvents ? this.sendAnalytics(this.pamPingUrl, e, !0) : this.addEventToQueue(YouboraCommunicationEvents.PING, e)
        } catch (r) {
            youboraData.log("YouboraCommunication :: Error Msg: " + r)
        }
    }, YouboraCommunication.prototype.sendPingTotalBitrate = function(t, a) {
        try {
            if (0 == this.startSent) return;
            a > 0 && (this.currentTime = a);
            var o = new Date;
            0 != this.lastPingTime && (this.diffTime = o.getTime() - this.lastPingTime), this.lastPingTime = o.getTime();
            var e = "?diffTime=" + this.diffTime + "&bitrate=" + t + "&pingTime=" + this.pamPingTime / 1e3 + "&time=" + a;
            1 == youboraData.cdn_node_data && this.fastDataValid && 0 == this.l3IsNodeSend && (e += this.l3dataStart.host == this.l3dataPing.host ? "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataStart.type : "&nodeHost=" + this.l3dataPing.host + "&nodeType=" + this.l3dataPing.type, this.l3IsNodeSend = !0), this.canSendEvents ? this.sendAnalytics(this.pamPingUrl, e, !0) : this.addEventToQueue(YouboraCommunicationEvents.PING, e)
        } catch (r) {
            youboraData.log("YouboraCommunication :: Error Msg: " + r)
        }
    }, YouboraCommunication.prototype.sendJoin = function(t, a) {
        try {
            t > 0 && (this.currentTime = t);
            var o = "?eventTime=" + t + "&time=" + a;
            this.canSendEvents ? this.sendAnalytics(this.pamJoinTimeUrl, o, !1) : this.addEventToQueue(YouboraCommunicationEvents.JOIN, o)
        } catch (e) {
            youboraData.log("YouboraCommunication :: Error Msg: " + e)
        }
    }, YouboraCommunication.prototype.sendBuffer = function(t, a) {
        try {
            if (0 == this.startSent) return;
            t > 0 && (this.currentTime = t);
            try {
                10 > t && youboraData.getLive() && (t = 10)
            } catch (o) {}
            var e = null,
                e = "?time=" + t + "&duration=" + a;
            this.canSendEvents ? this.sendAnalytics(this.pamBufferUnderrunUrl, e, !1) : this.addEventToQueue(YouboraCommunicationEvents.BUFFER, e)
        } catch (o) {
            youboraData.log("YouboraCommunication :: Error Msg: " + o)
        }
    }, YouboraCommunication.prototype.sendResume = function() {
        try {
            if (0 == this.startSent) return;
            var t = "";
            this.canSendEvents ? this.sendAnalytics(this.pamResumeUrl, t, !1) : this.addEventToQueue(YouboraCommunicationEvents.RESUME, t)
        } catch (a) {
            youboraData.log("YouboraCommunication :: Error Msg: " + a)
        }
    }, YouboraCommunication.prototype.sendPause = function() {
        try {
            if (0 == this.startSent) return;
            var t = "";
            this.canSendEvents ? this.sendAnalytics(this.pamPauseUrl, t, !1) : this.addEventToQueue(YouboraCommunicationEvents.PAUSE, t), youboraData.getResumeEnabled() && this.sendPlayTimeStatus()
        } catch (a) {
            youboraData.log("YouboraCommunication :: Error Msg: " + a)
        }
    }, YouboraCommunication.prototype.sendStop = function() {
        try {
            if (0 == this.startSent) return;
            this.currentTime = 0, youboraData.getResumeEnabled() && this.sendPlayTimeStatus(), clearInterval(this.resumeInterval);
            var t = "?diffTime=" + this.diffTime;
            this.canSendEvents ? this.sendAnalytics(this.pamStopUrl, t, !1) : this.addEventToQueue(YouboraCommunicationEvents.STOP, t), this.reset()
        } catch (a) {
            youboraData.log("YouboraCommunication :: Error Msg: " + a)
        }
    }, YouboraCommunication.prototype.sendStopResumeSafe = function() {
        try {
            if (0 == this.startSent) return;
            clearInterval(this.resumeInterval);
            var t = "?diffTime=" + this.diffTime;
            this.canSendEvents ? this.sendAnalytics(this.pamStopUrl, t, !1) : this.addEventToQueue(YouboraCommunicationEvents.STOP, t), this.reset()
        } catch (a) {
            youboraData.log("YouboraCommunication :: Error Msg: " + a)
        }
    }, YouboraCommunication.prototype.addEventToQueue = function(t, a) {
        try {
            var o = new YouboraCommunicationURL(t, a);
            this.eventQueue.push(o)
        } catch (e) {
            youboraData.log("YouboraCommunication :: Error Msg: " + e)
        }
    }, YouboraCommunication.prototype.init = function() {
        try {
            this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
                this.context.loadAnalytics(t)
            }, !1), 1 == youboraData.getHttpSecure() && (this.service = this.protocol + this.service.split("//")[1]);
            var t = this.service + "/data?system=" + this.system + "&pluginVersion=" + this.pluginVersion + "&targetDevice=" + this.targetDevice + "&outputformat=" + this.outputFormat;
            1 == youboraData.getNqsDebugServiceEnabled() && (t += "&nqsDebugServiceEnabled=true"), this.xmlHttp.open("GET", t, !1), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP Fastdata Request :: " + t)
        } catch (a) {
            youboraData.log("YouboraCommunication :: Error Msg: " + a)
        }
    }, YouboraCommunication.prototype.getLevel3Node = function() {
        this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
            this.context.loadAnalytics(t)
        }, !1);
        var t = this.service + "/data?system=" + this.system + "&pluginVersion=" + this.pluginVersion + "&targetDevice=" + this.targetDevice + "&outputformat=" + this.outputFormat;
        this.xmlHttp.open("GET", t, !0), this.xmlHttp.send()
    }, YouboraCommunication.prototype.checkConcurrencyWork = function() {
        try {
            var t = youboraData.getConcurrencyCode(),
                a = youboraData.getAccountCode(),
                o = youboraData.getConcurrencyService(),
                e = youboraData.getConcurrencySessionId(),
                r = youboraData.getConcurrencyMaxCount(),
                n = youboraData.getConcurrencyIpMode(),
                i = "";
            if (o = this.protocol + o.split("//")[1], youboraData.getConcurrencyEnabled()) {
                if (n) {
                    var s = this;
                    this.xmlHttp = new XMLHttpRequest, this.xmlHttp.addEventListener("load", function(t) {
                        s.validateConcurrencyResponse(t)
                    }, !1), i = o + "?concurrencyCode=" + t + "&accountCode=" + a + "&concurrencyMaxCount=" + r + "&random=" + Math.random(), this.xmlHttp.open("GET", i, !0), this.xmlHttp.send()
                } else {
                    var s = this;
                    this.xmlHttp = new XMLHttpRequest, this.xmlHttp.addEventListener("load", function(t) {
                        s.validateConcurrencyResponse(t)
                    }, !1), i = o + "?concurrencyCode=" + t + "&accountCode=" + a + "&concurrencySessionId=" + e + "&concurrencyMaxCount=" + r + "&random=" + Math.random(), this.xmlHttp.open("GET", i, !0), this.xmlHttp.send()
                }
                youboraData.log("YouboraCommunication :: HTTP Concurrency Request :: " + i)
            } else youboraData.log("YouboraCommunication :: HTTP Concurrency Request :: " + i)
        } catch (u) {
            youboraData.log("YouboraCommunication :: startConcurrencyWork :: Disabled in data.")
        }
    }, YouboraCommunication.prototype.validateConcurrencyResponse = function(t) {
        try {
            if (4 == t.target.readyState) {
                var a = t.target.response;
                if ("1" == a) {
                    this.sendError(14e3, "CC_KICK");
                    var o = youboraData.getConcurrencyRedirectUrl();
                    "function" == typeof o ? (youboraData.log("YouboraCommunication :: Concurrency :: Executed function"), o()) : (youboraData.log("YouboraCommunication :: Concurrency :: 1 :: Redirecting to: " + o), window.location = o)
                } else "0" == a ? youboraData.log("YouboraCommunication :: Concurrency :: 0 :: Continue...") : (youboraData.log("YouboraCommunication :: Concurrency :: Empty response... stoping validation."), clearInterval(this.concurrencyTimer))
            }
        } catch (e) {
            youboraData.log("YouboraCommunication :: validateConcurrencyResponse :: Error: " + e)
        }
    }, YouboraCommunication.prototype.enableConcurrency = function() {
        try {
            youboraData.setConcurrencyEnabled(!0);
            var t = this;
            clearInterval(this.concurrencyTimer), this.concurrencyTimer = setInterval(function() {
                t.checkConcurrencyWork()
            }, 1e4), this.checkConcurrencyWork(), youboraData.log("YouboraCommunication :: enableConcurrency :: Concurrency is now enabled")
        } catch (a) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: enableConcurrency :: Error: " + error)
        }
    }, YouboraCommunication.prototype.disableConcurrency = function() {
        try {
            youboraData.setConcurrencyEnabled(!1), clearInterval(this.concurrencyTimer), youboraData.log("YouboraCommunication :: disableConcurrency :: Concurrency is now disabled")
        } catch (t) {
            clearInterval(this.resumeInterval), youboraData.log("YouboraCommunication :: disableConcurrency :: Error: " + error)
        }
    }, YouboraCommunication.prototype.loadAnalytics = function(t) {
        var a = this;
        try {
            if (4 == t.target.readyState) {
                youboraData.log("YouboraCommunication :: Loaded XML FastData");
                var o = t.target.responseXML;
                try {
                    var e = o.getElementsByTagName("h")[0].childNodes[0].nodeValue
                } catch (r) {
                    youboraData.log("YouboraCommunication :: loadAnalytics :: Invalid Fast-Data Response!")
                }
                void 0 != e && "" != e && (this.pamBufferUnderrunUrl = this.protocol + e + "/bufferUnderrun", this.pamJoinTimeUrl = this.protocol + e + "/joinTime", this.pamStartUrl = this.protocol + e + "/start", this.pamStopUrl = this.protocol + e + "/stop", this.pamPauseUrl = this.protocol + e + "/pause", this.pamResumeUrl = this.protocol + e + "/resume", this.pamPingUrl = this.protocol + e + "/ping", this.pamErrorUrl = this.protocol + e + "/error");
                try {
                    this.pamCode = o.getElementsByTagName("c")[0].childNodes[0].nodeValue, this.pamCodeOrig = this.pamCode, this.pamPingTime = 1e3 * o.getElementsByTagName("pt")[0].childNodes[0].nodeValue, this.isXMLReceived = !0, this.enableAnalytics = !0, youboraData.log("YouboraCommunication :: Mandatory :: Analytics Enabled")
                } catch (n) {
                    this.enableAnalytics = !1, youboraData.log("YouboraCommunication :: Mandatory :: Analytics Disabled")
                }
                try {
                    this.enableBalancer = o.getElementsByTagName("b")[0].childNodes[0].nodeValue, 1 == this.enableBalancer ? (this.enableBalancer = !0, youboraData.log("YouboraCommunication :: Mandatory :: Balancer Enabled")) : (this.enableBalancer = !1, youboraData.log("YouboraCommunication :: Mandatory :: Balancer Disabled"))
                } catch (n) {
                    youboraData.log("YouboraCommunication :: Mandatory :: Balancer Disabled"), this.enableBalancer = !1
                }
                youboraData.enableAnalytics && (this.canSendEvents = !0), void 0 != e && "" != e && void 0 != this.pamCode && "" != this.pamCode && (this.fastDataValid = !0), this.sendEventsFromQueue();
                try {
                    a.debug = o.getElementsByTagName("db")[0].childNodes[0].nodeValue
                } catch (n) {}
                try {
                    a.debugHost = o.getElementsByTagName("dh")[0].childNodes[0].nodeValue
                } catch (n) {
                    a.debugHost = ""
                }
                a.debugHost.length > 0 && (youboraData.log("YouboraCommunication :: replaceConsoleEvents :: Binding to: " + this.debugHost), this.replaceConsoleEvents(), youboraData.setDebug(!0)), youboraData.cdn_node_data && this.fastDataValid && this.getLevel3Header(), youboraData.concurrencyProperties.enabled && this.fastDataValid && this.checkConcurrencyWork()
            }
        } catch (r) {
            youboraData.log("YouboraCommunication :: loadAnalytics :: Error: " + r)
        }
    }, YouboraCommunication.prototype.cPing = function() {
        try {
            this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, this.xmlHttp.addEventListener("load", function(t) {
                this.context.loadAnalytics(t)
            }, !1);
            var t = this.service + "/data?system=" + this.system + "&pluginVersion=" + this.pluginVersion + "&targetDevice=" + this.targetDevice + "&outputformat=" + this.outputFormat;
            this.xmlHttp.open("GET", t, !0), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP Request :: " + t)
        } catch (a) {
            youboraData.log("YouboraCommunication :: cPing :: Erro: " + a)
        }
    }, YouboraCommunication.prototype.replaceConsoleEvents = function() {
        try {
            var t = this;
            console = {
                log: function(a) {
                    try {
                        var o, e = new Date,
                            r = "[" + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds() + "]";
                        o = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), o.open("GET", t.debugHost + encodeURIComponent(r) + " |> " + a), o.send()
                    } catch (n) {}
                }
            }, youboraData.log("YouboraCommunication :: replaceConsoleEvents :: Done ::")
        } catch (a) {
            youboraData.log("YouboraCommunication :: replaceConsoleEvents :: Error: " + a)
        }
    }, YouboraCommunication.prototype.sendEventsFromQueue = function() {
        try {
            if (1 == this.canSendEvents)
                for (var t, a, o = this.eventQueue.pop(); null != o;) a = o.getEventType(), a == YouboraCommunicationEvents.START ? t = this.pamStartUrl : a == YouboraCommunicationEvents.JOIN ? t = this.pamJoinTimeUrl : a == YouboraCommunicationEvents.BUFFER ? t = this.pamBufferUnderrunUrl : a == YouboraCommunicationEvents.PAUSE ? t = this.pamPauseUrl : a == YouboraCommunicationEvents.RESUME ? t = this.pamResumeUrl : a == YouboraCommunicationEvents.PING ? t = this.pamPingUrl : a == YouboraCommunicationEvents.STOP ? t = this.pamStopUrl : a == YouboraCommunicationEvents.ERROR && (t = this.pamErrorUrl), null != t && this.sendAnalytics(t, o.getParams(), !1), o = this.eventQueue.pop()
        } catch (e) {
            youboraData.log("YouboraCommunication :: Error Msg: " + e)
        }
    }, YouboraCommunication.prototype.getBalancerUrls = function(t, a) {
        var o = this;
        if (this.balancedUrlsCallback = a, youboraData.enableBalancer) {
            if ("undefined" != typeof youboraData) {
                var e = youboraData.getBalanceService(),
                    r = youboraData.getBalanceType(),
                    n = youboraData.getBalanceZoneCode(),
                    i = youboraData.getBalanceOriginCode(),
                    s = youboraData.getAccountCode(),
                    u = (youboraData.getBalanceToken(), this.pluginVersion, youboraData.getBalanceNVA()),
                    c = youboraData.getBalanceNVB(),
                    m = youboraData.getLive();
                try {
                    this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this;
                    var l = e + "?type=" + r + "&systemcode=" + s + "&zonecode=" + n + "&session=" + this.pamCode + "&origincode=" + i + "&resource=" + encodeURIComponent(t) + "&niceNva=" + u + "&niceNvb=" + c + "&live=" + m + "&token=" + youboraData.getBalanceToken();
                    try {
                        1 == m && (l += "&live=true")
                    } catch (d) {}
                    this.xmlHttp.addEventListener("load", function(t) {
                        var a = t.target.response.toString(),
                            e = "",
                            r = !1;
                        try {
                            e = JSON.parse(a)
                        } catch (n) {
                            r = !0
                        }
                        if (0 == r) try {
                            var i = [],
                                s = 0;
                            for (index in a) try {
                                s++, i[index] = e[s].URL
                            } catch (n) {}
                            o.balancedUrlsCallback(i)
                        } catch (n) {
                            o.balancedUrlsCallback(!1)
                        } else o.balancedUrlsCallback(!1)
                    }, !1), this.xmlHttp.open("GET", l, !0), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP GetBalancerUrls Request :: " + l)
                } catch (h) {
                    youboraData.log("YouboraCommunication :: getBalancerUrls :: Error: " + h)
                }
            }
        } else o.balancedUrlsCallback(!1)
    }, YouboraCommunication.prototype.getBalancedResource = function(t, a) {
        if (youboraData.enableBalancer) {
            this.balancedCallback = a;
            var o = this,
                e = youboraData.getBalanceService(),
                r = youboraData.getBalanceType(),
                n = youboraData.getBalanceZoneCode(),
                i = youboraData.getBalanceOriginCode(),
                s = youboraData.getAccountCode(),
                u = (youboraData.getBalanceToken(), this.pluginVersion, youboraData.getBalanceNVA()),
                c = youboraData.getBalanceNVB(),
                m = youboraData.getLive();
            this.resourcePath = t;
            try {
                this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this;
                var l = e + "?type=" + r + "&systemcode=" + s + "&session=" + this.pamCode + "&zonecode=" + n + "&origincode=" + i + "&resource=" + encodeURIComponent(t) + "&niceNva=" + u + "&niceNvb=" + c + "&token=" + youboraData.getBalanceToken();
                try {
                    1 == m && (l += "&live=true")
                } catch (d) {}
                this.xmlHttp.addEventListener("load", function(t) {
                    var a = t.target.response.toString(),
                        e = "",
                        r = !1;
                    try {
                        e = JSON.parse(a)
                    } catch (n) {
                        r = !0
                    }
                    0 == r ? (youboraData.extraParams.param13 = !0, o.balancedCallback(e)) : o.balancedCallback(!1)
                }, !1), this.xmlHttp.open("GET", l, !0), this.xmlHttp.send(), youboraData.log("YouboraCommunication :: HTTP Balance Request :: " + l)
            } catch (h) {
                youboraData.log("YouboraCommunication :: getBalancedResource :: Error: " + h)
            }
        } else o.balancedCallback(!1)
    }, YouboraCommunication.prototype.validateBalanceResponse = function(t) {
        try {
            4 == t.target.readyState
        } catch (a) {
            youboraData.log("YouboraCommunication :: validateBalanceResponse :: Error: " + a)
        }
    }, YouboraCommunication.prototype.sendAnalytics = function(t, a, o) {
        try {
            if (this.canSendEvents && this.fastDataValid) {
                this.xmlHttp = new XMLHttpRequest, this.xmlHttp.context = this, o ? (this.xmlHttp.addEventListener("load", function(t) {
                    this.context.parseAnalyticsResponse(t)
                }, !1), this.xmlHttp.addEventListener("error", function() {
                    this.context.sendAnalyticsFailed()
                }, !1)) : (this.xmlHttp.addEventListener("load", function(t) {
                    this.context.parseAnalyticsResponse(t)
                }, !1), this.xmlHttp.addEventListener("error", function() {
                    this.context.sendAnalyticsFailed()
                }, !1));
                var e = "";
                e = "" != a ? t + a + "&code=" + this.pamCode + "&random=" + Math.random() : t + "?code=" + this.pamCode + "&random=" + Math.random(), youboraData.log("YouboraCommunication :: HTTP Request :: " + e), this.xmlHttp.open("GET", e, !0), this.xmlHttp.send()
            }
        } catch (r) {
            youboraData.log("YouboraCommunication :: Error Msg: " + r)
        }
    }, YouboraCommunication.prototype.parseAnalyticsResponse = function(t) {
        try {
            4 == t.target.readyState
        } catch (a) {
            youboraData.log("YouboraCommunication :: parseAnalyticsResponse :: Error: " + a)
        }
    }, YouboraCommunication.prototype.sendAnalyticsFailed = function() {
        try {
            youboraData.log("YouboraCommunication :: Failed communication with nQs Service")
        } catch (t) {
            youboraData.log("YouboraCommunication :: sendAnalyticsFailed :: Error: " + t)
        }
    }, YouboraCommunication.prototype.updateCode = function() {
        try {
            this.pamCodeCounter++, this.pamCode = this.pamCodeOrig + "_" + this.pamCodeCounter
        } catch (t) {
            youboraData.log("YouboraCommunication :: updateCode :: Error: " + t)
        }
    }, YouboraCommunication.prototype.reset = function() {
        try {
            this.lastPingTime = 0, this.diffTime = 0, this.startSent = !1, this.updateCode()
        } catch (t) {
            youboraData.log("YouboraCommunication :: reset Error: " + t)
        }
    }, YouboraCommunication.prototype.getResourcePath = function(t) {
        var a = t.split("//")[1],
            o = a.indexOf("/"),
            e = a.substring(o, t.length);
        return e
    }, YouboraCommunication.prototype.getExtraParamsUrl = function(t) {
        var a = "";
        return void 0 != t && (void 0 != t.extraparam1 && (a += "&param1=" + t.extraparam1), void 0 != t.extraparam2 && (a += "&param2=" + t.extraparam2), void 0 != t.extraparam3 && (a += "&param3=" + t.extraparam3), void 0 != t.extraparam4 && (a += "&param4=" + t.extraparam4), void 0 != t.extraparam5 && (a += "&param5=" + t.extraparam5), void 0 != t.extraparam6 && (a += "&param6=" + t.extraparam6), void 0 != t.extraparam7 && (a += "&param7=" + t.extraparam7), void 0 != t.extraparam8 && (a += "&param8=" + t.extraparam8), void 0 != t.extraparam9 && (a += "&param9=" + t.extraparam9), void 0 != t.extraparam10 && (a += "&param10=" + t.extraparam10)), a
    }, YouboraCommunicationURL.prototype.getParams = function() {
        return this.params
    }, YouboraCommunicationURL.prototype.getEventType = function() {
        return this.eventType
    }, "undefined" == typeof console) var console = function() {};
var YouboraCommunicationEvents = {
    START: 0,
    JOIN: 1,
    BUFFER: 2,
    PING: 3,
    PAUSE: 4,
    RESUME: 5,
    STOP: 6,
    ERROR: 7
};