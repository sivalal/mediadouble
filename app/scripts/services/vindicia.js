'use strict';
/*
 * VINDICIA SERVICES
 *
 */
mdlDirectTvApp.factory('Vindicia', ['$http', 'Sessions', '$rootScope', 'configuration', '$log', function($http, Sessions, $rootScope, configuration, $log) {
    var Vindicia = {
        createAccount: function(data) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/createAccount',
                data: data,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                $log.error("eCommerce Api to createAccount is returning error respnse. Please try again!");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        createPaymentMethod: function(data) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/createPaymentMethod',
                data: data,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                $log.error("eCommerce Api to createPaymentMethod is returning error respnse. Please try again!");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        confirmPaymentMethod: function(authId, paymentMethod) {
            var promise = $http.get(configuration.server_url + '/vindicia/confirmPaymentMethod?authId=' + authId + '&paymentMethod=' + paymentMethod).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        assignPaymentMethodToSubscription: function(paymentMethodBasedSessionID, subscriptionId) {
            var promise = $http.get(configuration.server_url + '/vindicia/assignPaymentMethodToSubscription?payment_method_id=' + paymentMethodBasedSessionID + '&subscription_id=' + subscriptionId).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        createSubscription: function(data) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/createSubscription',
                data: data,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                $log.error("eCommerce Api to createSubscriptionAction is returning error respnse. Please try again!");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        initializeTransaction: function(transData) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/initialize_transaction',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("transaction cannot be initialized--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        updateSubscriptionPayment: function(transData) {
            //call to transaction with promocode and package id and initialize a transaction
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/update_subscription_payment',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("transaction cannot be initialized--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        reviewTransaction: function(transData) {
            //review transaction to display errors and then confirm
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/review_transaction',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("review transaction failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        confirmTransaction: function(transData) {
            //review transaction to display errors and then confirm
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/confirm_transaction',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("confirm transaction failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        cancelTransaction: function(transData) {
            //review transaction to display errors and then confirm
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/cancel_transaction',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("cancel transaction failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        cancelConfirmTransaction: function(transData) {
            //review transaction to display errors and then confirm
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/cancel_confirm_transaction',
                data: transData,
                async: false,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) { // optional
                console.log("cancel transaction failed--------");
                return null;
            });
            // Return the promise to the controller
            return promise;
        },
        validatePromocode: function(promocode) {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/vindicia/validate_promocode?promocode=' + promocode).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getUserPackageDetailsByStatus: function() {
            var promise = $http.get(configuration.server_url + '/vindicia/get_user_package_by_status').then(function(response, headers) {
                return response.data;
            }, function(response) {
                console.log("package details of user: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            return promise;
        },
        getUserPackageDetailsByPurchase: function() {
            var promise = $http.get(configuration.server_url + '/vindicia/getUserPackageByPurcahse').then(function(response, headers) {
                return response.data;
            }, function(response) {
                console.log("package details of user: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            return promise;
        },
        getUserPackageByStatus: function() {
            var promise = $http.get(configuration.server_url + '/vindicia/getUserPackageByStatus').then(function(response, headers) {
                return response.data;
            }, function(response) {
                console.log("package details of user: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            return promise;
        },
        //  getPurchases: function(token) {
        //   var promise = $http.get(configuration.server_url + '/vindicia/getPurchases?accountToken=' + token).then(function (response, headers) {
        //         return response.data;
        //     	},
        // function(response) {
        // 	console.log("package details of user: Failed with " + response.status + ". Body: " + response.errorMessage);
        //   	// failed
        // }
        //   );
        //   return promise;
        //  },
        paymentMethod: function() {
            var promise = $http.get(configuration.server_url + '/vindicia/get_payment_method').then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        updateAccount: function(billingData) {
            var promise = $http({
                method: 'POST',
                url: configuration.server_url + '/vindicia/updateAccount',
                data: billingData,
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }, function(response) {
                console.log("account edit of user: Failed with " + response.status + ". Body: " + response.errorMessage);
                // failed
            });
            return promise;
        },
        billingHistory: function(fromDate, toDate) {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/vindicia/billing_history?from_date=' + fromDate + '&to_date=' + toDate).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        transactionHistory: function(fromDate, toDate) {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/vindicia/transaction_history?from_date=' + fromDate + '&to_date=' + toDate).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getPlayerOpt: function() {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/getopt?tid=' + Math.random()).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        getEntitlementList: function() {
            //review transaction to display errors and then confirm
            var promise = $http.get(configuration.server_url + '/vindicia/getEntitlementList').then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        //For adding new packages for the user.
        addSubPackages: function(productList) {
            var uid = Sessions.getCookie('userid');
            var promise = $http.get(configuration.server_url + '/vindicia/addSubPackages?productList=' + productList + '&uid=' + uid).then(function(response, headers) {
                return response.data;
            });
            return promise;
        },
        //For removing packages from the user.
        removeSubPackages: function(product) {
            var promise = $http.get(configuration.server_url + '/vindicia/removeSubPackages?products=' + product).then(function(response, headers) {
                return response.data;
            });
            return promise;
        }
    };
    return Vindicia;
}]);