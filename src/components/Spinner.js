import React, { Component } from "react";
import loading from "./loading.gif";
export default class Spinner extends Component {
  render() {
    return (
      <div className="container">
        <div className="text-center">
          <img className="my-6" src={loading} alt="loading" />
        </div>
      </div>
    );
  }
}
