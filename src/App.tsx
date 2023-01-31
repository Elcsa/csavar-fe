import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { idText } from 'typescript';
import { ftruncateSync } from 'fs';
import Popup from 'reactjs-popup';


interface State{
  postTipus:string,
  postKeszlet:number,
  postHosz:number,
  postAr:number,
  csavarok:Csavar[]
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
      csavarok:[]
    }
  }
  addtoDB=async()=>{
    const{postTipus,postKeszlet,postHosz,postAr}=this.state
    let csavar={
      "tipus":postTipus,
      "hosz":postHosz,
      "keszlet":postKeszlet,
      "ar":postAr
    };
    let response=await fetch("http://localhost:3000/csavar",{
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
    popUprendeles=async(id:number)=>{

    }
    render(){
      const{postTipus,postKeszlet,postHosz,postAr}=this.state
      const PopupExample=()=>(<Popup trigger={<button>trigger</button>}position="right center">
        <div>Popup content here</div>
      </Popup>)
      return<div>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  }
}
export default App;
