import Header from '@/components/Header'
import Heading from '@/components/Heading'
import Loading from '@/components/Loading';
import { Empty, Table } from 'antd';
import axios from 'axios';
import List from 'rc-virtual-list';
import React, { useEffect, useState } from 'react'

const Phantich = () => {
    let [listProductVariant, setListProductVariant] = useState([]);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const getListProductVariant = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/product/admin/list')
                setListProductVariant(result.data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log(err);
                // setListProductVariant(fakeData);
            }
        }
        getListProductVariant();
    }, [])

    if(loading) {
        return <Loading/>
    }
console.log('listProductVariant', listProductVariant)
  return (
    <div className='row col-12'>
        <Header title="Quản lý tồn" />
        <div className='col-12'>
        <div className="product-manager">
            <div className="wrapper manager-box">
                <div className="wrapper-product-admin table-responsive">
                <Table  
                     pagination={{
                        pageSize: 5,
                      }}
                    loading={loading}
                        columns={[ {
                            key: '1',
                            title: ' Tên hàng hóa',
                            dataIndex: 'customer',
                            render:(record, item) => {
                                return  <div style={{ display: 'flex', alignItems: 'center'}}>
                                <div>{item?.product_name}</div>
                                <div><img src={item?.product_image} style={{marginLeft: '5px', width: '70px', width: '70px', objectFit: 'cover'}}/></div>
                            </div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Tên phân loại',
                            dataIndex: 'content',
                            render:(record, item) => {
                                return <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <div>Màu: {item?.colour_name || '--' }</div>
                                <div>Size: {item?.size_name || '--' }</div>
                            </div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Tồn sẵn sàng bán',
                            dataIndex: 'content',
                            render:(record, item) => {
                                return <div>{item?.quantity}</div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Tổng vốn',
                            dataIndex: 'content',
                            render:(record, item) => {
                                return <div>{new Intl.NumberFormat('vn', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(item?.price * item?.quantity)}</div>
                            }
                        },
                    ]}
                        dataSource={listProductVariant}
                    >
                    </Table>
                    {/* <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th width="30%" title='Tên sản phẩm'>
                                    Phân loại
                                </th>
                                <th width="30%" title='Giá sản phẩm'>Tên phân loại</th>
                                <th width="10%" title='Giá sản phẩm'>Đã bán</th>
                                <th width="10%" title='Giá sản phẩm'>Tồn sẵn sàng bán</th>
                                <th width="10%" title='Giá sản phẩm'>Tổng vốn</th>
                                <th width="10%" title='Giá sản phẩm'>Đã bán</th>
                            </tr>
                        </thead>
                        {listProductVariant?.length ? (
                        <tbody>
                            {listProductVariant?.map(product => (
                                 <tr>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center'}}>
                                            <div>{product?.product_name}</div>
                                            <div><img src={product?.product_image} style={{marginLeft: '5px', width: '130px', width: '130px', objectFit: 'cover'}}/></div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                                            <div>Màu: {product?.colour_name || '--' }</div>
                                            <div>Size: {product?.size_name || '--' }</div>
                                        </div>
                                    </td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>100</td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                         <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                            <tbody>
                                <tr><td colSpan={6}><Empty /></td></tr>
                            </tbody>
                        </table>
                    )}
                    </table>
                     */}
                            
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Phantich