const PSD = require('psd');
const fs = require('fs').promises;
const path = require('path');
const application = require('./convert')



const psd = PSD.fromFile("./psd/health_life_1_4_.psd");
const filename = "health_life_1_4_"



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
                    var imgLoc = "./output/" + filename + "/" + folder + "/" + objectName + ".png";

                    const otherObject = await application.format(object, sc, imgLoc);
                    if (j == toplayer.length - 1) {
                        console.log(toplayer[j].get("name"));
                        console.log(imgLoc);
                        file.backgroundImage.src = imgLoc;
                    } else {
                        grouping.objects.push(otherObject);
                    }
                    const saveImg = await application.savePng(toplayer[j], imgLoc);
                } else {
                    var textName = toplayer[j].get("name");
                    var textLoc = "./output/" + filename + "/" + folder + "/" + textName + ".png";

                    const saveTxt = await application.savePng(toplayer[j], textLoc);

                    const textObject = await application.format(object, sc)
                    file.objects.push(textObject, sc);
                }
            }
        }
        file.objects.push(grouping, sc);
        const json = await application.saveJson(file, filename, name);
        // fs.writeFile(path.resolve("./output/" + filename + "/" + name + ".json"), JSON.stringify(file));
    }
}
convertPSD()


