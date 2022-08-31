import {create} from 'ipfs-core';

const projectId = '2DjfpkdiMwBSK7ARtxIfYNFvUp6';
const porjectSecret = "c4bace15728e55d310a6ee89a1480192";
const auth = "Basic " + btoa(projectId + ":" + porjectSecret);

const ipfs = create({
  host:'ipfs.infura.io',
  port:5001,
  protocol:'https',
  headers: {
    authorization: auth
  }
});

export default ipfs;