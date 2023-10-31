import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Tooltip, XAxis, YAxis, Line } from "recharts";

const SearchExc = ({Key}) => {
    const [graphdata, setGraphData] = useState([]);
    const [coin, setCoin] = useState([]);


    const fetchgraph = async () => {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${Key}/volume_chart?days=7`);
            const chartData = formatData(response.data);
            setGraphData(chartData);
            console.log(chartData);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchexc = async () => {
        try {
            const data = await axios.get(`https://api.coingecko.com/api/v3/exchanges/${Key}
            `);
            setCoin(data.data);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                console.error(err);
            }
        }
    };

    const formatData = (data) => {
        return data.map((c) => {
            const date = new Date(c[0]);
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
        fetchgraph();
        fetchexc();
        // eslint-disable-next-line
    }, [Key]);

    return(
        <div>
<div style={{display:"flex", justifyContent:"space-between"}}>
                <div style={{display:"flex"}}>
                <img src={coin.image}  alt={Key} height={70}/>
                <span style={{margin:"15px", fontSize:"40px",color:"orange", fontFamily:"cursive"}}>{coin.name} <span style={{fontSize:"20px", color:"Green", fontFamily:"cursive"}}>({coin.trust_score})</span></span>
            </div>
            <div style={{fontFamily:"Montserrat", display:"flex", flexDirection:"column", marginTop:"20px"}} >
                Volume:<span style={{color:"white", fontFamily:"cursive"}}> $ {coin.trade_volume_24h_btc_normalized}</span> 
            </div>
            </div>
            
            <LineChart width={700} height={450} data={graphdata}>
                <XAxis dataKey="datetime" />
                <YAxis scale="log" domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip/>} />
                <Line type="monotone" dataKey="value" stroke={"whitesmoke"} dot={false} />
            </LineChart>
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{backgroundColor: '#000', border: '1px solid #ccc', padding: '10px'}}>
                <p>{`Date & Time: ${payload[0].payload.datetime}`}</p>
                <p>{`Value: ${Number(payload[0].value).toFixed(2)}`}</p>
            </div>
        );
    }

    return null;
};
export default SearchExc;
