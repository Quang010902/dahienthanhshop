import Head from 'next/head'
import { Inter } from '@next/font/google'
import Slider from '@/components/Slider'
import { ArrowUpOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ProductItem from '@/components/CollectionPage/ProductItem'
import { backendAPI } from '@/config'
import { Divider } from 'antd'
import ReactPaginate from "react-paginate";

const inter = Inter({ subsets: ['latin'] })
export default function HomePage() {
	const [productList, setProductList] = useState([])
	const router = useRouter()
	const [categoryList, setCategoryList] = useState([]);
	const [pageNumber, setPageNumber] = useState(0);

    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
	useEffect(() => {
		const handleGetCategory = async () => {
			try {
				let respond = await axios.get(backendAPI + '/api/category/nest-list');
			
				setCategoryList(respond.data)
			} catch (error) {
				console.log(error);
				setCategoryList(fakeCategoryList);
			}
		}
		handleGetCategory();
	}, [])
	useEffect(() => {
		const item = categoryList.flatMap(item => {
			return [...item?.children?.map(item => item?.category_id), item?.category_id]
		}).map(item => axios.get(`${backendAPI}/api/product/customer/list?category=${item}`))

		Promise.all([...item]).then(function(values) {
			const items = values?.flatMap(item => [...item?.data])
			setProductList(items)
		  });
	}, [categoryList])
	
	const productss = useMemo(() => {
		return [...new Map(productList?.map(item => [item['product_variant_id'], item])).values()].slice(pagesVisited, pagesVisited + usersPerPage)
	}, [pagesVisited, productList, usersPerPage])
	const pageCount = Math.ceil([...new Map(productList?.map(item => [item['product_variant_id'], item])).values()].length / usersPerPage);

	const changePage = ({ selected }) => {
	  setPageNumber(selected);
	};
	return (
		<>
			<Head>
				<title>Hienthanh</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main className='home-page'>
				<div style={{ margin: "0 -64px" }}>
					<Slider />
				</div>
				<div>
					<img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1200:75/q:90/plain/https://dashboard.cellphones.com.vn/storage/smember-30-special-desk-update.gif"/>
				</div>
				<Divider orientation='center' style={{
					borderColor:'black'
				}}>Danh sách sản phẩm bán chạy</Divider>
				<div className="product-page">
					<div className="product-box d-flex flex-row flex-wrap justify-content-start">
						{
							productss.length ?
							productss.map((product, index) => {
									return (
										<ProductItem
											key={index}
											product_id={product.product_id}
											name={product.product_name}
											img={product.product_image}
											price={product.price}
											colour_name={product.colour_name}
											colour_id={product.colour_id}
											sizes={product.sizes}
											rating={product.rating}
											feedback_quantity={product.feedback_quantity}
										/>
									)
								})
								:
								<div className='d-flex'>
									Loading...
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
				<div className="homepage-basic bg-dark text-light">
					<div className="d-flex">
						<div className="content-left">
							<h2 className='content_h2'>
								ElevenT for <br /> Runing
							</h2>
							<p className='content_p'>Sản phẩm được kiểm nghiệm bởi các vận động viên <br />
								chạy bộ chuyên nghiệp</p>
							<div>
								<button className='border-radius fw-bold'>
									Khám phá ngay
								</button>
							</div>
						</div>
						<div className="content-right">
							<img src="https://mcdn.coolmate.me/image/April2023/mceclip1_35.jpg" alt="" />
						</div>
					</div>
				</div>

			
				<div className="homepage-hagstag">
					<div className="row">
						<div className="col-6">
							<p className='text-uppercase'>CÁC SẢN PHẨM TỰ HÀO SẢN XUẤT TẠI VIỆT NAM VÀ DÀNH CHO NGƯỜI VIỆT NAM! <br />
								HƠN 3 TRIỆU SẢN PHẨM ĐÃ ĐƯỢC GỬI TỚI TAY KHÁCH HÀNG SỬ DỤNG VÀ HÀI LÒNG!</p>
						</div>
						<div className="col-6 d-flex justify-content-around align-items-center">
							<div className="">
								<p className="hagstag-title">
									#ElevenT
								</p>
							</div>
							<div className="">
								<p className='text-uppercase'>GIẢI PHÁP MUA SẮM <br />Cả tủ đồ dành cho nam giới</p>
							</div>
						</div>
					</div>
				</div>
				<div className="homepage-service">
					<div className="d-flex">
						<div className="position-relative">
							<img className='p-0' src="https://mcdn.coolmate.me/image/March2023/mceclip0_26.jpg" alt="" />
							<div className="homepage-service-content position-absolute d-flex justify-content-between align-items-center w-100">
								<span className='title'>Câu chuyện ElevenT</span>
								<span className='title d-flex align-items-center'>
									<ArrowUpOutlined />
								</span>
							</div>
						</div>
						<div className="position-relative">
							<img src="https://mcdn.coolmate.me/image/March2023/mceclip1_16.jpg" alt="" />
							<div className="homepage-service-content position-absolute d-flex justify-content-between align-items-center w-100">
								<span className='title'>Dịch vụ hài lòng 100%</span>
								<span className='title d-flex align-items-center'>
									<ArrowUpOutlined />
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
