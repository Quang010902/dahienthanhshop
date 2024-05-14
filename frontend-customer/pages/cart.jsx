import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { swtoast } from '@/mixins/swal.mixin'
import { Radio, Button, Modal } from 'antd';
import { FaShippingFast } from 'react-icons/fa'
import CartItem from '@/components/CartPage/CartItem'
import Input from '@/components/Input'
import { backendAPI } from '@/config'
import { formatPrice } from '@/helpers/format'
import { clearCart } from '@/store/actions/cartActions'
import { useRouter } from 'next/router';
const CartPage = () => {
    const [customerId, setCustomerId] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [deliveryCharges, setDeliveryCharges] = useState(20000)
    const customerInfo = useSelector((state) => state.customer.customerInfo)
    const isLoggedIn = useSelector(state => state.customer.isLoggedIn)
    const productList = useSelector((state) => state.cart.productList)
    const dispatch = useDispatch()
    const router = useRouter()
    const formatter = new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const totalPrice = productList.reduce((accumulator, product) => accumulator + product.totalValue, 0)

    useEffect(() => {
        customerInfo != null ? setCustomerId(customerInfo.customer_id) : setCustomerId('')
        customerInfo != null ? setEmail(customerInfo.email) : setEmail('')
        customerInfo != null ? setCustomerName(customerInfo.customer_name) : setCustomerName('')
        customerInfo != null ? setPhoneNumber(customerInfo.phone_number) : setPhoneNumber('')
        customerInfo != null ? setAddress(customerInfo.address) : setAddress('')
    }, [customerInfo])

    const finalTotal = (price) => {
        return price + deliveryCharges
    }

    const [checkedOnline, setCheckedOnline] = useState('COD')
    const [openQR, setOpenQR] = useState(false)
    const [code, setCode] = useState((Math.random() + 1).toString(36).substring(7).toUpperCase())

    const handleCancel = (e) => {
        setOpenQR(false);
      };

    const handleOrder = async () => {
        if (isLoggedIn && productList.length) {
            try {
                setLoading(true)
                let orderItems = productList.map((product) => {
                    return { product_variant_id: product.productVariantId, quantity: product.quantity }
                })
                let order = {
                    user_id: customerId,
                    customer_name: customerName,
                    email,
                    phone_number: phoneNumber,
                    address,
                    order_items: orderItems,
                    type: checkedOnline,
                    code: code
                }

                const respond = await axios.post(`${backendAPI}/api/order/create`, order)
                dispatch(clearCart())
                setLoading(false)
                setOpenQR(false);
                router.push('/account/orders')
                swtoast.success({ text: "Đặt hàng thành công" });
            } catch (err) {
                console.log(err);
                setLoading(false)
                swtoast.error({
                    text: "Có lỗi khi tạo đơn hàng vui lòng thử lại!"
                });
            }
        }
    }

    return (
        <div className="cart-page">
            <Modal
                title='Xác nhận thanh toán bằng QR CODE'
                open={openQR}
                onOk={handleOrder}
                okText="Tiến hành thanh toán"
                cancelText="Hủy"
                onCancel={handleCancel}
                keyboard={false}
            >
           <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <img
                style={{
                    width: '250px',
                    textAlign:'center',
                    
                }} 
                src="https://i.ibb.co/S0P61Fh/77ce4753-f695-42a5-b3ef-553bf01ccef4.jpg" 
                alt="77ce4753-f695-42a5-b3ef-553bf01ccef4"/>
                </div>
                <div className="ml-2">
                   <div>
                     Nội dụng chuyển khoản: <span style={{ fontWeight: 'bold' ,color: 'red'}}>{code}</span>
                   </div>
                   <div>
                     Số tiền chuyển khoản: <span style={{ fontWeight: 'bold' ,color: 'red'}}>{formatPrice(finalTotal(totalPrice))}đ</span>
                   </div>
                    <div>
                        <span>Chú ý: Vui lòng nhập đúng Code và số tiền thanh toán để tránh rủi ro xảy ra</span>
                    </div>
                </div>
                
           </div>
            </Modal>
            <div className="row">
                <div className="col-7 cart-left-section">
                    <div className="title">
                        Thông tin vận chuyển
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-6">
                                <Input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    error={error}
                                    placeholder="Họ tên"
                                />
                            </div>
                            <div className="col-6">
                                <Input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    error={error}
                                    placeholder="Số điện thoại"
                                />
                            </div>
                        </div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error}
                            placeholder="Địa chỉ email"
                            disabled={true}
                        />
                        <Input
                            type="t"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={error}
                            placeholder="Địa chỉ"
                        />
                    </div>
                    <div className="payment">
                        <div className="title">
                            Hình thức thanh toán
                        </div>
                        <div>
                            <label htmlFor="" className="payment-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <div className='payment-item-radio'>
                                    <Radio checked={checkedOnline == 'COD'} onChange={() => setCheckedOnline('COD')}></Radio>
                                </div>
                                <div className='payment-item-icon'>
                                    <FaShippingFast />
                                </div>
                                <div className="payment-item-name">
                                    <p className="text-uppercase">cod</p>
                                    <p className="">Thanh toán khi nhận hàng</p>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="" className="payment-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <div className='payment-item-radio'>
                                    <Radio checked={checkedOnline == 'QR'} onChange={() => setCheckedOnline('QR')}></Radio>
                                </div>
                                <div className='payment-item-icon'>
                                    <img src='https://store-images.s-microsoft.com/image/apps.3768.14340978627155335.c3c132d0-b7d3-451e-87e1-eccb331441e5.e65382c2-18b1-4b90-b63e-96e2609f16d3?h=464' style={{width: '35px'}}/>
                                </div>
                                <div className="payment-item-name">
                                    <p className="text-uppercase">QR Pay</p>
                                    <p className="">QR Pay</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <Button
                    disabled={!productList?.length}
                    style={{
                        padding: '22px 0px',
                        background: 'orange',
                        lineHeight: "100%",
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                    }}
                    loading={loading} type='primary' onClick={async () => {
                        if(checkedOnline == 'QR') {
                            setOpenQR(true)
                        } else {
                           await handleOrder()
                        }
                    }} block>Đặt Hàng</Button>
                </div>
                <div className="col-5 cart-right-section">
                    <div className="title">
                        Giỏ hàng
                    </div>
                    <div className="cart-section">
                        {
                            productList.length > 0 ?
                                productList && productList.map((product, index) => {
                                    return (
                                        <CartItem
                                            key={index}
                                            productVariantId={product.productVariantId}
                                            name={product.name}
                                            image={product.image}
                                            colour={product.colour}
                                            size={product.size}
                                            quantity={product.quantity}
                                            totalValue={formatPrice(product.totalValue)}
                                        />

                                    )
                                }) : <p className="text-center">Chưa có sản phẩm nào trong giỏ hàng</p>
                        }
                    </div>
                    <div className="row pricing-info">
                        <div className="pricing-info-item position-relative d-flex justify-content-between">
                            <p>
                                Tạm tính
                            </p>
                            <p>
                                {formatPrice(totalPrice)}đ
                            </p>
                        </div>
                        <div className="pricing-info-item d-flex justify-content-between">
                            <p>Phí giao hàng</p>
                            <p>{formatPrice(deliveryCharges)}đ</p>
                        </div>
                        <div className="pricing-info-item final-total-box position-relative d-flex justify-content-between">
                            <p className='fw-bold'>Tổng</p>
                            <p className='fw-bold' style={{ fontSize: "20px" }}>
                                {formatPrice(finalTotal(totalPrice))}đ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage