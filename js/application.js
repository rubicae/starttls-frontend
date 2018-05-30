$(function() {
  $('.js-no').hide();
  $('.js-yes').show();

  // accordion
  $(".accordion-title").click(function(){
    this.classList.toggle("active");
    var panel = $(this).next();
    if (panel.css("display") === "block") {
      panel.css("display", "none");
    } else {
      panel.css("display", "block");
    }
  });

  // open accordion panel when anchor link clicked elsewhere
  $(".accordion-content p a").click(function(){
    linkhref = $(this).attr("href");
    console.log(linkhref);
    $(linkhref).parent().next().css("display","block");
  });


  // add another domain name to the add domain page
  $(".add-another").click(function(){
    $(".add-domains").prepend('<input type="text" value="mx.domain.org"></input>');
  });

  // share link social media icon in footer
  $(".copy-url").click(function(){
    urlCopied.innerHTML = window.location.href;
  });

  //select menu for Do you manage this email server
  /*
  Reference: http://jsfiddle.net/BB3JK/47/
  */

  // Iterate over each select element
  $('#manage').each(function () {

    // Cache the number of options
    var $this = $(this),
    numberOfOptions = $(this).children('option').length;

    // Hides the select element
    $this.addClass('s-hidden');

    // Wrap the select element in a div
    $this.wrap('<div class="select"></div>');

    // Insert a styled div to sit over the top of the hidden select element
    $this.after('<div class="styledSelect"></div>');

    // Cache the styled div
    var $styledSelect = $this.next('div.styledSelect');

    // Show the first select option in the styled div
    $styledSelect.text($this.children('option').eq(0).text());

    // Insert an unordered list after the styled div and also cache the list
    var $list = $('<ul />', {
      'class': 'options'
    }).insertAfter($styledSelect);

    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    // Cache the list items
    var $listItems = $list.children('li');

    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    $styledSelect.click(function (e) {
      e.stopPropagation();
      $('div.styledSelect.active').each(function () {
        $(this).removeClass('active').next('ul.options').hide();
      });
      $(this).toggleClass('active').next('ul.options').toggle();
    });

    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();
      /* alert($this.val()); Uncomment this for demonstration! */
    });

    // Hides the unordered list when clicking outside of it
    $(document).click(function () {
      $styledSelect.removeClass('active');
      $list.hide();
    });

  });
});
