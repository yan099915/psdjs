const PSD = require('psd');
const fs = require('fs').promises;
const path = require('path');
const application = require('./convert')



const psd = PSD.fromFile("./psd/nature_look_12_16.");
const filename = "nature_look_12_16"



async function convertPSD(file) {
    psd.parse();

    const tree = psd.tree();
    const children = tree._children

    // canvas size
    var data = tree.descendants();
    var w = tree.get("width");
    var h = tree.get("height");
    var sc = 1;

    for (i = 0; i < children.length; i++) {
        var name = children[i].get("name");
        console.log(name);

        var file = application.define(w * sc, h * sc);
        var grouping = application.group();
        var toplayer = children[i].descendants();

        for (j = 0; j < toplayer.length; j++) {
            if (toplayer[j].isGroup()) {
                var folder = toplayer[j].path();
                const assets = await fs.mkdir("./output/" + filename + "/" + folder, { recursive: true }, function (err) {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                var object = toplayer[j].export()
                if (!object.text) {
                    var objectName = toplayer[j].get("name");
                    var loc = "./output/" + objectName + ".png";
                    // console.log(loc);

                    toplayer[j].saveAsPng("./output/" + filename + "/" + folder + "/" + objectName + ".png").catch(function (err) {
                        console.log(err.stack);
                    });
                    const otherObject = application.format(object, sc, loc);
                    // console.log(grouping.objects);

                    grouping.objects.push(otherObject);
                } else {
                    var textName = toplayer[j].get("name");

                    toplayer[j].saveAsPng("./output/" + filename + "/" + folder + "/" + textName + ".png").catch(function (err) {
                        console.log(err.stack);
                    });

                    const textObject = application.format(object, sc)
                    file.objects.push(textObject, sc);
                }
            }
        }
        file.objects.push(grouping, sc);
        fs.writeFile(path.resolve("./output/" + filename + "/" + name + ".json"), JSON.stringify(file));
    }
}
convertPSD()


