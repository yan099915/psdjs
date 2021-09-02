const PSD = require('psd');
const nodeBase64 = require('nodejs-base64-converter');

var psd = PSD.fromFile("./health_life_1_4_.psd");
const application = require('./convert')

async function convertPSD(file) {
    psd.parse();
    var tree = psd.tree();

    // canvas size
    var data = tree.descendants();
    var w = tree.get("width");
    var h = tree.get("height");
    var sc = 1;


    var json = [];
    var children = tree._children
    for (i = 0; i < children.length; i++) {
        let qty = children[i].descendants().length;

        // jika children dari tree memiliki descendants
        if (qty >= 1) {
            // format fabricjs pertama
            var file = application.define(w * sc, h * sc);
            let name = children[i].get("name"); // nama child dari tree
            let cdesc = children[i].descendants().length;
            let bg = children[i].descendants()[cdesc - 1].get("name") // descendants terakhir dari child tree

            //masukan bg kedalam background
            file.backgroundImage.src = bg;
            try {
                for (index = 0; index < qty - 1; index++) {
                    let grandchild = children[i].descendants()[index]; //data grandchild dari tree
                    var object = application.format(grandchild, sc); // ubah data grandchild menjadi format fabricjs

                    // masukan object kedalam object
                    file.objects.push(object, sc);
                }
                // var toplayer = { [name]: [file] };
                console.log(file);

                // json.push(toplayer);
            } catch (error) {
                console.log(error);
            }
            // console.log(json[0]);

        }
    }
}

convertPSD()

