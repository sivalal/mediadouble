'use strict';
/*
 * Manage account page
 */
mdlDirectTvApp.controller('BillingHistoryCtrl', ['$scope', '$modal', 'dateFilter', '$http', 'AccountService', 'SocialService', '$rootScope', '$sce', 'Sessions', 'Authentication', 'configuration', '$filter', '$window', 'Vindicia', '$location', 'analyticsService', '$cookieStore', 'Gigya',
    function($scope, $modal, dateFilter, $http, AccountService, SocialService, $rootScope, $sce, Sessions, Authentication, configuration, $filter, $window, Vindicia, $location, analyticsService, $cookieStore, Gigya) {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);

        $scope.transactionList = [];
        $scope.test = "value";
        var currentDate = $filter('date')(new Date(), 'MM/dd/yyyy');
        //currentDate.setFullYear(currentDate.getFullYear() - 1);
        var fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 2);
        $scope.fromBillDate = $filter('date')(fromDate, 'MM/dd/yyyy');
        var todate = new Date();
        todate.setDate(todate.getDate() + 1);
        $scope.toBillDate = $filter('date')(todate, 'MM/dd/yyyy');;
        $scope.tfValue = true;
        /*Load More*/
        /*Initail loading values*/
        $scope.initLoadMore = function() {
            $scope.currentPageNumber = 0;
            $scope.totalPages = 0;
            $scope.itemsPerPage = 8;
            $scope.listOfTransactions = [];
            $scope.isShowNextBilling = false;
        };
        /*find total pages*/
        $scope.findTotalPages = function(totalCounts, itemsPerPage) {
            if (totalCounts % itemsPerPage == 0) {
                $scope.totalPages = Math.floor(totalCounts / itemsPerPage);
            } else {
                $scope.totalPages = Math.floor((totalCounts / itemsPerPage) + 1);
            }
        };
        $scope.dateComparison = function(endate) {
            var dateArr = endate.split('-');
            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            var endDateObj = new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]);
            if (endDateObj > currentDate) {
                console.log("current greater than to date");
                return true;
            } else {
                console.log("current less than to date");
                return false;
            }
        };
        $scope.findNextBillingObject = function(listOfTrans) {
            var transObj = null
            for (var i = 0; i < listOfTrans.length; i++) {
                transObj = listOfTrans[i];
                var endate = transObj.transaction_items[0]['service_period_end_date'];
                if ($scope.dateComparison(endate)) {
                    return transObj;
                }
            }
        };
        /*Load more data and append to our current list , when ever we called*/
        $scope.loadMore = function() {
            //console.log($scope.getData());
            $scope.listOfTransactions = $scope.listOfTransactions.concat($scope.getData());
            $scope.currentPageNumber = $scope.currentPageNumber + 1;
            console.log("appnding array");
            console.log($scope.listOfTransactions);
        };
        /*Fetch page wise data as the per page count */
        $scope.getData = function() {
            //var jsonStringData='{"responseStatus":200,"responseContent":{"status":{"code":"0","message":"Success","user_id":"e58dd15f50bf41c0bd9d3c32cf8685ea","pcode":"R3ZHExOjHcfMbqoMxpYBE7PbDEyB","request_id":"90e9947a658a3245","http_code":200},"transactions":[{"merchant_transaction_id":"DTVHOT00043473","amount":0,"currency":"USD","timestamp":"2015-01-27","status":"Authorized","source_payment_method":{"id":"CreditCard_54c77db3_89","vid":"","type":"CreditCard","credit_card":{"last_digits":"4448"},"account_holder_name":"alex 2","billing_address":{"name":"alex 2","addr1":"addr1","city":"wqd","district":"AL","postal_code":12345,"postal_code_string":"12345","country":"US","phone":"12342423444"}},"transaction_items":[{"name":"Monthly billing with first month free","price":0,"service_period_start_date":"2015-01-27","service_period_end_date":"2015-02-26"},{"name":"DirecTV-Hispanic: Subscription Video on Demand (Basic Package)","price":0,"service_period_start_date":"2015-01-27","service_period_end_date":"2015-02-26"},{"name":"Total Tax","price":0,"service_period_start_date":"2015-01-27","service_period_end_date":"2015-02-26"}]},{"merchant_transaction_id":"DTVHOT00048574","amount":7.99,"currency":"USD","timestamp":"2015-02-27","status":"Authorized","source_payment_method":{"id":"CreditCard_54c77db3_89","vid":"","type":"CreditCard","credit_card":{"last_digits":"4448"},"account_holder_name":"alex 2","billing_address":{"name":"alex 2","addr1":"addr1","city":"wqd","district":"AL","postal_code":12345,"postal_code_string":"12345","country":"US","phone":"12342423444"}},"transaction_items":[{"name":"Monthly billing with first month free","price":0,"service_period_start_date":"2015-02-27","service_period_end_date":"2015-03-26"},{"name":"DirecTV-Hispanic: Subscription Video on Demand (Basic Package)","price":7.99,"service_period_start_date":"2015-02-27","service_period_end_date":"2015-03-26"},{"name":"Total Tax","price":0,"service_period_start_date":"2015-02-27","service_period_end_date":"2015-03-26"}]},{"merchant_transaction_id":"DTVHOT00053868","amount":7.99,"currency":"USD","timestamp":"2015-03-27","status":"Authorized","source_payment_method":{"id":"CreditCard_54c77db3_89","vid":"","type":"CreditCard","credit_card":{"last_digits":"4448"},"account_holder_name":"alex 2","billing_address":{"name":"alex 2","addr1":"addr1","city":"wqd","district":"AL","postal_code":12345,"postal_code_string":"12345","country":"US","phone":"12342423444"}},"transaction_items":[{"name":"Monthly billing with first month free","price":0,"service_period_start_date":"2015-03-27","service_period_end_date":"2015-04-26"},{"name":"DirecTV-Hispanic: Subscription Video on Demand (Basic Package)","price":7.99,"service_period_start_date":"2015-03-27","service_period_end_date":"2015-04-26"},{"name":"Total Tax","price":0,"service_period_start_date":"2015-03-27","service_period_end_date":"2015-04-26"}]}]}}';
            //var mydata=JSON.parse(jsonStringData);
            var allData = $scope.transactionList; //=mydata.responseContent.transactions;//$scope.allTransactions;            
            //var totalItems=allData.length;
            $scope.nextBillingObject = $scope.findNextBillingObject(allData);
            if ($scope.nextBillingObject != null) {
                $scope.isShowNextBilling = true;
            } else {
                $scope.isShowNextBilling = false;
            }
            console.log("Last object Scope");
            console.log($scope.nextBillingObject);
            var sendData = $filter('limitTo')($filter('startFrom')(allData, $scope.currentPageNumber * $scope.itemsPerPage), $scope.itemsPerPage);
            return sendData;
        };
        $scope.getBillingTransaction = function(fromDate, toDate) {
            // converting to api params format
            var dateTime = new Date(fromDate);
            var fromDate = dateTime.getFullYear() + "-" + ("0" + (dateTime.getMonth() + 1)).slice(-2) + "-" + ("0" + dateTime.getDate()).slice(-2);
            var dateTime = new Date(toDate);
            var toDate = dateTime.getFullYear() + "-" + ("0" + (dateTime.getMonth() + 1)).slice(-2) + "-" + ("0" + dateTime.getDate()).slice(-2);
            var dateAr = fromDate.split('-');
            fromDate = dateAr[0] + dateAr[1] + dateAr[2];
            var dateAr = toDate.split('-');
            toDate = dateAr[0] + dateAr[1] + dateAr[2];
            $scope.ajaxBillingHistorySpinner = true;
            $scope.initLoadMore();
            /**/
            //        $scope.loadMore();
            //        $scope.totalCounts=$scope.transactionList.length;//$scope.allTransactions.length;
            //        $scope.findTotalPages($scope.totalCounts,$scope.itemsPerPage);
            /**/
            Vindicia.transactionHistory(fromDate, toDate).then(function(transactionList) {
                var transactionListContent = transactionList.responseContent;
                $scope.ajaxBillingHistorySpinner = false;
                if (transactionList.responseStatus == 200) {
                    if (transactionListContent.status.http_code == 200) {
                        $scope.transactionList = transactionListContent.transactions;
                        $scope.userPackageInBillingHistoryContainer = true;
                        $scope.initLoadMore();
                        $scope.totalCounts = $scope.transactionList.length; //$scope.allTransactions.length;
                        $scope.findTotalPages($scope.totalCounts, $scope.itemsPerPage);
                        $scope.loadMore();
                    } else {
                        $scope.transactionHistoryError = true;
                        $scope.transactionHistoryMessage = (typeof transactionListContent.status != 'undefined') ? transactionListContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                } else if (transactionList.responseStatus == 500) {
                    $scope.transactionHistoryError = true;
                    $scope.transactionHistoryMessage = transactionList.responseStatus.toString();
                } else {
                    $scope.transactionHistoryError = true;
                    if (typeof transactionListContent == "string") {
                        $scope.transactionHistoryMessage = (typeof transactionListContent != 'undefined') ? transactionList.responseStatus.toString() : 'TRANSACTION_FAILED_MSG';
                    } else {
                        $scope.transactionHistoryMessage = (typeof transactionListContent.status != 'undefined') ? transactionListContent.status.code.toString() : 'TRANSACTION_FAILED_MSG';
                    }
                }
                console.log("trans");
                console.log($scope.transactionList);
            });
        };
        jQuery("#fromBillingDate").datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                var toDateElement = jQuery("#toBillingDate");
                toDateElement.datepicker("option", "minDate", selectedDate);
                //if((toDateElement.val() != 'undefined') || (toDateElement.val() == null)) $scope.getBillingTransaction(selectedDate, toDateElement.val());
            }
        });
        jQuery('#toBillingDate').datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            numberOfMonths: 1,
            maxDate: '0',
            onClose: function(selectedDate) {
                var fromDateElement = jQuery("#fromBillingDate");
                fromDateElement.datepicker("option", "maxDate", selectedDate);
                $scope.getBillingTransaction(fromDateElement.val(), selectedDate);
            }
        });
        jQuery('#toBillingDateImg').click(function() {
            jQuery('#toBillingDate').datepicker('show');
        });
        jQuery('#fromBillingDateImg').click(function() {
            jQuery('#fromBillingDate').datepicker('show');
        });
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.getBillingTransaction($scope.fromBillDate, $scope.toBillDate);
            }
        });
        $scope.sortByDate = function() {
            if ($scope.tfValue == true) {
                $("#dateSort").removeClass("dateSortArrowDown");
                $("#dateSort").addClass("dateSortArrowUp");
                $scope.tfValue = false;
            } else {
                $scope.tfValue = true;
                $("#dateSort").removeClass("dateSortArrowUp");
                $("#dateSort").addClass("dateSortArrowDown");
            }
        };
        $scope.slideUpDown = function(id, type) {
            if (type == 'nextBilling') {
                if ($("#nextBilling_").css('display') == 'block') {
                    $("#nextBillingMain_").removeClass("rTableRowOpen");
                    $("#nextBilling_").slideUp('slow');
                } else {
                    $("#nextBillingMain_").addClass("rTableRowOpen");
                    $("#nextBilling_").slideDown('slow');
                }
            } else {
                if ($("#" + id).css('display') == 'block') {
                    $("#billingMain_" + id).removeClass("rTableRowOpen");
                    $("#" + id).slideUp('slow');
                } else {
                    $("#billingMain_" + id).addClass("rTableRowOpen");
                    $("#" + id).slideDown('slow');
                }
            }
        };
    }
]);