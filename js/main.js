$(document).ready(function () {

    // Global variables for item form
    var $items = $('#items');
    var $itemForm = $('.itemForm');

    // AJAX to access API, and loop out the menu with item forms
    $.ajax({
        type: 'GET',
       // url: 'js/data.json',
       url: 'https://rawgit.com/Magwit/pizzadata/master/data.json',
        success: function (data) {

            // Randomize Boss' surprise
            var foodArray = ['artichoke', 'portobello', 'härkis', 'pulled pork', 'vendace', 'mozzarella', 'red pepper', 'goat cheese', 'smoked aubergine', 'meatballs', 'red onion', 'fresh basil', 'mozzarella bufala', 'salami'];

            function Shuffle(o) {
                for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }

            Shuffle(foodArray);

            var chosenArray = foodArray.slice(0, 3);

            data[4].ingredients[0] = chosenArray[0];
            data[4].ingredients[1] = chosenArray[1];
            data[4].ingredients[2] = chosenArray[2];

            $.each(data, function (i, datum) {

                // Local variables for item form and its child elements
                var $itemForm = $('<form>').attr({
                    class: 'itemForm',
                    id: datum.id,
                    method: 'post',
                    action: ""
                });

                var $itemName = $('<input>').attr({
                    type: 'text',
                    value: datum.name
                });

                var $itemPrize = $('<input>').attr({
                    type: 'text',
                    value: datum.prize.toFixed(2)
                });

                var $itemIngredients = $('<p>').text(datum.ingredients).attr({
                    class: 'itemIngredients'
                });

                var $itemButton = $('<button>').attr({
                    type: 'submit',
                    class: 'btn btn-sm'
                });

                $($itemButton).html('Add to order');

                // Creating the item form 

                $itemForm.append($itemName).append($itemPrize).append($itemIngredients).append($itemButton);
                $items.append($itemForm);
            });
        }
    });

    // Live search 

    $('#pizza-search').keyup(function () {
        if ($(this).val()) {
            var search = $(this).val().toLowerCase();
            $('.itemForm').hide();
            $(".itemIngredients:contains('" + search + "')").parent().show();

        } else {
            $('.itemForm').show();
        }
    });

    // Gobal variables for the order form

    var $orderForm = $('.order-form');
    var $orderHeader = $('.order-header');
    var $orderItems = $('.order-items');
    var $orderFooter = $('.order-footer');
    var $submitOrder = $('.submit-order');
    var $total = $('.total');
    var firstTime = true;

    // Form submit with event delegation div > form

    $items.on('submit', 'form', function (e) {
        e.preventDefault();
        var $prize = this[1].value;

        if (!$(this).hasClass('clicked')) {

            // create order item (input elements for order form) and add class 'clicked' to the itemForm.

            var $name = this[0].value;

            var $id = this.id;

            var $inputDiv = $('<div>').attr({
                id: $id + '-order'
            });

            var $inputQty = $('<input/>').attr({
                type: 'number',
                name: 'qty',
                value: 1
            });

            var $inputName = $('<input/>').attr({
                type: 'text',
                name: 'name',
                value: $name

            });
            var $inputSubtotal = $('<input/>').attr({
                type: 'number',
                name: 'subtotal',
                class: 'sub-total',
                step: 'any',
                value: $prize
            });

            var $deleteBtn = $('<span>').attr({
                class: 'delete'
            });
            $($deleteBtn).html('delete');

            // Append created elemnts to input div, next append inputdiv to order-items 

            $inputDiv.append($inputQty).append($inputName).append($inputSubtotal).append($deleteBtn).append('<br />');
            $orderItems.append($inputDiv);

            // Unhide order total and order submit button first time a menu item is clicked

            if (firstTime === true) {
                $total.attr({
                    type: 'number',
                    step: 'any',
                });

                $submitOrder.attr({
                    type: 'submit'
                });

            }
            // add class 'clicked' to the itemForm

            $(this).addClass('clicked');

            firstTime = false;

        } else {
            // calculate subtotal when more than one of the same pizza is ordered

            var $orderId = this.id + '-order';

            var $targetDiv = $("#" + $orderId);

            var $targetInput = $($targetDiv).children('input')[0];

            var oldValue = $($targetInput).val();

            var newValue = parseFloat(oldValue) + 1;

            $($targetInput).val(newValue);

            var $subtotalInput = $($targetDiv).children('input')[2];

            var newSubtotal = parseFloat(newValue * $prize).toFixed(2);

            $($subtotalInput).val(newSubtotal);

        }

        calculateTotal();

    });
    // Loop through subtotals to calculate total 

    function calculateTotal() {
        var totalAmount = 0;
        $('.sub-total').each(function (index) {
            totalAmount += parseFloat($(this).val());
        });
        $($total).val(totalAmount.toFixed(2));

        parseFloat($total.val());
    }
    // function for deleting order items  
    
    $orderItems.on('click', 'span', function (e) {
        $(this).parent().remove();
        calculateTotal();

    });

});