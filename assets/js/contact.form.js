(function ($) {
    'use strict';
    // Get the form.
    var form = $('#contact-form');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        e.preventDefault(); // Stop the default form submission

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function (response) {
            // Update message styling
            $(formMessages).removeClass('text-warning fw-bolder mt-2')
                           .addClass('text-dark fw-bold mt-3 border py-2 px-3')
                           .text(response);
            
            // Clear the form fields, excluding subject if not present
            $('#name, #email, #message').val('');
            $('#subject').length && $('#subject').val('');
        })
        .fail(function (data) {
            // Update message styling
            $(formMessages).addClass('text-warning fw-bolder mt-2')
                           .removeClass('text-dark fw-bold mt-3 border py-2 px-3')
                           .text(data.responseText || 'Oops! An error occurred and your message could not be sent.');
        });
    });
})(jQuery);
