import React from 'react';
import { Navbar , Nav , Container, Form} from 'react-bootstrap';
import axios from 'axios'
import {BACKEND_PORT} from './index'
import {Pie} from 'react-chartjs-2';

import './App.css';
const allColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];
const options = {
  title: {
    display: true,
    text: 'Top Categories'
  },
  legend: {
    display: true,
    position : 'bottom'
  }
}
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      startDate: new Date(),
      chartData : null
    }
  }
  
 handleChange  = (e) => {
   if(this.state.startDate !== e.target.value){ 
        let date = e.target.value
        this.setState({ startDate : date})
        this.getProductCategories(date)
   }
 }

 getProductCategories = (date) => {
    axios.get(`http://localhost:${BACKEND_PORT}/get-product-categories?date=${date}`)
    .then((response) => {
      let productData = response.data.data;
      if(productData.length > 0)
        this.renderChart(productData)
    })
    .catch(err=>console.log(err))
 }

 renderChart = (productData) => {
    let labels = productData.map((val,idx) => {
      return val.category;
    })
    let data = productData.map((val,idx) => {
      return val.count;
    })
    const chartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: allColors.slice(0,productData.length),
        hoverBackgroundColor: allColors.slice(0,productData.length),
      }]
    };
    this.setState({chartData})
   
 }
  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand  href="/">Products Review</Navbar.Brand>
            <Nav className="mr-auto"> <Nav.Link href="#home">Home</Nav.Link></Nav>
        </Navbar>
        <Container  style={{minHeight:'100vh'}}>
          <Form style={{marginTop:25}}>
          <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" defaultValue={new Date(this.state.startDate).toISOString().substr(0,10)}  required onChange={this.handleChange}/>
          </Form>
          {this.state.chartData && <Pie data={this.state.chartData}  options={options}/>}
        </Container>
      </div>
    );
  }
}
export default App;
