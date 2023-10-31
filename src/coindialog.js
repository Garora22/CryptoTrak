import axios from 'axios';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import './coinsdialog.css';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

const CoinDialog = ({Key}) => {
    const [graphdata, setGraphData] = useState([]);
    const [coin, setCoin] = useState([]);
    const [format,setFormat]= useState('24h');

    const formatData = (data) => {
        return data.chart.map((c) => {
            const date = new Date(c[0] * 1000);
            return {
                time: date.toLocaleTimeString(),
                date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
                monthYear: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                datetime: date.toLocaleString(),
                value: c[1],
            };
        });
    };

    useEffect(() => {
        const source = axios.CancelToken.source();  // Create a cancel token

        const fetchgraph = async () => {
            try {
                const response = await axios.get(`https://api.coinstats.app/public/v1/charts?period=${format}&coinId=${Key}`, { cancelToken: source.token });
                const chartData = formatData(response.data);
                setGraphData(chartData);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    console.error(err);
                }
            }
        };

        const fetchcoin = async () => {
            try {
                const data = await axios.get(`https://api.coinstats.app/public/v1/coins/${Key}?currency=USD`, { cancelToken: source.token });
                setCoin(data.data.coin);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    console.error(err);
                }
            }
        };

        fetchcoin();
        fetchgraph();

        return () => {
            source.cancel();  // Cancel the request when the component is unmounted
        };
        // eslint-disable-next-line
    }, [Key, format]);
    let arrow1h, arrow1d, arrow1w;
    let color1h, color1d, color1w;

    if (coin.priceChange1h > 0) {
        arrow1h = <ArrowDropUp style={{ verticalAlign: "middle" }} />;
        color1h = "rgb(60, 203, 65)";
    } else if (coin.priceChange1h < 0) {
        color1h = "red";
        arrow1h = <ArrowDropDown style={{ verticalAlign: "middle" }} />;
    } else {
        color1h = "grey";
    }

    if (coin.priceChange1d > 0) {
        arrow1d = <ArrowDropUp style={{ verticalAlign: "middle" }} />;
        color1d = "rgb(60, 203, 65)";
    } else if (coin.priceChange1d < 0) {
        color1d = "red";
        arrow1d = <ArrowDropDown style={{ verticalAlign: "middle" }} />;
    } else {
        color1d = "grey";
    }

    if (coin.priceChange1w > 0) {
        arrow1w = <ArrowDropUp style={{ verticalAlign: "middle" }} />;
        color1w = "rgb(60, 203, 65)";
    } else if (coin.priceChange1w < 0) {
        color1w = "red";
        arrow1w = <ArrowDropDown style={{ verticalAlign: "middle" }} />;
    } else {
        color1w = "grey";
    }

    const handleOptionClick = (event) => {
        const selectedFormat = event.target.getAttribute('data-value');
        setFormat(selectedFormat);

        document.querySelectorAll('.format-option').forEach(el => el.classList.remove('selected'));
        event.target.classList.add('selected');
    };

    let xAxisKey;
    if (format === '24h') {
        xAxisKey = 'time';
    } else if (['1w', '1m', '3m', '6m', '1y'].includes(format)) {
        xAxisKey = 'date';
    } else if (format === 'all') {
        xAxisKey = 'monthYear';
    }

    let arrow;
    let color;
    if (coin.priceChange1d > 0) {
        arrow = <ArrowDropUp style={{ verticalAlign: "middle" }} />;
        color = "rgb(60, 203, 65)";
    } else if (coin.priceChange1d < 0) {
        color = "red";
        arrow = <ArrowDropDown style={{ verticalAlign: "middle" }} />;
    } else {
        color = "grey";
    }

    return (
        <div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <div style={{display:"flex"}}>
                    <img src={coin.icon}  alt={Key} height={70}/>
                    <span style={{margin:"15px", fontSize:"40px",color:"orange", fontFamily:"cursive"}}>
                        {coin.name} 
                        <span style={{fontSize:"20px", color:"gray", fontFamily:"Montserrat"}}>
                            ({coin.symbol})
                            <span style={{
                                backgroundColor: "#5c5e5e1f", 
                                fontFamily:"fantasy",
                                color: color,
                                padding: '5px',
                                borderRadius: '5px',
                            }}>
                                {arrow} {coin.priceChange1d} %
                            </span>
                        </span>
                    </span>
                </div>
                <div style={{fontFamily:"Montserrat", display:"flex", flexDirection:"column", marginTop:"20px"}} >
                    Price:<span style={{color:color, fontFamily:"cursive"}}> $ {coin.price}</span> 
                </div>
            </div>
            <LineChart width={700} height={450} data={graphdata}>
                <XAxis dataKey={xAxisKey} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip/>} />
                <Line type="monotone" dataKey="value" stroke={color} dot={false} />
            </LineChart>
            <div className="format-selector" onClick={handleOptionClick}>
                <span className="format-option selected" data-value="24h">24H</span>
                <span className="format-option" data-value="1w">1W</span>
                <span className="format-option" data-value="1m">1M</span>
                <span className="format-option" data-value="3m">3M</span>
                <span className="format-option" data-value="6m">6M</span>
                <span className="format-option" data-value="1y">1Y</span>
                <span className="format-option" data-value="all">ALL</span>
            </div>
            <div style={{marginTop:"10px",display:"flex",justifyContent:"space-around"}}>
            <span style={{
                                backgroundColor: "#5c5e5e1f", 
                                fontFamily:"fantasy",
                                color: color1h,
                                padding: '5px',
                                borderRadius: '5px',
                                marginLeft: '10px',
                            }}>
                                1h: {arrow1h} {coin.priceChange1h || 'N/A'} %
                            </span>
                            <span style={{
                                backgroundColor: "#5c5e5e1f", 
                                fontFamily:"fantasy",
                                color: color1d,
                                padding: '5px',
                                borderRadius: '5px',
                                marginLeft: '10px',
                            }}>
                                1d: {arrow1d} {coin.priceChange1d || 'N/A'} %
                            </span>
                            <span style={{
                                backgroundColor: "#5c5e5e1f", 
                                fontFamily:"fantasy",
                                color: color1w,
                                padding: '5px',
                                borderRadius: '5px',
                                marginLeft: '10px',
                            }}>
                                1w: {arrow1w} {coin.priceChange1w || 'N/A'} %
                            </span>
            </div>
            <div>
                <div style={{color: "white", padding: "10px" ,borderRadius: "5px"}}>
                    <p>Website: <a href={coin.websiteUrl}>{coin.websiteUrl}</a></p>
                    <p>Rank: {coin.rank}</p>
                    <p>Volume: {coin.volume}</p>
                    <p>Market Cap: {coin.marketCap}</p>
                    <p>Circulating Supply: {coin.availableSupply}</p>
                    <p>Total Supply: {coin.totalSupply}</p>
                </div>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{backgroundColor: '#000', border: '1px solid #ccc', padding: '10px'}}>
                <p>{`Date & Time: ${payload[0].payload.datetime}`}</p>
                <p>{`Value: $${payload[0].value.toFixed(2)}`}</p>
            </div>
        );
    }

    return null;
};

export default CoinDialog;
