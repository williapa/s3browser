
    $(function() {
	  var filemanager = $('.explorer'),
      breadcrumbs = $('.bucketparents'),
      fileList = filemanager.find('.data');
      /* function to strip weird shit */
      function fxstip(str){
        var newstr = "";
        str.forEach(function(ch,index){
          newstr[index] = 
        })
      }
      $("#button").click(function(){
      	/*call to our node server that gets that data baby */
      	  $.getJSON('assets/data.json', function (data) {
      	  	if(data){
      	   	  $(".emptybucket").hide();
      	   	  	console.log(data);

      	   	  	data.forEach(function(x){
                  str = fxstrip(x);
      	   	  		var item = "<li>"+x.Key+"</li>";
      	   	  		$(".data").append(item);
      	   	  	});
      	   	 }
      	   	 else{
      	   	 console.log("no data");
      	   	 }
  	    });
      }); 
    });