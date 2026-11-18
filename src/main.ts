import {desk,duration} from "@shared/desk";
import {wrap} from "@shared/surface";
type S={target:number;start:number;paused:number;laps:number[];index:number};
desk<S>({name:"Split Reel",accent:"#ED8B86",motion:{"motif":"stations","color":"#ED8B86","shine":"#FFF0DB"},initial:()=>({target:60,start:0,paused:0,laps:[],index:0}),
render:(s,now)=>{
 const last=s.laps[s.index],live=s.start?now-s.start+s.paused:s.paused;
 return {title:s.start?"Current lap":s.laps.length?"Split review":"Target split",value:s.start?duration(live):s.laps.length?duration(last):duration(s.target*1000),
 lines:["Target "+duration(s.target*1000),s.laps.length?"Split "+(s.index+1)+": "+duration(last):"No splits yet",
 last!==undefined?"Delta "+((last/1000-s.target)>=0?"+":"")+(last/1000-s.target).toFixed(1)+"s":"Wheel: adjust target",
 "Click: start / mark split","Start: pause / resume","Hold Start: new session"]};},
action:(s,k,now)=>{
 if(k==="hold-start"){s.start=0;s.paused=0;s.laps=[];s.index=0;}
 if(k==="ok"){if(s.start){s.laps.push(Math.max(0,now-s.start)+s.paused);s.laps=s.laps.slice(-20);s.index=s.laps.length-1;}s.start=now;s.paused=0;}
 if(k==="start"){if(s.start){s.paused+=Math.max(0,now-s.start);s.start=0;}else s.start=now;}
 if(k==="up"||k==="down"){const d=k==="up"?1:-1;if(s.laps.length)s.index=wrap(s.index+d,s.laps.length);else if(!s.start)s.target=Math.max(5,Math.min(7200,s.target+d*5));}
},ticking:s=>Boolean(s.start)});
