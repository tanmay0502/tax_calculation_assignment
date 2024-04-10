$(document).ready(function() {

    function validateInput(input) {
        return input.trim() !== '';
    }

    function showError(inputField, errorMessage) {
        inputField.siblings('.invalid-feedback').text(errorMessage).css('display', 'block');
        inputField.parent().find('.error-icon').css('display', 'block').attr('title', errorMessage);
    }

    function hideError(inputField) {
        inputField.siblings('.invalid-feedback').css('display', 'none');
        inputField.parent().find('.error-icon').css('display', 'none');
    }

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function calculateTax(grossIncome, extraIncome, deductions, age) {
        if (!validateInput(grossIncome) || !validateInput(extraIncome) || !validateInput(deductions) || age === '') {
            alert('Please fill in all fields with valid values.');
            return;
        }
    
        grossIncome = parseFloat(grossIncome) * 100000;
        extraIncome = parseFloat(extraIncome) * 100000;
        deductions = parseFloat(deductions) * 100000;
    
        var totalIncome = grossIncome + extraIncome - deductions;
        var tax = 0;
    
        if (totalIncome > 800000) {
            if (age === '<40') {
                tax = 0.3 * (totalIncome - 800000);
            } else if (age === '40-60') {
                tax = 0.4 * (totalIncome - 800000);
            } else if (age === '>=60') {
                tax = 0.1 * (totalIncome - 800000);
            }
        }
    
        $('#result').html('Your calculated tax is: ' + (tax / 100000).toFixed(2) + ' Lakhs' + '<br>' + 'Your overall income is: ' + (totalIncome / 100000).toFixed(2) + ' Lakhs');
        $('#resultModal').show();
    }
    

    $('#grossIncome, #extraIncome, #deductions').on('input', function() {
        var inputField = $(this);
        var value = inputField.val();

        if (!validateInput(value)) {
            showError(inputField, 'Please enter a valid income.');
        } else if (!isNumeric(value)) {
            showError(inputField, 'Please enter a numeric value.');
        } else {
            hideError(inputField);
        }
    });

    $('#age').on('change', function() {
        var ageField = $(this);
        var age = ageField.val();

        if (age === '') {
            showError(ageField, 'This field is mandatory.');
        } else {
            hideError(ageField);
        }
    });

    $('.error-icon').on('click', function() {
        var errorMessage = $(this).data('error');
        $('#result').text(errorMessage);
        $('#resultModal').show();
    });

    $('#taxForm').submit(function(event) {
        event.preventDefault();
        
        var grossIncome = $('#grossIncome').val();
        var extraIncome = $('#extraIncome').val();
        var deductions = $('#deductions').val();
        var age = $('#age').val();

        calculateTax(grossIncome, extraIncome, deductions, age);
    });

    $('#closeModal').click(function() {
        $('#resultModal').hide();
    });
});
