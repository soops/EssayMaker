var copyThot, openEssay, saveEssay, saveHtml, saveText;

window.onload = function() {
  var d, dateObj, day, month, monthNames, monthNo, year;
  window.zclip = new ZeroClipboard(document.getElementById("copy-thot"));
  window.sentiment = new Sentimood();
  window.droptions = {
    readAsDefault: "Text",
    dragClass: "drop",
    on: {
      load: function(e, file) {
        var essay;
        essay = JSON.parse(e.target.result);
        $("#name").val(essay.head.name);
        $("#title").val(essay.head.title);
        $("#date-text").text(essay.head.date);
        $("#th").val(essay.para.thesis);
        $("#co").val(essay.para.conclusion);
        $("#ts1").val(essay.bp1.ts);
        $("#ex1").val(essay.bp1.ex);
        $("#cs1").val(essay.bp1.cs);
        $("#ts2").val(essay.bp2.ts);
        $("#ex2").val(essay.bp2.ex);
        $("#cs2").val(essay.bp2.cs);
        $("#ts3").val(essay.bp3.ts);
        $("#ex3").val(essay.bp3.ex);
        $("#cs3").val(essay.bp3.cs);
        return $("#open-from-save").notify("Essay loaded successfully.", "success");
      },
      error: function(e, file) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(e.target.error);
        }
        return $("#open-from-save").notify("There was an error loading your file.");
      },
      skip: function(e, file) {
        return alert("This file could not be read.");
      }
    }
  };
  FileReaderJS.setupDrop(document.getElementById('open-from-save'), window.droptions);
  $("#open-from-save").bind("dragenter", function() {
    $("#open-from-save").addClass("drop");
    return $("#save-text").addClass("pacman-scale").html("<div></div><div></div><div></div><div></div>");
  });
  $("#open-from-save").bind("dragleave", function() {
    $("#open-from-save").removeClass("drop");
    return $("#save-text").removeClass("pacman-scale").html("Open");
  });
  $("#open-from-save").bind("drop", function() {
    $("#open-from-save").removeClass("drop");
    return $("#save-text").removeClass("pacman-scale").html("Open");
  });
  $('[data-toggle="tooltip"]').tooltip();
  zclip.on("ready", function() {
    return typeof console !== "undefined" && console !== null ? console.log("ZeroClipboard is ready!") : void 0;
  });
  dateObj = new Date;
  monthNo = dateObj.getUTCMonth();
  day = dateObj.getUTCDate();
  year = dateObj.getUTCFullYear();
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  month = monthNames[monthNo];
  d = month + ' ' + day + ', ' + year;
  return document.getElementById('date-text').innerHTML = d;
};

copyThot = function() {
  var essay;
  essay = (($("#name").val()) + "\r" + ($("#date-text").text()) + "\r" + ($("#title").val()) + "\n\t" + ($("#th").val())) + ("\r\t" + ($("#ts1").val()) + " " + ($("#ex1").val()) + " " + ($("#cs1").val()) + "\r\t") + (($("#ts2").val()) + " " + ($("#ex2").val()) + " " + ($("#cs2").val()) + "\r\t") + (($("#ts3").val()) + " " + ($("#ex3").val()) + " " + ($("#cs3").val()) + "\r\t") + ("" + ($("#co").val()));
  zclip.on("copy", (function(_this) {
    return function(event) {
      var clipboard;
      clipboard = event.clipboardData;
      return clipboard.setData("text/plain", essay);
    };
  })(this));
  return zclip.on("error", (function(_this) {
    return function(event) {
      return window.prompt("Copy to clipboard:\nCtrl+C, Enter", essay);
    };
  })(this));
};

saveText = function() {
  var essay, save;
  essay = (($("#name").val()) + "\r\n" + ($("#date-text").text()) + "\r\n" + ($("#title").val()) + "\n\n\t" + ($("#th").val())) + ("\r\n\t" + ($("#ts1").val()) + " " + ($("#ex1").val()) + " " + ($("#cs1").val()) + "\r\n\t") + (($("#ts2").val()) + " " + ($("#ex2").val()) + " " + ($("#cs2").val()) + "\r\n\t") + (($("#ts3").val()) + " " + ($("#ex3").val()) + " " + ($("#cs3").val()) + "\r\n\t") + ("" + ($("#co").val()));
  save = new Blob([essay], {
    type: "text/plain;charset=utf-8"
  });
  return saveAs(save, $("#title").val());
};

saveHtml = function() {
  var essay, essayHTML, save;
  essay = {
    head: {
      name: $("#name").val(),
      title: $("#title").val(),
      date: $("#date-text").text()
    },
    para: {
      thesis: marked($("#th").val()),
      conclusion: marked($("#co").val())
    },
    bp1: marked($("#ts1").val() + " " + $("#ex1").val() + " " + $("#cs1").val()),
    bp2: marked($("#ts2").val() + " " + $("#ex2").val() + " " + $("#cs2").val()),
    bp3: marked($("#ts3").val() + " " + $("#ex3").val() + " " + $("#cs3").val())
  };
  essayHTML = "<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"utf-8\"> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags --> <title>" + essay.head.title + "</title> <!-- Bootstrap --> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\" integrity=\"sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==\" crossorigin=\"anonymous\"> <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries --> <!-- WARNING: Respond.js doesn\'t work if you view the page via file:// --> <!--[if lt IE 9]> <script src=\"https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js\"></script> <script src=\"https://oss.maxcdn.com/respond/1.4.2/respond.min.js\"></script> <![endif]--> <!-- styles --> <style> .container { /* padding */ padding: 0.5in; /* font stuff */ font-family: \"Times New Roman\", sans-serif; font-size: 12pt; } .title { width: 100%; text-align: center; font-weight: 600; } </style> </head> <body> <div class=\"container\"> <p>" + essay.head.name + "</p> <p>" + essay.head.date + "</p> <p class=\"title\">" + essay.head.title + "</p> <p>" + essay.para.thesis + "</p> <p>" + essay.bp1 + "</p> <p>" + essay.bp2 + "</p> <p>" + essay.bp3 + "</p> <p>" + essay.para.conclusion + "</p> </div> </body> </html>";
  save = new Blob([essayHTML], {
    type: "text/html;charset=utf-8"
  });
  return saveAs(save, $("#title").val() + ".html");
};

saveEssay = function() {
  var essay, save;
  essay = {
    head: {
      name: $("#name").val(),
      title: $("#title").val(),
      date: $("#date-text").text()
    },
    para: {
      thesis: $("#th").val(),
      conclusion: $("#co").val()
    },
    bp1: {
      ts: $("#ts1").val(),
      ex: $("#ex1").val(),
      cs: $("#cs1").val()
    },
    bp2: {
      ts: $("#ts2").val(),
      ex: $("#ex2").val(),
      cs: $("#cs2").val()
    },
    bp3: {
      ts: $("#ts3").val(),
      ex: $("#ex3").val(),
      cs: $("#cs3").val()
    }
  };
  save = new Blob([JSON.stringify(essay)], {
    type: "application/json;charset=utf-8"
  });
  return saveAs(save, $("#title").val() + ".esma");
};

openEssay = function() {
  FileReaderJS.setupInput(document.getElementById('fileinput'), window.droptions);
  return $("#fileinput").trigger("click");
};

window.onerror = function(e) {
  if (RegExp(/Uncaught SyntaxError: Unexpected token ./g).test(e)) {
    return $.notify("Error:\nThe \"essay\" you tried to load was not an essay. Please stop uploading cat pictures to EssayMaker, it won't do anything but waste your time.", "error");
  }
};