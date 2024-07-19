// Ensure correct path and file name
import bwipjs from 'bwip-js';
function generateRandomBarcode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }
  
  async function generateQR_Code(req, res) {
    const text = generateRandomBarcode();
  if (!text) {
    return res.status(400).send('Text query parameter is required');
  }

  try {
    bwipjs.toBuffer({
      bcid: 'code128',    
      text: text,            
      scale: 3,             
      height: 10,          
      includetext: true,    
      textxalign: 'center',  
    }, (err, png) => {
      if (err) {
        return res.status(500).send('Error generating barcode');
      }
      
      res.set('Content-Type', 'image/png');
      res.send(png);
    });
  } catch (error) {
    res.status(500).send('Error generating barcode');
  }
}
export default generateQR_Code ;