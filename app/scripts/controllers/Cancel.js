'use strict';
/* Cancell Package Instance Controller */
//Instance controller for Cancel Modal
var CancelModalICtrl = ['$scope', '$modalInstance', '$modal', 'item', '$rootScope', '$location', 'Authentication', 'AccountService', '$filter', 'Vindicia', 'Sessions',
    function($scope, $modalInstance, $modal, item, $rootScope, $location, Authentication, AccountService, $filter, Vindicia, Sessions) {
        //close the modal
        $scope.cancel = function() {
            $location.url($location.path());
            $modalInstance.dismiss('cancel');
        };
        $scope.closeCancelErrorAlert = function() {
            $scope.cancelError = false;
        };
        $scope.closeCancelConfirmErrorAlert = function() {
            $scope.cancelConfirmError = false;
        };
        var init = function() {
                if ($rootScope.enableCancelPackagePromoPage) {
                    $scope.cancel_page_1 = true;
                    $scope.cancel_page_2 = false;
                    $scope.cancel_page_3 = false;
                } else {
                    $scope.cancel_page_1 = false;
                    $scope.cancel_page_2 = true;
                    $scope.cancel_page_3 = false;
                }
            }
            //onload active page
        init();
        $scope.showConfirmBox = function() {
            $scope.cancel_page_1 = false;
            $scope.cancel_page_2 = true;
            $scope.cancel_page_3 = false;
        };
        //account cancellation confirmation box
        $scope.accountCancel = function() {
            console.log($rootScope.userSubscriptionDetails);
            $scope.ajaxCancelPackageConfirmSpinner = true;
            var transData = {
                accountToken: Sessions.getCookie('accessToken'),
                packages: $rootScope.userSubscriptionDetails.subscriptionProductId,
                subscriptionId: $rootScope.userSubscriptionDetails.subscriptionId
            };
            Vindicia.cancelTransaction(transData).then(function(transactionCancelResponse) {
                console.log(transactionCancelResponse);
                var transactionCancelResponseContent = transactionCancelResponse.responseContent;
                if (transactionCancelResponse.responseStatus == 200) {
                    if (transactionCancelResponseContent.status.code == 0) {
                        $scope.cancelInitializeResponse = transactionCancelResponseContent;
                        $scope.accountConfirmation();
                    } else {
                        $scope.ajaxCancelPackageConfirmSpinner = true;
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined') ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                } else {
                    $rootScope.ajaxCancelPackageConfirmSpinner = true;
                    if (typeof transactionCancelResponseContent == "string") {
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent != 'undefined') ? transactionCancelResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                    } else {
                        $scope.cancelConfirmErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined') ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                }
            });
        };
        //account cancellation confirmation box
        // $scope.showConfirmBox=function() {
        // 	$scope.ajaxCancelPackageSpinner = true;
        // 	//call to cancel transaction
        // 	var transData = {
        // 		accountToken: Sessions.getCookie('accessToken'),
        // 		packages: $rootScope.userSubscriptionDetails.subscriptionProductId,
        // 		subscriptionId: $rootScope.userSubscriptionDetails.subscriptionId
        // 	};
        // 	Vindicia.cancelTransaction(transData).then(function(transactionCancelResponse) {
        // 		console.log(transactionCancelResponse);
        // 		$scope.ajaxCancelPackageSpinner = false;
        // 		var transactionCancelResponseContent = transactionCancelResponse.responseContent;
        // 		if(transactionCancelResponse.responseStatus == 200) {
        // 			if(transactionCancelResponseContent.status.code == 0) {
        // 				$scope.cancelInitializeResponse = transactionCancelResponseContent;
        // 				$scope.cancel_page_1 = false;
        // 				$scope.cancel_page_2 = true;
        // 				$scope.cancel_page_3 = false;
        // 			} else {
        // 				$scope.cancelError        = true;
        // 				$scope.cancelErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined')  ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
        // 			}
        // 		} else {
        // 			$location.url($location.path());
        // 			$rootScope.cancelError = true;
        // 			if(typeof transactionCancelResponseContent == "string") {
        // 			$scope.cancelErrorMessage = (typeof transactionCancelResponseContent != 'undefined') ? transactionCancelResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
        // 			} else {
        // 			$scope.cancelErrorMessage = (typeof transactionCancelResponseContent.status != 'undefined')  ? transactionCancelResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
        // 			}
        // 		}
        // 	});
        // }
        //account cancellation confirmation box
        $scope.accountConfirmation = function() {
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
                        $rootScope.entitlementCheck();
                    } else {
                        $scope.cancelConfirmError = true;
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent.status != 'undefined') ? transactionConfirmResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                } else {
                    if (typeof transactionConfirmResponseContent == "string") {
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent != 'undefined') ? transactionConfirmResponse.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                    } else {
                        $scope.cancelConfirmErrorMessage = (typeof transactionConfirmResponseContent.status != 'undefined') ? transactionConfirmResponseContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                }
            });
        };
        $scope.packageSwitch = function() {
            $location.url($location.path());
            $modalInstance.dismiss('cancel');
            $scope.signupModal(3);
        }
        $scope.packageSelected = function(packageItem) {
            $modalInstance.dismiss('cancel');
            $rootScope.nextBillingAmountForSelectedPackage = $rootScope.billingAmountBasedOnFreePlanFilter(packageItem, false);
            $rootScope.signupPackageId = packageItem.id;
            $rootScope.signupModal(3);
        };
        $scope.checkIfValueExistInUserSubscriptionList = function(productId) {
            return ($rootScope.userSubscriptionDetails.subscriptionProductId == productId) ? true : false;
        };
    }
];