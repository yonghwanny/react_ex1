import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
//import Modal from "../components/Modal";
//import QRcode from "../components/QRcode";
import { fetchCardsOfSale } from "../api/UseCaver";
//import * as KlipAPI from "../api/UseKlip";
//import { DEFAULT_QR_CODE, DEFAULT_ADDRESS } from "../constants/for_klip";
//import LogoKlaytn from "../assets/logo_klaytn.png";
import { Link } from "react-router-dom";
//import axios from "axios";

export default function Ticket() {
	const [nfts, setNfts] = useState([]); // {id: '101', uri: ''}
	//const [myAddress, setMyAddress] = useState(window.sessionStorage.getItem('address') || DEFAULT_ADDRESS);
	//const [myBalance, setMyBalance] = useState(window.sessionStorage.getItem('balance') || '0');

	//const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	//const [showModal, setShowModal] = useState(false);
	//const [showToast, setShowToast] = useState(false);
	//const [modalProps, setModalProps] = useState({
	//	title: "MODAL",
	//	onConfirm: () => {},
	//});

	//종가 클레이 가격
	//const [klayPrice, setKlayPrice] = useState('0');	

	//클립 지갑연동
  /*
	const getUserData = () => {
		setModalProps({
			title: "Klip 지갑을 연동하시겠습니까?",
			onConfirm: () => {
				KlipAPI.getAddress(setQrvalue, async (address) => {
					window.sessionStorage.setItem('address', address);
					setMyAddress(address);
					const _balance = await getBalance(address);
					window.sessionStorage.setItem('balance', _balance);
					setMyBalance(_balance);

				});
			},
		});
		setShowModal(true);
	}

	const handleClickCopyAddress = () => {
		navigator.clipboard.writeText(myAddress).then(() => setShowToast(true));
	}
*/	
	useEffect(() => {
		const fetchMyNFTs = async () => {

			const _nfts = await fetchCardsOfSale();
				setNfts(_nfts);
		
		}
/*
		//종가 클레이튼 가격 가져요기
		const fetchKlayPrice = async () => {
			//if (myAddress === DEFAULT_ADDRESS) {
				//alert("NO ADDRESS");
				//return;
			//}

			try {
				const URL = "https://gametok.co.kr/api/klay_info.json";

				const response = await fetch(URL);
      	const result = await response.json();
				console.log(result.tickers[0].last);
				setKlayPrice(result.tickers[0].last);
			}catch(error){
				console.error(error);
			}
			
			//setKlayPrice('258');
		}
*/
		//if (myAddress !== DEFAULT_ADDRESS) {
			fetchMyNFTs();
			//fetchKlayPrice();
		//}
		
	}, []);

	return (
		<div
			className="container"
			style={{ padding: "0 10px 50px", width: "100%" }}
		>
			<h1>Ticket</h1>
			<div className="d-grid gap-2" style={{ position: "relative" }}>

			</div>
			<Row>
				{nfts.map((nft) => (
					<Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
						<Card>
						<Link to={`/ticket/${nft.id}`}>
							<Card.Img src={nft.uri} />
						</Link>
						</Card>
						<Row><h5>No.{nft.id}</h5><h4>{nft.name}</h4><h5>{nft.description}</h5></Row>
						
						<Row>
						{nft.attributes.map((attr) => {

							return (
								<Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
									<li>{attr.trait_type} : {attr.value}</li>
								</Col>
							);
						}	
						)}
						</Row>
						<Row><h5>{nft.sellPrice !== "0" ? "판매가격 :" + nft.sellPrice + " klay" : ""}</h5></Row>
					</Col>
				))}
			</Row>
			
		</div>
	)
}
