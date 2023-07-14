import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class PinataService {
   constructor() {}

   public async getUrlByPhoneModel(phoneModel: string) {
    try {
      var config = {
        method: 'get',
        url: `https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues]={"phoneModel":{"value":"${phoneModel}","op":"eq"}}`,
        headers: { 
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
      };
      const res = await axios(config);
      return res.data;
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
    }
   }

   public async getUrlByImei(imei: string) {
    try {
      var config = {
        method: 'get',
        url: `https://api.pinata.cloud/data/pinList?metadata[keyvalues]={"imei":{"value":"${imei}","op":"eq"}}`,
        headers: { 
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
      };
      const res = await axios(config);
      return res.data;
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
    }
   }

   public async uploadNftMetadata(phoneModel: string, imei: string, ipfs: string) {
    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": `${imei}.json`,
      },
      "pinataContent": {
        "name": `${phoneModel} - ${imei}`,
        "description": "Unique Recykle NFT",
        // for now use gateway but later replace with ipfs://
        "image": `${process.env.PINATA_GATEWAY}${ipfs}`,
      }
    });
    
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json', // Use this line to get the correct Content-Type header with the boundary
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace this with your JWT
        },
      });
      return res.data.IpfsHash;
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
    }

    //var config = {
    //  method: 'post',
    //  url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    //  headers: { 
    //    'Content-Type': 'application/json', 
    //     Authorization: `Bearer ${process.env.PINATA_JWT}`,
    //  },
    //  data : data
    //};
    //const res = await axios(config);
    //return res.data.IpfsHash;
   }

   public async uploadPhoneBuffer(buffer: Buffer, phoneModel: string) {
    const formData = new FormData();

    // check if we already have phone in pinata
    const phoneIpfs = await this.getUrlByPhoneModel(phoneModel);
    
    if (phoneIpfs.count) {
      return phoneIpfs.rows[0].ipfs_pin_hash;
    };

    // Create a Readable stream from the Buffer
    const stream = Readable.from(buffer);
    formData.append('file', stream, {
      filename: `${phoneModel}.png`, // Set your desired file name here
    });
  
    const metadata = JSON.stringify({
      name: `Phone Image: ${phoneModel}`,
      keyvalues: {
        phoneModel,
      }
    });
    formData.append('pinataMetadata', metadata);
  
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
  
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(), // Use this line to get the correct Content-Type header with the boundary
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace this with your JWT
        },
      });
      return res.data.IpfsHash;
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
    }
   }

   public async uploadImageBuffer(buffer: Buffer, phoneModel: string, imei: string, type: string) {
    const formData = new FormData();

    // Create a Readable stream from the Buffer
    const stream = Readable.from(buffer);
    formData.append('file', stream, {
      filename: `${imei}.png`, // Set your desired file name here
    });
  
    const metadata = JSON.stringify({
      name: `${phoneModel} - ${imei}`,
      keyvalues: {
        imei,
        type,
      }
    });
    formData.append('pinataMetadata', metadata);
  
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
  
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(), // Use this line to get the correct Content-Type header with the boundary
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace this with your JWT
        },
      });
      return res.data.IpfsHash;
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error);
    }
   }
}
