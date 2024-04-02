import React, { useEffect, useRef } from "react";
import queryString from 'query-string';
import CheckoutAPI from "../API/CheckoutAPI";

const Paypal = ({ information, total, setLoad, setSuccess }) => {
    const paypal = useRef()  // khải báo ref cho paypal

    useEffect(() => {
        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Hóa Đơn Đặt Hàng",
                            amount: {
                                currency_code: "USD",
                                value: String(Math.ceil(Number(total) / 23400)), // tổng tiền của hóa đơn
                            },
                        },
                    ],
                })
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log(order)

                // Tiếp theo là ông muốn xử lý api get,post,put,update như nào thì tùy ông xử lý nha :v
                // Sau khi xử lý đưa xuống data xong thì

                setLoad(true);
                const fetchOrderApi = async () => {

                    const params = {
                        ...information,
                        idUser: sessionStorage.getItem('id_user')
                    }
    
                    const query = '?' + queryString.stringify(params)
    
                    const response = await CheckoutAPI.postEmail(query)
    
                    console.log(response)
                    
                    setLoad(false);
                    setSuccess(true);
                }
    
                fetchOrderApi();
            },
            onError: (err) => {
                console.log("Vui Lòng Kiểm Tra Lại Thông Tin")
            }
        }).render(paypal.current)
    }, [])

    return (
        <div ref={paypal}>
        </div>
    );
}

export default Paypal;