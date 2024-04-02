import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../Redux/Action/ActionCart';
import { addSession } from '../../Redux/Action/ActionSession';

import { Link } from 'react-router-dom';
import LoginLink from '../../Authentication/LoginLink';
import LogoutLink from '../../Authentication/LogoutLink';
import Name from '../../Authentication/Name';

function Header(props) {

    const [active, setActive] = useState('Home')

    const dispatch = useDispatch()

    //Sau khi F5 nó sẽ kiểm tra nếu phiên làm việc của Session vẫn còn thì nó sẽ tiếp tục
    // đưa dữ liệu vào Redux
    if (sessionStorage.getItem('id_user')){
        const action = addSession(sessionStorage.getItem('id_user'))
        dispatch(action)
    }else{
        //Đưa idTemp vào Redux temp để tạm lưu trữ
        sessionStorage.setItem('id_temp', 'abc999')
        const action = addUser(sessionStorage.getItem('id_temp'))
        dispatch(action)
    }

    //Get IdUser từ redux khi user đã đăng nhập
    var idUser = useSelector(state => state.Session.idUser)

    //Get idtemp từ redux khi user chưa đăng nhập
    var idTemp = useSelector(state => state.Cart.id_user)

    console.log(idUser)

    console.log(idTemp)

    const [loginUser, setLoginUser] = useState(false)
    const [nameUser, setNameUser] = useState(false)

    useEffect(() => {
        if (!idUser){
            setLoginUser(false) 
            setNameUser(false)
        }else{
            setLoginUser(true) 
            setNameUser(true)
        }
    }, [idUser])


    const handlerActive = (value) => {

        setActive(value)
        console.log(value)

    }


    return (
        <div className="container px-0 px-lg-3">
            <nav className="navbar navbar-expand-lg navbar-light py-3 px-lg-0">
                <Link className="navbar-brand" to={`/`}>
                    <span className="font-weight-bold text-uppercase text-dark">Boutique</span>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item" onClick={() => handlerActive('Home')}>
                            <Link className="nav-link" to={`/`} 
                            style={active === 'Home' ? { color: '#dcb14a' } : {color: 'black'}} >Home</Link>
                        </li>
                        <li className="nav-item" onClick={() => handlerActive('Shop')}>
                            <Link className="nav-link" to={`/shop`} 
                            style={active === 'Shop' ? { color: '#dcb14a' } : {color: 'black'}} >Shop</Link>
                        </li>  
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to={`/cart`}>
                                <i className="fas fa-dolly-flatbed mr-1 text-gray"></i>Cart
                            </Link>
                        </li>
                        {nameUser ? (<Name />) : ''}
                        {loginUser ? (<LoginLink />) : (<LogoutLink />)}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Header;