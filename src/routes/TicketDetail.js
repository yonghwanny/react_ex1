import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Toast, Alert } from "react-bootstrap";
import Modal from "../components/Modal";
import QRcode from "../components/QRcode";
import { getBalance, getNftInfo } from "../api/UseCaver";
import * as KlipAPI from "../api/UseKlip";
import { DEFAULT_QR_CODE, DEFAULT_ADDRESS } from "../constants/for_klip";
import LogoKlaytn from "../assets/logo_klaytn.png";
//import { useHistory, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function TicketDetail() {
  const { tid } = useParams();
  console.log(tid);

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

//종가 클레이 가격
const [klayPrice, setKlayPrice] = useState('0');	
//판매승인 확인
//const [saleStatus, setSaleStatus] = useState(false);
//const account = myAddress;
//판매가격
//const [sellPrice, setSellPrice] = useState("0");
//const [inputSellPrice, setInputSellPrice] = useState("");
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
*j/
/*
//판매승인 토글
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
//구매 이벤트
const onClickBuyPriceExe = (tokenId, _sellPrice) => {
  const sellPrice = _sellPrice * 10000000000000000; // 0.01 klay(1klay = 10 ^ 18)
  //alert(sellPrice);//2*10000000000000000 = 20000000000000000

  KlipAPI.buyXPassToken(tokenId, sellPrice, setQrvalue, (result) => {
    alert(JSON.stringify(result));
  });
};
const onClickBuyPrice = (_sellPrice) => {

  setModalProps({
    title: _sellPrice + " klay에 구매하시겠습니까?",
    onConfirm: () => {
      onClickBuyPriceExe(tid, _sellPrice);
    },
  })
  setShowModal(true);

}

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
    const _nfts = await getNftInfo(tid);
      setNfts(_nfts);
    //await getNftInfo(82211);
    //const _saleStatus = await getSaleStatus(myAddress);
    //setSaleStatus(_saleStatus);
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
/*
  //판매가격 가져오기
  const getSellPriceByTid = async () => {
    if (myAddress === DEFAULT_ADDRESS) {
      alert("NO ADDRESS");
      return;
    }

    try {
      const _sellPrice = await getSellPrice(tid);
      console.log(_sellPrice);
      setSellPrice(_sellPrice);

    } catch(error) {
      console.log(error);
    }
  }
*/
  if (myAddress !== DEFAULT_ADDRESS) {
    fetchMyNFTs();
    fetchKlayPrice();
    //getSellPriceByTid();
  }
  
}, [myAddress, tid]);

return (
  <div
    className="container"
    style={{ padding: "0 10px 50px", width: "100%" }}
  >
    <h1>Ticket</h1>
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
    {myAddress !== DEFAULT_ADDRESS ? (
    <Row style={{ textAlign: "right" }}>
      
    </Row>
    ) : null}
    <Row>
      {nfts.map((nft) => 
        (
        <Col style={{ marginRight: 0, paddingRight: 0 }} sm={6} xs={6}>
          <Card>
            <Card.Img src={nft.uri} />
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
          <Row style={{ textAlign: "right" }}>
            <Col>
              <div>
                {nft.sellPrice} Klay
                <button onClick={()=>{onClickBuyPrice(nft.sellPrice)}}>구매하기</button>
              </div>
            </Col>
          </Row>
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
//<button onClick={(e)=>{clickHandler(params, e)}}> Do Something!</button>