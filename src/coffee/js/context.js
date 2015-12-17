var titleHide, titleShow;

$(function() {
  $('#preview-toggle').change(function() {
    var essay;
    if ($(this).prop("checked") !== true) {
      essay = marked((($("#name").val()) + "<br>" + ($("#date-text").text()) + "<br>" + ($("#title").val()) + "<br><br>&nbsp;&nbsp;&nbsp;&nbsp;" + ($("#th").val())) + ("<br>&nbsp;&nbsp;&nbsp;&nbsp;" + ($("#ts1").val()) + " " + ($("#ex1").val()) + " " + ($("#cs1").val()) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;") + (($("#ts2").val()) + " " + ($("#ex2").val()) + " " + ($("#cs2").val()) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;") + (($("#ts3").val()) + " " + ($("#ex3").val()) + " " + ($("#cs3").val()) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;") + ("" + ($("#co").val())));
      $("#preview").html(essay);
      $("#editor").hide(125);
      return $("#preview").show(125);
    } else {
      $("#preview").hide(125);
      return $("#editor").show(125);
    }
  });
  return $(".part, .para").on("blur focus", function() {
    var essay, rating;
    essay = ("" + ($("#th").val())) + ("\r\t" + ($("#ts1").val()) + " " + ($("#ex1").val()) + " " + ($("#cs1").val()) + "\r\t") + (($("#ts2").val()) + " " + ($("#ex2").val()) + " " + ($("#cs2").val()) + "\r\t") + (($("#ts3").val()) + " " + ($("#ex3").val()) + " " + ($("#cs3").val()) + "\r\t") + ("" + ($("#co").val()));
    rating = sentiment.analyze(essay).score;
    $("#tone-container").tooltip("destroy");
    if (rating < 0) {
      $("#tone-input").css("color", "red");
      $("#tone-container").tooltip({
        html: true,
        placement: "top",
        title: "<span class='text'><small><strong class='red'>Negative</strong><br>Your essay takes a negative stance overall.</small></span>"
      });
    } else if (rating > 0) {
      $("#tone-input").css("color", "green");
      $("#tone-container").tooltip({
        html: true,
        placement: "top",
        title: "<span class='text'><small><strong class='green'>Positive</strong><br>Your essay takes a positive stance overall.</small></span>"
      });
    } else if (rating === 0) {
      $("#tone-input").css("color", "#33C3F0");
      $("#tone-container").tooltip({
        html: true,
        placement: "top",
        title: "<span class='text'><small><strong class='blue'>Neutral</strong><br>Your essay takes a neutral stance overall.</small></span>"
      });
    }
    return $("#tone-input").text(rating);
  });
});

titleShow = function(type, num) {
  if (type !== "co" || "th") {
    $(".l" + type + num).css("visibility", "visible");
    $(".l" + type + num).collapse("show");
    switch (num) {
      case "1":
        $(".l" + type + "2, .l" + type + "3").css("visibility", "hidden");
        return $(".l" + type + "2, .l" + type + "3").collapse("show");
      case "2":
        $(".l" + type + "1, .l" + type + "3").css("visibility", "hidden");
        return $(".l" + type + "1, .l" + type + "3").collapse("show");
      case "3":
        $(".l" + type + "1, .l" + type + "2").css("visibility", "hidden");
        return $(".l" + type + "1, .l" + type + "2").collapse("show");
    }
  } else {
    return $(".l" + type).collapse("show");
  }
};

titleHide = function(type, num) {
  if (type !== "co" || "th") {
    return $(".part-label").collapse("hide");
  } else {
    return $(".l" + type).collapse("hide");
  }
};
