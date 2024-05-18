import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Button, Empty, Input } from 'antd'
import ReactPaginate from "react-paginate";

import ProductItem from '@/components/CollectionPage/ProductItem'

import { backendAPI } from '@/config'
import { UserOutlined } from '@ant-design/icons'

const CollectionPage = () => {
    const router = useRouter()
    const { category } = router.query
    const [productList, setProductList] = useState([])
    const [typeSort, setTypeSort] = useState('desc')
    const [productListFilter, setProductListFilter] = useState([])
    const [searchInput, setSearchInput] = useState('');

    const [pageNumber, setPageNumber] = useState(0);

    const usersPerPage = 8;
    const pagesVisited = pageNumber * usersPerPage;
  
    useEffect(() => {
        const getProductList = async () => {
            try {
                let url = category ? `${backendAPI}/api/product/customer/list?category=${category}` : `${backendAPI}/api/product/customer/list`
                const result = await axios.get(url)
                setProductList(result.data ? [...new Map(result.data?.map(item => [item['product_variant_id'], item])).values()] : [])
                    setProductListFilter(result.data ? [...new Map(result.data?.map(item => [item['product_variant_id'], item])).values()] : [])
                
            } catch (err) {
                console.log(err)
            }
        }

        getProductList()
    }, [category])

    const products = useMemo(() => {
        return typeSort == 'desc' ? [...productListFilter].sort((a, b) => a.price - b.price) : [...productListFilter].sort((a, b) => b.price - a.price)
    }, [typeSort, productListFilter])

    const displayUsers = useMemo(() => {
        return [...products.slice(pagesVisited, pagesVisited + usersPerPage)]
    }, [products, pagesVisited, usersPerPage])
    console.log('displayUsers', displayUsers)

  const pageCount = Math.ceil(products.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

    return (
        <div className="product-page">
            <h5 className="mb-4 mt-3">Sắp xếp theo</h5>
            <div className="d-flex col-12">
                <div className="col-6">
                    <Button onClick={() => setTypeSort('desc')} style={{background: 'black', color: 'white'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
                        Giá tăng dần
                    </Button>
                    <Button onClick={() => setTypeSort('esc')} style={{background: 'black', color: 'white'}} className="mx-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-down"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
                        Giá giảm dần
                    </Button>
                </div>
                <div className="col-4">
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder='Nhập tên sản phẩm...'
                    onKeyUp={(e) => {
                        if(e.key == 'Enter') {
                            if(!searchInput) {
                                setProductListFilter([...productList])
                                return
                            } 
                            setProductListFilter(() => [...productList].filter(item => {
                                if(item?.product_name.toLowerCase().includes(searchInput.toLowerCase())) {
                                    return item
                                }
                            }))
                        }
                    }}
                    prefix={<UserOutlined/>}
                />
                </div>
                
            </div>
            <div className="product-box d-flex flex-row flex-wrap justify-content-start">
                {
                    displayUsers.length ?
                    displayUsers.map((product, index) => {
                            return (
                                <ProductItem
                                    key={index}
                                    product_id={product.product_id}
                                    name={product.product_name}
                                    img={product.product_image}
                                    colour_name={product.colour_name}
                                    price={product.price}
                                    colour_id={product.colour_id}
                                    sizes={product.sizes}
                                    rating={product.rating}
                                    feedback_quantity={product.feedback_quantity}
                                />
                            )
                        })
                        :
                        <div className='d-flex' style={{ width: "100%", height: "400px" }}>
                            <Empty style={{ margin: "auto" }} />
                        </div>
                }
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
        </div>
    )
}

export default CollectionPage