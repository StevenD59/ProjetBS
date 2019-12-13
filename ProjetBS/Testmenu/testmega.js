//Survole cat. Homme
$(".survol1").on('mouseover', function () {
    $(".test12").show();
});
$(".survol1").on('mouseleave', function () {
    $(".test12").hide();
});

$(".survol2").on('mouseover', function () {
    $(".test13").show();
});

$(".survol2").on('mouseleave', function () {
    $(".test13").hide();
});

$(".survol3").on('mouseover', function () {
    $(".test14").show();
});

$(".survol3").on('mouseleave', function () {
    $(".test14").hide();
});


//Survole Cat. Femme
$(".survol4").on('mouseover', function () {
    $(".test15").show();
});
$(".survol4").on('mouseleave', function () {
    $(".test15").hide();
});

$(".survol5").on('mouseover', function () {
    $(".test16").show();
});

$(".survol5").on('mouseleave', function () {
    $(".test16").hide();
});

$(".survol6").on('mouseover', function () {
    $(".test17").show();
});

$(".survol6").on('mouseleave', function () {
    $(".test17").hide();
});


//Survole Cat. Garçon
$(".survol7").on('mouseover', function () {
    $(".test18").show();
});
$(".survol7").on('mouseleave', function () {
    $(".test18").hide();
});

$(".survol8").on('mouseover', function () {
    $(".test19").show();
});

$(".survol8").on('mouseleave', function () {
    $(".test19").hide();
});

$(".survol9").on('mouseover', function () {
    $(".test20").show();
});

$(".survol9").on('mouseleave', function () {
    $(".test20").hide();
});


//Survol Cat. Fille
$(".survol10").on('mouseover', function () {
    $(".test18").show();
});
$(".survol10").on('mouseleave', function () {
    $(".test18").hide();
});

$(".survol11").on('mouseover', function () {
    $(".test19").show();
});

$(".survol11").on('mouseleave', function () {
    $(".test19").hide();
});

$(".survol12").on('mouseover', function () {
    $(".test20").show();
});

$(".survol12").on('mouseleave', function () {
    $(".test20").hide();
});

//Accordion

$( function() {
    $( "#accordion" ).accordion();
  } );

//Date-Picker

$( function() {
    $( ".datepicker" ).datepicker({
        dateFormat: "dd/mm/yy",
        dayNames:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        dayNamesMin:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
        monthNames:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
        });
  } );


//Spinner Detail Panier

jQuery(document).ready(function(){
    // This button will increment the value
    $('.qtyplus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($(this).siblings('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $(this).siblings('input[name='+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
    // This button will decrement the value till 0
    $(".qtyminus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($(this).siblings('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $(this).siblings('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
});

//Popup

$( function() {
    var dialog, form,
 
      // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
      emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      name = $( "#name" ),
      email = $( "#email" ),
      password = $( "#password" ),
      allFields = $( [] ).add( name ).add( email ).add( password ),
      tips = $( ".validateTips" );
 
    function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
 
    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }
 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }
 
    function validAddress(e) {
      var valid = true;
      allFields.removeClass( "ui-state-error" );
 
      valid = valid && checkLength( name, "username", 3, 16 );
      valid = valid && checkLength( email, "email", 6, 80 );
      valid = valid && checkLength( password, "password", 5, 16 );
 
      valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
      valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
      valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
 
      if ( valid ) {
        $( "#users tbody" ).append( "<tr>" +
          "<td>" + name.val() + "</td>" +
          "<td>" + email.val() + "</td>" +
          "<td>" + password.val() + "</td>" +
        "</tr>" );
        dialog.dialog( "close" );
      }
      return valid;
    }
 
    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Mettre à jour": validAddress,
        Fermer: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
      }
    });
 
    form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      validAddress();
    });
 
    $( ".modify-address" ).button().on( "click", function() {
      dialog.dialog( "open" );
      $(".ui-dialog-titlebar-close").hide()
    });
  } );

  //Autocomplite


  $( function() {
    let availableTags = [
      "Pull",
      "Pantalon",
      "Robe",
      "T-shirt",
      "Polo"
    ];
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  } );


  //Index

  $( function() {
    $( "#tabs" ).tabs();
  } );


//   $(".Survole1").on('click', function () {
//     $("#tabs-1").show();
//     $("#tabs-2, #")
// });
// $(".survol1").on('mouseleave', function () {
//     $(".test12").hide();
// });