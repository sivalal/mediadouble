'use strict';
/*
 * cancel account page
 */
mdlDirectTvApp.controller('CancelSubscriptionCtrl', ['$scope', '$modal', 'Gigya', '$timeout', '$http', 'AccountService', 'SocialService', '$rootScope', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore',
    function($scope, $modal, Gigya, $timeout, $http, AccountService, SocialService, $rootScope, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore) {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
        $scope.cancel_accountObj = null;
        $scope.showUserComment = false;
        $scope.userFeedBackAndCancelData = null;
        $scope.showConfirmPage = false;
        //gigya param watch
        $rootScope.$watch("gigyaParamList", function(newValue) {
            if (typeof newValue == 'undefined' || newValue == '') {
                return null; // gigyaParamList not updated yet
            }
            var initialCancel_accountObj = $rootScope.gigyaParamList.cancel_account;
            for (var i in initialCancel_accountObj.cancellation_statements) {
                initialCancel_accountObj.cancellation_statements[i].statementSelection = false;
            }
            initialCancel_accountObj.feedbackStatementSelection = null;
            initialCancel_accountObj.userComment = ""; //initial user comment
            $scope.cancel_accountObj = initialCancel_accountObj;
            console.log($scope.cancel_accountObj);
            analyticsService.TrackCustomPageLoad("account:cancel");
            if (typeof $rootScope.button_config_list !== 'undefined') {
                var buttonConfig = $filter('filter')($rootScope.button_config_list, {
                    id: 'SubmitFeedbackAndCancel'
                });
                $scope.SubmitFeedbackAndCancelButton = buttonConfig[0];
                var buttonConfig2 = $filter('filter')($rootScope.button_config_list, {
                    id: 'cancelAccountKeepMeIn'
                });
                $scope.cancelAccountKeepMeInButton = buttonConfig2[0];
            } else {
                console.log("button_config_list missing from appgrid configuration");
            }
            try {
                var msgObj = JSON.parse($rootScope.appGridMetadata.messages);
                $rootScope.TXTCANCELOTHERHINTObj = getTranslationObj('TXT_CANCEL_OTHER_HINT', msgObj);
            } catch (e) {}
        });
        /*
         * @param {string} key    -> appgrid message id
         * @param {object} msgObj -> appgrid msg obj
         * @returns {TranslationObj or null}
         */
        function getTranslationObj(key, msgObj) {
            var dummyObj = {};
            dummyObj.en_US = "";
            dummyObj.es_ES = "";
            if (typeof msgObj == 'undefined') {
                return dummyObj;
            }
            var TranslationObjList = $filter('filter')(msgObj, {
                id: key
            });
            if (typeof TranslationObjList == 'undefined') {
                return dummyObj;
            }
            return ((typeof TranslationObjList[0] !== 'undefined') ? TranslationObjList[0] : dummyObj);
        }
        $scope.HomePageAction = function() {
            jQuery("html,body").animate({
                scrollTop: 0
            }, 1000);
            //show notification and redirect user to home page
            //show notification
            $rootScope.enableSucessAlertMessage("CANCELACCOUNT_StayBackNotification");
            $timeout(function() {
                if (isMobile.any()) {
                    $location.url('/m.manageAccount');
                } else {
                    $location.url('/');
                }
            }, 4000); //redirect user to home page
        };

        function ShowFormStatusMsg(selectedCancelStatementsList) {
            //hide previous warnings.
            $rootScope.informationSuccessContainer = false;
            $rootScope.informationErrorContainer = false;
            //end of hide previous warnings.
            jQuery("html,body").animate({
                scrollTop: 0
            }, 1000);
            if ((typeof $scope.cancel_accountObj.feedbackStatementSelection == 'undefined' || $scope.cancel_accountObj.feedbackStatementSelection == null) &&
                selectedCancelStatementsList.length == 0) {
                $rootScope.enableErrorAlertMessage("CANCELACCOUNT_FEEDBACKPLEASE");
            } else if (selectedCancelStatementsList.length == 0) {
                $rootScope.enableErrorAlertMessage("CANCELACCOUNT_FEEDBACK_CANCELSTATEMENT_MISSING");
            } else if (typeof $scope.cancel_accountObj.feedbackStatementSelection == 'undefined' || $scope.cancel_accountObj.feedbackStatementSelection == null) {
                $rootScope.enableErrorAlertMessage("CANCELACCOUNT_FEEDBACKSTATEMENTSELECTION_MISSING");
            }
        }
        /*
         *
         * Cancel Account Button Action
         */
        $scope.CancelAccountAction = function() {
            var selectedCancelStatementsList = $filter('filter')($scope.cancel_accountObj.cancellation_statements, {
                statementSelection: true
            });
            console.log("cancel statements:-");
            console.log(selectedCancelStatementsList);
            console.log("feedback:-");
            console.log($scope.cancel_accountObj.feedbackStatementSelection);
            if ((typeof $scope.cancel_accountObj.feedbackStatementSelection != 'undefined' && $scope.cancel_accountObj.feedbackStatementSelection != null) &&
                selectedCancelStatementsList.length > 0) {
                SetProcessedUserData(selectedCancelStatementsList);
                //hide previous warnings.
                $rootScope.informationSuccessContainer = false;
                $rootScope.informationErrorContainer = false;
                //end of hide previous warnings.
                jQuery("html,body").animate({
                    scrollTop: 0
                }, 1000);
                $scope.accountCancel();
            } else {
                //user hasn't selected atleast one cancelation statement and
                // one feedback statement
                ShowFormStatusMsg(selectedCancelStatementsList);
            }
        };
        $scope.cancelStatementsChange = function(cstatement) {
            console.log(cstatement);
            if (cstatement.statementSelection == true) {
                $rootScope.informationErrorContainer = false;
            }
            if (cstatement.id == "other" && cstatement.statementSelection == true) {
                $scope.showUserComment = true;
            } else if (cstatement.id == "other") {
                $scope.showUserComment = false;
                $scope.cancel_accountObj.userComment = ""; //clear previous user comment
            }
        };
        $scope.disableCancelStatementsChange = function(cstatement) {
            var selectedList = $filter('filter')($scope.cancel_accountObj.cancellation_statements, {
                statementSelection: true
            });
            if (selectedList.length == 2) {
                //selected CancelStatements is 2 disable all unchecked CancelStatements
                cstatement.checkoutPackageCheckboxDisable = (cstatement.statementSelection == true) ? false : true;
            } else {
                cstatement.checkoutPackageCheckboxDisable = false;
            }
            return cstatement.checkoutPackageCheckboxDisable;
        };

        function SetProcessedUserData(selectedCancelStatementsList) {
            var selectedCancelStatementsListIds = new Array();
            for (var i in selectedCancelStatementsList) {
                selectedCancelStatementsListIds.push(selectedCancelStatementsList[i].id);
            }
            var cancellation_statement_ids = selectedCancelStatementsListIds.join();
            var userData = {
                UID: $rootScope.userid,
                cancel_account: {
                    cancellation_statement_ids: cancellation_statement_ids,
                    cancel_user_comment: $scope.cancel_accountObj.userComment,
                    product_feedback_ids: $scope.cancel_accountObj.feedbackStatementSelection
                },
                type: "cancelStatementAndFeedBack",
                action: 'setInfo'
            };
            console.log(userData);
            $scope.userFeedBackAndCancelData = userData;
        }
        /*
         * to store feedback in gigya
         */
        $scope.MakeFeedbackCall = function() {
            AccountService.SetAccountInfo($scope.userFeedBackAndCancelData).then(function(setAccountResponse) {
                // if(setAccountResponse.statusCode==200){
                $location.url('/cancelledAccountConfirmation');
                // }
            });
        };
        $scope.NoGoBack = function() {
            $scope.showConfirmPage = false;
        };
        ////////////////cancel subscription api call functions///////////////////////////////////
        $scope.accountCancel = function() {
            console.log("user UserPackageDetailsByPurchase details:-");
            console.log($rootScope.getUserPackageDetailsByPurchaseResp);
            if (typeof $rootScope.getUserPackageDetailsByPurchaseResp != 'undefined' && typeof $rootScope.getUserPackageDetailsByPurchaseResp.subscription_id != 'undefined') {
                var subscriptionId = $rootScope.getUserPackageDetailsByPurchaseResp.subscription_id;
            } else {
                console.log("error: undefined rootScope.getUserPackageDetailsByPurchaseResp.subscription_id")
            }
            var subscriptionProductId = $rootScope.basicPackageId ? $rootScope.basicPackageId : "";
            if (typeof subscriptionId == 'undefined' || subscriptionProductId == "") {
                $rootScope.informationSuccessContainer = false;
                $rootScope.informationErrorContainer = false;
                console.log("subscriptionProductId or subscriptionId missing ");
                return null;
            }
            console.log("Userinf:basicPackageId");
            console.log($rootScope.basicPackageId);
            $scope.ajaxCancelPackageConfirmSpinner = true;
            var transData = {
                accountToken: Sessions.getCookie('accessToken'),
                packages: subscriptionProductId,
                subscriptionId: subscriptionId
            };
            Vindicia.cancelTransaction(transData).then(function(transactionCancelResponse) {
                console.log(transactionCancelResponse);
                var transactionCancelResponseContent = transactionCancelResponse.responseContent;
                if (transactionCancelResponse.responseStatus == 200) {
                    if (transactionCancelResponseContent.status.code == 0) {
                        $scope.cancelInitializeResponse = transactionCancelResponseContent;
                        $scope.showConfirmPage = true;
                        jQuery("html,body").animate({
                            scrollTop: 0
                        }, 1000);
                    } else {
                        $scope.ajaxCancelPackageConfirmSpinner = true;
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined') ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        $rootScope.enableErrorAlertMessage($scope.cancelConfirmErrorMessage);
                    }
                } else {
                    $rootScope.ajaxCancelPackageConfirmSpinner = true;
                    if (typeof transactionCancelResponseContent == "string") {
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent != 'undefined') ? transactionCancelResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                    } else {
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined') ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                    $rootScope.enableErrorAlertMessage($scope.cancelConfirmErrorMessage);
                }
            });
        };
        //-----------------
        $scope.showIncorrectPasswordError = false;
        $scope.pwdcheck = function() {
            $scope.showIncorrectPasswordError = false; //clear msg
        };
        $scope.CheckPasswordAndConfirm = function() {
            var data = {
                email: Sessions.getCookie('emailId'),
                password: $scope.uLoginPassword,
                rememberme: false,
                action: 'login'
            };
            Gigya.postHandler(data).then(function(response) {
                var USER = response;
                if (USER.errorStatus == 0 && USER.statusCode == 200) {
                    //password ok so trigger cancel account confirmation
                    $scope.accountCancelConfirmation();
                } else {
                    //show incorrect password
                    $scope.showIncorrectPasswordError = true;
                }
            });
        };
        $scope.accountCancelConfirmation = function() {
            $scope.ajaxCancelPackageConfirmSpinner = true;
            //call to cancel transaction
            var transData = {
                accountToken: Sessions.getCookie('accessToken'),
                initResponse: $scope.cancelInitializeResponse
            };
            Vindicia.cancelConfirmTransaction(transData).then(function(transactionConfirmResponse) {
                console.log(transactionConfirmResponse);
                $scope.ajaxCancelPackageConfirmSpinner = false;
                var transactionConfirmResponseContent = transactionConfirmResponse.responseContent;
                if (transactionConfirmResponse.responseStatus == 200) {
                    if (transactionConfirmResponseContent.status.code == 0) {
                        $scope.cancel_page_1 = false;
                        $scope.cancel_page_2 = false;
                        $scope.cancel_page_3 = true;
                        $scope.MakeFeedbackCall(); //on cancel success store feedback in gigya
                        $rootScope.entitlementCheck();
                    } else {
                        $scope.cancelConfirmError = true;
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent.status != 'undefined') ? transactionConfirmResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                        $rootScope.enableErrorAlertMessage($scope.cancelConfirmErrorMessage);
                    }
                } else {
                    if (typeof transactionConfirmResponseContent == "string") {
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent != 'undefined') ? transactionConfirmResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                    } else {
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent.status != 'undefined') ? transactionConfirmResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                    $rootScope.enableErrorAlertMessage($scope.cancelConfirmErrorMessage);
                }
            });
        };
        //////////////////////////////////////////////////////////////////////////
    }
]);