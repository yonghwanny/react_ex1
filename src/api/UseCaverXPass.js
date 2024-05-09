import Caver from "caver-js"
import axios from "axios";
import KIP17ABI from "../abi/SaleXPassTokenABI.json";
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
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
const NFTContract = new caver.contract(KIP17ABI, MARKET_CONTRACT_ADDRESS);

export const fetchCardsOfSale = async (address) => {

  // Fetch Balance
  const balance = await NFTContract.methods.getSaleXPassTokens().call();
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
    nfts.push({ uri: tokenUris[i], id: tokenIds[i], name: tokenName[i], description: tokenDesc[i], attributes: tokenAttr[i] });
  }
  console.log(nfts);
  return nfts;
};
