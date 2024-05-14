import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Empty, Table } from 'antd'
import axios from 'axios'
import { Modal} from 'antd'
import Header from '@/components/Header'
import Heading from '@/components/Heading'
import Router from 'next/router'
import { Button } from 'react-bootstrap';
import Loading from '@/components/Loading';

const FeedBack = () => {
    let [listFeedBack, setListFeedBack] = useState([]);
    let [listProductVariant, setListProductVariant] = useState([]);
    let [loading, setLoading] = useState(false);
    let [productId, setProductId] = useState('');

    useEffect(() => {
        const getListFeedBack = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/feedback/getlist-feed-back')
                setListFeedBack(result.data)
            } catch (err) {
                console.log(err);
                // setListProductVariant(fakeData);
            }
        }
        getListFeedBack();
    }, [])

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

    const listProductVariant2 = useMemo(() => {
        return listProductVariant?.map((itemz) => {
            const findVariant = listFeedBack?.filter(item => item?.productId == itemz?.product_id)

            return {
                ...itemz,
                findVariant
            }
        })
    })

    const [open, setOpen] = useState(false);

    const currentFeedBack = useMemo(() => {
        return listFeedBack?.filter(item => item?.productId == productId?.product_id)
    }, [productId])

	const showModal = (id) => {
        setProductId(id)
	  setOpen(true);
	};
  
	const handleOk = (e) => {
	  setOpen(false);
	};
  
	const handleCancel = (e) => {
	  setOpen(false);
	};

    // const refreshProductVariantTable = async () => {
    //     const result = await axios.get('http://localhost:8080/api/product/admin/list')
    //     setListProductVariant(result.data)
    // }

    if(loading) {
        return <Loading/>
    }

    return (
        <div className="product-manager">
            <Modal
					title="Thêm đánh giá"
					open={open}
					onOk={handleOk}
					okText="Đóng"
					cancelText="Hủy"
					onCancel={handleCancel}
                    keyboard={false}
					okButtonProps={{ display: 'none', title: 'Hủy', color: 'transparent', opacity: 0 }}
					cancelButtonProps={{ display: false, title: 'Đóng' }}
				>
					 <Table
                        columns={[ {
                            key: '1',
                            title: 'Tên người dùng',
                            dataIndex: 'customer'
                        },
                        {
                            key: '2',
                            title: 'Đánh giá',
                            dataIndex: 'content'
                        },]}
                        dataSource={currentFeedBack}
                    >
                    </Table>
				</Modal>
            <Header title="Quản lý đánh giá" />
            <div className="wrapper manager-box">
                <Heading title="Tất cả đánh giá của phân loại sản phẩm" />
                <div className="wrapper-product-admin table-responsive">
                <Table  
                     pagination={{
                        pageSize: 5,
                      }}
                    loading={loading}
                        columns={[ {
                            key: '1',
                            title: 'Phân loại',
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
                                return  <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <div>Màu: {item?.colour_name || '--' }</div>
                                <div>Size: {item?.size_name || '--' }</div>
                            </div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Thao tác',
                            dataIndex: 'content',
                            render:(record, item) => {
                                return  <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <Button onClick={() => showModal(item)} style={{ margin: 'auto'}}>Xem đánh giá <span style={{color: 'red'}}>{`(${item?.findVariant?.length})`}</span></Button>
                            </div>
                            }
                        },
                    ]}
                        dataSource={listProductVariant2}
                    >
                    </Table>
                    {/* <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th width="50%" title='Tên sản phẩm'>
                                    Phân loại
                                </th>
                                <th width="30%" title='Giá sản phẩm'>Tên phân loại</th>
                                <th width="20%" title='Giá sản phẩm'>Thao tác</th>
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
                                    <td><Button onClick={() => showModal(product)} style={{ margin: 'auto'}}>Xem đánh giá</Button></td>
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
    )
}

export default FeedBack