$(document).ready(function() {

    var historyData = [];

    function validateInput(input) {
        return input.trim() !== '';
    }

    function showError(inputField, errorMessage) {
        inputField.siblings('.invalid-feedback').text(errorMessage).css('display', 'block');
        inputField.parent().find('.error-icon').css('display', 'flex');
    }

    function hideError(inputField) {
        inputField.siblings('.invalid-feedback').css('display', 'none');
        inputField.parent().find('.error-icon').css('display', 'none');
    }

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function calculateTax(grossIncome, extraIncome, deductions, age) {
        if (!validateInput(grossIncome)) {
            showError($('#grossIncome'), 'Please enter a valid income.');
            return;
        }
        if (!validateInput(extraIncome)) {
            showError($('#extraIncome'), 'Please enter a valid income.');
            return;
        }
        if (!validateInput(deductions)) {
            showError($('#deductions'), 'Please enter a valid amount.');
            return;
        }
        if (age === '') {
            showError($('#age'), 'This field is mandatory.');
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

        var incomeAfterTax = (totalIncome - tax).toLocaleString('en-IN');
        var taxAmount = tax.toLocaleString('en-IN');
    
        historyData.unshift({
            grossIncome: grossIncome.toLocaleString('en-IN'),
            extraIncome: extraIncome.toLocaleString('en-IN'),
            deductions: deductions.toLocaleString('en-IN'),
            age: age,
            resultTax: taxAmount,
            totalIncomeAfterTax: incomeAfterTax
        });
    
        if (historyData.length > 3) {
            historyData.pop();
        }
    
        $('#result').html('Your overall income is: <span style="color: green">₹' + incomeAfterTax + '</span><br>' + 'After reducing the tax of: <span style="color: red">₹' + taxAmount + '</span>');
        showModal();
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

    $('.question-mark').hover(function() {
        var tooltipText = $(this).next('.tooltip').text();
        var iconPosition = $(this).position();
        var tooltipWidth = $(this).next('.tooltip').width();

        var tooltipLeft = iconPosition.left;
        var tooltipTop = iconPosition.top - 30;

        $(this).next('.tooltip').css({ top: tooltipTop, left: tooltipLeft }).fadeIn();
    }, function() {
        $(this).next('.tooltip').fadeOut();
    });

    $('.error-icon').hover(function() {
        var tooltipText = $(this).data('error');
        var iconPosition = $(this).position();

        var tooltipLeft = iconPosition.left;
        var tooltipTop = iconPosition.top - 80;

        $(this).after('<div class="tooltip">' + tooltipText + '</div>');
        $('.tooltip').css({ top: tooltipTop, left: tooltipLeft });

    }, function() {
        $('.tooltip').remove();
    });

    $('#taxForm').submit(function(event) {
        event.preventDefault();

        var grossIncome = $('#grossIncome').val();
        var extraIncome = $('#extraIncome').val();
        var deductions = $('#deductions').val();
        var age = $('#age').val();

        calculateTax(grossIncome, extraIncome, deductions, age);
    });

    function showModal() {
        $('#resultModal').show();
        $('#resultModal').addClass('fade-in');
        $('body').append('<div id="overlay"></div>');
    }

    function hideModal() {
        $('#resultModal').hide();
        $('#overlay').remove();
    }

    $('#closeModal').click(function() {
        hideModal();
    });

    function showCalculationDetails() {
        var calculationDetails = `
            <p>
                The tax calculation works based on this formula:<br>
                - Overall income (after deductions) under 8 (≤) Lakhs is not taxed.<br>
                - Income over 8 (>) Lakhs, the amount over 8 Lakhs is taxed at:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- 30% for people with age < 40<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- 40% for people with age ≥ 40 but < 60<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- 10% for people with age ≥ 60<br>
                <br>
                Example:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;- Age = 34, Income = 40 Lakhs, no deductions, tax = .3 * (40 - 8) = .3 * 32 = 9.6 Lakhs
            </p>
        `;
        $('#result').html(calculationDetails);
        showModal();
    }

    $('.calculation-link').click(function() {
        showCalculationDetails();
    });

    function showHistory() {
        var historyHTML = '';
        if (historyData.length === 0) {
            historyHTML += '<p>No history available.</p>';
        } else {
            historyHTML += '<ul class="history-list">';
            historyData.forEach(function(entry) {
                historyHTML += '<li class="history-item">';
                historyHTML += '<div class="history-details">';
                historyHTML += '<div><strong>Gross Income:</strong> ₹' + entry.grossIncome + '</div>';
                historyHTML += '<div><strong>Extra Income:</strong> ₹' + entry.extraIncome + '</div>';
                historyHTML += '<div><strong>Deductions:</strong> ₹' + entry.deductions + '</div>';
                historyHTML += '<div><strong>Age Group:</strong> ' + entry.age + '</div>';
                historyHTML += '<div><strong>Result Tax:</strong> ₹' + entry.resultTax + '</div>';
                historyHTML += '<div><strong>Total Income after Tax Deduction:</strong> ₹' + entry.totalIncomeAfterTax + '</div>';
                historyHTML += '</div>';
                historyHTML += '</li>';
            });
            historyHTML += '</ul>';
        }
        $('#result').html(historyHTML);
        $('.result-head').html("Tax Calculation History");
        showModal();
    }

    $('.history').click(function() {
        showHistory();
    });

});

