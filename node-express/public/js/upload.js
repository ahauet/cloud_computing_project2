var acceptFileType = /.*/i;
var maxFileSize = 1000;
var credentialsUrl = '/s3_credentials';
var uploadUrl = '/upload';
var eventId;

window.initS3FileUpload = function($fileInput, id) {
  eventId=id;
  $fileInput.fileupload({
    paramName:'file',
    add: s3add,
    dataType: 'xml',
    done: onS3Done
  });
};

function s3add(e, data){
  //Beautiful render
  document.getElementById("inputText").value = data.files[0].name;
  var contentType = data.files[0].type;
  $("#S3URL").attr('href', "").text('');
  $("#S3message").text('');

    if (contentType == "image/png" || contentType == "image/jpeg"){
      var reader = new FileReader();
      reader.onload = function (e) {
        var base = e.target.result;
        $('#imup').attr('src', base);
      };
      reader.readAsDataURL(data.files[0]);

  } else{
    $('#imup').attr('src',"data:image/png;base64,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");
  }


  //S3 part
  var filename = data.files[0].name;
  if (contentType == "image/png" || contentType == "image/jpeg" || contentType == "application/zip") {
    var params = [];
    $("#S3message").text('Fichier en cours d\'upload');
    $.ajax({
      url: credentialsUrl,
      type: 'GET',
      dataType : 'json',
      data: {
        id: eventId,
        filename: filename,
        content_type: contentType
      },
      success:function(s3Data){
        data.url = s3Data.endpoint_url;
        data.formData = s3Data.params;
        data.submit();
      }
    });
    return params;
  }
  else {
    $("#S3message").text('Fichier non supporté. Uniquement png/zip/jpg');
    return []
  }

};

function onS3Done(e, data){
  var s3Url = $(data.jqXHR.responseXML).find('Location').text();
  var s3Key = $(data.jqXHR.responseXML).find('Key').text();
  //DO SOMETHING TO ADD INTO DB
  $("#S3message").text('');
  $("#S3URL").attr('href', s3Url).text('File uploaded at '+s3Url);
  $.ajax({
    url: '/ddb_add',
    type: 'GET',
    dataType : 'json',
    data: {
      id : eventId,
      filename: data.originalFiles[0].name,
      link: s3Url.replace(/\\/g, '/').replace(/.*\//, '')
    },
    success:function(data){//NOTHING TODO HERE ?
    }
  });
};

$(document).ready( function() {
  $(document).on('change', '.btn-file :file', function() {
    var input = $(this),
    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
  });

  $("#downloadZip").click(function () {
      alert("download requested");
  });
});
