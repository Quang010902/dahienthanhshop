import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Empty, Modal, Table } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import Router from 'next/router'
import { Button } from 'react-bootstrap';
import Loading from '@/components/Loading';
import { swtoast } from '@/mixins/swal.mixin';

const Users = () => {
    let [listUser, setListUser] = useState([]);
    let [loading, setLoading] = useState(false);
    let [loadingBlock, setLoadingBLock] = useState(false);
     
    const [titleView, setTitleView] = useState('Bạn có đồng ý khóa tài khoản này ?')
    const [idUser, setIdUser] = useState('')
    console.log('idUser', idUser)
   

useEffect(() => {
    const getListFeedBack = async () => {
        try {
            setLoading(true)
            const result = await axios.get('http://localhost:8080/api/customer/getusers')
            setListUser(result.data)
            setLoading(false)
        } catch (err) {
            console.log(err);
            // setListProductVariant(fakeData);
        }
    }
    getListFeedBack();
    }, [loadingBlock])
  
    const [open, setOpen] = useState(false);

    const showModal = () => {
	  setOpen(true);
	};
  
	const handleOk = async (e) => {
        if(!idUser) return 
        setLoadingBLock(true)
        let result = await axios.put(`http://localhost:8080/api/customer/updatestate`, {
            user_id: idUser,
        });
        if(result) {
            swtoast.success({ text: 'Thành công!' })
            setLoadingBLock(false)
            setOpen(false);  
        }
       
	};
  
	const handleCancel = (e) => {
	  setOpen(false);
	};

    if(loading) {
        return <Loading/>
    }
  
   
    return (
        <div className="product-manager">
            <Header title="Quản lý người dùng" />
            <div className="wrapper manager-box">
            <Modal
                title='Xác nhận'
                open={open}
                onOk={handleOk}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={handleCancel}
                keyboard={false}
            >
                {titleView}
            </Modal>
                <Heading title="Quản lý tài khoản" />
                <div className="wrapper-product-admin table-responsive">
                <Table  
                     pagination={{
                        pageSize: 5,
                      }}
                    loading={loading}
                        columns={[ {
                            key: '1',
                            title: ' Email',
                            dataIndex: 'customer',
                            render:(record, item) => {
                                return <div> {item?.email}</div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Roles',
                            dataIndex: 'content',
                            render:(record, item) => {
                                return  <div style={{ display: 'flex', flexDirection: 'column'}}>
                                {item?.role_id == 1 ? 'Admin' : "Người dùng"}
                            </div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Trạng thái',
                            dataIndex: 'content',
                            render:(record, item) => {
                            return <div style={{ display: 'flex', flexDirection: 'column'}}>
                               {item?.statusUser ? 'Đang hoạt động' : 'Đã bị khóa'}
                            </div>
                            }
                        },
                        {
                            key: '2',
                            title: 'Thao tác',
                            align: 'center', 
                            dataIndex: 'content',
                            render:(record, item) => {
                                return <div className='d-flex justify-content-around'>
                                    <Button loading={loadingBlock} style={{
                                        background: item?.statusUser ? item?.role_id == 1 ? 'red' : 'blue' : 'gray'
                                    }} disabled={item?.role_id == 1} onClick={() => {
                                        showModal()
                                        setIdUser(item?.user_id)
                                        setTitleView(item?.statusUser ? 'Bạn có đồng ý khóa tài khoản này ?' : 'Bạn có đồng ý mở tài khoản này ?')
                                    }} type='danger'>
                                        {item?.statusUser ? 'Khóa tài khoản' : 'Mở tài khoản'}
                                    </Button>
                                </div>
                            }
                        },
                    ]}
                        dataSource={listUser}
                    >
                    </Table>
                            
                </div>
            </div>
        </div>
    )
}

export default Users