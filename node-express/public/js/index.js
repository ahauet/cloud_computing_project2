var acceptFileType = /.*/i;
var maxFileSize = 1000;
var credentialsUrl = '/s3_credentials';
var uploadUrl = '/upload';

window.initS3FileUpload = function($fileInput) {
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
  var reader = new FileReader();
  reader.onload = function (e) {
    var base = e.target.result;
    $('#imup').attr('src', base);


  };
  reader.readAsDataURL(data.files[0]);
  $("#S3URL").attr('href', "").text('');

  //S3 part
  var filename = data.files[0].name;
  var contentType = data.files[0].type;
  var params = [];
  $.ajax({
    url: credentialsUrl,
    type: 'GET',
    dataType : 'json',
    data: {
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
};

function onS3Done(e, data){
  var s3Url = $(data.jqXHR.responseXML).find('Location').text();
  var s3Key = $(data.jqXHR.responseXML).find('Key').text();
  //DO SOMETHING TO ADD INTO DB
  $("#S3URL").attr('href', s3Url).text('File uploaded at '+s3Url);
  $.ajax({
    url: '/ddb_add',
    type: 'GET',
    dataType : 'json',
    data: {
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
});
