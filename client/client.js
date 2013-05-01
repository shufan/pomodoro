Meteor.startup(function() {
  soundManager.setup({
    // where to find flash audio SWFs, as needed
    url: '/path/to/swf-files/',
    // optional: prefer HTML5 over Flash for MP3/MP4
    preferFlash: false,
    onready: function() {
      // SM2 is ready to play audio!
      soundManager.createSound({
        id: 'alarm',
        url: 'alarm.mp3'
      });
    }
  });
});
