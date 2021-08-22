import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Main from "./Main";
import gif from "../loading.gif";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // leaving out the arguments will default to these values

const App = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState();
  const [error, setError] = useState();

  const [decentragram, setDecentragram] = useState(null);
  const [apis, setApis] = useState([]);
  const [buffer, setBuffer] = useState([]);

  const [apisCount, setApisCount] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];
    if (networkData) {
      const decentragram = web3.eth.Contract(
        Decentragram.abi,
        networkData.address
      );
      setDecentragram(decentragram);
      const apisCount = await decentragram.methods.apiCount().call();
      setApisCount(apisCount);
      let apiArr = [];
      for (let i = 1; i <= apisCount; i++) {
        const totalapi = await decentragram.methods.apis(i).call();
        apiArr.push(totalapi);
        console.log("SETTTED ID DSJHb", apis);
      }

      setApis(apiArr.sort((a, b) => b.fund - a.fund));

      setLoading(false);
    } else {
      console.log("ERROR PANIC");
      window.alert("contract has not been dep... error ok just error");
    }
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log(Buffer(reader.result));
    };
  };
  const uploadImage = (description, githublink) => {
    try {
      console.log("submitting wait");

      ipfs.add(buffer, (error, result) => {
        console.log("ipfs result", result);
        if (error) {
          console.log(error);
          return;
        }
        setLoading(true);
        decentragram.methods
          .createApi(result[0].hash, description, githublink)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
    } catch (e) {
      setError(e);
      console.log("error", e);
    }
  };
  const fundApi = (id, fundAmount) => {
    setLoading(true);
    decentragram.methods
      .fundApi(id)
      .send({ from: account, value: fundAmount })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };
  useEffect(async () => {
    await loadWeb3();
    await loadBlockchainData();
  }, []);

   window.ethereum.on("accountsChanged", function(accounts) {
      setAccount(account);
      loadBlockchainData();
    });
  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div className="loader-parent">
          <img src={gif} alt="" />
        </div>
      ) : (
        // <></>
        <Main
          account={account}
          apis={apis}
          captureFile={captureFile}
          uploadImage={uploadImage}
          fundApi={fundApi}
          //
          //   // Code...
        />
      )}
    </div>
  );
};

export default App;
