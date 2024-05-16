import Caver from "caver-js"
import axios from "axios";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import MARKETABI from "../abi/SaleXPassTokenABI.json";
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	NFT_CONTRACT_ADDRESS,
	MARKET_CONTRACT_ADDRESS,
	CHAIN_ID,
} from "../config"

// KAS API 호출 시 필요한 헤더
const option = {
	headers: [
		{
			name: "Authorization",
			value:
				"Basic " +
				Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
		},
		{ name: "x-chain-id", value: CHAIN_ID },
	],
}

// KAS API 사용을 위한 객체 생성
const caver = new Caver(
	new Caver.providers.HttpProvider(
		"https://node-api.klaytnapi.com/v1/klaytn",
		option
	)
)

// 참조 ABI와 스마트컨트랙트 주소를 통해 스마트컨트랙트 연동
const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);
const MarketContract = new caver.contract(MARKETABI, MARKET_CONTRACT_ADDRESS);

export const fetchCardsOf = async (address) => {
	/* 
		NFT 가져오는 방법 (1)
		1. balanceOf 함수 를 사용해서 전체 NFT 개수를 가져온다
		2. 전체 NFT 개수만큼 반복문을 돌면서 tokenOfOwnerByIndex 함수를 이용하여 tokenId를 하나씩 가져오고 tokenIds 배열에 담는다
		3. tokenURI함수 를 이용해 앞에서 담아둔 tokenIds 배열을 돌면서 tokenURI를 하나씩 가져온다 

		NFT 가져오는 방법 (2)
		KAS API 중에 Token 관련 API 사용
		참고: https://refs.klaytnapi.com/ko/th/latest#operation/getNftsByOwnerAddress
	*/

  // Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  console.log(`[NFT Balance]${balance}`);
  // Fetch Token IDs
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    tokenIds.push(id);
  }
  // Fetch Token URIs
  const tokenUris = [];
  const tokenName = [];
	const tokenDesc = [];
	const tokenAttr = [];
	const tokenPrice = [];
  for (let i = 0; i < balance; i++) {
    // const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    // tokenUris.push(uri);

		const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call(); // KAS 메타데이터 response.uri: "https://metadata-store.klaytnapi.com/e2d83vdb-c108-823c-d5f3-69vdf2d871c51/4f9asvf2f5-02d0-5b86-4f99-50acds269c8a.json"
		const response = await axios.get(metadataUrl) // JSON 형식 메타데이터가 들어옴
		const uriJSON = response.data
		console.log(uriJSON);
    tokenUris.push(uriJSON.image);
		tokenName.push(uriJSON.name);
		tokenDesc.push(uriJSON.description);
		tokenAttr.push(uriJSON.attributes);
		const _tokenPrice = await getSellPrice(tokenIds[i]);
		tokenPrice.push(_tokenPrice);
  }
  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i], sellPrice: tokenPrice[i] });
  }
  console.log(nfts);
  return nfts;
};

//tokenID 가 있을경울 해당 정보만 리턴
export const fetchCardsOfTid = async (address, tid) => {
	/* 
		NFT 가져오는 방법 (1)
		1. balanceOf 함수 를 사용해서 전체 NFT 개수를 가져온다
		2. 전체 NFT 개수만큼 반복문을 돌면서 tokenOfOwnerByIndex 함수를 이용하여 tokenId를 하나씩 가져오고 tokenIds 배열에 담는다
		3. tokenURI함수 를 이용해 앞에서 담아둔 tokenIds 배열을 돌면서 tokenURI를 하나씩 가져온다 

		NFT 가져오는 방법 (2)
		KAS API 중에 Token 관련 API 사용
		참고: https://refs.klaytnapi.com/ko/th/latest#operation/getNftsByOwnerAddress
	*/

  // Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  console.log(`[NFT Balance]${balance}`);
  // Fetch Token IDs
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
		//if(id === tid) {
			tokenIds.push(id);
		//}

  }
  // Fetch Token URIs
  const tokenUris = [];
  const tokenName = [];
	const tokenDesc = [];
	const tokenAttr = [];
  for (let i = 0; i < balance; i++) {
    // const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    // tokenUris.push(uri);

		const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call(); // KAS 메타데이터 response.uri: "https://metadata-store.klaytnapi.com/e2d83vdb-c108-823c-d5f3-69vdf2d871c51/4f9asvf2f5-02d0-5b86-4f99-50acds269c8a.json"
		const response = await axios.get(metadataUrl) // JSON 형식 메타데이터가 들어옴
		const uriJSON = response.data
		console.log(uriJSON);
    tokenUris.push(uriJSON.image);
		tokenName.push(uriJSON.name);
		tokenDesc.push(uriJSON.description);
		tokenAttr.push(uriJSON.attributes);
  }
  const nfts = [];
  for (let i = 0; i < balance; i++) {
		if(tokenIds[i] === tid) {
			nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i] });
		}
    //nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i] });
  }
  console.log(nfts);
  return nfts;
};
//판매등록된 NFT만 추출
export const fetchCardsOfSale = async () => {
	/*
		struct XPassTokenData {
        uint tokenId;
        uint tokenPrice;
    }
	*/
  //  xPassTokens[i] = XPassTokenData(tokenId, tokenPrice);
  const balance = await MarketContract.methods.getSaleXPassTokens().call();
  console.log(`[NFT Balance]${balance}`);
 
  const tokenIds = [];
  //for (let i = 0; i < balance.length; i++) {
  //  const id = balance[i][0];
	//	tokenIds.push(id);
  //}
  // Fetch Token URIs
  const tokenUris = [];
  const tokenName = [];
	const tokenDesc = [];
	const tokenAttr = [];
	const tokenPrice = [];
  for (let i = 0; i < balance.length; i++) {
		tokenIds[i] = balance[i][0];
		tokenPrice[i] = balance[i][1];
		const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call();
		const response = await axios.get(metadataUrl) // JSON 형식 메타데이터가 들어옴
		const uriJSON = response.data
		console.log(uriJSON);
    tokenUris.push(uriJSON.image);
		tokenName.push(uriJSON.name);
		tokenDesc.push(uriJSON.description);
		tokenAttr.push(uriJSON.attributes);
		tokenPrice.push(tokenPrice[i]);
  }
  const nfts = [];
  for (let i = 0; i < balance.length; i++) {
		//if(tokenIds[i] === tid) {
			nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i], sellPrice: tokenPrice[i] });
		//}
    //nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i] });
  }
  console.log(nfts);
  return nfts;
	
};

// 클레이 지갑의 잔고 조회하기
export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
		//16진수 response를 숫자로 바꾸고, PEB단위에서 KLAY단위로 변환
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};

// NFT 상세정보
export const getNftInfo = async (tid) => {
	const metadataUrl = await NFTContract.methods.tokenURI(tid).call(); // KAS 메타데이터 response.uri: "https://metadata-store.klaytnapi.com/e2d83vdb-c108-823c-d5f3-69vdf2d871c51/4f9asvf2f5-02d0-5b86-4f99-50acds269c8a.json"
	const response = await axios.get(metadataUrl) // JSON 형식 메타데이터가 들어옴
	const uriJSON = response.data
	console.log(uriJSON);

  const tokenUris = uriJSON.image;
	const tokenName = uriJSON.name;
	const tokenDesc = uriJSON.description;
	const tokenAttr = uriJSON.attributes;
	const tokenPrice = await getSellPrice(tid);

	//console.log(tokenAttr);

	const nftInfo = [];
	nftInfo.push({uri: tokenUris, id: tid, name: tokenName, description: tokenDesc, attributes: tokenAttr, sellPrice: tokenPrice});
	
	return nftInfo;

}

//판매승인 여부 확인
export const getSaleStatus = async (account) => {
	try {
		if (!account || !NFTContract) return;

		const response = await NFTContract.methods
			.isApprovedForAll(account, MARKET_CONTRACT_ADDRESS)
			.call();

		console.log(response);

		return response;
	} catch (error) {
		console.error(error);
	}
}

//판매가격정보 확인
export const getSellPrice = async (tid) => {
	try {
		if (!tid || !MARKET_CONTRACT_ADDRESS) return;

		const response = await MarketContract.methods.getXPassTokenInfo(tid).call();
		console.log(response);

		return response;
		
	} catch (error) {
		console.error(error);
	}
}