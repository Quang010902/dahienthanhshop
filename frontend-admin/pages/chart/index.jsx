import Header from '@/components/Header';
import { Button } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { PureComponent, useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
const svgS = [{
  title: 'Chờ Xác Nhận',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
}, {
  title: 'Đã Xác Nhận',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
}, {
  title: 'Đang vận chuyển',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
}, {
  title: 'Đã Giao',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
}, {
  title: 'Đã Hủy',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
},
{
  title: 'Hủy Bởi Shop',
  svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea6c06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
}
]

const convertTime = (created_at) => {
  const date = new Date(created_at);
  const year = date.getFullYear();
  const day = date.getDate(); // ngày trong tháng
  const month = date.getMonth() + 1;
  const formattedDate = `${day}/${month}/${year}`;

  return month
}



const Chart = () => {
  let [orderList, setOrderList] = useState([]);
  let [type, setType] = useState('');
 const totalMoney = 'Thành tiền'
 const sum = 'Tháng'
 const sum2 = 'Số lượng đơn'
 const formatter = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'VND',
});
  const orders = useMemo(() => {
    const items = Object.groupBy(!type ? orderList : orderList?.filter(order => order.type == type), item => item?.state_name)

    return Object.keys(items)?.map(key => ({name: key, [sum]: items[key]?.length, [totalMoney]: 
      (_.sum(items[key]?.map(item => item?.total_order_value)) || 0)
    }))
  }, [orderList, type])

  const orders2 = useMemo(() => {
    const items2 = (!type ? orderList : orderList?.filter(order => order.type == type))?.map(item => {
      const time = convertTime(item?.created_at)
      return {
        ...item,
        time: time
      }
    })
    const items = Object.groupBy(items2, item => item?.time)
    console.log('items', items)
    return Object.keys(items)?.map(key => ({name: `Tháng ${key}`, [sum2]: items[key]?.length, [totalMoney]: 
      (_.sum(items[key]?.map(item => item?.total_order_value)) || 0)
    }))

  }, [orderList, type])
  console.log('orders2',orders2)
  const sumTotal = useMemo(() => {
    return formatter.format(_.sum(orderList?.map(order => order?.total_order_value)))
  }, [orderList])
  useEffect(() => {
      const getOrderList = async () => {
          try {
              const result = await axios.get('http://localhost:8080/api/order/admin/list')
              setOrderList(result.data)
          } catch (err) {
              console.log(err);
              // setOrderList(fakeOrderList);
          }
      }
      getOrderList();
  }, [])

  return (
    <div  className='row col-12'>
      <Header title="Báo cáo kinh doanh" />
        <div className="row col-12">
          <div className="col-12">
          <h6 className="mb-4 mt-4">Thống kê đơn hàng: {sumTotal}</h6>
            
            <div style={{
              display: 'grid',
              marginBottom: '10px', 
              gridTemplateColumns: 'repeat(2, 1fr)'
            }}>
              {svgS?.map(item => {
                const findOrder = orders?.find(order => order?.name == item?.title)
                console.log('findOrder', findOrder)
                return (
                  <div className="d-flex align-items-center mb-2">
                <span className="mx-2">{item.svg}</span>
                <span>{item.title}</span>
                <span style={{color:'red', fontWeight: 'bold'}}>{`( ${findOrder ? findOrder[sum] : 0} )`}</span>
              </div>
                )
              })}
            </div>
            <div>
              <Button style={{background: !type && 'black', color: !type ? 'white' : 'black'}} onClick={() => setType('')} className="mx-2">Tất cả</Button>   
              <Button style={{background: type == 'QR' && 'black', color: type == 'QR' ? 'white' : 'black'}} onClick={() => setType('QR')} className="mx-2">Đơn Online</Button>   
              <Button style={{background: type == 'COD' && 'black', color: type == 'COD' ? 'white' : 'black'}} onClick={() => setType('COD')}>Đơn Thủ công</Button>   
            </div>
            <AreaChart
                width={1100}
                height={400}
                data={orders2}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <Tooltip name={totalMoney}/>
              <Area type="monotone" dataKey={sum2} stroke="#ee4035" fill="#ee4035" />
              <Area type="monotone" dataKey={totalMoney} stroke="#ee4035" fill="#ee4035" />
            </AreaChart>
          </div>
        </div>
    </div>
  )
}

export default Chart