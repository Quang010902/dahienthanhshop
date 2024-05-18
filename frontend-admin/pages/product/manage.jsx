import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin'
import Router from 'next/router'
import ReactPaginate from "react-paginate";

import * as actions from '../../store/actions';


const ProductManagementPage = () => {
    let [listProductVariant, setListProductVariant] = useState([]);
    const dispatch = useDispatch();
    
    console.log('listProductVariant', listProductVariant)
        const [searchInput, setSearchInput] = useState('');

    const [pageNumber, setPageNumber] = useState(0);

    const usersPerPage = 6;
    const pagesVisited = pageNumber * usersPerPage;
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

    const displayUsers = useMemo(() => {
        return [...listProductVariant.slice(pagesVisited, pagesVisited + usersPerPage)]
    }, [listProductVariant, pagesVisited, usersPerPage])
    console.log('displayUsers', displayUsers)

  const pageCount = Math.ceil(listProductVariant.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

    return (
       <>
         <div className="product-manager">
            <Header title="Quản lý phân loại sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page">
                    <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
                        Thêm sản phẩm
                    </button>
                </div>
                <Heading title="Tất cả phân loại sản phẩm" />
                <div className="wrapper-product-admin table-responsive">
                    <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Tên sản phẩm' className="name col-infor-product">
                                    Tên phân loại
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
                        displayUsers.length ?
                        displayUsers.map((productVariant, index) => {
                                return (
                                    <div key={index}>
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
                                    </div>
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
        <div className='row'>
                <div className='col-7'></div>
                <div className='col-5'>
                <ReactPaginate
                    previousLabel={"Sau"}
                    nextLabel={"Trước"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
                </div>
            </div>
       </>
    )
}

export default ProductManagementPage