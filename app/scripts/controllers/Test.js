 ////////////TEST CASE FOR POST REQUEST///////////////
 var accountToken = "Z1NSMnpUejJhV0s2YkNqR09Db29pWW1JSTRSU0dKYW1kN01SWjIwczlNb1hRU0tTS1JHY3pnOEhkdGRXYjBvL0NwSStpSXhtaXQxSVJJUEJXNGFGU3U0ZldxOWdmZEZ5RHVPL296eExXMVFiSkZkVXRKOEsyOWI4V2JQZHhsb0JBaEVmMFIzRVB0N3FKbVFWOWdFdXdRPT0=";
 var rawData = {
     "transaction": {
         "type": "subscribe",
         "user_id": "c1236f81c48d46258e52b258051b34bd",
         "payment_method_type": "CreditCard",
         "new_product_id": "HOTT_SVOD_BASIC",
         "old_product_id": "",
         "promo_code": "",
         "callback_urls": {
             "return_url": "http://127.0.0.1:9000/",
             "error_url": "http://127.0.0.1:9000/"
         }
     }
 };
 /*
   $http({
       method: 'POST',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'text/plain'
       },
       url: 'https://player-staging.ooyala.com/commerce/transactions/new?account_token='+accountToken,
       data: JSON.stringify(rawData),
       dataType: 'json'
   }).then(function(response) {
         console.log('success response');
       }, 
       function(response) { // optional
         console.log("transaction cannot be initialized--------");
       }
   );
 */
 ////////////TEST CASE FOR POST REQUEST///////////////