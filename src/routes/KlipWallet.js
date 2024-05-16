import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Toast, Alert } from "react-bootstrap";
import Modal from "../components/Modal";
import QRcode from "../components/QRcode";
import { getBalance, fetchCardsOf, getSaleStatus } from "../api/UseCaver";
import * as KlipAPI from "../api/UseKlip";
import { DEFAULT_QR_CODE, DEFAULT_ADDRESS } from "../constants/for_klip";
import LogoKlaytn from "../assets/logo_klaytn.png";
import { Link } from "react-router-dom";
//import axios from "axios";

export default function KlipWallet() {
	const [nfts, setNfts] = useState([]); // {id: '101', uri: ''}
	const [myAddress, setMyAddress] = useState(window.sessionStorage.getItem('address') || DEFAULT_ADDRESS);
	const [myBalance, setMyBalance] = useState(window.sessionStorage.getItem('balance') || '0');

	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	const [showModal, setShowModal] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [modalProps, setModalProps] = useState({
		title: "MODAL",
		onConfirm: () => {},
	});

	//공연중일 경우 판매가격에 제한을 주기위한 체크함수
	//const [checkLitmitPrice, setCheckLitmitPrice] = useState(false);
	let checkBeforeDate = false;

    // 공연중인 티켓일 경우 2차 판매금액의 최고금액을 제한한다.
	const getCheckBeforeDate = (_pDate) => {
		//const regex = /[^0-9]/g;
		_pDate = _pDate.replace("년", "-");
		_pDate = _pDate.replace("월", "-");
		_pDate = _pDate.replace("일", "");
		_pDate = _pDate.replace(/\s+/g, "");
		const arrDate = _pDate.split("-");
	
		const pDate = new Date(`${arrDate[0]}-${arrDate[1] >= 10 ? arrDate[1] : '0' + arrDate[1]}-${arrDate[2] >= 10 ? arrDate[2] : '0' + arrDate[2]}`);
		//console.log(pDate);
		const tDate = new Date();
		if(pDate.getTime() > tDate.getTime()) {
		
			return true;
		}
		return false;
	}
	//종가 클레이 가격
	const [klayPrice, setKlayPrice] = useState('0');	
	//판매승인 확인
	const [saleStatus, setSaleStatus] = useState(false);
	console.log(saleStatus);
	//const account = myAddress;
 
	/////////////////////////////////////////////////////////////////////
	/*
	const onClickMyCard = (tokenId) => {
		KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) => {
			alert(JSON.stringify(result));
		});
	};

	const onClickCard = (id) => {
		setModalProps({
			title: "NFT를 마켓에 올리시겠어요?",
			onConfirm: () => {
				onClickMyCard(id);
			},
		})
		setShowModal(true);
	}
	*/
	//판매승인 토글
	/*
	const onClickApproveMyCard = () => {
		KlipAPI.approveSaleCardAll(!saleStatus, setQrvalue, (result) => {
			alert(JSON.stringify(result));
		});
	};

	const onClickApproveCard = (_msg) => {
	setModalProps({
		title: _msg,
		onConfirm: () => {
			onClickApproveMyCard();
		},
	})
	setShowModal(true);
	}
*/
	//클립 지갑연동
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
	
	useEffect(() => {
		const fetchMyNFTs = async () => {
			if (myAddress === DEFAULT_ADDRESS) {
				alert("NO ADDRESS");
				return;
			}
			const _nfts = await fetchCardsOf(myAddress);
				setNfts(_nfts);
			//await getNftInfo(82211);
			const _saleStatus = await getSaleStatus(myAddress);
			setSaleStatus(_saleStatus);
		}

		//종가 클레이튼 가격 가져요기
		const fetchKlayPrice = async () => {
			if (myAddress === DEFAULT_ADDRESS) {
				alert("NO ADDRESS");
				return;
			}

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

		if (myAddress !== DEFAULT_ADDRESS) {
			fetchMyNFTs();
			fetchKlayPrice();
		}
		
	}, [myAddress]);

	return (
		<div
			className="container"
			style={{ padding: "0 10px 50px", width: "100%" }}
		>
			<h1>My Wallet</h1>
			<div className="d-grid gap-2" style={{ position: "relative" }}>
				<Button
					onClick={handleClickCopyAddress}
					variant="light"
					size="lg"
					style={{ wordBreak: "break-word", width: "100%" }}
				>
					{myAddress}
				</Button>
				<Toast
					onClose={() => setShowToast(false)}
					show={showToast}
					delay={1000}
					autohide
					style={{
						width: 120,
						position: "absolute",
						top: 55,
						left: 0,
						zIndex: 10,
						backgroundColor: "rgba(112,112,112,0.7)",
					}}
				>
					<Toast.Body style={{ padding: 10, fontSize: 11, color: "#fff" }}>
						복사를 완료했습니다.
					</Toast.Body>
				</Toast>
				<Alert onClick={getUserData} variant="primary" style={{ fontSize: 25 }}>
					{myAddress !== DEFAULT_ADDRESS ? (
						<div style={{ textAlign: "right" }}>
							<img src={LogoKlaytn} alt="klaytn" style={{ width: 30 }} />
							{myBalance} KLAY  [{klayPrice}원]
						</div>
					) : (
						"지갑 연동하기"
					)}
				</Alert>
			</div>
			{qrvalue !== "DEFAULT" ? <QRcode value={qrvalue} /> : null}
			<Row>
				{nfts.map((nft) => (
					<Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
						<Card>
						<Link to={`/wallet/${nft.id}`}>
							<Card.Img src={nft.uri} />
						</Link>
						</Card>
						<Row><h5>No.{nft.id}</h5><h4>{nft.name}</h4><h5>{nft.description}</h5></Row>
						
						<Row>
						{nft.attributes.map((attr) => {
							//공연일 이전인지 체크
							if(attr.trait_type === "공연일시"){
								//console.log(attr.value);
								checkBeforeDate = getCheckBeforeDate(attr.value);
								//attr.value = new Date();
							}
							//공연중일때 판매가격 제한
							if(checkBeforeDate && attr.trait_type === "티켓가격"){
								//attr.value = Number(attr.value) * 2;
								//klay 현재가격

								//최대가격이상일 경우 리턴

								
							}
							return (
								<Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
									<li>{attr.trait_type} : {attr.value}</li>
								</Col>
							);
						}	
						)}
						</Row>
						<Row><h5>{nft.sellPrice !== "0" ? "판매중(" + nft.sellPrice + " klay)" : "판매전"}</h5></Row>
					</Col>
				))}
			</Row>
			<Modal
				showModal={showModal}
				close={() => setShowModal(false)}
				modalProps={modalProps}
			/>
		</div>
	)
}
