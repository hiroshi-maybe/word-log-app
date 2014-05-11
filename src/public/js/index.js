(function(window) {
  $(document).ready(function() {
    var $words_wrap = $("#word_list_wrap"),
        $words_ls = $("#word_list"),
        $word_input = $("#word_input"),
        $res_input = $("#res_input"),
        $snip_input = $("#snippet_input"),
        $prac_input = $("#practice_input");

    $("#search").click(function() {
      var word = $word_input.val();
      if (word.length<1) { return; }
      window.open('http://eow.alc.co.jp/search?q='+word, '_blank');
    });

    $("#post_reference").click(function() {
      var word = $word_input.val();
      if (word.length<1) { return; }
      $.post("word", {
	"word" : word,
	"resource"  : $res_input.val(),
	"snip" : $snip_input.val(),
	"example" : $prac_input.val()
      })
	.done(function(res) {
	  $prac_input.val("");
	  alert("post success");
	  console.log(res);
	});
    });

    // recent words
    $.getJSON("word/list", function(res) {
      console.log(res);
      // Error
      if (res.resultCode!=0) { return; }
      $words_ls.detach();
      res.data.forEach(function(x) {
	$words_ls.append("<li>"+x.word+"</li>");
      });
      $words_ls.appendTo($words_wrap);
    });

    
  });

})(this);
