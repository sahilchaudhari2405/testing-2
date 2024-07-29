// Ensure correct path and file name
import bwipjs from 'bwip-js';
import Product from '../model/product.model.js';
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomString = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomString += numbers[randomIndex];
  }

  return randomString;
}
async function generateRandomBarcode(req,res) {
  let newBarcode;
  let isUnique = false;

  while (!isUnique) {
    //  newBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    newBarcode =generateRandomString();
    const checkBarcode = await Product.findOne({ BarCode: newBarcode });

    if (!checkBarcode) {
      isUnique = true;
    } 
  }
  res.status(200).json({ message: "Barcode created successfully", BarCode: newBarcode});
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
export default generateRandomBarcode;