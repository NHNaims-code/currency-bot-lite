import express from "express";
import cheerio from "cheerio";
import axios from 'axios'

const app = express();
const port = 9000;


app.get("/", (req, res) => {
  res.json({ message: "Hello From Express App"});
});

app.get("/currencies", async(req, res) => {
  

  try {
    const response = await axios.get('https://www.google.com/finance/markets/currencies')

    const dataSet = []

    const $ = cheerio.load(response.data)
    const cheerioData = $('.SxcTic').each( async (index, element) => {

      const $2 = cheerio.load(element)
      const conversion_name = $2('.ZvmM7').text()
      const conversion_rate = $2('.YMlKec').text()
      const conversion_graph = $2('div.NN5r3b > span').attr('aria-label')
      console.log(conversion_name, ' ', conversion_rate, ' ',conversion_graph)

      dataSet.push({conversion_name, conversion_rate, conversion_graph})
    })
    
    res.json({ is_success: true, data: dataSet });
      
  } catch (error) {
    res.json({ is_success: false, data: [] });
  }

});

app.get("/currency-rate", async(req, res) => {
  

  try {

    console.log(req.query)

    const currencyA = req.query.from;
    const currencyB = req.query.to;
    const response = await axios.get(`https://www.google.com/finance/quote/${currencyA}-${currencyB}`)

    const $ = cheerio.load(response.data)
    const today_rate = $('.fxKbKc').text()
    const yesterday_rate = $('.P6K39c').text()

    if(!today_rate || !yesterday_rate) return res.json({ is_success: false, data: [] });
    
    const today = (parseFloat(today_rate) - parseFloat(yesterday_rate)).toFixed(2).toString()

    const data = {}

    data[`${currencyA}_${currencyB}`] = 
      {
        today_rate: parseFloat(today_rate).toFixed(4).toString(),
        yesterday_rate:parseFloat(yesterday_rate).toFixed(4).toString(),
        change: (parseFloat(today_rate) - parseFloat(yesterday_rate)).toFixed(4).toString()
      }
    data[`${currencyB}_${currencyA}`] = 
      {
        today_rate: (1/parseFloat(today_rate)).toFixed(4).toString(),
        yesterday_rate: (1/parseFloat(yesterday_rate)).toFixed(4).toString(),
        change: (-(parseFloat(today_rate) - parseFloat(yesterday_rate))).toFixed(4).toString()
      }

    res.json({ is_success: true, data});
      
  } catch (error) {
    res.json({ is_success: false, data: [] });
  }

});

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
