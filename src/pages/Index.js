import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import config from "../config";

function Index() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list');

            if(res.data.results !== undefined ) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire ({
                title:'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    function showImage(item) {
        if  (item.img !== undefined) {
        return <img src={config.apiPath+ '/uploads/' + item.img} className="card-img-top" alt="" />
        }
        return <></>;
    }
    return (
        <>
        <div className="container mt-3">
          <div className="h3">สินค้าของร้านเรา</div>
          <div className="row">
            {products && products.length > 0 && products.map((item, index) => (
              <div className="col-3" key={index}>
                <div className="card">
                    {showImage(item)}
                  <div className="card-body">
                    <div>{item.name}</div>
                    <div>{item.price}</div>
                    <div className="text-center">
                      <button className="btn btn-primary">
                        <i className="fa fa-shopping-cart mr-2"></i>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </>
      );
      
      
}
export default Index;