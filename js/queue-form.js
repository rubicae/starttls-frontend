/*
 * Form interactions for POST to /api/queue
 */
$(function() {
  var $form = $("#queue");
  init_form();

  $form.submit(function(e) {
    $form.find(".errors").hide();
    e.preventDefault();

    var domain = $form.find('input[name="domain"]').val(),
        url = $form.attr('action');

    $.ajax({
      type: 'POST',
      url: url,
      data: $form.serializeArray()
    }).done(function(data) {
      window.location = "/domain-submitted";
    }).fail(function(e, message) {
      if (e.responseJSON.message) {
        var message = e.responseJSON.message;
      } else if (e.status == 429) {
        // The backend rate limiter doesn't let us a set a message, so we set
        // one here instead.
        var message = 'Rate limit exceeded. Please try again later.';
      } else {
        Raven.captureMessage('Received ' + e.status + ' with no error message')
        var message = 'Something went wrong on our end. ' +
          'We\'ve reported the error and will look into it.';
      }
      $form.find('#queue-errors')
        .text(message)
        .show();
    });
  });
});

function extractSearchParam(key) {
  var url = window.location.href;
  var qs = "";
  var afterKey = "";

  if (url.indexOf("?") < 0) {
    return "";
  }

  qs = url.substring(url.indexOf("?") + 1);
  if (qs.indexOf("#") >= 0) {
    qs = qs.substring(0, qs.indexOf("#"));
  }

  if (qs.substring(0, key.length + 1) === (key + "=")) {
    afterKey = qs.substring(key.length + 1);
  } else if (qs.indexOf("&" + key + "=") >= 0) {
    afterKey = qs.substring(qs.indexOf("&" + key + "=") + key.length + 2);
  } else {
    return "";
  }

  if (afterKey.indexOf("&") >= 0) {
    return afterKey.substring(0, afterKey.indexOf("&"));
  }
  return afterKey;
}

function init_form() {
  var domain = extractSearchParam('domain');
  if (domain) {
    $('#domain-input').val(domain);
    $('.your-domain').text(domain);
  }

  init_toggle_mta_sts();
  init_add_another_mx();
  var mta_sts = extractSearchParam('mta_sts');
  if (mta_sts == 'true') {
    $('#mta-sts-input').prop('checked', true);
    $('#mx-hostnames').hide();
  }
}

function init_toggle_mta_sts() {
  $mta_sts = $('#mta-sts-input');
  $mta_sts.change(function() {
    if ($mta_sts.prop('checked'))
      $('#mx-hostnames').slideUp()
        .find('input').attr('disabled', true);
    else
      $('#mx-hostnames').slideDown()
        .find('input').attr('disabled', false);
  });
}

function init_add_another_mx() {
  var $add_another = $('#queue .add-another'),
    $mxs = $('#queue .mx-domain');

  // Hide all but the first mx-domain field
  $mxs.slice(1).hide();

  $add_another.click(function() {
    var $hidden_fields = $mxs.filter(':hidden');
    $hidden_fields.first().show();
    if ($hidden_fields.length <= 1)
      // Showed the last field, no more to show
      $add_another.attr('disabled', true);
  });
}
