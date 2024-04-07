import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin'
import Router from 'next/router'

import * as actions from '../../store/actions';


const ProductManagementPage = () => {
    let [listProductVariant, setListProductVariant] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getListProductVariant = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/product/admin/list')
                setListProductVariant(result.data)
            } catch (err) {
                console.log(err);
                // setListProductVariant(fakeData);
            }
        }
        getListProductVariant();
    }, [])

    const refreshProductVariantTable = async () => {
        const result = await axios.get('http://localhost:8080/api/product/admin/list')
        setListProductVariant(result.data)
    }

    return (
        <div className="product-manager">
            <Header title="Quản lý sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page">
                    <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
                        Thêm sản phẩm
                    </button>
                </div>
                <Heading title="Tất cả sản phẩm" />
                <div className="wrapper-product-admin table-responsive">
                    <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Tên sản phẩm' className="name col-infor-product">
                                    Sản phẩm
                                </th>
                                <th title='Giá sản phẩm' className="col-price">Giá</th>
                                <th title='Tồn kho' className="col-quantity">Tồn kho</th>
                                <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                <th title="Trạng thái" className="col-state">Trạng thái</th>
                                <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                    {
                        listProductVariant.length ?
                            listProductVariant.map((productVariant, index) => {
                                return (
                                    <ProductAdmin
                                        key={index}
                                        product_id={productVariant.product_id}
                                        product_variant_id={productVariant.product_variant_id}
                                        product_name={productVariant.product_name}
                                        product_image={productVariant.product_image}
                                        colour_name={productVariant.colour_name}
                                        size_name={productVariant.size_name}
                                        price={productVariant.price}
                                        quantity={productVariant.quantity}
                                        state={productVariant.state}
                                        created_at={productVariant.created_at}
                                        refreshProductVariantTable={refreshProductVariantTable}
                                    />
                                )
                            })
                            :
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}><Empty /></td></tr>
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductManagementPage