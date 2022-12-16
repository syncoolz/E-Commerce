import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getCategories } from "../admin/apiAdmin";
import { getFilteredProducts } from "./coreApi";
import Checkbox from "./Checkbox";
import Card from "./Card";
import { prices } from "./fixedPrices";
import Radiobox from "./Radiobox";

const Orders = (props) => {
  const [error, setError] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        if (data) {
            setFilteredResults(data)
        }
      }
    });
  };



  useEffect(() => {
    init();
  }, []);

  return (
    <Layout
      title="Orders Page"
      description="Orders User"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-3">
          <h4>Summary your Orders</h4>
          
        </div>
        <div className="col-9">
          <h2 className="mb-4">Orders</h2>
          <div className="row">
            {filteredResults &&
              filteredResults.map((p, i) => (
                <div key={i} className="col-4 mb-3">
                  <Card product={p} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
