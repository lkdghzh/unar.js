import Listener from "./listener"
export default class Hub{
    constructor(){
        this.id=0;
        this.listeners=[]
    }
    addListener(){
        this.listeners.push(new Listener())
    }
    deleteListener(){
        
    }
}