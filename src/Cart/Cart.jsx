
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, updateCart } from '../Redux/Action/ActionCart';
import ListCart from './Component/ListCart';
import alertify from 'alertifyjs'
import { Link, Redirect } from 'react-router-dom'
import CartAPI from '../API/CartAPI';
import queryString from 'query-string'


function Cart(props) {

    //id_user được lấy từ redux
    const id_user = useSelector(state => state.Cart.id_user)

    //listCart được lấy từ redux
    const listCart = useSelector(state => state.Cart.listCart)

    const [cart, setCart] = useState([])

    const [total, setTotal] = useState()

    const dispatch = useDispatch()

    //State dùng để Load dữ liệu từ Redux
    const [loadRedux, setLoadRedux] = useState({
        idProduct: '',
        count: ''
    })

    //State dùng để Load dữ liệu từ API
    const [loadAPI, setLoadAPI] = useState(false)

    //Hàm này dùng để Load dữ liệu ở Redux
    //Khi người dùng chưa đăng nhập
    useEffect(() => {

        const fetchDataRedux = () => {

            if (!sessionStorage.getItem('id_user')){
                setCart(listCart)

                getTotal(listCart)
            }

        }

        fetchDataRedux()

    }, [loadRedux])

    //Hàm này dùng để tính tổng tiền carts
    function getTotal(carts) {
        let sub_total = 0
                
        const sum_total = carts.map(value => {
            return sub_total += parseInt(value.priceProduct) * parseInt(value.count)
        })

        setTotal(sub_total)
    }

    //Hàm này dùng để load dữ liệu từ API
    //Khi người dùng đã đăng nhập
    useEffect(() => {

        const fetchData = async () => {

            if (sessionStorage.getItem('id_user')){

                const params = {
                    idUser: sessionStorage.getItem('id_user')
                }

                const query = '?' + queryString.stringify(params)

                console.log(query)

                const response = await CartAPI.getCarts(query)

                setCart(response)

                getTotal(response)

            }

        }

        fetchData()

        setLoadAPI(false)

    }, [loadAPI])


    //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha 
    const onDeleteCart = (getUser, getProduct) => {
        console.log( "idUser: " + getUser + ", idProduct: " + getProduct)

        if (sessionStorage.getItem('id_user')){ // user đã đăng nhập

            //Sau khi nhận được dữ liệu ở component con truyền lên thì sẽ gọi API xử lý dữ liệu
            const fetchDelete = async () => {

                const params = {
                    idUser: getUser,
                    idProduct: getProduct
                }

                const query = '?' + queryString.stringify(params)

                const response = await CartAPI.deleteToCart(query)
                console.log(response)

            }

            fetchDelete()

            //Sau đó thay đổi state loadAPI và load lại hàm useEffect
            setLoadAPI(true)

            alertify.set('notifier','position', 'bottom-left');
            alertify.error('Bạn Đã Xóa Hàng Thành Công!');

        }else{ // user chưa đăng nhập

            //Nếu không có phiên làm việc của Session User thì mình sẽ xử lý với Redux
            const data = {
                idProduct: getProduct,
                idUser: getUser,
            }

            //Đưa dữ liệu vào Redux
            const action = deleteCart(data)
            dispatch(action)

            alertify.set('notifier','position', 'bottom-left');
            alertify.error('Bạn Đã Xóa Hàng Thành Công!');

            //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
            setLoadRedux({
                idProduct: getProduct,
                count: ''
            })
            
        }

    }

    //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha 
    const onUpdateCount = (getUser, getProduct, getCount) => {
        console.log("Count: " + getCount + ", idUser: " + getUser + ", idProduct: " + getProduct)

        if (sessionStorage.getItem('id_user')){ // user đã đăng nhập

            //Sau khi nhận được dữ liệu ở component con truyền lên thì sẽ gọi API xử lý dữ liệu
            const fetchPut = async () => {

                const params = {
                    idUser: getUser,
                    idProduct: getProduct,
                    count: getCount
                }

                const query = '?' + queryString.stringify(params)

                const response = await CartAPI.putToCart(query)
                console.log(response)
                
            }

            fetchPut()

            //Sau đó thay đổi state loadAPI và load lại hàm useEffect
            setLoadAPI(true)

            console.log("Ban Da Dang Nhap!")

            alertify.set('notifier','position', 'bottom-left');
            alertify.success('Bạn Đã Sửa Hàng Thành Công!');

        }else{

            //Nếu không có phiên làm việc của Session User thì mình sẽ xử lý với Redux
            const data = {
                idProduct: getProduct,
                idUser: getUser,
                count: getCount
            }

            //Đưa dữ liệu vào Redux
            const action = updateCart(data)
            dispatch(action)

            alertify.set('notifier','position', 'bottom-left');
            alertify.success('Bạn Đã Sửa Hàng Thành Công!');

            //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
            setLoadRedux({
                idProduct: getProduct,
                count: getCount
            })
        }

    }

    //Hàm này dùng để redirect đến page checkout
    const [redirect, setRedirect] = useState(false)

    const onCheckout = () => {
        
        if (!sessionStorage.getItem('id_user')){
            alertify.set('notifier','position', 'bottom-left');
            alertify.error('Vui Lòng Kiểm Tra Lại Đăng Nhập!');
            return
        }

        if (cart.length === 0){
            alertify.set('notifier','position', 'bottom-left');
            alertify.error('Vui Lòng Kiểm Tra Lại Giỏ Hàng!');
            return
        }
        
        setRedirect(true)

    }

    return (
        <div className="container">
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                        <div className="col-lg-6">
                            <h1 className="h2 text-uppercase mb-0">Cart</h1>
                        </div>
                        <div className="col-lg-6 text-lg-right">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                                    <li className="breadcrumb-item active" aria-current="page">Cart</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5">
                <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>
                <div className="row">
                    <div className="col-lg-8 mb-4 mb-lg-0">
                        
                        <ListCart 
                            listCart={cart} 
                            onDeleteCart={onDeleteCart} 
                            onUpdateCount={onUpdateCount} />

                        <div className="bg-light px-4 py-3">
                            <div className="row align-items-center text-center">
                                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                                    <Link className="btn btn-link p-0 text-dark btn-sm" to={`/shop`}>
                                        <i className="fas fa-long-arrow-alt-left mr-2"> </i>Continue shopping
                                    </Link>                
                                </div>
                                <div className="col-md-6 text-md-right">
                                    {
                                        redirect && <Redirect to={'/checkout'} />
                                    }
                                    <span className="btn btn-outline-dark btn-sm" onClick={onCheckout}>
                                        Procceed to checkout<i className="fas fa-long-arrow-alt-right ml-2"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card border-0 rounded-0 p-lg-4 bg-light">
                            <div className="card-body">
                                <h5 className="text-uppercase mb-4">Cart total</h5>
                                <ul className="list-unstyled mb-0">
                                    <li className="d-flex align-items-center justify-content-between"><strong className="text-uppercase small font-weight-bold">Subtotal</strong><span className="text-muted small">${total}</span></li>
                                    <li className="border-bottom my-2"></li>
                                    <li className="d-flex align-items-center justify-content-between mb-4"><strong className="text-uppercase small font-weight-bold">Total</strong><span>${total}</span></li>
                                    <li>
                                        <form>
                                            <div className="form-group mb-0">
                                                <input className="form-control" type="text" placeholder="Enter your coupon" />
                                                <button className="btn btn-dark btn-sm btn-block" type="submit"> <i className="fas fa-gift mr-2"></i>Apply coupon</button>
                                            </div>
                                        </form>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cart;