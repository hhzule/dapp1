import React, { useState } from "react";
import Identicon from "identicon.js";

const Main = ({ account, uploadImage, captureFile, apis, fundApi }) => {
  const [apiDescription, setApiDescription] = useState();
  const [githublink, setGithubLink] = useState();

  const [fundamount, setFundamount] = useState(null);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            <h6 className="d-4">Connected Account: {account}</h6>

            <h2>Create Api</h2>
            <form
              onSubmit={(event) => {
                if (githublink === null) {
                  alert("Provide a github link!");
                  return;
                }
                event.preventDefault();
                const description = apiDescription;
                uploadImage(description, githublink);
              }}
            >
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .gif"
                onChange={(e) => {
                  captureFile(e);
                }}
              />
              <div className="form-group mr-sm-2">
                <br></br>
                <input
                  id="apiDescription"
                  type="text"
                  value={apiDescription}
                  onChange={(e) => {
                    setApiDescription(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Api Description..."
                  required
                />
                <input
                  style={{ marginTop: "10px" }}
                  id="githublink"
                  type="text"
                  value={githublink}
                  onChange={(e) => {
                    setGithubLink(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Github link for your api..."
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg">
                Upload!
              </button>
            </form>
            <p>&nbsp;</p>
            {apis ? (
              <input
                type="text"
                value={fundamount}
                onChange={(e) => {
                  setFundamount(e.target.value);
                }}
              />
            ) : null}

            {apis.map((image, key) => {
              return (
                <div className="card mb-4" key={key}>
                  <div className="card-header">
                    <img
                      className="mr-2"
                      src={`data:image/png;base64,${new Identicon(
                        image.developer,
                        30
                      ).toString()}`}
                    />
                    <small className="text-muted">{image.developer}</small>
                  </div>
                  <ul id="imageList" className="list-group list-group-flush">
                    <li className="list-group-item" style={{ padding: "30px" }}>
                      <img
                        src={`https://ipfs.infura.io/ipfs/${image.hashes}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <p>{image.description}</p>
                    </li>
                    <li>
                      <a style={{color:"black"}} href={image.githublink}>{image.githublink}</a>
                    </li>
                    <li key={key} className="list-group-item py-2">
                      <small className="float-left mt-1 text-muted">
                        TIPS:{" "}
                        {window.web3.utils.fromWei(
                          image.fund.toString(),
                          "Ether"
                        )}{" "}
                        ETH
                      </small>

                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        name={image.id}
                        onClick={(event) => {
                          if (fundamount === null) {
                            alert("enter a tip amount you cant tip air");
                            return;
                          }
                          let fund = window.web3.utils.toWei(
                            fundamount,
                            "Ether"
                          );
                          console.log(event.target.name, fund);
                          fundApi(event.target.name, fund);
                        }}
                      >
                        TIP IN ETH CHOOSE WISELY
                      </button>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
