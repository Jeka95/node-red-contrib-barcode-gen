const bwipjs = require('bwip-js');
module.exports = function (RED) {
   function FirstNode(config) {
      RED.nodes.createNode(this, config);
      this.codeType = config.codeType;
      this.includeText = config.includeText
      var node = this;
      node.on('input', function (msg) {
         bwipjs.toBuffer({
            bcid: `${node.codeType}`,       // Barcode type
            text: `${msg.payload}`,    // Text to encode
            scale: 5,               // 3x scaling factor
            height: 10,              // Bar height, in millimeters
            includetext: node.includeText,            // Show human-readable text
            textxalign: 'center',        // Always good to set this
         })
            .then(png => {
               // let result = 'data:image/png;base64,' + png.toString('base64')
               let result = png
               msg.payload = result;
               msg.codeType = node.codeType;
               node.send(msg);
               // `png` is a Buffer as in the example above
            })
            .catch(err => {
               let result = err
               msg.payload = result;
               node.send(msg);
               // `err` may be a string or Error object
            })
      });
   }
   RED.nodes.registerType("barcode-gen", FirstNode);
}
