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
  console.log($('<a/>').attr('href', s3Url).text('File uploaded at '+s3Url).appendTo($('body')));
}
