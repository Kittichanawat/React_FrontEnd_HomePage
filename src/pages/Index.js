import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Mymodal from "../components/MyModal";
import dayjs from 'dayjs';
function Index() {
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]); // Item in Carts
  const [recordInCarts, setRecordInCarts] = useState(0);
  const [sumQty, setSumQty] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [payDate , setPayDate] = useState(dayjs (new Date()).format('YYYY-DD-MM'));
  const [payTime, setPayTime] = useState('');

  useEffect(() => {
    fetchData();
    fetchDataFromLocal();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/product/list");

      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  function showImage(item) {
    if (item.img !== undefined) {
      let imgPath = config.apiPath + "/uploads/" + item.img;
      if (item.img === "") imgPath = "default.webp";

      return (
        <img src={imgPath} height="150 px" className="card-img-top" alt="" />
      );
    }
    return <></>;
  }

  const addToCart = (item) => {
    let arr = carts;
    if (arr === null) {
      arr = [];
    }
    arr.push(item);

    setCarts(arr);
    setRecordInCarts(arr.length);

    localStorage.setItem("carts", JSON.stringify(carts));

    fetchDataFromLocal();
  };
  const fetchDataFromLocal = () => {
    const itemInCarts = JSON.parse(localStorage.getItem("carts"));
    if (itemInCarts !== null) {
      setCarts(itemInCarts);
      setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);
      computePriceAndQty(itemInCarts);
    }
  };
  const computePriceAndQty = (itemInCarts) => {
    if (itemInCarts !== null) {
      let sumQty = 0;
      let sumPrice = 0;

      for (let i = 0; i < itemInCarts.length; i++) {
        const item = itemInCarts[i];
        sumQty++;
        sumPrice += parseInt(item.price);
      }
      setSumPrice(sumPrice);
      setSumQty(sumQty);
    }
  };
  const handleRemove = async (item) => {  
    try {
      const button = await Swal.fire({
        title: 'ลบสินค้า',
        text: 'ยืนยันการลบสินค้า',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      });
  
      if (button.isConfirmed){
        // ทำสำเนาของอาร์เรย์ carts เพื่อป้องกันการแก้ไข state โดยตรง
        let arr = [...carts];
        
        // หาตำแหน่งของรายการแรกที่ตรงกับ id ของสินค้าที่ต้องการลบ
        const index = arr.findIndex(cartItem => cartItem.id === item.id);
        
        // ถ้าพบรายการที่ต้องการลบ
        if (index !== -1){
          arr.splice(index, 1); // ลบรายการนั้นออกจากอาร์เรย์
        }
        
        // อัปเดต state และ localStorage
        setCarts(arr);
        setRecordInCarts(arr.length);
        localStorage.setItem('carts', JSON.stringify(arr));
        computePriceAndQty(arr);
      }
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.message,
        icon: 'error'
      });
    }
  }
  const handleSave = async () =>{
    try {
      const payload = {
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        payDate: payDate,
        carts: carts
      }
      const res = await axios.post(config.apiPath + '/api/sale/save', payload);
      if (res.data.message ==="success") {
        localStorage.removeItem('carts');
        setRecordInCarts(0);
        setCarts([]);
        Swal.fire({
          title:'บันทึกข้อมูล',
          text: 'ระบบได้บันทึกข้อมูลของคุณแล้ว',
          icon: 'success'

        })
      }
    } catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  return (
    <>
      <div className="container mt-3">
        <div className="float-start">
          <div className="h3">สินค้าของร้านเรา</div>
        </div>
        <div className="float-end">
          ตะกร้าของฉัน{" "}
          <button
            className="btn btn-outline-success"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#modalCart"
          >
            <i className="fa fa-shopping-cart"></i> {recordInCarts}{" "}
          </button>
        </div>
        <div className="clearfix"></div>

        <div className="row">
          {products &&
            products.length > 0 &&
            products.map((item, index) => (
              <div className="col-3 mt-5" key={item.id}>
                <div className="card">
                  {showImage(item)}
                  <div className="card-body">
                    <div>{item.name}</div>
                    <div>{item.price.toLocaleString("th-TH")}</div>
                    <div className="text-center">
                      <button
                        className="btn btn-primary"
                        onClick={(e) => addToCart(item)}
                      >
                        <i className="fa fa-shopping-cart me-2"></i>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Mymodal id="modalCart" title="ตะกร้าของฉัน">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th className="text-end">name</th>
              <th className="text-end">price</th>
              <th className="text-end">qty</th>
              <th width="60px"></th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 ? (
              carts.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="text-end">
                    {item.price.toLocaleString("th-TH")}
                  </td>
                  <td className="text-end">1</td>
                  <td className="text-center">
                    <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
        <div className="text-center">
          จำนวน {sumQty} รายการ เป็นเงิน {sumPrice.toLocaleString("th-TH")} บาท
        </div>

        <div className=" mt-3">
          <div>
            <div>ชื่อผู้สั่งซื้อ</div>
            <input type="text" className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} />
          </div>
          <div className="mt-3">
            <div>เบอร์โทรศัพท์</div>
            <input type="text"className="form-control" value ={customerPhone} onChange={e => setCustomerPhone(e.target.value)}/>
          </div>
          <div className="mt-3">
            <div>ที่อยู่ในการจัดส่ง</div>
            <input type="text" className="form-control" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}/>

          </div>
          <div>
            <div className="mt-3">
              <div className="alert alert-warning">
               <div> โปรดโอนเงินไปที่บัญชีธนาคาร</div> 
               <div>นายสมชาย ซื้อสินค้า 888-8888</div>
              </div>
              <div>วันที่โอน</div>
              <input type="date" className="form-control" value={payDate} onChange={e => setPayDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-3">
            <div>เวลาที่โอน</div>
            <input type="text" className="form-control"  value={payTime} onChange={e => setPayTime(e.target.value)}/>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSave} >
            <i className="fa fa-check me-2"></i> ยืนยันการสั่งซื้อ
          </button>
        </div>
      </Mymodal>
    </>
  );
}
export default Index;
