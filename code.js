

// global variable that defines the how the food will be retrieved
var transport = "pickup";

const MASS_TAX = 0.0625;


/*        function ready
 *        purpose: update order page automatically as the user selects 
 *                 its positions
 *      parameter: none
 *         return: nothing
 *           note: use of ready() method to make the function available 
 *                 after loading the page
*/
$(document).ready(function() {
 
  initialization(); // set initial elements of the form
  transportation(); // evaluate if the city and street will be included

  cost_update(); // update the table with the proper calculations
  
});


/*        function transportation
 *        purpose: evaluate which method of deliverying the food
 *                 will be applied
 *      parameter: none
 *         return: nothing
 *           note: - use of trigger "click" to activate the function 
 *                 - global variable transport is updated according to 
 *                 the specified method
*/
function transportation() {

// evaluate if the radio button is set for pickup or delivery
$('input:radio[value="pickup"]').click(function() {
 $('.address').css("display","none");
 transport = "pickup";
});

$('input:radio[value="delivery"]').click(function() 
{
 $('.address').css("display","block");
 transport = "delivery";

});
}

/*        function initialization
 *        purpose: initalize the windows eith default empty data
 *      parameter: none
 *         return: nothing
 *           note: simple function -> it could be better developed 
*/

function initialization()
{
 // default: address options is not displayed
 $('.address').css("display","none");
 transport = "pickup";

}


/*        function cost_update
 *        purpose: update total values and subtotal, tax, and total 
 *                 as the client select the number of products to order
 *      parameter: none
 *         return: nothing
 *           note: - numbers are rounded to 2 decimal cases with toFixed
 *                 - 0.0625 is the value for tax -> CONSTANT ELEM = MASS_TAX
*/
function cost_update() {
 $("select").on("input", function() { // occurr whenever a change is noticed
  var subtotal = 0;
  $("select option:selected").each(function(idx) {

   // walk through the products updating them accordingly
   var qty = $(this).val();
   var cost_per_product = qty * menuItems[idx].cost;
   $("input[name='cost']:eq(" + idx + ")").attr("value", (cost_per_product).toFixed(2));
   subtotal = subtotal + cost_per_product; // subtotal is updated every time a change happens
  });

  taxes = subtotal * MASS_TAX; // obtain state tax calculation

  // summarized calculations are also updated  
  $("input[name='subtotal']").attr("value", (subtotal).toFixed(2));
  $("input[name='tax']").attr("value", (taxes).toFixed(2));
  $("input[name='total']").attr("value", (subtotal + taxes).toFixed(2));

 });
}

/*        function confirm_order
 *        purpose: submit all the input values generating a ticket receipt
 *      parameter: none
 *         return: nothing
 *           note: - delegate validation of the web page with the 
 *                 function validation
 *                 - delegate time calculation for print_time() function 
 *                 and for the usage of the Date class 
 *                 - helper function print_item(source) retrieve the whole
 *                 row from the HTML and generate a line informing 
 *                 the quantity of products and the related prices
 *                 - event function that is called every time the button 
 *                 submit is pressed on the html text
 *                 - print HTML text into a new window by using window.open
*/
function confirm_order() {
 // check for all the requirements of the submission first
 // it warns the client wether something went wrong
 var boolean_valid = validation();

 // only proceed for the receipt generation if the validation is succesful
 if (boolean_valid) {
  
  // pop up message confirming the success of the transaction
  alert("Thank you for buying with us");

  // initalize a window object
  var summary = window.open();

  // create a string array to generate all the lines for the new window html page
  lines = "<head>";
  lines += "<link rel='stylesheet' href='rules.css'></link>" // insert the general CSS rules to the file
  lines += "</head>";
  lines += "<body style='background-color:#f4a460'>"; // updated according to the general CSS rules
  lines += "<h1>Thank You!</h1><br />";

  lines += "<div class='receipt'>";

  lines += "<p>Here is your receipt:</p>";

  lines += print_item($("table").find("tr:eq(1)"));
  lines += print_item($("table").find("tr:eq(2)"));
  lines += print_item($("table").find("tr:eq(3)"));
  lines += print_item($("table").find("tr:eq(4)"));
  lines += print_item($("table").find("tr:eq(5)"));

  lines += "<br><br>";
  

  lines += "<strong>Subtotal:</strong> $" + $('input:text[name="subtotal"]').val() + "<br>";
  lines += "<strong>Tax:</strong> $" + $('input:text[name="tax"]').val() + "<br>";
  lines += "<strong>Total:</strong> $" + $('input:text[name="total"]').val() + "<br>";

  lines += "<br><br>" + print_time() + "<br>";

  lines += "</div>";

  lines += "</body>";

  // print whole file with new lines
  summary.document.writeln(lines);
 }

}

/*        function print_item
 *        purpose: get location of a whole row from the table and convert 
 *                 its data into a string
 *      parameter: line row from table of products
 *         return: string informing the type of product, quantity and 
 *                 total price
 *           note: - helper function for confirm_order() event function
*/
function print_item(line) {
  
 qty = line.find("td:eq(0)>select").val();
 if (qty == "0" || qty == "0.00") { // the string is only formed if products > 0
  return "";

 } else {

  var total_cost = line.find("td:eq(3)>input").val();
  var detail = line.find("td:eq(1)").text();
  return (detail + ": " + qty + " by the price of " + total_cost + "<br>");

 }
}

/*        function print_time
 *        purpose: define how much time will take according to the delivery 
                   method previously defined 
 *      parameter: nothing
 *         return: string informing the time in hours and minutes
 *           note: - usage of Date class to figure out current time
 *                 - usage of global variable to identify the defined method
*/
function print_time() {
 
 var line;
 // if statements perform the same task
 // only difference is that for delivery it takes the double of time
 if (transport == "pickup") {
   var mydate = new Date();	
   line = new Date(mydate.getTime() + 20*60000);
   h = (line.getHours()<10?'0':'') + line.getHours(),
   m = (line.getMinutes()<10?'0':'') + line.getMinutes();
   line = "Pickup time: " + h + ':' + m;
 } else {
  var mydate = new Date();	
   line = new Date(mydate.getTime() + 40*60000);
   h = (line.getHours()<10?'0':'') + line.getHours(),
   m = (line.getMinutes()<10?'0':'') + line.getMinutes();
   line = "Pickup time: " + h + ':' + m;
 }
 return line;

}

/*        function validation
 *        purpose: confirm if last name, phone, street and city are 
                   properly included in the submission
 *      parameter: nothing
 *         return: boolean value that indicates success or 
 *                 failure of validation
 *           note: - it defines if the printing of the new window 
 *                 will be performed or if the client needs to adjust errors
 *                 - use of helper functions to check for specific validations 
*/
function validation() {
 var validated = true;

 // check if the last name is not empty
 validated = valid_helper($('input:text[name="lname"]'));
 if (!validated) {
  return validated;
 }

 // check phone validity -> extract only the numbers of the string
 // and affer if they match to the expected lengths
 var phone = $('input[name="phone"]').val();
 var phone_address = $('input[name="phone"]');

 // delete all non-numbers of the phone input
 var digits = String(phone.replace(/[^0-9]/g, ""));

 // if the remaining matches with the expected lenght, the phone number is correct
 if (digits.length != 7 && digits.length != 10) {
  alert("Must enter a valid phone number");
  phone_address.focus();
  phone_address.select();
  validated = false;
 }

 // assert if previous lines of codes found an invalid elemenet
 if (!validated) {
  return validated;
 }

 // check if street and city inputs are filled, in case the client wants delivery mehtod
 if (transport == "delivery") {
  validated = valid_helper($('input:text[name="street"]'));
  validated = valid_helper($('input:text[name="city"]'));
 }

 // assert if previous lines of code find an invalid element
 if (!validated) {
  return validated;
 }

 // check if at least one product has been chosen
 validated = valid_products_helper();

 // return true if has passed the assertions 
 return validated;
}

/*        function valid_helper
 *        purpose: check if input box is empty 
 *      parameter: input txt
 *         return: boolean value whether the text is empty or not
 *           note: - in case of empty boxes, an alert will instruct the client
*/
function valid_helper(source) {
 // check if the last name is not empty
 var name = source;
 if(name.val() == "") {
  alert("Must enter a value for the text-box");
  name.focus();
  name.select();
  return false;
 } else {
   return true;
 }
}

/*        function valid_products_helper
 *        purpose: check if at least one product has been added to the cart
 *      parameter: nothing
 *         return: boolean value whether the cart is empty or not
 *           note: - in case of empty cart, an alert will instruct the client
*/
function valid_products_helper() {
 var marker = false;
 $("select option:selected").each(function() {
  if ($(this).val() != 0)
    marker = true;    // in case one of the values is not empty
 });

 if (!marker) {
  alert("Must choose at least one product");
  $(this).focus();
 }
 return marker;

}
