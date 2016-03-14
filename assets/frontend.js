$(function(){

  /*adapted from http://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php */
  currentColumn = 1;
  d = [{}];
  files = [];
  currentFiles = [];
  currentFolders = [];
  folders = [];
  fileTypes = [];
   var filemanager = $('.filemanager'),
  breadcrumbs = $('.breadcrumbs'),
  fileList = filemanager.find('.data');

  $('.nothingfound').click(function(){
    window.location.hash = "top";
  })
   $('.searchicon').click(function(){
        $('input').show().focus();
    });

      // Listening for keyboard input on the search field.
      // We are using the "input" event which detects cut and paste
      // in addition to keyboard input.

    $('.site').find('input').on('input', function(e){

      var value = this.value.trim();

      filemanager.addClass('searching');

      // Update the hash on every key stroke
      window.location.hash = 'search=' + value;
      hideTheseFiles = [];
      showTheseFiles = [];
      files.forEach(function(item){
        if(parseFileName(d[item].Key.toLowerCase()).indexOf(value.toLowerCase()) == -1){
          hideTheseFiles.push(item);
        }
        else{
          showTheseFiles.push(item);
        }
      });

      filemanager.removeClass('searching');
      filterCurrentFiles(hideTheseFiles, showTheseFiles);

    }).on('keyup', function(e){

      // Clicking 'ESC' button triggers focusout and cancels the search
      var search = $(this);

      if(e.keyCode == 27) {

        search.trigger('focusout');

      }

    }).focusout(function(e){

      // Cancel the search
      endSearch();
      var search = $(this);
      search.hide();


  });

  /* getting data retrieved by node */

  $.getJSON('assets/data.json', function (data) {

  	d = data;
    bucketName = data["bucketName"];
	  currentPath = '',
	  breadcrumbsUrls = [];

	  var folders = [],
	  files = [];

    /*render is merely the initial call. updateView() organizes the heavy lifting */
    render(data);
  });

  /* function list */

  /* Convert file sizes from bytes to human readable units */
  function bytesToSize(bytes){
    var kb = bytes/1024;
    return Math.ceil(kb);
  }

  /* Escapes special html characters in names */
  function escapeHTML(text){
    return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
  }

  function parseFileName(text){

    return text.replace(/\+/g," ");
  }

  /* Locates a file by path */
  function searchByPath(dir) {}

  function updateView(data,displaybucket,level){
    //todo, make a function and turn into animations
    if(level==1){
      $('#column1').show();
      $('#column2').show();
      $('#column3').show();
      $('#column4').hide();
      $('#column5').hide();
      $('#column6').hide();
    }
    else if(level==2){
      $('#column1').show();
      $('#column2').show();
      $('#column3').show();
      $('#column4').hide();
      $('#column5').hide();
      $('#column6').hide();
    }
    else if(level==3){
      $('#column1').show();
      $('#column2').show();
      $('#column3').show();
      $('#column4').hide();
      $('#column5').hide();
      $('#column6').hide();
    }
    else if(level==4){
      $('#column1').hide();
      $('#column2').show();
      $('#column3').show();
      $('#column4').show();
      $('#column5').hide();
      $('#column6').hide();
    }
    else if(level==5){
      $('#column1').hide();
      $('#column2').hide();
      $('#column3').show();
      $('#column4').show();
      $('#column5').show();
      $('#column6').hide();
    }
    else {
      $('#column1').hide();
      $('#column2').hide();
      $('#column3').hide();
      $('#column4').show();
      $('#column5').show();
      $('#column6').show();
    }
    /*files and folders track the INDEX of the data item. use data[a].Property to get the item */
    files = [];
    currentFiles = [];
    currentFolders = [];
    folders = [];
    fileTypes = [];
    folderCounts = new Array(); /* todo make hash map and map the name of the bucket to the number items innit  */
    a = 0;
    while(a<data.length && data[a].Key){
      var item = data[a];
      str = item.Key;

      //check if the item is the bucket we're displaying
      if(str == displaybucket) { 
        //add breadcrumb2 or 3
        $('.breadcrumbs'+level+" span").text(parseFileName(str));
      }
      //add case for index objects lvl 1
      else if(displaybucket == "/"){
        if(str.indexOf("/") == -1){
          files.push(a);
          fileTypes[a] = str.substring(str.lastIndexOf("."), str.length);
        }
        else {
          if("/" == str.charAt(str.length-1)){
            folders.push(a);
          }
          else {
            files.push(a);
          }

        }
      }
      //add case nested objects lvl 2 3
      else if(displaybucket != "/"){
        //folder
        if(str.lastIndexOf("/") > str.lastIndexOf(".")){
          folders.push(a);
        }
        else {
          files.push(a);
          fileTypes[a] = str.substring(str.lastIndexOf("."), str.length);
        }
      }
      //build currentFiles and currentFolders
      a++;
    }
    files.forEach(function(item){
        if(displaybucket == "/"){
          if(data[item].Key.indexOf("/") == -1){
            currentFiles.push(item);
          }
        }
        else {
          file_path = data[item].Key.substring(0, data[item].Key.lastIndexOf("/"))
          if(displaybucket == file_path+"/"){
            currentFiles.push(item);
          }
        }
      });
      folders.forEach(function(item){
        if(level == (data[item].Key.split("/").length - 1)){
          if(data[item].Key.indexOf(displaybucket) > -1){
            currentFolders.push(item);
          }
        }
      });
    updateHTML(currentFiles, currentFolders, files, folders, data, level);
  }

  /* Render the HTML for the file manager */
  function render(data){
    bucketName = data[data.length-1].bucketName
    //initial bucket name
    $(".breadcrumbs1").append("<span>s3.amazonaws.com/"+bucketName+"</span>");
    delete data[data.length-1].bucketName;
    updateView(data, "/", 1);
  }

 /* Recursively search through the file tree */
 function searchData(data, searchTerms) {}

 /* Generates breadcrumbs */
 function generateBreadcrumbs(nextDir){}

 function endSearch(){
  $("a").removeClass("searchHide");
 }

 /* Navigates to the given hash (path) */
 function filterCurrentFiles(newFolders, oldFolders){

    newFolders.forEach(function(item){
      $("#"+item).addClass("searchHide");
    });

    oldFolders.forEach(function(item){
      $("#"+item).removeClass("searchHide");
    });
 }

 function updateHTML(currentFiles, currentFolders, files, folders, data, column){ //data always is just all da data, column is the column to refresh
  //folders
  currentFolders.forEach(function(item){
    str = data[item].Key;
    children = 0;
    files.forEach(function(t){
      if(data[t].Key.indexOf(str) != -1) { 
        children+=1; 
      }
    });
    folders.forEach(function(t){
      if(data[t].Key.indexOf(str) != -1 && data[t].Key != str) {
        children+=1; 
      }
    });
    $(".column"+column+" .data").append("<a id='"+item+"'><li class='folders'><span class='icon folder full'></span><span class='name'>"+parseFileName(str)+"</span>"+"<span class='details'>"+children+" items</span></li></a>");
  
    //folderclick
    $("#"+item).click(function(){
      //get current column (X) by looking at last char of the li's parent parent, the <A id="columnX">
      currentColumn = $(this).parent().parent().attr('id').charAt(6);
      x = currentColumn;
      while(x<6){
        x++;
       $("#column"+x+" .data").empty();
       $("#column"+x+" .nothingfound").hide();
       $("#column"+x+" .breadcrumbs span").text("");
      }

      $("#column"+(currentColumn)+" .data li").removeClass("selected emptyfolder");

      childs = $("#"+this.id+" .details").text();
      if(childs[0] == "0") {
        $("#"+this.id).children(":first").addClass("emptyfolder");
      }
      else {
        $("#"+this.id).children(":first").addClass("selected");
      }
      updateView(data, data[this.id].Key, (++currentColumn));
      hashdest = "column"+currentColumn;
      window.location.hash = hashdest;
    });
  });

  //files
  currentFiles.forEach(function(item){
    str = parseFileName(data[item].Key);
    fileNames = str.split("/");
    bytes = bytesToSize(data[item].Size);
    $(".column"+column+" .data").append("<a id='"+item+"'><li class='files'><span class='icon file f-html'>"+fileTypes[item]+"</span><span class='name'>"+fileNames[fileNames.length-1]+"</span><span class='details'>"+bytes+" KB</span></li></a>");
  

    //fileclick
    $("#"+item).click(function(){
      currentColumn = $(this).parent().parent().attr('id').charAt(6);
      x = currentColumn;
      while(x<6){
        x++;
       $("#column"+x+" .data").empty();
       $("#column"+x+" .nothingfound").hide();
       $("#column"+x+" .breadcrumbs span").text("");
      }
      $('#column'+(currentColumn)+' .data li').removeClass("selected emptyfolder");
      $('.files').removeClass("selected");
      $("#"+this.id).children(":first").toggleClass("selected");
      /* todo change to link to the file */
      window.location.href = "https://s3.amazonaws.com/"+bucketName+"/"+data[this.id].Key;
    });
  });
  if(currentFiles.length == 0 && currentFolders.length == 0){
    $("#column"+column+" .nothingfound").show();
  }
  else{
    $("#column"+column+" .nothingfound").hide();
  }
 }
});