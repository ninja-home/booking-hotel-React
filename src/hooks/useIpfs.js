import {create} from 'ipfs-core';
import {useEffect, useState} from 'react';

let ipfs = null;
const projectId = '2DjfpkdiMwBSK7ARtxIfYNFvUp6';
const porjectSecret = "c4bace15728e55d310a6ee89a1480192";
const auth = "Basic " + btoa(projectId + ":" + porjectSecret);


export default function useIpfs() {
    const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
    const [ipfsInitError, setIpfsInitError] = useState(null);

    useEffect(() => {
        startIpfs();
        return function cleanUp() {
            if (ipfs && ipfs.stop) {
                console.log("stopping IPFS");
                ipfs.stop().catch(err => console.log(err));
                ipfs = null;
                setIpfsReady(false);
            }
        }
    }, []);

    async function startIpfs() {
        if (ipfs) {
            console.log("IPFS already started");
        } else if (window.ipfs && window.ipfs.enable) {
            console.log("Found window.ipfs");
            ipfs = await window.ipfs.enable({commands: ['id']});
        } else {
            try {
                console.time("IPFS Started");
                ipfs = await create({
                    host:'ipfs.infura.io',
                    port:5001,
                    protocol:'https',
                    headers: {
                      authorization: auth
                    }                  
                });
                console.timeEnd("IPFS Started");
            } catch(err) {
                // console.error("IPFS init error:", err);
                ipfs = null;
                setIpfsInitError(err);    
            }
        }
        setIpfsReady(Boolean(ipfs));
    }

    return {ipfs, isIpfsReady, ipfsInitError};
}