$(document).ready( function() {
  $(document).on('change', '.btn-file :file', function() {
    var input = $(this),
    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
  });

  $('.btn-file :file').on('fileselect', function(event, label) {
    var input = $(this).parents('.input-group').find(':text');
    log = label;

    if( input.length ) {
      input.val(log);
      var input = this;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var base = e.target.result;
          $('#img-upload').attr('src', base);
        }
        reader.readAsDataURL(input.files[0]);
      }
      document.getElementById('file-button-upload').removeAttribute('disabled');
    }

  });
  $('#file-button-upload').click(function(){
    console.log("upload is clicked");
  });

  // function readURL(input) {
  //   if (input.files && input.files[0]) {
  //     var reader = new FileReader();
  //
  //     reader.onload = function (e) {
  //       console.log(e.target);
  //       $('#img-upload').attr('src', e.target.result);
  //     }
  //
  //     reader.readAsDataURL(input.files[0]);
  //   }
  //   document.getElementById('file-button-upload').removeAttribute('disabled');
  // }
  //
  // $("#imgInp").change(function(){
  //   readURL(this);
  // });
});
