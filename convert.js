const PSD = require('psd');
const fs = require('fs');
const path = require('path');
const base64 = require('base-64')



module.exports = {
    define: (width, height) => {
        var dt = {
            version: "4.1.0",
            objects: [],
            backgroundImage: {
                type: "image",
                version: "4.1.0",
                originX: "left",
                originY: "top",
                left: 0,
                top: 0,
                width: width,
                height: height,
                fill: "rgb(255,255,255)",
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: "butt",
                strokeDashOffset: 0,
                strokeLineJoin: "miter",
                strokeMiterLimit: 4,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: "",
                fillRule: "nonzero",
                paintFirst: "fill",
                globalCompositeOperation: "source-over",
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                crossOrigin: "anonymous",
                filters: [],
                src: ""
            }
        };
        return dt
    },

    format: (arr, scale, loc) => {
        // var arr = data.export();

        if (arr.text) {

            // font colors
            let clr = arr.text.font.colors[0].reverse();
            clr.shift();
            // Nama Font
            let font = arr.text.font.name.replace(/(?:\\[rn]|[\r\n]+)+|\u0000/g, " ");
            // Ukuran Font
            let size = Math.round((arr.text.font.sizes[0] * arr.text.transform.yy) * 100) * 0.01;
            let height = Math.round((arr.text.font.sizes[0] * arr.text.transform.xx) * 100) * 0.01;
            // console.log(font.trim());


            var dt = {
                type: "textbox",
                version: "4.4.0",
                originX: "left",
                originY: "top",
                left: arr.left,
                top: arr.top,
                width: arr.width,
                height: arr.height,
                fill: `rgb(${clr.reverse().toString()})`,
                stroke: "#000000",
                strokeWidth: 1,
                strokeDashArray: null,
                strokeLineCap: "butt",
                strokeDashOffset: 0,
                strokeLineJoin: "miter",
                strokeMiterLimit: 4,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                visible: true,
                backgroundColor: "",
                fillRule: "nonzero",
                paintFirst: "fill",
                globalCompositeOperation: "source-over",
                skewX: 0,
                skewY: 0,
                text: arr.text.value.replace(/(?:\\[rn]|[\r\n]+)+|\u0003/g, "\n"),
                fontSize: size,
                fontWeight: "",
                fontFamily: font.trim(),
                fontStyle: "",
                lineHeight: 1,
                underline: "",
                overline: false,
                linethrough: false,
                textAlign: arr.text.font.alignment[0],
                textBackgroundColor: "",
                charSpacing: 0,
                styles: {},
            };
            return dt;
        }

        var dt = {
            type: "image",
            version: "4.1.0",
            originX: "left",
            originY: "top",
            left: arr.left,
            top: arr.top,
            width: arr.width,
            height: arr.height,
            fill: "rgb(0,0,0)",
            stroke: `rgb(0,0,0)`,
            strokeWidth: null,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeDashOffset: 0,
            strokeLineJoin: "miter",
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 100,
            shadow: null,
            visible: true,
            backgroundColor: "",
            fillRule: "nonzero",
            paintFirst: "fill",
            globalCompositeOperation: "source-over",
            skewX: 0,
            skewY: 0,
            cropX: 0,
            cropY: 0,
            crossOrigin: null,
            filters: [],
            src: loc
        };
        return dt;
    },

    group: (w) => {
        var group = {
            type: "group",
            version: "4.4.0",
            originX: "center",
            originY: "center",
            left: 250,
            top: 1320,
            width: 200,
            height: 50,
            fill: "rgb(0,0,0)",
            stroke: null,
            strokeWidth: 0,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeDashOffset: 0,
            strokeLineJoin: "miter",
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            shadow: null,
            visible: true,
            backgroundColor: "",
            fillRule: "nonzero",
            paintFirst: "fill",
            globalCompositeOperation: "source-over",
            skewX: 0,
            skewY: 0,
            objects: [],
        };
        return group
    },

    savePng: (layer, loc) => {
        layer.saveAsPng(loc).catch(function (err) {
            console.log(err.stack);
        });
    },

    saveJson: (file, filename, name) => {
        fs.writeFile(path.resolve("./output/" + filename + "/" + name + ".json"), JSON.stringify(file), function (err) {
            if (err) {
                console.log(err)
            }
        })
    }
};