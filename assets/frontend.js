$(function(){

  /*adapted from http://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php */
  currentRow = 1;
  files = [];
  currentFiles = [];
  currentFolders = [];
  folders = [];
  fileTypes = [];
  var filemanager = $('.filemanager'),
  breadcrumbs = $('.breadcrumbs'),
  fileList = filemanager.find('.data');


   $('.searchicon').click(function(){
        $('input').show().focus();
    });

      // Listening for keyboard input on the search field.
      // We are using the "input" event which detects cut and paste
      // in addition to keyboard input.

    $('.site').find('input').on('input', function(e){

      folders = [];
      files = [];

      var value = this.value.trim();

      if(value.length) {

        filemanager.addClass('searching');

        // Update the hash on every key stroke
        window.location.hash = 'search=' + value.trim();

      }

      else {

        filemanager.removeClass('searching');
        //window.location.hash = encodeURIComponent(currentPath);

      }

    }).on('keyup', function(e){

      // Clicking 'ESC' button triggers focusout and cancels the search

      var search = $(this);

      if(e.keyCode == 27) {

        search.trigger('focusout');

      }

    }).focusout(function(e){

      // Cancel the search

      var search = $(this);

      if(!search.val().trim().length) {

        //window.location.hash = encodeURIComponent(currentPath);
        search.hide();
        search.parent().find('span').show();

      }

  });

  /* getting data retrieved by node */

  $.getJSON('assets/data.json', function (data) {

  	var response = [data],
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
    
    /*files and folders track the INDEX of the data item. use data[a].Property to get the item */
    files = [];
    currentFiles = [];
    currentFolders = [];
    folders = [];
    fileTypes = [];
    folderCounts = new Array(); /* todo make hash map and map the name of the bucket to the number items innit  */
    a = 0;

    while(a<data.length){
      var item = data[a];
      str = item.Key;

      //check if the item is the bucket we're displaying
      if(str == displaybucket) { 
        //add breadcrumb2 or 3
        $('.breadcrumbs'+level+" span").text(str);
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
          console.log(file_path);
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

    console.log(data.length);

    updateView(data, "/", 1);

    //initial bucket name
    $(".breadcrumbs1").append("<span>pw106</span>");
  }

 /* Recursively search through the file tree */
 function searchData(data, searchTerms) {}

 /* Generates breadcrumbs */
 function generateBreadcrumbs(nextDir){}

 /* Navigates to the given hash (path) */
 function goto(hash) {}

 function updateHTML(currentFiles, currentFolders, files, folders, data, column){ //data always is just all da data, column is the column to refresh
  //folders
  currentFolders.forEach(function(item){
    str = parseFileName(data[item].Key);
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
    $(".column"+column+" .data").append("<a id='"+item+"'><li class='folders'><span class='icon folder full'></span><span class='name'>"+str+"</span>"+"<span class='details'>"+children+" items</span></li></a>");
  
    //folderclick
    $("#"+item).click(function(){
      //get current column (X) by looking at last char of the li's parent parent, the <A id="columnX">
      currentRow = $(this).parent().parent().attr('id').charAt(6);
      x = currentRow;
      while(x<6){
        x++;
       $("#column"+x+" .data").empty();
       $("#column"+x+" .nothingfound").hide();
       $("#column"+x+" .breadcrumbs span").text("");
      }

      $("#column"+(currentRow)+" .data li").removeClass("selected");
      $("#"+this.id).children(":first").addClass("selected");
      updateView(data, data[this.id].Key, (++currentRow));
      hashdest = "column"+(currentRow);
      console.log(hashdest);
      window.location.hash = hashdest;
    });
  });

  //files
  currentFiles.forEach(function(item){
    str = parseFileName(data[item].Key);
    bytes = bytesToSize(data[item].Size);
    $(".column"+column+" .data").append("<a id='"+item+"'><li class='files'><span class='icon file f-html'>"+fileTypes[item]+"</span><span class='name'>"+str+"</span><span class='details'>"+bytes+" KB</span></li></a>");
  

    //fileclick
    $("#"+item).click(function(){
      currentRow = $(this).parent().parent().attr('id').charAt(6);
      x = currentRow;
      while(x<6){
        x++;
       $("#column"+x+" .data").empty();
       $("#column"+x+" .nothingfound").hide();
       $("#column"+x+" .breadcrumbs span").text("");
      }
      $('#column'+(currentRow)+' .data li').removeClass("selected");
      $('.files').removeClass("selected");
      $("#"+this.id).children(":first").toggleClass("selected");
      /* todo change to link to the file */

      hashdest = "top";
      window.location.hash = hashdest;
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