const PSD = require('psd');
const fs = require('fs');
const path = require('path');
const { parse, stringify, toJSON, fromJSON } = require('flatted');
const fabric = require('fabric').fabric


const psd = PSD.fromFile("./psd/health_life_1_4_.psd");
const application = require('./convert')
const filename = "health_life_1_4_"

async function toImg(json, w, h) {
    // initialize fabric canvas and assign to global windows object for debug
    var canvas = new fabric.Canvas('c');

    // canvas.setHeight(h);
    // canvas.setWidth(w);

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
        fabric.log(o, object);
    });

    var dataURL = canvas.toDataURL('png');
    console.log(dataURL);
}

async function convertPSD(file) {
    psd.parse();
    const tree = psd.tree();
    const children = tree._children

    // canvas size
    var data = tree.descendants();
    var w = tree.get("width");
    var h = tree.get("height");
    var sc = 1;

    const main = await fs.mkdir(`./output/${filename}`, { recursive: true }, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`"New directory ./output/${filename} successfully created."`)
        }
    })

    for (i = 0; i < children.length; i++) {
        let qty = children[i]._children.length; // banyak children dari Post
        let name = children[i].get("name"); // nama child dari tree

        // jika children dari tree memiliki children
        if (qty >= 1) {
            // format fabricjs pertama
            var file = application.define(w * sc, h * sc);
            let cdesc = children[i].descendants().length;
            let bg = children[i].descendants()[cdesc - 1].get("name") // descendants terakhir dari child tree

            // console.log(name);

            for (b = 0; b < qty; b++) {
                let grandchild = children[i]._children[b]
                // console.log(grandchild._children.length);

                let count = 0;
                let count2 = 0;
                for (c = 0; c < grandchild._children.length; c++) {
                    let txt = grandchild._children[c]
                    // console.log(Boolean(txt.export().text));
                    if (txt.export().text) {
                        count++
                    } else {
                        count2++
                    }
                    // console.log(grandchild._children[c].get("name"), c, name);

                    if (c === grandchild._children.length - 1 && count >= 1) {
                        for (d = 0; d < grandchild._children.length; d++) {
                            let content = grandchild._children[d].get("name");
                            let txtObject = application.format(grandchild._children[d], sc); // ubah data grandchild menjadi format fabricjs

                            const assets = await fs.mkdir(`./output/${filename}/assets`, { recursive: true }, function (err) {
                                if (err) {
                                    console.log(err)
                                }
                            })
                            grandchild._children[d].saveAsPng(`./output/${filename}/assets/${content}.png`).then(function () {
                                console.log(`Exported!`);
                            });

                            file.objects.push(txtObject, sc);
                        }
                    } else if (c === grandchild._children.length - 1 && count == 0) {
                        for (e = 0; e < grandchild._children.length; e++) {
                            let img = grandchild._children[e].get("name");
                            let imgObject = application.format(grandchild._children[e], sc); // ubah data grandchild menjadi format fabricjs
                            let imgLocation = "./output/" + filename + "/assets/" + imgObject + ".png"
                            let a = grandchild._children[e].get("image");

                            // console.log(img, "cek");

                            const assets = await fs.mkdir(`./output/${filename}/assets`, { recursive: true }, function (err) {
                                if (err) {
                                    console.log(err)
                                }
                            })

                            const abc = toImg(JSON.stringify(imgObject), w, h);
                            file.objects.push(imgObject);

                            grandchild._children[e].saveAsPng(`./output/${filename}/assets/${imgObject}.png`).then(function () {
                                console.log(`Exported!`);
                            });
                        }
                    }
                }
            }
            //masukan bg kedalam background
            file.backgroundImage.src = bg;

        }
        // console.log(file);
        fs.writeFileSync(path.resolve(`./output/${filename}`, `${name}.json`), JSON.stringify(file));
    }
}

convertPSD()


