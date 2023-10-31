import axios from "axios";
import { useEffect, useState } from "react";
import './SearchNFT.css';  // Assuming you have a CSS file named SearchNFT.css in the same directory

const SearchNFT = ({Key}) => {
    const [nftData, setNftData] = useState(null);

    const fetchNFTData = async () => {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/nfts/${Key}`);
            setNftData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNFTData();
        // eslint-disable-next-line
    }, [Key]);

    return (
        <div className="nft-container">
            {nftData && (
                <div className="nft-card">
                    <div className="nft-header">
                        <img src={nftData.image.small} alt={nftData.name} className="nft-image"/>
                        <div className="nft-title">
                            <h1>{nftData.name}</h1>
                            <p>({nftData.symbol})</p>
                        </div>
                    </div>

                    <div className="nft-info">
                        <p>Floor Price: {nftData.floor_price.usd} USD</p>
                        <p>Market Cap: {nftData.market_cap.usd} USD</p>
                        <p>Total Supply: {nftData.total_supply}</p>
                        <p>Number of Unique Addresses: {nftData.number_of_unique_addresses}</p>
                        <p>Description: {nftData.description}</p>
                        <p>Contract Address: {nftData.contract_address}</p>
                        <p>Asset Platform ID: {nftData.asset_platform_id}</p>
                        <p>Native Currency: {nftData.native_currency}</p>
                        <p>Explorer links:</p>
                        {nftData.explorers.map((explorer, index) => (
                            <a key={index} href={explorer.link} target="_blank" rel="noreferrer" className="nft-link">{explorer.name}</a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchNFT;
