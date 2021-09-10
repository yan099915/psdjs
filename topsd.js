const PSD = require("psd");

var file = process.argv[2] || "./psd/health_life_1_4_.psd";
var start = new Date();
var arr = [];

PSD.open(file).then(function (psd) {
  psd.tree().descendants().forEach(function (node) {
    console.log(node.get("name"))
    if (node.isGroup()) return true;
    var i = node.export();
    var number = Math.floor(Math.random() * 100)

    if (!i.text) {
      node.saveAsPng("./output/" + node.name + number + ".png").catch(function (err) {
        console.log(err.stack);
      });
      if (!arr[node.path()]) arr[node.path()] = [];
      arr[node.path()].push("./output/" + node.name + number + ".png");
    } else {
      if (!arr["text"]) arr["text"] = [];
      arr["text"].push(i.text);
    }
  });
})
  .then(function () {
    console.log(arr['Post04/Shapes/Star/Star']);
    console.log(arr);
    console.log("Finished in " + (new Date() - start) + "ms");
  })
  .catch(function (err) {
    console.log(err.stack);
  });
