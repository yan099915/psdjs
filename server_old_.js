const PSD = require('psd');
const fs = require('fs');
const path = require('path');
const fabric = require('fabric').fabric



const psd = PSD.fromFile("./psd/nature_look_12_16.psd");
const application = require('./convert')

async function convertPSD(file) {
    psd.parse();

    const tree = psd.tree();
    const children = tree._children

    // canvas size
    var data = tree.descendants();
    var w = tree.get("width");
    var h = tree.get("height");
    var sc = 1;
    // var getgroup = application.group()
    // console.log(getgroup);


    // for (i = 0; i < children.length; i++) {
    //     let bg = children[i].descendants()[children[i].descendants().length - 1].get("name") // descendants terakhir dari child tree
    //     console.log(bg);
    // }

    // var group = []
    // var start = new Date();
    // var arr = [];
    // data.forEach(function (node) {
    //     var file = application.define(w * sc, h * sc);
    //     var number = Math.floor(Math.random() * 100)

    //     // console.log(node.get("name"))

    //     if (node.isGroup()) return true;
    //     var i = node.export();

    //     if (!i.text) {
    //         node.saveAsPng("./output/" + node.name + number + ".png").catch(function (err) {
    //             console.log(err.stack);
    //         });
    //         if (!arr[node.path()]) arr[node.path()] = [];
    //         arr[node.path()].push("./output/" + node.name + number + ".png");
    //         console.log(node.get("name"));
    //     } else {
    //         if (!arr["text"]) arr["text"] = [];
    //         arr["text"].push(i.text);
    //         let txtObject = application.format(i, sc);

    //     }
    // })
    // console.log(arr.length);




    for (i = 0; i < children.length; i++) { //4x post 1 post 2 dst
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
                            grandchild._children[d].saveAsPng(`./output/${filename}/assets/${content}.png`).catch(function (err) {
                                console.log(err.stack);
                            });

                            file.objects.push(txtObject, sc);
                        }
                    } else if (c === grandchild._children.length - 1 && count == 0) {

                        for (e = 0; e < grandchild._children.length; e++) {
                            let img = grandchild._children[e].get("name");
                            let imgLocation = "./output/" + filename + "/assets/" + img + ".png"
                            let object = grandchild._children[e]
                            let imgObject = application.format(grandchild._children[e], sc); // ubah data grandchild menjadi format fabricjs

                            // console.log(img, "cek");

                            const assets = await fs.mkdir(`./output/${filename}/assets`, { recursive: true }, function (err) {
                                if (err) {
                                    console.log(err)
                                }
                            })

                            // file.objects.push(imgObject);
                            // console.log(grandchild._children[e].get("name"));

                            // grandchild._children[e].saveAsPng(imgLocation).catch(function (err) {
                            //     console.log(err.stack);
                            // })
                        }
                    }
                }
            }
            //masukan bg kedalam background
            file.backgroundImage.src = bg;
        }
        fs.writeFileSync(path.resolve(`./output/${filename}`, `${name}.json`), JSON.stringify(file));
    }
}

convertPSD()


