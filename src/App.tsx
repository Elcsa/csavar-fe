import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { ftruncateSync } from 'fs';
import { throws } from 'assert';

interface State{
  postTipus:string,
  postKeszlet:number,
  postHosz:number,
  postAr:number,
  csavarok:Csavar[]
  show:boolean;
  selectedItem:Csavar
  rendelesDarab:number;
  rendelesDarabmax:number;
  rendelesDarabMin:number
}
interface Csavar{
  id:number,
  tipus:string,
  hosz:number,
  keszlet:number,
  ar:number,
}
interface CsavarResponse{
  csavarok:Csavar[]
}
class App extends React.Component<{},State>{
  constructor(props:{}){
    super(props)
    this.state={
      postTipus:"",
      postKeszlet:0,
      postHosz:0,
      postAr:0,
      csavarok:[],
      show: false,
      rendelesDarab:0,
      rendelesDarabmax:0,
      rendelesDarabMin:0,

      selectedItem:{id:-1,tipus:"",hosz:0,keszlet:0,ar:0}
    }
  }
  toggle=()=>this.setState((currentState)=>({show:!currentState.show}));
  addtoDB=async()=>{
    const{postTipus,postKeszlet,postHosz,postAr}=this.state
    let csavar={
      "tipus":postTipus,
      "hosz":postHosz,
      "keszlet":postKeszlet,
      "ar":postAr
    };
    let response = await fetch("http://localhost:3000/csavar",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(csavar)
    })
    this.loadData()
  }
  loadData=async()=>{
    let response =await fetch("http://localhost:3000/csavar/")
    let data=await response.json()as CsavarResponse
    this.setState({
      csavarok:data.csavarok
    })
    }
    componentDidMount(): void {
      this.loadData()
    }
    deleteFromData=async(id:number)=>{
      await fetch('http://localhost:3000/csavar/'+id,{
        method:'DELETE'
      })
      this.loadData()
    }
    handleClick=(item:Csavar)=>{
      this.setState({
        selectedItem:item,
        show:true
      })
    }
    resetDisplay=()=>{
      this.setState({
        rendelesDarab:0,
        show:false,
        selectedItem:{id:-1,tipus:"",hosz:0,keszlet:0,ar:0}
      })
    }
    megrendel=async(id:number)=>{
      let rendeltdarabszam={
        "db":this.state.rendelesDarab
      }
      let url="http://localhost:3000csavar/"+id+"/rendeles"
      let response=await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(rendeltdarabszam)
      })
      this.resetDisplay()
      this.loadData()
    }

    render(){
      const{postTipus,postKeszlet,postHosz,postAr}=this.state
      
      return<div>
        <div className='container'>
          <div className='row justify-content-center'>
          <div className="col-sm-4 text-center">
            csavar tipusa:<br/><input type="text" value={postTipus} onChange={e=>this.setState({postTipus:e.currentTarget.value})}/>

          </div>
          </div>
          <div className='row justify-content-center'>
            <div className="col-sm-4 text-center">
              csavar hosza mm:<br/><input type="number" min={0} value={postHosz} onChange={e=>this.setState({postHosz:parseInt(e.currentTarget.value)})}/>

            </div>
          </div>
          <div className='row justify-content-center'>
            <div className="col-sm-4 text-center">
              keszlet (db):<br/><input type="number" min={0} value={postKeszlet} onChange={e=>this.setState({postKeszlet:parseInt(e.currentTarget.value)})}/>

            </div>
          </div>
          <div className='row justify-content-center'>
            <div className="col-sm-4 text-center">
              ar(ft):<br/><input type="number" min={1} value={postAr} onChange={e=>this.setState({postAr:parseFloat(e.currentTarget.value)})}/>

            </div>
          </div>
          <div className='row justify-content-center mt-3'>
          <div className="col text-center">
            <button className='btn btn-secondary' onClick={this.addtoDB}>felvesz</button><br/>

          </div>
          </div>
          <div className='row justify-content-center mt-3'>
            <div className="col text-center">
              <p className='text-danger'>{}</p>
            </div>
          </div>
        </div>
        {this.state.show && <div className='row justify-content-center pt-3 pb-3'>
        <div className="col text-center">
          <h2>biztoss megrendeled ezt a csavart? <strong>{this.state.selectedItem.tipus}</strong></h2>
          <input type="number" name="db" value={this.state.rendelesDarab} onChange={e =>this.setState({rendelesDarab:parseInt(e.currentTarget.value)})}/>db<br/>
          <button onClick={()=>this.megrendel(this.state.selectedItem.id)}className='btn btn-success mt-2'>Megrendel</button>
          <br/>
          <button onClick={this.toggle} className='btn btn-danger mt-2'>megse</button>
          </div>
        </div>}



        <div className='row'>
          {this.state.csavarok.map(item=>(
            <div className='col-md-4'>
              <div className="card text-center">
                <div className="card-body">
                  tipus:{item.tipus}<br/>
                  hosz:{item.hosz}mm <br/>
                  keszlet:{item.keszlet}db <br/>
                  ar:{item.ar}ft
                </div>
                <div className='card-footer'>
                  <button onClick={(event)=>this.deleteFromData(item.id)}>torles</button>
                  <button onClick={(event)=> this.handleClick(item)}>rendel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  }

export default App;
