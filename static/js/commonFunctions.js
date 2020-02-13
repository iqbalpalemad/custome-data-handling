function sendAjax(url,data,callback){
	$.ajax({
	   headers: { "X-CSRFToken": token },
	   url: url,
	   data : data,
	   type : 'POST'
	})
	.done(function( data ) {
		 callback(data)
	})
	.fail(function() {
	    callback(data)
	});
}