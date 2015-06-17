'use strict';
/*
 * Subscription Details Controller
 */
mdlDirectTvApp.controller('subscriptionDetailsCtrl', ['$scope', '$parse', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya', '$routeParams',
    function($scope, $parse, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya, $routeParams) {
        console.log("<==into manage account page==>");
        $scope.test = "value";
        $scope.showMoreUpgradesLabelMobile = true;
        $scope.hideAddonContainerMobile = true;
        $scope.hideCancelSaveBtn = $scope.showManageAddonBtn = true;
        $scope.removedObjects = [];
        $rootScope.packageVal = (typeof $rootScope.packageVal == 'undefined') ? {} : $rootScope.packageVal;
        $scope.currNavSelected = false;
        $scope.selectedPackageId = ($rootScope.empty($rootScope.selectedPackageInNav)) ? $routeParams.id : $rootScope.selectedPackageInNav;
        $rootScope.$watch("packagesReady", function(newValue, oldValue) {
            if (newValue == 'undefined' || typeof newValue == 'undefined') {
                return true; // packageList not updated yet
            }
            $rootScope.newPackageList = (typeof $rootScope.newPackageList == 'undefined') ? $filter('filter')($rootScope.packageObjList, {
                newPackageSelection: true
            }) : $rootScope.newPackageList;
            if (!$rootScope.packLength) {
                $rootScope.packLength = $rootScope.newPackageList.length;
                //For getting the currency symbol
                if ($rootScope.packLength) {
                    $rootScope.currencySymbol = $rootScope.newPackageList[0].billing_plan.price_symbol;
                }
            }
            $rootScope.addedAddons = (typeof $rootScope.addedAddons == 'undefined') ? [] : $rootScope.addedAddons;
            if (!$rootScope.initialCost) {
                $rootScope.initialCost = $scope.calculateTotalPackageAmount();
            }
            $rootScope.newAddonList = (typeof $rootScope.newAddonList == 'undefined') ? $filter('filter')($rootScope.packageObjList, {
                type: 'addon',
                isSubscribed: false
            }) : $rootScope.newAddonList;
            if (!$rootScope.basicAddonList) {
                $rootScope.basicAddonList = $rootScope.newAddonList;
                for (var i in $rootScope.basicAddonList) {
                    var id = $rootScope.basicAddonList[i].id;
                    $rootScope.packageVal[id] = false;
                }
            }
            $scope.purchaseCancel();
            $scope.calculateTotalPackageAmount();
            if (!!$scope.selectedPackageId) {
                for (var i in $rootScope.newAddonList) {
                    var id = $rootScope.newAddonList[i].id;
                    console.log("$rootScope.newAddonList[i].id" + $rootScope.newAddonList[i].id);
                    console.log("id" + $scope.selectedPackageId);
                    if ($scope.selectedPackageId == id) {
                        $rootScope.packageVal[id] = true;
                        $scope.addAdditionalPackage($rootScope.newAddonList[i], true);
                        break;
                    }
                }
            }
            $scope.calculateTotalPackageAmount();
            $scope.ajaxPackageSpinner = false;
        });
        $scope.boltOnsSave = function() {
            $scope.colorCancel();
            if ($scope.removedObjects.length > 0) {
                for (var i in $scope.removedObjects) {
                    $scope.removedObjects[i].name[$rootScope.CurrentLang] = $scope.removedObjects[i].name[$rootScope.CurrentLang] + "?";
                }
                $scope.showOverlay = true;
                console.log("overlay display.");
            } else {
                console.log("no changes to save.");
            }
        };
        $scope.changeListOrder = function(id) {
            var objSelected = $filter('filter')($rootScope.packageObjList, {
                id: id
            });
            $scope.removeA($rootScope.packageObjList, objSelected);
            $rootScope.packageObjList.push(objSelected[0]);
        };
        $scope.boltOnsCancel = function() {
            $scope.colorCancel();
            $scope.showForm = $scope.hideAddonContainer = $scope.hideTextBelow = false;
            $scope.hideCancelSaveBtn = $scope.showManageAddonBtn = true;
            $scope.removePackageMode = $scope.showOverlay = false;
            $scope.removedObjects = [];
            $rootScope.addedAddons = [];
            $rootScope.packageVal = {};
            for (var i in $rootScope.packageObjList) {
                $rootScope.packageObjList[i].packageSelection = true;
            }
            $scope.grandTotal = $rootScope.initialCost;
        };
        $scope.colorCancel = function() {
            for (var i in $rootScope.packageObjList) {
                $rootScope.packageObjList[i].isNavClick = false;
            }
            $scope.showMoreUpgradesLabel = false;
            $scope.currNavSelected = false;
        };
        $scope.clearOverlay = function(noCloseOverlay) {
            for (var i in $scope.removedObjects) {
                var obj = $scope.removedObjects[i];
                var lastChar = obj.name[$rootScope.CurrentLang].slice(-1);
                if (lastChar == "?") {
                    obj.name[$rootScope.CurrentLang] = obj.name[$rootScope.CurrentLang].
                    substring(0, obj.name[$rootScope.CurrentLang].length - 1);
                    obj.packageSelection = true;
                }
            }
            if (!noCloseOverlay) {
                $scope.showOverlay = false;
                $scope.showOverlaySpinner = false;
            }
        };
        $scope.removeExistingPackage = function() {
            $scope.showErrorOverlayTxt = false;
            $scope.showOverlaySpinner = true;
            var isRemovedAddonClicked = false;
            var packageIds = [],
                undeletedIDs = [],
                deletedIDs = [];
            var grandTotal = $rootScope.initialCost;
            for (var i in $scope.removedObjects) {
                packageIds.push($scope.removedObjects[i].id);
            }
            var newPackageStr = packageIds.join("|");
            analyticsService.serviceDowngrade($rootScope.userSubscribedPackages, newPackageStr);
            //for(var i in $scope.removedObjects){
            console.log("removing ids:");
            console.log(packageIds);
            Vindicia.removeSubPackages(JSON.stringify(packageIds)).then(function(removedPackageResponse) {
                $scope.clearOverlay(true);
                console.log("removedPackageResponse");
                console.log(removedPackageResponse);
                if (removedPackageResponse.deletedArray.length == packageIds.length) {
                    deletedIDs = removedPackageResponse.deletedArray;
                    $scope.removedObjects = [];
                    $rootScope.entitlementCheck();
                    //$rootScope.addExpiryDate(deletedIDs);
                    $rootScope.enableSucessAlertMessage("DELETE_ADDONS_TXT");
                    $scope.calculateTotalPackageAmount();
                    $scope.clearOverlay();
                    $scope.boltOnsCancel();
                } else if (removedPackageResponse.deletedArray.length > 0) {
                    var deletedPacks = [];
                    deletedIDs = removedPackageResponse.deletedArray;
                    for (var i in $scope.removedObjects) {
                        if (deletedIDs.indexOf($scope.removedObjects[i].id) > -1) {
                            deletedPacks.push($scope.removedObjects[i]);
                        }
                    }
                    $scope.removeA($scope.removedObjects, deletedPacks);
                    $rootScope.entitlementCheck();
                    $scope.calculateTotalPackageAmount();
                    //$rootScope.addExpiryDate(deletedIDs);
                    $scope.clearOverlay();
                    $scope.boltOnsCancel();
                } else if (removedPackageResponse.existingArray.length > 0 && removedPackageResponse.unDeletedArray.length == 0) {
                    $scope.clearOverlay();
                    $scope.boltOnsCancel();
                }
                if (removedPackageResponse.unDeletedArray.length > 0) {
                    var undeletedPacks = [];
                    undeletedIDs = removedPackageResponse.unDeletedArray;
                    for (var i in $scope.removedObjects) {
                        if (undeletedIDs.indexOf($scope.removedObjects[i].id) > -1) {
                            undeletedPacks.push($scope.removedObjects[i]);
                        }
                    }
                    $scope.removedObjects = undeletedPacks;
                    $scope.showErrorOverlayTxt = true;
                }
            });
        };
        $scope.purchaseCancel = function() {
            $scope.colorCancel();
            for (var i in $rootScope.packageObjList) {
                if ($rootScope.packageObjList[i].type == 'addon' && $rootScope.packageObjList[i].isSubscribed == false) {
                    $rootScope.packageObjList[i].newPackageSelection = false;
                    $rootScope.packageObjList[i].packageSelection = true;
                }
            }
            $scope.removeA($rootScope.newPackageList, $rootScope.addedAddons);
            for (var i in $rootScope.addedAddons) {
                $rootScope.newAddonList.push($rootScope.addedAddons[i]);
            }
            $scope.showForm = $scope.hideAddonContainer = $scope.hideTextBelow = false;
            $scope.hideCancelSaveBtn = $scope.showManageAddonBtn = true;
            $scope.removePackageMode = $scope.showOverlay = false;
            $scope.removedObjects = [];
            $rootScope.addedAddons = [];
            $rootScope.packageVal = {};
            for (var i in $rootScope.newAddonList) {
                var id = $rootScope.newAddonList[i].id;
                $rootScope.packageVal[id] = false;
            }
            $scope.grandTotal = $rootScope.initialCost;
        };
        $scope.showContainer = function() {
            $scope.hideCancelSaveBtn = $scope.showManageAddonBtn = false;
            $scope.hideAddonContainer = $scope.removePackageMode = true;
        };
        $scope.getMoreUpgrades = function() {
            $scope.showMoreUpgradesLabel = false;
            $scope.hideAddonContainer = false;
        };
        $scope.getMoreUpgradesMobile = function() {
            $scope.showMoreUpgradesLabelMobile = false;
            $scope.hideAddonContainerMobile = false;
        };
        $scope.getLessUpgradesMobile = function() {
            $scope.showMoreUpgradesLabelMobile = true;
            $scope.hideAddonContainerMobile = true;
        };
        $scope.hideOrShowMoreUpgrades = function() {
            if ($rootScope.newAddonList.length == 0) {
                $scope.showMoreUpgradesLabel = false;
                $scope.hideAddonContainer = true;
            } else {
                $scope.showMoreUpgradesLabel = true;
                $scope.hideAddonContainer = true;
            }
        };
        $scope.addAdditionalPackage = function(packageObj, isNavClick) {
            $scope.currNavSelected = false;
            $scope.changeListOrder(packageObj.id);
            if (!isNavClick) {
                $scope.colorCancel();
            } else {
                packageObj.isNavClick = true;
                $scope.currNavSelected = true;
                $scope.currSelectedNavBolton = packageObj;
            }
            var id = packageObj.id;
            $scope.hideTextBelow = $rootScope.packageVal[id] = true;
            $scope.showManageAddonBtn = false;
            $scope.showForm = true;
            packageObj.newPackageSelection = packageObj.packageSelection = true;
            if ($rootScope.newPackageList.indexOf(packageObj) < 0) {
                $rootScope.newPackageList.push(packageObj);
            }
            if ($rootScope.addedAddons.indexOf(packageObj) < 0) {
                $rootScope.addedAddons.push(packageObj);
            }
            $scope.removeA($rootScope.newAddonList, [packageObj]);
            if (isNavClick) {
                $scope.hideOrShowMoreUpgrades();
            }
            if ($rootScope.newAddonList.length == 0) {
                console.log("$rootScope.newAddonList==>");
                console.log($rootScope.newAddonList);
                $scope.hideAddonContainer = true;
            }
            //reload grand total
            $scope.calculateTotalPackageAmount();
        };
        $scope.cancelAccount = function() {
            $location.path("/cancelAccount");
        };
        $scope.billngHistory = function() {
            $location.path("/billingHistory");
        };
        //Removes given values/objects from the array
        $scope.removeA = function(arr, arrToRemove) {
            var pos, L = arrToRemove.length,
                ax;
            while (L > 0 && arr.length) {
                pos = arrToRemove[--L];
                while ((ax = arr.indexOf(pos)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        };
        $scope.CheckPasswordAndConfirm = function() {
            if (this.passwordForm.password.$valid) {
                console.log("$scope.password");
                console.log($('#passwordId').val());
                var data = {
                    email: Sessions.getCookie('emailId'),
                    password: $('#passwordId').val(),
                    rememberme: false,
                    action: 'login'
                };
                Gigya.postHandler(data).then(function(response) {
                    var USER = response;
                    if (USER.errorStatus == 0 && USER.statusCode == 200) {
                        $scope.showIncorrectPasswordError = false;
                        //password ok so trigger purchaseAddon function
                        $scope.purchaseAddon();
                    } else {
                        //show incorrect password
                        $scope.showIncorrectPasswordError = true;
                    }
                });
            } else {
                $scope.submitted = true;
            }
        };
        $scope.purchaseAddon = function() {
            $scope.addOnSubscrptnSpinner = true;
            var productList = [];
            var newPackage = [];
            $rootScope.addonsNamesList = "";
            $rootScope.addonsUnAddedNamesList = "";
            for (var i in $rootScope.addedAddons) {
                newPackage.push($rootScope.addedAddons[i].id);
                var product = {
                    "product": {
                        "id": $rootScope.addedAddons[i].id
                    }
                };
                productList.push(product);
            }
            var newPackageStr = newPackage.join("|");
            analyticsService.serviceUpgrade($rootScope.userSubscribedPackages, newPackageStr);
            productList = JSON.stringify(productList);
            Vindicia.addSubPackages(productList).then(function(addedPackageResponse) {
                if (addedPackageResponse.addedArray.length > 0) {
                    var addedPacks = [];
                    var idList = [];
                    console.log("$rootScope.addedAddons==>");
                    console.log($rootScope.addedAddons);
                    var addedIDs = addedPackageResponse.addedArray;
                    var succesArrLen = addedPackageResponse.addedArray.length;
                    if (succesArrLen == $rootScope.addedAddons.length) {
                        for (var i in $rootScope.addedAddons) {
                            $rootScope.addonsNamesList = $rootScope.addonsNamesList + ", " + $rootScope.addedAddons[i].name[$rootScope.CurrentLang];
                            idList.push($rootScope.addedAddons[i].id);
                        }
                        $rootScope.addedAddons = [];
                    } else if (succesArrLen < $rootScope.addedAddons.length) {
                        for (var i in $rootScope.addedAddons) {
                            if (addedIDs.indexOf($rootScope.addedAddons[i].id) > -1) {
                                addedPacks.push($rootScope.addedAddons[i]);
                            }
                        }
                        $scope.removeA($rootScope.addedAddons, addedPacks);
                        for (var j in addedPacks) {
                            idList.push(addedPacks[j].id);
                            $rootScope.addonsNamesList = $rootScope.addonsNamesList + ", " + addedPacks[j].name[$rootScope.CurrentLang];
                        }
                    }
                    $rootScope.addonsNamesList = $scope.removeLastChar($rootScope.addonsNamesList, ",", ",");
                    //$rootScope.addonsNamesList = $rootScope.addonsNamesList.substring(0, $rootScope.addonsNamesList.length - 1);
                    console.log($rootScope.addonsNamesList);
                    $scope.showManageAddonBtn = true;
                    $rootScope.packageAddSuccessTxt = true;
                    $rootScope.enableSucessAlertMessage("SUCCESS_PURCHASE_TXT");
                    $scope.colorCancel();
                    for (var j in $rootScope.packageObjList) {
                        var id = $rootScope.packageObjList[j].id;
                        if (idList.indexOf(id) > -1) {
                            delete $rootScope.packageVal[id];
                            $rootScope.packageObjList[j].isSubscribed = true;
                            var obj = $filter('filter')($rootScope.basicAddonList, {
                                id: id
                            });
                            $scope.removeA($rootScope.basicAddonList, obj);
                        }
                    }
                    $rootScope.entitlementCheck();
                    $rootScope.initialCost = $scope.calculateTotalPackageAmount();
                    $scope.showForm = false;
                    var MastheadBolton_ReturnUrl = Sessions.getCookie('MastheadBolton_ReturnUrl');
                    if (MastheadBolton_ReturnUrl != "") {
                        Sessions.setCookie('MastheadBolton_ReturnUrl', "");
                        $location.path(MastheadBolton_ReturnUrl);
                    }
                } else if (addedPackageResponse.existingArray.length > 0 && addedPackageResponse.unAddedArray.length == 0) {
                    $scope.purchaseCancel();
                    $scope.boltOnsCancel();
                }
                if (addedPackageResponse.unAddedArray.length > 0) {
                    if (addedPackageResponse.addedArray.length == 0) {
                        console.log("transaction failed....");
                        $rootScope.enableErrorAlertMessage("TRANSACTION_FAILED_MSG");
                    } else {
                        var unSuccessArr = addedPackageResponse.unAddedArray;
                        for (var j in unSuccessArr) {
                            idList.push(unSuccessArr[j].id);
                            $rootScope.unAddedAddonsNamesList = $rootScope.unAddedAddonsNamesList + ", " + unSuccessArr[j].name[$rootScope.CurrentLang];
                        }
                        $rootScope.unAddedAddonsNamesList = $scope.removeLastChar($rootScope.unAddedAddonsNamesList, ",", ",");
                        setTimeout(function() {
                            $rootScope.packageAddErrorTxt = true;
                            $rootScope.enableErrorAlertMessage("PARTIAL_TRANSACTION_FAILED_MSG");
                        }, 3000);
                    }
                    var unAddedPacks = [];
                    var unAddedPacksIDs = addedPackageResponse.unAddedArray;
                    for (var i in $rootScope.addedAddons) {
                        if (unAddedPacksIDs.indexOf($rootScope.addedAddons[i].id) > -1) {
                            unAddedPacks.push($rootScope.addedAddons[i]);
                        }
                    }
                    $rootScope.addedAddons = unAddedPacks;
                    $scope.purchaseCancel();
                    $scope.boltOnsCancel();
                }
                $scope.hideTextBelow = false;
                $scope.addOnSubscrptnSpinner = false;
                ///////////////////////////////////
            });
        };
        $scope.removeLastChar = function(string, lchars, fchars) {
            var lastChar = string.slice(-1);
            if (lchars && (lastChar == lchars)) {
                string = string.substring(0, string.length - 1);
            }
            string = string.slice(1);
            return string;
        };
        $scope.setFormScope = function(scope) {
            this.promoCodeForm = scope;
        };
        $scope.isCheckboxPaymentChange = function(packageObj) {
            var id = packageObj.id;
            packageObj.packageSelection = !packageObj.packageSelection;
            if ($scope.removePackageMode == true) {
                if (packageObj.packageSelection == false) {
                    $scope.removedObjects.push(packageObj);
                    // $scope.removeA($rootScope.newPackageList, [packageObj]);
                } else if (packageObj.packageSelection == true) {
                    var pos = $scope.removedObjects.indexOf(packageObj);
                    if (pos > -1) {
                        $scope.removeA($scope.removedObjects, [packageObj]);
                        // $rootScope.newPackageList.push(packageObj);
                    }
                }
            } else if (packageObj.packageSelection == false) {
                $scope.colorCancel();
                console.log("Removing package");
                $scope.removeA($rootScope.newPackageList, [packageObj]);
                $scope.removeA($rootScope.addedAddons, [packageObj]);
                $rootScope.newAddonList.push(packageObj);
                packageObj.newPackageSelection = packageObj.packageSelection = false;
                $scope.hideAddonContainer = false;
                //var randomAddedPackage = $rootScope.packageVal.indexOf(true);
                if ($rootScope.packageVal[id] == true) {
                    $rootScope.packageVal[id] = false;
                }
                if ($rootScope.newPackageList.length > $rootScope.packLength) {
                    $scope.hideTextBelow = $scope.showForm = true;
                    $scope.showManageAddonBtn = false;
                } else if ($rootScope.newPackageList.length == $rootScope.packLength) {
                    $scope.showManageAddonBtn = true;
                    $scope.hideTextBelow = $scope.showForm = false;
                }
            }
            if (packageObj.billing_plan.price_amount) {
                var priceAmount = parseFloat(packageObj.billing_plan.price_amount);
                if (packageObj.packageSelection == false) {
                    $scope.grandTotal = parseFloat($scope.grandTotal - priceAmount);
                } else {
                    $scope.grandTotal = parseFloat($scope.grandTotal + priceAmount);
                }
                $scope.grandTotal = parseFloat($scope.grandTotal.toFixed(2));
            }
            return;
        };
        //calculate total package amount
        $scope.calculateTotalPackageAmount = function() {
            var newValue = $rootScope.newPackageList;
            if (newValue) {
                var grandTotal = 0;
                for (var i = 0; i <= newValue.length; i++) {
                    if (newValue[i] && newValue[i].showExpiration != true) {
                        grandTotal += parseFloat(newValue[i].billing_plan.price_amount);
                    }
                }
            }
            $scope.grandTotal = parseFloat(grandTotal.toFixed(2));
            return $scope.grandTotal;
        };
    }
]);