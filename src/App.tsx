import { useState, useEffect } from "react";

const P={bg0:"#16120F",bg1:"#1E1A16",bg2:"#252019",bg3:"#2D2620",bg4:"#362E25",ember:"#C4471A",emberDim:"#C4471A22",wood:"#8B5A2B",cream:"#EEE4D0",muted:"#A0897A",faint:"#6B574C",div:"#2D2620",olive:"#5E7D45",amber:"#B8752A",amberDim:"#B8752A22"};
const SENS={low:P.olive,moderate:P.amber,high:P.ember};
const CONS={consistent:P.olive,moderate:P.amber,variable:P.ember};
const PHASE={prep:P.faint,cook:P.cream,pull:P.ember,rest:P.olive,serve:P.amber};

const WOOD={
  charcoal:[{id:"post_oak",label:"Post Oak",note:"The Texas standard. Clean, medium smoke."},{id:"hickory",label:"Hickory",note:"Bold and assertive. Classic for pork and ribs."},{id:"apple",label:"Apple",note:"Mild and slightly sweet. Great for poultry and pork."},{id:"cherry",label:"Cherry",note:"Mild, fruity, adds deep color."},{id:"pecan",label:"Pecan",note:"Nutty and mild. A softer alternative to hickory."},{id:"mesquite",label:"Mesquite",note:"Intense and earthy. Best for hot and fast cooks."},{id:"maple",label:"Maple",note:"Subtle and sweet. Good for poultry."},{id:"alder",label:"Alder",note:"Delicate and clean. Classic for fish."}],
  wood:[{id:"post_oak",label:"Post Oak",note:"The Texas standard. Clean, medium smoke."},{id:"hickory",label:"Hickory",note:"Bold and assertive. Classic for pork and ribs."},{id:"pecan",label:"Pecan",note:"Nutty and mild. Softer than hickory."},{id:"mesquite",label:"Mesquite",note:"Intense and earthy. Best for shorter cooks."},{id:"cherry",label:"Cherry",note:"Fruity and mild. Adds color."},{id:"apple",label:"Apple",note:"Light and sweet. Good for poultry and pork."},{id:"mixed",label:"Mixed Split Wood",note:"Oak-forward blends are most versatile."}],
  pellets:[{id:"signature",label:"Signature Blend",note:"Hickory, maple, cherry mix. Versatile."},{id:"hickory_p",label:"Hickory",note:"Bold smoke. Classic for pork and brisket."},{id:"apple_p",label:"Apple",note:"Mild and sweet. Great for poultry and pork."},{id:"oak_p",label:"Oak",note:"Clean, medium smoke. A reliable all-rounder."},{id:"cherry_p",label:"Cherry",note:"Mild with good color. Works on almost anything."},{id:"competition",label:"Competition Blend",note:"Oak, hickory, cherry. Bold and well-rounded."}],
};
const FUEL_WOOD_MAP={"Wood Pellets":"pellets","Wood / Charcoal":"wood","Charcoal / Wood Chunks":"charcoal","Charcoal":"charcoal","Propane / Natural Gas":null};
const PREP_TYPES=[{id:"dry_rub",label:"Dry Rub"},{id:"dry_brine",label:"Dry Brine"},{id:"wet_brine",label:"Wet Brine"},{id:"injection",label:"Injection"},{id:"marinade",label:"Marinade"},{id:"binder_rub",label:"Binder and Rub"}];
const CUT_PREPS={
  brisket_packer:[{type:"dry_rub",label:"SPG",timing:"1 hr before"},{type:"dry_rub",label:"Coffee rub",timing:"1 hr before"},{type:"dry_brine",label:"Kosher salt only",timing:"12 to 24 hrs ahead"}],
  brisket_flat:[{type:"dry_rub",label:"SPG",timing:"1 hr before"},{type:"dry_brine",label:"Kosher salt",timing:"12 hrs ahead"}],
  pork_shoulder:[{type:"binder_rub",label:"Mustard binder and brown sugar rub",timing:"Night before"},{type:"injection",label:"Apple juice and butter injection",timing:"Before cook"},{type:"dry_brine",label:"Salt overnight",timing:"12 to 24 hrs ahead"}],
  spare_ribs:[{type:"dry_rub",label:"Brown sugar rub",timing:"2 hrs before"},{type:"dry_rub",label:"Memphis dry rub",timing:"2 hrs before"}],
  baby_back:[{type:"dry_rub",label:"Sweet smoky rub",timing:"2 hrs before"},{type:"dry_rub",label:"SPG and paprika",timing:"1 hr before"}],
  whole_chicken:[{type:"dry_brine",label:"Kosher salt uncovered overnight",timing:"Night before"},{type:"marinade",label:"Buttermilk marinade",timing:"4 to 8 hrs ahead"}],
  chicken_thighs:[{type:"dry_brine",label:"Kosher salt and pepper",timing:"2 to 4 hrs ahead"},{type:"marinade",label:"Soy garlic ginger",timing:"2 to 4 hrs ahead"}],
  prime_rib:[{type:"dry_brine",label:"Kosher salt uncovered",timing:"24 to 48 hrs ahead"},{type:"dry_rub",label:"Herb crust",timing:"1 hr before"}],
  beef_tenderloin:[{type:"dry_rub",label:"SPG and herbs",timing:"1 hr before"},{type:"marinade",label:"Garlic butter rub",timing:"30 min before"}],
  tomahawk:[{type:"dry_brine",label:"Coarse salt only",timing:"24 hrs ahead"},{type:"dry_rub",label:"SPG",timing:"1 hr before"}],
  ribeye:[{type:"dry_rub",label:"SPG",timing:"45 min before"},{type:"dry_brine",label:"Coarse salt",timing:"45 min or overnight"}],
  flank_steak:[{type:"marinade",label:"Soy lime garlic marinade",timing:"2 to 4 hrs ahead"},{type:"dry_rub",label:"Cumin dry rub",timing:"30 min before"}],
  tri_tip:[{type:"dry_rub",label:"Santa Maria rub",timing:"1 hr before"},{type:"marinade",label:"Red wine and herb marinade",timing:"4 hrs ahead"}],
  pork_tenderloin:[{type:"marinade",label:"Garlic and herb",timing:"2 to 4 hrs ahead"},{type:"dry_rub",label:"SPG and paprika",timing:"30 min before"}],
};
const COOKER_TYPES=[
  {id:"pellet",icon:"P",label:"Pellet Smoker",desc:"Wood pellet-fed, digitally controlled.",fuel:"Wood Pellets",traits:{tempMod:1.0,weatherSensitivity:"low",heatConsistency:"consistent"},planningNotes:["Holds temp within 10F automatically","Smoke flavor lighter than wood or charcoal","Little adjustment needed during the cook"],models:[{id:"traeger_pro780",label:"Traeger Pro 780",area:780,tempRange:"165-500F",note:"Reliable workhorse, app-connected"},{id:"traeger_timberline",label:"Traeger Timberline XL",area:1320,tempRange:"165-500F",note:"Super Smoke mode at low temps"},{id:"recteq_700",label:"Recteq RT-700",area:702,tempRange:"180-500F",note:"Runs very consistent"},{id:"camp_woodwind",label:"Camp Chef Woodwind Pro",area:811,tempRange:"160-500F",note:"Sidekick burner for searing"},{id:"pitboss_1150",label:"Pit Boss 1150",area:1150,tempRange:"180-500F",note:"Budget-friendly, large capacity"}]},
  {id:"offset",icon:"O",label:"Offset Smoker",desc:"Firebox beside the chamber. Most hands-on.",fuel:"Wood / Charcoal",traits:{tempMod:1.18,weatherSensitivity:"high",heatConsistency:"variable"},planningNotes:["Wind and cold can add 30 to 60 min to your cook","Hot side near firebox runs 25 to 40F hotter","Tend the fire every 45 to 60 min"],models:[{id:"oklahoma_highland",label:"Oklahoma Joe Highland",area:619,tempRange:"200-350F",note:"Entry-level, needs some mods"},{id:"old_country_pecos",label:"Old Country Pecos",area:1500,tempRange:"200-350F",note:"Heavy steel, holds temp well"},{id:"lang_36",label:"Lang 36 Deluxe",area:576,tempRange:"200-300F",note:"Reverse flow, more even heat"},{id:"yoder_640",label:"Yoder Wichita",area:638,tempRange:"200-350F",note:"Competition-grade, thick steel"}]},
  {id:"kamado",icon:"K",label:"Kamado / Ceramic",desc:"Ceramic egg-style. Charcoal. Extremely efficient.",fuel:"Charcoal / Wood Chunks",traits:{tempMod:0.92,weatherSensitivity:"low",heatConsistency:"consistent"},planningNotes:["Ceramic retains heat, runs 8 to 10 percent faster","Barely affected by wind or cold","Stalls tend to be shorter"],models:[{id:"bge_large",label:"Big Green Egg Large",area:262,tempRange:"200-750F",note:"The original. Huge aftermarket support"},{id:"bge_xl",label:"Big Green Egg XL",area:452,tempRange:"200-750F",note:"Full packer brisket fits flat"},{id:"kamado_joe_classic",label:"Kamado Joe Classic III",area:256,tempRange:"225-750F",note:"Divide and Conquer system included"},{id:"kamado_joe_big",label:"Kamado Joe Big Joe III",area:406,tempRange:"225-750F",note:"Larger cook surface, same control"},{id:"primo_oval",label:"Primo Oval XL",area:400,tempRange:"200-700F",note:"Oval shape fits two-zone better"}]},
  {id:"pit_barrel",icon:"B",label:"Pit Barrel / Drum",desc:"Vertical drum. Charcoal. Nearly foolproof.",fuel:"Charcoal / Wood Chunks",traits:{tempMod:0.88,weatherSensitivity:"low",heatConsistency:"moderate"},planningNotes:["Runs hotter at 275 to 310F, cooks faster","No temp dial, coal load controls heat","Vertical hang produces exceptional bark"],models:[{id:"pit_barrel_classic",label:"Pit Barrel Cooker Classic",area:null,tempRange:"270-310F",note:"30-gal drum, hooks included"},{id:"gateway_drum",label:"Gateway Drum Smoker 55",area:null,tempRange:"225-325F",note:"Competition favorite, precise vents"},{id:"hunsaker_drum",label:"Hunsaker Vortex Drum",area:null,tempRange:"225-325F",note:"Vortex firebox, very even heat"}]},
  {id:"kettle",icon:"W",label:"Kettle Grill",desc:"Classic charcoal grill. Smoke with indirect setup.",fuel:"Charcoal / Wood Chunks",traits:{tempMod:1.08,weatherSensitivity:"moderate",heatConsistency:"variable"},planningNotes:["Use snake or fuse method for low and slow","Requires a water pan to maintain moisture","Wind affects vent control"],models:[{id:"weber_kettle_22",label:"Weber Original Kettle 22in",area:363,tempRange:"225-450F",note:"The classic. Works great with mods"},{id:"weber_kettle_26",label:"Weber Master Touch 26in",area:508,tempRange:"225-450F",note:"Larger for bigger cooks"},{id:"pk_360",label:"PK Grills PK360",area:360,tempRange:"225-500F",note:"Four-vent precision control"}]},
  {id:"gas",icon:"G",label:"Gas Grill",desc:"Propane or natural gas. Fast heat, easy control.",fuel:"Propane / Natural Gas",traits:{tempMod:0.95,weatherSensitivity:"low",heatConsistency:"consistent"},planningNotes:["Use a smoker box for wood smoke","Indirect setup: one side on, meat on the other","Smoke penetration is lighter than charcoal"],models:[{id:"weber_genesis",label:"Weber Genesis E-335",area:513,tempRange:"300-500F",note:"3-burner, reliable indirect zone"},{id:"weber_spirit",label:"Weber Spirit II E-310",area:424,tempRange:"300-500F",note:"Compact 3-burner entry gas"},{id:"napoleon_prestige",label:"Napoleon Prestige 500",area:500,tempRange:"300-700F",note:"Infrared rear burner for rotisserie"}]},
];
const CUTS=[
  {id:"brisket_packer",label:"Brisket - Full Packer",cat:"Beef",yield:0.60,base:75,defaultCook:225,defaultTarget:203,restMin:120,restMax:240},
  {id:"brisket_flat",label:"Brisket - Flat Only",cat:"Beef",yield:0.65,base:70,defaultCook:225,defaultTarget:203,restMin:60,restMax:120},
  {id:"chuck_roast",label:"Chuck Roast",cat:"Beef",yield:0.68,base:65,defaultCook:250,defaultTarget:205,restMin:30,restMax:60},
  {id:"short_ribs",label:"Short Ribs",cat:"Beef",yield:0.72,base:60,defaultCook:250,defaultTarget:200,restMin:30,restMax:60},
  {id:"prime_rib",label:"Prime Rib - Standing Rib Roast",cat:"Beef",yield:0.75,base:15,defaultCook:250,defaultTarget:130,restMin:30,restMax:45},
  {id:"beef_tenderloin",label:"Beef Tenderloin - Whole",cat:"Beef",yield:0.90,base:10,defaultCook:250,defaultTarget:130,restMin:15,restMax:20},
  {id:"tomahawk",label:"Tomahawk Ribeye",cat:"Beef",yield:0.88,base:12,defaultCook:250,defaultTarget:130,restMin:10,restMax:15},
  {id:"ribeye",label:"Ribeye Steak",cat:"Beef",yield:0.92,base:10,defaultCook:275,defaultTarget:130,restMin:5,restMax:10},
  {id:"flank_steak",label:"Flank Steak",cat:"Beef",yield:0.93,base:8,defaultCook:275,defaultTarget:135,restMin:5,restMax:10},
  {id:"tri_tip",label:"Tri-Tip",cat:"Beef",yield:0.88,base:12,defaultCook:250,defaultTarget:130,restMin:10,restMax:20},
  {id:"pork_shoulder",label:"Pork Shoulder - Boston Butt",cat:"Pork",yield:0.65,base:75,defaultCook:225,defaultTarget:205,restMin:60,restMax:120},
  {id:"spare_ribs",label:"Spare Ribs",cat:"Pork",yield:0.75,base:55,defaultCook:235,defaultTarget:195,restMin:15,restMax:30},
  {id:"baby_back",label:"Baby Back Ribs",cat:"Pork",yield:0.78,base:45,defaultCook:235,defaultTarget:195,restMin:10,restMax:20},
  {id:"pork_tenderloin",label:"Pork Tenderloin",cat:"Pork",yield:0.90,base:30,defaultCook:275,defaultTarget:145,restMin:10,restMax:15},
  {id:"whole_chicken",label:"Whole Chicken",cat:"Poultry",yield:0.80,base:35,defaultCook:275,defaultTarget:165,restMin:10,restMax:15},
  {id:"chicken_thighs",label:"Chicken Thighs",cat:"Poultry",yield:0.82,base:28,defaultCook:275,defaultTarget:175,restMin:5,restMax:10},
  {id:"leg_of_lamb",label:"Leg of Lamb",cat:"Lamb",yield:0.70,base:50,defaultCook:250,defaultTarget:145,restMin:20,restMax:40},
  {id:"salmon",label:"Salmon - Plank Smoked",cat:"Other",yield:0.88,base:25,defaultCook:225,defaultTarget:145,restMin:5,restMax:10},
];
const INIT_COOKS=[
  {id:1,cut:"Brisket - Full Packer",date:"Mar 22, 2026",rating:5,weight:16,cooker:"Big Green Egg Large",cookerTypeId:"kamado",notes:"Best bark yet. 16 hrs total.",wentWell:"Bark was perfect, smoke ring deep.",changeNextTime:"Rest longer next time, sliced a little too soon.",onTrack:"On track",wood:"post_oak",estimatedMins:810,actualMins:795,pullTempTarget:203,pullTempActual:203},
  {id:2,cut:"Pork Shoulder - Boston Butt",date:"Mar 8, 2026",rating:3,weight:10,cooker:"Traeger Pro 780",cookerTypeId:"pellet",notes:"A little dry.",wentWell:"Good smoke ring.",changeNextTime:"Pull earlier and rest longer.",onTrack:"Ran long",wood:"hickory_p",estimatedMins:540,actualMins:620,pullTempTarget:205,pullTempActual:208},
  {id:3,cut:"Baby Back Ribs",date:"Feb 29, 2026",rating:3,weight:6,cooker:"Weber Original Kettle 22in",cookerTypeId:"kettle",notes:"A little dry on the ends.",wentWell:"Good color and pull-back on the bones.",changeNextTime:"Wrap 30 min earlier.",onTrack:"On track",wood:"apple",estimatedMins:270,actualMins:265,pullTempTarget:195,pullTempActual:193},
  {id:4,cut:"Whole Chicken",date:"Feb 14, 2026",rating:5,weight:5,cooker:"Big Green Egg Large",cookerTypeId:"kamado",notes:"Spatchcock. Crispy skin, 275F.",wentWell:"Crispy skin, juicy throughout.",changeNextTime:"Nothing, repeat this exactly.",onTrack:"On track",wood:"cherry",estimatedMins:110,actualMins:105,pullTempTarget:165,pullTempActual:165},
];
const INIT_PLANNED=[
  {id:"p1",cut:"Brisket - Full Packer",cookDate:"Apr 19, 2026",serveTime:"18:00",weight:15,cooker:"Big Green Egg Large",cookerTypeId:"kamado",cookerTempMod:0.92,startTempAdj:15,wrapAdj:0,estimatedCookMins:810,restMin:120,restMax:240,targetTemp:203,cookTemp:225,fuel:"Charcoal / Wood Chunks",wood:"post_oak",guests:10},
];
const INIT_COOKERS=[
  {id:"traeger_pro780",label:"Traeger Pro 780",typeId:"pellet",type:"Pellet Smoker",fuel:"Wood Pellets",icon:"P",nickname:""},
  {id:"bge_large",label:"Big Green Egg Large",typeId:"kamado",type:"Kamado / Ceramic",fuel:"Charcoal / Wood Chunks",icon:"K",nickname:"The Egg"},
];
const RECIPES=[
  {id:1,title:"Aaron Franklin-Style Brisket",cut:"Brisket",method:"Offset",time:"12-16 hrs",liked:true},
  {id:2,title:"Competition Pork Butt",cut:"Pork Shoulder",method:"Pellet Smoker",time:"10-14 hrs",liked:true},
  {id:3,title:"3-2-1 Spare Ribs",cut:"Spare Ribs",method:"Any",time:"6 hrs",liked:false},
  {id:4,title:"Spatchcock Chicken",cut:"Whole Chicken",method:"Ceramic",time:"1.5-2 hrs",liked:false},
];
const PLAN_STEPS=["cut","qty","cooker","params","results","summary"];
const PLAN_STEP_LABELS=["Cut","Quantity","Cooker","Fire and Temp","Estimate","Summary"];

// ─── USDA ──────────────────────────────────────────────────────────────────────
function getUsdaInfo(cutId){
  if(["whole_chicken","chicken_thighs"].includes(cutId)) return{temp:165,label:"Poultry",note:"165F minimum for all poultry. No exceptions.",strict:true};
  if(cutId==="salmon") return{temp:145,label:"Fish",note:"145F minimum for fish and seafood.",strict:false};
  if(cutId==="leg_of_lamb") return{temp:145,label:"Lamb",note:"145F minimum. Allow 3 min rest.",strict:false};
  if(["pork_shoulder","spare_ribs","baby_back","pork_tenderloin"].includes(cutId)) return{temp:145,label:"Pork",note:"145F minimum for whole cuts. Allow 3 min rest.",strict:false};
  return{temp:145,label:"Beef",note:"145F minimum for whole cuts. Ground beef is 160F.",strict:false};
}
function UsdaNote({cutId,targetTemp}){
  const u=getUsdaInfo(cutId);const below=targetTemp>0&&targetTemp<u.temp;
  return(<div style={{marginTop:10,padding:"9px 12px",borderRadius:9,background:u.strict&&below?P.emberDim:P.bg3,border:"1px solid "+(u.strict&&below?P.ember+"44":P.div)}}><div style={{fontSize:11,color:u.strict&&below?P.ember:P.faint,lineHeight:1.5}}><span style={{fontWeight:500}}>USDA safe minimum: {u.temp}F</span>{below&&<span style={{color:u.strict?P.ember:P.amber}}> — your target is {u.temp-targetTemp}F below</span>}</div>{below&&<div style={{fontSize:11,color:P.muted,marginTop:3,lineHeight:1.5}}>{u.note}</div>}</div>);
}
function UsdaResultNote({cutId,targetTemp}){
  const u=getUsdaInfo(cutId);const tgt=targetTemp||0;const below=tgt>0&&tgt<u.temp;
  return(<div style={{padding:"10px 13px",borderRadius:10,background:u.strict&&below?P.emberDim:P.bg2,border:"1px solid "+(u.strict&&below?P.ember+"44":P.div)}}><div style={{fontSize:11,color:u.strict&&below?P.ember:P.faint}}><span style={{fontWeight:500}}>USDA safe minimum ({u.label}): {u.temp}F</span>{below?<span style={{color:u.strict?P.ember:P.amber}}> — target is {u.temp-tgt}F below, intentional for this doneness level</span>:<span style={{color:P.olive}}> — your target is above the safe minimum</span>}</div></div>);
}

// ─── RECOMMENDATIONS ───────────────────────────────────────────────────────────
function getRecs(cut,plan,cooks){
  if(!cut||!cooks||!cooks.length) return[];
  const cc=cooks.filter(c=>c.cut===cut.label);const recs=[];
  const lastChange=[...cc].reverse().find(c=>c.changeNextTime);
  if(lastChange) recs.push({id:"carry",priority:1,icon:"memo",label:"From your last cook",message:"You noted: \""+lastChange.changeNextTime+"\"",source:lastChange.date+" · "+lastChange.rating+" flames"});
  if(plan&&plan.cookerTypeId){const mc=cc.filter(c=>c.cookerTypeId===plan.cookerTypeId&&c.estimatedMins&&c.actualMins);if(mc.length>=2){const avg=Math.round(mc.reduce((s,c)=>s+(c.actualMins-c.estimatedMins),0)/mc.length);if(Math.abs(avg)>15) recs.push({id:"delta",priority:2,icon:"clock",label:"Cook time pattern",message:"Your "+(plan.cookerLabel||"cooker")+" has run "+Math.abs(avg)+" min "+(avg>0?"longer":"shorter")+" than estimated on average.",source:"Based on "+mc.length+" logged cooks"});}}
  if(cc.length>=3){const recent=cc.slice(-3);const avg=recent.reduce((s,c)=>s+c.rating,0)/recent.length;if(avg<=3){const note=recent.find(c=>c.changeNextTime);recs.push({id:"trend",priority:3,icon:"flame",label:"Trending lower",message:"Your last "+recent.length+" cooks averaged "+avg.toFixed(1)+" flames."+(note?" Notes: \""+note.changeNextTime+"\"":""),source:"Last "+recent.length+" cooks"});}}
  return recs.sort((a,b)=>a.priority-b.priority).slice(0,2);
}
function getMsTip(msId,cut,cooks){
  if(!cooks||!cooks.length) return null;
  const cc=cooks.filter(c=>c.cut===cut.label);if(!cc.length) return null;
  if(msId==="wrap"){const h=cc.filter(c=>c.changeNextTime&&c.changeNextTime.toLowerCase().includes("wrap")&&c.rating<=3);if(h.length>=1) return "You mentioned wrap timing on a lower-rated cook. Worth checking bark now.";}
  if(msId==="pull"){const e=cc.filter(c=>c.pullTempActual&&c.pullTempTarget&&(c.pullTempActual-c.pullTempTarget)>4&&c.rating<=3);if(e.length>=1) return "You have pulled this cut over target before and rated it low. Hold to probe tender.";}
  if(msId==="rest"){const r=cc.filter(c=>c.changeNextTime&&c.changeNextTime.toLowerCase().includes("rest")&&c.rating<=3);if(r.length>=1) return "You noted rushing the rest on a lower-rated cook. Give it the full time.";}
  return null;
}

// ─── COOK INTELLIGENCE ────────────────────────────────────────────────────────
function getCookStage(cut,elMins,totalMins,lastTemp){
  const pct=elMins/totalMins;
  const hasStall=["brisket_packer","brisket_flat","pork_shoulder","chuck_roast"].includes(cut.id);
  if(pct<0.30) return "early";
  if(hasStall&&lastTemp&&lastTemp>=155&&lastTemp<=170) return "stall";
  if(pct>=0.80) return "late";
  return "mid";
}
function interpretTemp(cut,temp,targetTemp,stage,logs){
  const hasStall=["brisket_packer","brisket_flat","pork_shoulder","chuck_roast"].includes(cut.id);
  const isLow=cut.base>=45;
  let rate=null;
  if(logs.length>=2){
    const last=logs[logs.length-1];const prev=logs[logs.length-2];
    if(last.tempNum&&prev.tempNum&&last.epochMs&&prev.epochMs){
      const dt=(last.epochMs-prev.epochMs)/60000;
      if(dt>0) rate=(last.tempNum-prev.tempNum)/dt;
    }
  }
  const remaining=targetTemp-temp;
  let minsToTarget=null;
  if(rate&&rate>0&&remaining>0) minsToTarget=Math.round(remaining/rate);
  let status="on_track",interpretation="",nextAction="";
  if(temp>=targetTemp){
    status="attention";
    interpretation="At or past your pull target of "+targetTemp+"F.";
    nextAction="Run the probe now. If it slides in clean, pull it.";
  } else if(hasStall&&temp>=155&&temp<=170){
    status="stall";
    interpretation="You're in the stall. Temp will plateau here for 1 to 3 hrs. This is normal.";
    nextAction="Check your bark. If it's set and mahogany, wrap now. If still forming, give it 30 more min.";
  } else if(stage==="late"&&remaining<=15){
    status="attention";
    interpretation=remaining+"F from your target. Getting close.";
    nextAction="Start probing every 20 to 30 min. Looking for the probe to slide in like soft butter.";
  } else if(stage==="early"){
    status="on_track";
    interpretation="Temp is climbing normally for this stage.";
    nextAction="Lid stays closed. No action needed yet.";
  } else if(rate!==null&&rate<0.3&&stage!=="early"){
    status="behind";
    interpretation="Temp is climbing slowly. Not a problem yet.";
    nextAction="Check again in 30 min and watch the rate.";
  } else if(minsToTarget&&minsToTarget<60){
    status="ahead";
    interpretation="Climbing well — roughly "+minsToTarget+" min from target at current pace.";
    nextAction=isLow?"Start probing soon. Temp is a guide, feel is the confirm.":"Check again in 20 min.";
  } else {
    status="on_track";
    interpretation=remaining+"F from target. Cook is progressing as expected.";
    nextAction=isLow?"Keep the lid closed and let it ride.":"Check again in 30 min.";
  }
  return{status,interpretation,nextAction,minsToTarget,rate};
}
function getRevisedFinish(logs,targetTemp){
  const tLogs=logs.filter(l=>l.tempNum);
  if(tLogs.length<2) return null;
  const last=tLogs[tLogs.length-1];const prev=tLogs[tLogs.length-2];
  if(!last.epochMs||!prev.epochMs) return null;
  const dt=(last.epochMs-prev.epochMs)/60000;
  if(dt<=0) return null;
  const rate=(last.tempNum-prev.tempNum)/dt;
  if(rate<=0) return null;
  const remaining=targetTemp-last.tempNum;
  const minsLeft=Math.round(remaining/rate);
  return{minsLeft,newFinishEpoch:Date.now()+minsLeft*60*1000};
}
function statusLabel(status){
  const map={on_track:{label:"On track",color:P.olive},ahead:{label:"Running ahead",color:P.olive},behind:{label:"Running behind",color:P.amber},stall:{label:"Stall in progress",color:P.amber},attention:{label:"Action needed",color:P.ember}};
  return map[status]||map.on_track;
}

// ─── SHARED UI ─────────────────────────────────────────────────────────────────
function Flame({size,color,filled}){const s=size||16,c=color||P.ember;return(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1C8 1 10 4 9.5 6.5C11 5.5 11.5 3.5 11.5 3.5C12.5 5 13 7 12 9.5C11 12 9 14 8 14.5C7 14 5 12 4 9.5C3 7 3.5 5 4.5 3.5C4.5 3.5 5 5.5 6.5 6.5C6 4 8 1 8 1Z" fill={filled?c:"none"} stroke={c} strokeWidth="0.8"/></svg>);}
function Stars({rating,onChange}){return(<div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(i=>(<button key={i} onClick={()=>onChange&&onChange(i)} style={{background:"none",border:"none",cursor:onChange?"pointer":"default",padding:1}}><Flame size={18} filled={i<=rating} color={i<=rating?P.ember:P.faint}/></button>))}</div>);}
function TopBar({title,onBack,onProfile,userName}){return(<div style={{display:"flex",alignItems:"center",padding:"12px 16px 11px",gap:8,borderBottom:"1px solid "+P.div,background:P.bg0}}>{onBack&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:P.muted,padding:"0 8px 0 0",fontSize:24,lineHeight:1}}>‹</button>}<span style={{flex:1,fontSize:16,fontWeight:500,color:P.cream,letterSpacing:0.1}}>{title}</span>{onProfile&&<button onClick={onProfile} style={{width:30,height:30,borderRadius:15,background:P.ember+"28",border:"1.5px solid "+P.ember+"55",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,fontWeight:600,color:P.ember}}>{(userName||"?").charAt(0).toUpperCase()}</span></button>}</div>);}
function Card({children,style}){return <div style={{background:P.bg2,borderRadius:14,padding:"15px 16px",border:"1px solid "+P.div,...(style||{})}}>{children}</div>;}
function Chip({label,active,onClick}){return(<button onClick={onClick} style={{background:active?P.ember:P.bg4,border:"1px solid "+(active?P.ember:P.div),borderRadius:20,padding:"6px 14px",color:active?"#fff":P.muted,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontWeight:active?500:400}}>{label}</button>);}
function PrimaryBtn({children,onClick,disabled,style}){return(<button onClick={onClick} disabled={disabled} style={{background:disabled?P.bg4:P.ember,border:"none",borderRadius:12,padding:"15px 0",color:disabled?P.faint:"#fff",fontSize:15,fontWeight:600,cursor:disabled?"default":"pointer",width:"100%",letterSpacing:0.2,...(style||{})}}>{children}</button>);}
function SecondaryBtn({children,onClick,style}){return(<button onClick={onClick} style={{background:"none",border:"1px solid "+P.div,borderRadius:12,padding:"13px 0",color:P.muted,fontSize:14,cursor:"pointer",width:"100%",...(style||{})}}>{children}</button>);}
function Lbl({children,style}){return <div style={{fontSize:11,color:P.faint,letterSpacing:0.7,textTransform:"uppercase",marginBottom:10,...(style||{})}}>{children}</div>;}
function RecCard({rec}){
  const icons={memo:<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke={P.amber} strokeWidth="1.2"/><line x1="5.5" y1="6" x2="10.5" y2="6" stroke={P.amber} strokeWidth="1"/><line x1="5.5" y1="9" x2="9" y2="9" stroke={P.amber} strokeWidth="1"/></svg>,clock:<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke={P.amber} strokeWidth="1.2"/><path d="M8 5v3.5l2 1.5" stroke={P.amber} strokeWidth="1.2" strokeLinecap="round"/></svg>,flame:<Flame size={14} color={P.ember} filled={true}/>};
  return(<div style={{background:P.amber+"14",border:"1px solid "+P.amber+"33",borderRadius:12,padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>{icons[rec.icon]}<span style={{fontSize:11,fontWeight:600,color:P.amber,letterSpacing:0.3}}>{rec.label}</span></div><div style={{fontSize:12,color:P.cream,lineHeight:1.6}}>{rec.message}</div><div style={{fontSize:10,color:P.faint,marginTop:5}}>{rec.source}</div></div>);
}
function NavBar({active,onNav}){
  const tabs=[{id:"plan",label:"Plan"},{id:"journal",label:"Journal"},{id:"recipes",label:"Recipes"},{id:"explore",label:"Explore"}];
  const icons={plan:a=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C10 2 13 6 12.5 9C14 8 14.5 5.5 14.5 5.5C16 7.5 16.5 10.5 15 13.5C13.5 16.5 11 18 10 18.5C9 18 6.5 16.5 5 13.5C3.5 10.5 4 7.5 5.5 5.5C5.5 5.5 6 8 7.5 9C7 6 10 2 10 2Z" fill={a?P.ember:"none"} stroke={a?P.ember:P.faint} strokeWidth="1.4"/></svg>,journal:a=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="2" stroke={a?P.ember:P.faint} strokeWidth="1.4" fill={a?P.emberDim:"none"}/><line x1="7" y1="7" x2="13" y2="7" stroke={a?P.ember:P.faint} strokeWidth="1.2"/><line x1="7" y1="10" x2="13" y2="10" stroke={a?P.ember:P.faint} strokeWidth="1.2"/><line x1="7" y1="13" x2="10" y2="13" stroke={a?P.ember:P.faint} strokeWidth="1.2"/></svg>,recipes:a=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="10" height="13" rx="1.5" stroke={a?P.ember:P.faint} strokeWidth="1.4" fill={a?P.emberDim:"none"}/><rect x="7" y="6" width="10" height="13" rx="1.5" stroke={a?P.ember:P.faint} strokeWidth="1.4" fill={a?P.ember+"22":P.bg2}/></svg>,explore:a=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={a?P.ember:P.faint} strokeWidth="1.4" fill={a?P.emberDim:"none"}/><path d="M7 13l1.5-3.5L12 8l-1.5 3.5L7 13z" stroke={a?P.ember:P.faint} strokeWidth="1.1" strokeLinejoin="round" fill="none"/></svg>};
  return(<div style={{display:"flex",borderTop:"1px solid "+P.div,background:P.bg0}}>{tabs.map(t=>{const a=active===t.id;return(<button key={t.id} onClick={()=>onNav(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"10px 0 9px",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>{icons[t.id](a)}<span style={{fontSize:10,color:a?P.ember:P.faint,fontWeight:a?600:400,letterSpacing:0.2}}>{t.label}</span></button>);})}</div>);
}
function PlanProgress({step}){
  const idx=PLAN_STEPS.indexOf(step);
  return(<div style={{padding:"8px 16px 0",background:P.bg0,borderBottom:"1px solid "+P.div}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,color:P.faint}}>Step {idx+1} of {PLAN_STEPS.length}</span><span style={{fontSize:11,color:P.faint,fontWeight:500}}>{PLAN_STEP_LABELS[idx]}</span></div><div style={{display:"flex",gap:4,paddingBottom:8}}>{PLAN_STEPS.map((s,i)=>(<div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=idx?P.ember:P.bg4}}/>))}</div></div>);
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function fmtStart(serveTime,estMins,restMax){const buf=estMins+restMax,p=serveTime.split(":");const total=parseInt(p[0])*60+parseInt(p[1]),start=total-buf;const h=((Math.floor(start/60)%24)+24)%24,m=((start%60)+60)%60,ap=h>=12?"PM":"AM";return(h%12||12)+":"+(m<10?"0"+m:m)+" "+ap;}
function fmtEl(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h>0?h+"h "+m+"m":m+"m";}
function fmtClock(epochMs){const d=new Date(epochMs),h=d.getHours(),m=d.getMinutes(),ap=h>=12?"PM":"AM";return(h%12||12)+":"+(m<10?"0"+m:m)+" "+ap;}
function nowLabel(){const now=new Date(),h=now.getHours(),m=now.getMinutes(),ap=h>=12?"PM":"AM";return(h%12||12)+":"+(m<10?"0"+m:m)+" "+ap;}
function loadLS(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function saveLS(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingScreen({onComplete}){
  const [step,setStep]=useState("welcome");
  const [name,setName]=useState("");
  const [cookerTypeId,setCookerTypeId]=useState(null);
  const [cookerModelId,setCookerModelId]=useState(null);
  const [nickname,setNickname]=useState("");
  const ct=COOKER_TYPES.find(t=>t.id===cookerTypeId);
  const model=ct&&ct.models.find(m=>m.id===cookerModelId);
  const finish=()=>{
    if(!model||!ct) return;
    onComplete({name:name.trim()||"Pitmaster",cooker:{id:model.id,label:model.label,typeId:ct.id,type:ct.label,fuel:ct.fuel,icon:ct.icon,nickname:nickname.trim()}});
  };
  const s={flex:1,overflowY:"auto",padding:"24px 20px",display:"flex",flexDirection:"column",background:P.bg1};
  if(step==="welcome") return(<div style={{...s,alignItems:"center",justifyContent:"center",textAlign:"center"}}><div style={{width:64,height:64,borderRadius:32,background:P.ember+"22",border:"1.5px solid "+P.ember+"44",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}><Flame size={32} color={P.ember} filled={true}/></div><div style={{fontSize:28,fontWeight:600,color:P.cream,marginBottom:8,letterSpacing:-0.5}}>Holy Smokes</div><div style={{fontSize:15,color:P.muted,lineHeight:1.6,marginBottom:40,maxWidth:280}}>A precision cook companion for serious home smokers.</div><PrimaryBtn onClick={()=>setStep("name")}>Get started</PrimaryBtn></div>);
  if(step==="name") return(<div style={{...s,gap:16}}><div style={{paddingTop:8}}><div style={{fontSize:22,fontWeight:600,color:P.cream,marginBottom:6}}>What should we call you?</div><div style={{fontSize:13,color:P.muted}}>Just your first name is fine.</div></div><Card><input value={name} onChange={e=>setName(e.target.value)} placeholder="First name" style={{width:"100%",background:"none",border:"none",fontSize:22,fontWeight:500,color:P.cream,outline:"none",boxSizing:"border-box"}}/></Card><div style={{fontSize:11,color:P.faint,lineHeight:1.6}}>Temperature units default to Fahrenheit. You can change this in your profile.</div><div style={{marginTop:"auto"}}><PrimaryBtn onClick={()=>setStep("cooker_type")} disabled={!name.trim()}>{name.trim()?"Let's go, "+name.trim().split(" ")[0]:"Enter your name to continue"}</PrimaryBtn></div></div>);
  if(step==="cooker_type") return(<div style={{...s,gap:10}}><div style={{paddingTop:8}}><div style={{fontSize:22,fontWeight:600,color:P.cream,marginBottom:6}}>What are you cooking on?</div><div style={{fontSize:13,color:P.muted}}>Add your primary cooker. You can add more later.</div></div>{COOKER_TYPES.map(t=>(<button key={t.id} onClick={()=>{setCookerTypeId(t.id);setCookerModelId(null);setStep("cooker_model");}} style={{width:"100%",background:P.bg2,border:"1px solid "+P.div,borderRadius:12,padding:"13px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:9,background:P.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:500,color:P.faint,flexShrink:0}}>{t.icon}</div><div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{t.label}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>{t.desc}</div></div></button>))}</div>);
  if(step==="cooker_model") return(<div style={{...s,gap:10}}><div style={{paddingTop:8}}><div style={{fontSize:22,fontWeight:600,color:P.cream,marginBottom:6}}>{ct&&ct.label}</div><div style={{fontSize:13,color:P.muted}}>Select your model.</div></div>{ct&&ct.models.map(m=>(<button key={m.id} onClick={()=>{setCookerModelId(m.id);setStep("cooker_confirm");}} style={{width:"100%",background:P.bg2,border:"1px solid "+P.div,borderRadius:12,padding:"13px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{m.label}</div><div style={{fontSize:11,color:P.faint,marginTop:3}}>{m.note}{m.area?" · "+m.area+" sq in":""}</div></button>))}<SecondaryBtn onClick={()=>setStep("cooker_type")}>Back</SecondaryBtn></div>);
  if(step==="cooker_confirm") return(<div style={{...s,gap:12}}><div style={{paddingTop:8}}><div style={{fontSize:22,fontWeight:600,color:P.cream,marginBottom:6}}>Looking good.</div><div style={{fontSize:13,color:P.muted}}>Give it a nickname — optional.</div></div><Card><div style={{fontSize:11,color:P.faint,marginBottom:4}}>Your cooker</div><div style={{fontSize:15,fontWeight:500,color:P.cream,marginBottom:2}}>{model&&model.label}</div><div style={{fontSize:12,color:P.muted}}>{ct&&ct.label} · {ct&&ct.fuel}</div></Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>Nickname <span style={{color:P.faint}}>(optional)</span></div><input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder={model?model.label:""} style={{width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px 12px",color:P.cream,fontSize:14,boxSizing:"border-box",outline:"none"}}/></Card>{ct&&(<Card style={{background:P.bg2}}><div style={{display:"flex",gap:8}}>{[["Weather",ct.traits.weatherSensitivity,SENS],["Heat",ct.traits.heatConsistency,CONS]].map(([k,v,cm])=>(<div key={k} style={{flex:1,background:P.bg3,borderRadius:10,padding:"10px"}}><div style={{fontSize:10,color:P.faint,marginBottom:4}}>{k}</div><div style={{fontSize:12,fontWeight:500,color:cm[v]||P.muted,textTransform:"capitalize"}}>{v}</div></div>))}</div></Card>)}<div style={{marginTop:"auto",display:"flex",flexDirection:"column",gap:10}}><PrimaryBtn onClick={finish}>Start cooking</PrimaryBtn><SecondaryBtn onClick={()=>setStep("cooker_model")}>Back</SecondaryBtn></div></div>);
  return null;
}

// ─── PLANNED CARD ─────────────────────────────────────────────────────────────
function PlannedCard({cook,onStart,onDelete}){
  const startTime=fmtStart(cook.serveTime,cook.estimatedCookMins,cook.restMax);
  const p=cook.serveTime.split(":");const sh=parseInt(p[0]),sm=parseInt(p[1]);
  const serveLabel=(sh%12||12)+":"+(sm<10?"0"+sm:sm)+" "+(sh>=12?"PM":"AM");
  const woodLabel=cook.wood?cook.wood.replace(/_p$/,"").replace(/_/g," "):"-";
  return(<div style={{background:P.bg2,borderRadius:14,border:"1px solid "+P.div,overflow:"hidden",marginBottom:10}}><div style={{padding:"14px 16px 12px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div style={{flex:1,marginRight:8}}><div style={{fontSize:15,fontWeight:500,color:P.cream}}>{cook.cut}</div><div style={{fontSize:11,color:P.faint,marginTop:3}}>{cook.weight} lbs · {cook.cooker}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:13,fontWeight:500,color:P.amber}}>{cook.cookDate}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>Serve {serveLabel}</div></div></div><div style={{display:"flex",background:P.bg3,borderRadius:10,overflow:"hidden"}}>{[["Start by",startTime],[(cook.cookTemp||"")+"F","Cook temp"],[woodLabel,"Wood"]].map(([v,k],i)=>(<div key={i} style={{flex:1,padding:"9px 10px",borderRight:i<2?"1px solid "+P.div:"none"}}><div style={{fontSize:10,color:P.faint,marginBottom:2}}>{k}</div><div style={{fontSize:12,fontWeight:500,color:P.cream,textTransform:"capitalize"}}>{v}</div></div>))}</div></div><div style={{display:"flex",borderTop:"1px solid "+P.div}}><button onClick={onDelete} style={{flex:1,background:"none",border:"none",borderRight:"1px solid "+P.div,padding:"12px 0",color:P.faint,fontSize:12,cursor:"pointer"}}>Remove</button><button onClick={onStart} style={{flex:2,background:P.ember,border:"none",padding:"12px 0",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Start Cook</button></div></div>);
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({onStart,onCookDetail,planned,onStartPlanned,onDeletePlanned,pastCooks,userName}){
  const [showAll,setShowAll]=useState(false);
  const visible=showAll?planned:planned.slice(0,2);
  const first=userName?userName.split(" ")[0]:"there";
  return(<div style={{flex:1,overflowY:"auto",background:P.bg1}}><div style={{padding:"20px 16px 0"}}><div style={{background:"linear-gradient(160deg,#2A1F16 0%,#1E1A16 100%)",borderRadius:16,padding:"24px 20px",border:"1px solid "+P.div,marginBottom:20}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Flame size={16} color={P.ember} filled={true}/><span style={{fontSize:11,color:P.faint,letterSpacing:1,textTransform:"uppercase"}}>Holy Smokes</span></div><div style={{fontSize:26,fontWeight:600,color:P.cream,lineHeight:1.1,marginBottom:4}}>Hey {first},</div><div style={{fontSize:15,color:P.muted,marginBottom:20}}>What are you planning to smoke?</div><PrimaryBtn onClick={onStart}>Plan a Cook</PrimaryBtn></div>{planned.length>0&&(<div style={{marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><Lbl style={{marginBottom:0}}>Up Next</Lbl>{planned.length>2&&<button onClick={()=>setShowAll(!showAll)} style={{background:"none",border:"none",color:P.ember,fontSize:12,cursor:"pointer",padding:0,fontWeight:500}}>{showAll?"Show less":"View all "+planned.length}</button>}</div>{visible.map(c=><PlannedCard key={c.id} cook={c} onStart={()=>onStartPlanned(c)} onDelete={()=>onDeletePlanned(c.id)}/>)}</div>)}<div style={{paddingBottom:20}}><Lbl>Past Cooks</Lbl>{pastCooks.length===0&&<div style={{fontSize:13,color:P.faint,padding:"8px 0"}}>No cooks logged yet. Plan your first cook above.</div>}{pastCooks.slice(0,3).map(c=>(<div key={c.id} onClick={()=>onCookDetail(c)} style={{background:P.bg2,borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid "+P.div,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{c.cut}</div><div style={{fontSize:11,color:P.faint,marginTop:3}}>{c.date} · {c.weight} lbs</div></div><Stars rating={c.rating}/></div>))}</div></div></div>);
}

// ─── CUT SCREEN ───────────────────────────────────────────────────────────────
function CutScreen({onSelect,pastCooks}){
  const [search,setSearch]=useState("");
  const cats=[...new Set(CUTS.map(c=>c.cat))];
  const filtered=CUTS.filter(c=>c.label.toLowerCase().includes(search.toLowerCase()));
  const recentCuts=[];
  if(pastCooks){for(let i=0;i<pastCooks.length&&recentCuts.length<3;i++){const cut=CUTS.find(c=>c.label===pastCooks[i].cut);if(cut&&!recentCuts.find(r=>r.id===cut.id))recentCuts.push(cut);}}
  return(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:P.bg1}}><div style={{padding:"12px 16px",borderBottom:"1px solid "+P.div}}><div style={{position:"relative"}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cuts..." style={{width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:10,padding:"10px 14px 10px 36px",color:P.cream,fontSize:13,boxSizing:"border-box",outline:"none"}}/><svg style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke={P.faint} strokeWidth="1.3"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke={P.faint} strokeWidth="1.3" strokeLinecap="round"/></svg></div></div><div style={{flex:1,overflowY:"auto",padding:"4px 16px 16px"}}>{recentCuts.length>0&&!search&&(<div><Lbl style={{padding:"16px 0 8px",marginBottom:0}}>Recently cooked</Lbl>{recentCuts.map(cut=>(<button key={cut.id+"_r"} onClick={()=>onSelect(cut)} style={{width:"100%",background:P.bg3,border:"1px solid "+P.ember+"44",borderRadius:12,padding:"13px 15px",color:P.cream,fontSize:13,cursor:"pointer",textAlign:"left",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Flame size={12} color={P.ember} filled={true}/><span>{cut.label}</span></div><span style={{color:P.faint,fontSize:11,background:P.bg4,padding:"3px 8px",borderRadius:8}}>{Math.round(cut.yield*100)}%</span></button>))}</div>)}{cats.map(cat=>{const items=filtered.filter(c=>c.cat===cat);if(!items.length) return null;return(<div key={cat}><Lbl style={{padding:"16px 0 8px",marginBottom:0}}>{cat}</Lbl>{items.map(cut=>(<button key={cut.id} onClick={()=>onSelect(cut)} style={{width:"100%",background:P.bg2,border:"1px solid "+P.div,borderRadius:12,padding:"13px 15px",color:P.cream,fontSize:13,cursor:"pointer",textAlign:"left",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{cut.label}</span><span style={{color:P.faint,fontSize:11,background:P.bg3,padding:"3px 8px",borderRadius:8}}>{Math.round(cut.yield*100)}%</span></button>))}</div>);})}</div></div>);
}

// ─── QUANTITY ─────────────────────────────────────────────────────────────────
function QuantityScreen({cut,plan,onUpdate,onNext}){
  const [mode,setMode]=useState(plan.quantityMode||"weight");
  const [guests,setGuests]=useState(plan.guests||8);
  const [serving,setServing]=useState(plan.serving||"standard");
  const [lbs,setLbs]=useState(plan.weight||"");
  const smap={light:0.33,standard:0.40,generous:0.50};
  const calcLbs=(guests*smap[serving])/cut.yield;
  const rawLbs=mode==="guests"?calcLbs:parseFloat(lbs)||0;
  const cookedLbs=rawLbs*cut.yield;
  const impliedGuests=mode==="weight"&&rawLbs>0?Math.round((rawLbs*cut.yield)/smap[serving]):guests;
  const ok=rawLbs>0;
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,background:P.bg1}}><Card><div style={{fontSize:11,color:P.faint,marginBottom:3}}>Selected cut</div><div style={{fontSize:15,fontWeight:500,color:P.cream}}>{cut.label}</div><div style={{fontSize:11,color:P.amber,marginTop:4}}>~{Math.round(cut.yield*100)}% rendered yield</div></Card><div style={{display:"flex",background:P.bg3,borderRadius:12,padding:4,border:"1px solid "+P.div}}>{[["weight","I have the meat"],["guests","Plan by guests"]].map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} style={{flex:1,background:mode===m?P.bg2:"none",border:mode===m?"1px solid "+P.div:"1px solid transparent",borderRadius:9,padding:"9px 0",color:mode===m?P.cream:P.faint,fontSize:12,fontWeight:mode===m?500:400,cursor:"pointer"}}>{l}</button>))}</div>{mode==="guests"?(<><Card><div style={{fontSize:12,color:P.muted,marginBottom:14}}>Number of guests</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24}}><button onClick={()=>setGuests(Math.max(1,guests-1))} style={{width:40,height:40,borderRadius:20,background:P.bg3,border:"1px solid "+P.div,color:P.cream,fontSize:20,cursor:"pointer"}}>-</button><span style={{fontSize:36,fontWeight:600,color:P.cream,minWidth:48,textAlign:"center"}}>{guests}</span><button onClick={()=>setGuests(guests+1)} style={{width:40,height:40,borderRadius:20,background:P.bg3,border:"1px solid "+P.div,color:P.cream,fontSize:20,cursor:"pointer"}}>+</button></div></Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Serving size</div><div style={{display:"flex",gap:8}}>{["light","standard","generous"].map(s=><Chip key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} active={serving===s} onClick={()=>setServing(s)}/>)}</div></Card></>):(<Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Raw weight</div><div style={{display:"flex",alignItems:"center",gap:10}}><input type="number" step="0.1" min="0.5" placeholder="0.0" value={lbs} onChange={e=>setLbs(e.target.value)} style={{width:90,background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px",color:P.cream,fontSize:24,fontWeight:600,textAlign:"center",outline:"none"}}/><span style={{fontSize:16,color:P.muted}}>lbs</span></div></Card>)}{rawLbs>0&&(<Card style={{background:P.bg3,border:"1px solid "+P.ember+"33"}}><div style={{fontSize:11,color:P.faint,marginBottom:6}}>{mode==="guests"?"Estimated quantity needed":"What you will get"}</div><div style={{fontSize:28,fontWeight:600,color:P.cream,letterSpacing:-0.5}}>{(mode==="guests"?rawLbs:cookedLbs).toFixed(1)} lbs <span style={{fontSize:13,color:P.muted,fontWeight:400}}>{mode==="guests"?"raw":"cooked"}</span></div><div style={{fontSize:12,color:P.muted,marginTop:4}}>{mode==="guests"?"approx. "+cookedLbs.toFixed(1)+" lbs cooked · "+guests+" guests":"approx. "+impliedGuests+" "+serving+" portions"}</div></Card>)}<PrimaryBtn onClick={()=>{onUpdate({guests:impliedGuests,serving,weight:parseFloat(rawLbs.toFixed(1)),quantityMode:mode});onNext();}} disabled={!ok}>{ok?"Continue with "+rawLbs.toFixed(1)+" lbs":"Enter a weight to continue"}</PrimaryBtn></div>);
}

// ─── ADD COOKER ───────────────────────────────────────────────────────────────
function AddCookerScreen({onSave,onBack}){
  const [step,setStep]=useState("type");
  const [typeId,setTypeId]=useState(null);
  const [modelId,setModelId]=useState(null);
  const [nickname,setNickname]=useState("");
  const ct=COOKER_TYPES.find(t=>t.id===typeId);
  const model=ct&&ct.models.find(m=>m.id===modelId);
  if(step==="type") return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:9,background:P.bg1}}><Lbl>What type of cooker?</Lbl>{COOKER_TYPES.map(t=>(<button key={t.id} onClick={()=>{setTypeId(t.id);setModelId(null);setStep("model");}} style={{width:"100%",background:P.bg2,border:"1px solid "+P.div,borderRadius:12,padding:"13px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:9,background:P.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:500,color:P.faint,flexShrink:0}}>{t.icon}</div><div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{t.label}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>{t.desc}</div></div></button>))}</div>);
  if(step==="model") return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:9,background:P.bg1}}><Lbl>{ct&&ct.label} — Select model</Lbl>{ct&&ct.models.map(m=>(<button key={m.id} onClick={()=>{setModelId(m.id);setStep("confirm");}} style={{width:"100%",background:P.bg2,border:"1px solid "+P.div,borderRadius:12,padding:"13px 14px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{m.label}</div><div style={{fontSize:11,color:P.faint,marginTop:3}}>{m.note}{m.area?" · "+m.area+" sq in":""}</div></button>))}<SecondaryBtn onClick={()=>setStep("type")}>Back</SecondaryBtn></div>);
  if(step==="confirm") return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,background:P.bg1}}><Card><div style={{fontSize:11,color:P.faint,marginBottom:4}}>Adding cooker</div><div style={{fontSize:16,fontWeight:500,color:P.cream}}>{model&&model.label}</div><div style={{fontSize:12,color:P.muted,marginTop:3}}>{ct&&ct.label} · {ct&&ct.fuel}</div></Card>{ct&&(<Card style={{background:P.bg2}}><div style={{display:"flex",gap:8}}>{[["Weather",ct.traits.weatherSensitivity,SENS],["Heat",ct.traits.heatConsistency,CONS]].map(([k,v,cm])=>(<div key={k} style={{flex:1,background:P.bg3,borderRadius:10,padding:"10px"}}><div style={{fontSize:10,color:P.faint,marginBottom:4}}>{k}</div><div style={{fontSize:12,fontWeight:500,color:cm[v]||P.muted,textTransform:"capitalize"}}>{v}</div></div>))}</div></Card>)}<Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>Nickname (optional)</div><input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder={model?model.label:""} style={{width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px 12px",color:P.cream,fontSize:13,boxSizing:"border-box",outline:"none"}}/></Card><PrimaryBtn onClick={()=>{if(!ct||!model) return;onSave({id:model.id,label:model.label,typeId:ct.id,type:ct.label,fuel:ct.fuel,icon:ct.icon,nickname});}} >Save Cooker</PrimaryBtn><SecondaryBtn onClick={()=>setStep("model")}>Back</SecondaryBtn></div>);
  return null;
}

// ─── COOKER PICK ──────────────────────────────────────────────────────────────
function CookerPickScreen({savedCookers,plan,onUpdate,onNext,onAddCooker,pastCooks,selectedCut,autoSelectId}){
  const [sel,setSel]=useState(autoSelectId||plan.cookerId||null);
  const [justAdded,setJustAdded]=useState(!!autoSelectId);
  useEffect(()=>{if(autoSelectId){setSel(autoSelectId);setJustAdded(true);const t=setTimeout(()=>setJustAdded(false),3000);return()=>clearTimeout(t);}},[autoSelectId]);
  const selObj=savedCookers.find(x=>x.id===sel);
  const recs=sel&&selectedCut?getRecs(selectedCut,{...plan,cookerId:sel,cookerTypeId:selObj&&selObj.typeId,cookerLabel:selObj&&(selObj.nickname||selObj.label)},pastCooks):[];
  const go=()=>{const c=savedCookers.find(x=>x.id===sel);const ct=COOKER_TYPES.find(t=>t.id===c.typeId);onUpdate({cookerId:sel,cookerLabel:c.nickname||c.label,cookerTypeId:c.typeId,cookerTempMod:ct.traits.tempMod,fuel:c.fuel,cookerTraits:ct.traits,cookerPlanningNotes:ct.planningNotes});onNext();};
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:9,background:P.bg1}}><Lbl>Select your cooker</Lbl>{justAdded&&(<div style={{background:P.olive+"22",border:"1px solid "+P.olive+"44",borderRadius:10,padding:"10px 13px",marginBottom:4,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,color:P.olive}}>✓</span><span style={{fontSize:12,color:P.olive,fontWeight:500}}>Cooker added and selected — tap Continue when ready</span></div>)}{savedCookers.map(cp=>{const ct=COOKER_TYPES.find(t=>t.id===cp.typeId);const active=sel===cp.id;return(<button key={cp.id} onClick={()=>setSel(cp.id)} style={{width:"100%",background:active?P.ember+"18":P.bg2,border:"1px solid "+(active?P.ember:P.div),borderRadius:12,padding:"13px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:9,background:P.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:500,color:active?P.ember:P.faint,flexShrink:0}}>{cp.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{cp.nickname||cp.label}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>{cp.type} · {cp.fuel}</div>{ct&&active&&(<div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>{[["Weather",ct.traits.weatherSensitivity,SENS],["Heat",ct.traits.heatConsistency,CONS]].map(([k,v,cm])=>(<span key={k} style={{fontSize:10,background:P.bg0,borderRadius:8,padding:"3px 8px",color:cm[v]||P.faint}}>{k}: {v}</span>))}</div>)}</div>{active&&<div style={{color:P.ember,fontSize:16}}>✓</div>}</button>);})}<button onClick={onAddCooker} style={{background:"none",border:"1px dashed "+P.div,borderRadius:12,padding:"13px",color:P.faint,fontSize:12,cursor:"pointer",marginTop:4}}>+ Add a cooker</button>{recs.length>0&&(<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}><Lbl>Based on your history</Lbl>{recs.map(r=><RecCard key={r.id} rec={r}/>)}</div>)}<PrimaryBtn onClick={go} disabled={!sel}>Continue</PrimaryBtn></div>);
}

// ─── PARAMS ───────────────────────────────────────────────────────────────────
function ParamsScreen({cut,plan,onUpdate,onNext}){
  const [cookTemp,setCookTemp]=useState(plan.cookTemp||cut.defaultCook);
  const [targetTemp,setTargetTemp]=useState(plan.targetTemp||cut.defaultTarget);
  const [startTemp,setStartTemp]=useState(plan.startTemp||"fridge");
  const [wrap,setWrap]=useState(plan.wrap||"none");
  const [serveTime,setServeTime]=useState(plan.serveTime||"18:00");
  const [wood,setWood]=useState(plan.wood||null);
  const [prepTypes,setPrepTypes]=useState(plan.prepTypes||[]);
  const [prepName,setPrepName]=useState(plan.prepName||"");
  const [prepTiming,setPrepTiming]=useState(plan.prepTiming||"");
  const fuelKey=FUEL_WOOD_MAP[plan.fuel]||null;
  const woodOpts=fuelKey?WOOD[fuelKey]:null;
  const suggestions=CUT_PREPS[cut.id]||[];
  const togglePrep=id=>setPrepTypes(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const applySug=s=>{if(!prepTypes.includes(s.type))setPrepTypes(prev=>[...prev,s.type]);setPrepName(s.label);setPrepTiming(s.timing);};
  const presets={brisket_packer:[{label:"Probe Tender",val:203},{label:"Pulled",val:210}],brisket_flat:[{label:"Probe Tender",val:203}],pork_shoulder:[{label:"Pulled",val:205},{label:"Sliced",val:190}],spare_ribs:[{label:"Competition Bite",val:195},{label:"Fall Off Bone",val:203}],baby_back:[{label:"Competition Bite",val:195},{label:"Fall Off Bone",val:200}],prime_rib:[{label:"Rare",val:120},{label:"Med Rare",val:130},{label:"Medium",val:138}],beef_tenderloin:[{label:"Rare",val:120},{label:"Med Rare",val:130}],tomahawk:[{label:"Rare",val:120},{label:"Med Rare",val:130},{label:"Medium",val:138}],ribeye:[{label:"Rare",val:120},{label:"Med Rare",val:130},{label:"Medium",val:138}],flank_steak:[{label:"Med Rare",val:130},{label:"Medium",val:138}],tri_tip:[{label:"Rare",val:120},{label:"Med Rare",val:130},{label:"Medium",val:138}]};
  const ps=presets[cut.id]||[];
  const go=()=>onUpdate({cookTemp,targetTemp,startTemp,wrap,serveTime,startTempAdj:startTemp==="fridge"?15:0,wrapAdj:wrap==="crutch"?-30:wrap==="paper"?-15:0,wood,prepTypes,prepName,prepTiming})&&onNext()||onNext();
  const inp={width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"9px 12px",color:P.cream,fontSize:13,boxSizing:"border-box",outline:"none"};
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,background:P.bg1}}>{plan.cookerLabel&&<div style={{fontSize:12,color:P.faint,padding:"2px 0"}}>Cooking on: <span style={{color:P.cream,fontWeight:500}}>{plan.cookerLabel}</span></div>}<Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Prep / rub / brine</div>{suggestions.length>0&&(<div style={{marginBottom:12}}><Lbl style={{marginBottom:8}}>Common for this cut</Lbl><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{suggestions.map((s,i)=>(<button key={i} onClick={()=>applySug(s)} style={{background:prepName===s.label?P.ember+"22":P.bg3,border:"1px solid "+(prepName===s.label?P.ember:P.div),borderRadius:20,padding:"5px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,color:prepName===s.label?P.cream:P.muted}}>{s.label}</span>{prepName===s.label&&<span style={{color:P.ember,fontSize:11}}>✓</span>}</button>))}</div></div>)}<Lbl style={{marginBottom:8}}>What are you using?</Lbl><input value={prepName} onChange={e=>setPrepName(e.target.value)} placeholder="e.g. Meat Church Holy Cow or SPG" style={{...inp,marginBottom:8}}/>{prepName.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>{PREP_TYPES.map(pt=>(<button key={pt.id} onClick={()=>togglePrep(pt.id)} style={{background:prepTypes.includes(pt.id)?P.ember:P.bg3,border:"1px solid "+(prepTypes.includes(pt.id)?P.ember:P.div),borderRadius:20,padding:"4px 11px",color:prepTypes.includes(pt.id)?"#fff":P.faint,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{pt.label}</button>))}</div>}{prepName.length>0&&<input value={prepTiming} onChange={e=>setPrepTiming(e.target.value)} placeholder="When? e.g. 24 hrs ahead or 1 hr before" style={inp}/>}</Card>{woodOpts&&(<Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>{fuelKey==="pellets"?"Pellet flavor":"Wood / smoke"}</div><div style={{display:"flex",flexDirection:"column",gap:7}}>{woodOpts.map(w=>(<button key={w.id} onClick={()=>setWood(w.id)} style={{background:wood===w.id?P.ember+"18":P.bg3,border:"1px solid "+(wood===w.id?P.ember:P.div),borderRadius:10,padding:"10px 12px",cursor:"pointer",textAlign:"left"}}><div style={{fontSize:13,fontWeight:wood===w.id?500:400,color:wood===w.id?P.cream:P.muted}}>{w.label}</div>{wood===w.id&&<div style={{fontSize:11,color:P.faint,marginTop:4,lineHeight:1.5}}>{w.note}</div>}</button>))}</div></Card>)}<Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>Cooking temperature</div><div style={{display:"flex",alignItems:"center",gap:10}}><input type="range" min={200} max={325} step={5} value={cookTemp} onChange={e=>setCookTemp(+e.target.value)} style={{flex:1}}/><span style={{fontSize:20,fontWeight:600,color:P.cream,minWidth:60,letterSpacing:-0.5}}>{cookTemp}F</span></div><div style={{fontSize:11,color:P.faint,marginTop:6}}>Typical: {cut.defaultCook-25} to {cut.defaultCook+25}F</div></Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Target internal temp</div>{ps.length>0&&<div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>{ps.map(p=><Chip key={p.val} label={p.label+" ("+p.val+"F)"} active={targetTemp===p.val} onClick={()=>setTargetTemp(p.val)}/>)}</div>}<div style={{display:"flex",alignItems:"center",gap:8}}><input type="number" value={targetTemp} onChange={e=>setTargetTemp(+e.target.value)} style={{width:76,background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"9px 10px",color:P.cream,fontSize:18,fontWeight:600,textAlign:"center",outline:"none"}}/><span style={{fontSize:13,color:P.faint}}>F</span></div><UsdaNote cutId={cut.id} targetTemp={targetTemp}/></Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Meat starting temp</div><div style={{display:"flex",gap:8}}><Chip label="Fridge (38F)" active={startTemp==="fridge"} onClick={()=>setStartTemp("fridge")}/><Chip label="Tempered (55F)" active={startTemp==="tempered"} onClick={()=>setStartTemp("tempered")}/></div></Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Wrap method</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}><Chip label="No wrap" active={wrap==="none"} onClick={()=>setWrap("none")}/><Chip label="Texas Crutch" active={wrap==="crutch"} onClick={()=>setWrap("crutch")}/><Chip label="Butcher Paper" active={wrap==="paper"} onClick={()=>setWrap("paper")}/></div>{wrap!=="none"&&<div style={{fontSize:11,color:P.olive,marginTop:8}}>Wrapping shortens the stall — adjusted in your estimate.</div>}</Card><Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>Target serve time</div><input type="time" value={serveTime} onChange={e=>setServeTime(e.target.value)} style={{background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"9px 12px",color:P.cream,fontSize:14,outline:"none"}}/></Card><PrimaryBtn onClick={()=>{onUpdate({cookTemp,targetTemp,startTemp,wrap,serveTime,startTempAdj:startTemp==="fridge"?15:0,wrapAdj:wrap==="crutch"?-30:wrap==="paper"?-15:0,wood,prepTypes,prepName,prepTiming});onNext();}}>Calculate Estimate</PrimaryBtn></div>);
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsScreen({cut,plan,onNext}){
  const w=plan.weight||14;const tDelta=(cut.defaultCook-(plan.cookTemp||cut.defaultCook))/25;const cMod=plan.cookerTempMod||1.0;
  const total=Math.round(cut.base*w*cMod*(1+tDelta*0.15)+(plan.startTempAdj||0)+(plan.wrapAdj||0));const totalMax=Math.round(total*1.25);
  const fmt=m=>{const h=Math.floor(m/60),mn=m%60;return mn>0?h+"h "+mn+"m":h+"h";};
  const fmtT=mins=>{const m=((mins%1440)+1440)%1440;const h=Math.floor(m/60),mn=m%60,ap=h>=12?"PM":"AM",h12=h%12||12;return h12+":"+(mn<10?"0"+mn:mn)+" "+ap;};
  const p=(plan.serveTime||"18:00").split(":");const serveM=parseInt(p[0])*60+parseInt(p[1]);
  const hasStall=["brisket_packer","brisket_flat","pork_shoulder","chuck_roast"].includes(cut.id);const traits=plan.cookerTraits;
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,background:P.bg1}}><Card style={{background:P.bg3}}><div style={{fontSize:11,color:P.faint,marginBottom:6,letterSpacing:0.4}}>Estimated cook window</div><div style={{fontSize:34,fontWeight:600,color:P.cream,letterSpacing:-0.5}}>{fmt(total)} <span style={{color:P.faint,fontWeight:400}}>—</span> {fmt(totalMax)}</div><div style={{fontSize:12,color:P.muted,marginTop:5}}>{cut.label} · {w} lbs · {plan.cookTemp||cut.defaultCook}F</div></Card><div style={{display:"flex",gap:10}}><Card style={{flex:1}}><div style={{fontSize:10,color:P.faint,marginBottom:4}}>Rest</div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{fmt(cut.restMin)} — {fmt(cut.restMax)}</div></Card><Card style={{flex:1}}><div style={{fontSize:10,color:P.faint,marginBottom:4}}>Pull temp</div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{plan.targetTemp||cut.defaultTarget}F</div></Card></div><Card style={{border:"1px solid "+P.ember+"55",background:P.emberDim}}><div style={{fontSize:11,color:P.muted,marginBottom:5}}>To serve at {fmtT(serveM)}</div><div style={{fontSize:17,fontWeight:600,color:P.cream}}>Start between {fmtT(serveM-totalMax-cut.restMax)} — {fmtT(serveM-total-cut.restMin)}</div><div style={{fontSize:11,color:P.faint,marginTop:4}}>Includes rest time</div></Card><UsdaResultNote cutId={cut.id} targetTemp={plan.targetTemp||cut.defaultTarget}/>{traits&&(<Card style={{background:P.bg2}}><div style={{fontSize:11,fontWeight:600,color:P.amber,marginBottom:10,letterSpacing:0.3}}>Cooker factors applied</div><div style={{display:"flex",gap:8,marginBottom:10}}>{[["Time mod",cMod>1.0?"+"+Math.round((cMod-1)*100)+"%":cMod<1.0?"-"+Math.round((1-cMod)*100)+"%":"avg",cMod>1.05?P.amber:cMod<0.97?P.olive:P.muted],["Weather",traits.weatherSensitivity,SENS[traits.weatherSensitivity]],["Heat",traits.heatConsistency,CONS[traits.heatConsistency]]].map(([k,v,c])=>(<div key={k} style={{flex:1,background:P.bg3,borderRadius:10,padding:"10px 10px"}}><div style={{fontSize:10,color:P.faint,marginBottom:4}}>{k}</div><div style={{fontSize:12,fontWeight:500,color:c,textTransform:"capitalize"}}>{v}</div></div>))}</div>{plan.cookerPlanningNotes&&plan.cookerPlanningNotes.slice(0,2).map((n,i)=>(<div key={i} style={{fontSize:11,color:P.muted,lineHeight:1.6,paddingLeft:10,borderLeft:"2px solid "+P.div,marginBottom:i<1?6:0}}>{n}</div>))}</Card>)}{hasStall&&(<Card style={{border:"1px solid "+P.amber+"44",background:P.amberDim}}><div style={{fontSize:11,fontWeight:600,color:P.amber,marginBottom:5,letterSpacing:0.3}}>Stall advisory</div><div style={{fontSize:12,color:P.muted,lineHeight:1.6}}>Expect a stall at 155 to 165F. May last 1 to 3 hrs. {plan.wrap==="none"?"Wrapping will push through faster.":"Your wrap choice is factored in."}</div></Card>)}<PrimaryBtn onClick={onNext}>View Plan Summary</PrimaryBtn></div>);
}

// ─── SAVE SHEET ───────────────────────────────────────────────────────────────
function SaveSheet({onStartNow,onSaveLater,onSaveNow}){
  const [mode,setMode]=useState("choose");const [cookDate,setCookDate]=useState("");
  if(mode==="later") return(<div style={{position:"absolute",bottom:0,left:0,right:0,background:P.bg2,borderTop:"1px solid "+P.div,borderRadius:"16px 16px 0 0",padding:20,zIndex:10}}><div style={{fontSize:15,fontWeight:500,color:P.cream,marginBottom:4}}>When are you cooking?</div><div style={{fontSize:12,color:P.muted,marginBottom:14}}>We will remind you when to start based on your serve time.</div><input type="date" value={cookDate} onChange={e=>setCookDate(e.target.value)} style={{width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px 12px",color:P.cream,fontSize:14,boxSizing:"border-box",marginBottom:12,outline:"none"}}/><div style={{display:"flex",gap:10}}><SecondaryBtn onClick={()=>setMode("choose")} style={{flex:1}}>Back</SecondaryBtn><button onClick={()=>onSaveLater(cookDate||"Soon")} disabled={!cookDate} style={{flex:2,background:cookDate?P.wood:P.bg4,border:"none",borderRadius:12,padding:"13px 0",color:cookDate?"#fff":P.faint,fontSize:14,fontWeight:600,cursor:cookDate?"pointer":"default"}}>Save for {cookDate||"..."}</button></div></div>);
  return(<div style={{position:"absolute",bottom:0,left:0,right:0,background:P.bg2,borderTop:"1px solid "+P.div,borderRadius:"16px 16px 0 0",padding:20,zIndex:10}}><div style={{fontSize:15,fontWeight:500,color:P.cream,marginBottom:4}}>Save this plan</div><div style={{fontSize:12,color:P.muted,marginBottom:18}}>Start now or save for a future date.</div><div style={{display:"flex",flexDirection:"column",gap:10}}><button onClick={onStartNow} style={{background:P.ember,border:"none",borderRadius:12,padding:"16px 0",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Flame size={18} color="#fff" filled={true}/>Start Cook Now</button><SecondaryBtn onClick={()=>setMode("later")}>Save for a future date</SecondaryBtn><button onClick={onSaveNow} style={{background:"none",border:"none",padding:"6px 0",color:P.faint,fontSize:12,cursor:"pointer"}}>Save without a date</button></div></div>);
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────────
function SummaryScreen({cut,plan,onSaveLater,onStartNow,saved}){
  const [showSheet,setShowSheet]=useState(false);
  const prepLabel=plan.prepName||(plan.prepTypes&&plan.prepTypes.length?plan.prepTypes.map(id=>{const pt=PREP_TYPES.find(p=>p.id===id);return pt?pt.label:"";}).join(", "):"-");
  const woodLabel=plan.wood?plan.wood.replace(/_p$/,"").replace(/_/g," "):"-";
  const rows=[["Cut",cut.label],["Weight",(plan.weight||0)+" lbs raw"],["Cooker",plan.cookerLabel||"-"],["Fuel",plan.fuel||"-"],["Wood",woodLabel],["Prep",prepLabel],["Prep timing",plan.prepTiming||"-"],["Cook temp",(plan.cookTemp||cut.defaultCook)+"F"],["Target temp",(plan.targetTemp||cut.defaultTarget)+"F"],["Wrap",plan.wrap==="crutch"?"Texas Crutch":plan.wrap==="paper"?"Butcher Paper":"No wrap"],["Guests",""+(plan.guests||0)]];
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,position:"relative",background:P.bg1}}><Card><div style={{fontSize:16,fontWeight:600,color:P.cream,marginBottom:14}}>{cut.label}</div>{rows.map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:10,marginBottom:10,borderBottom:"1px solid "+P.div}}><span style={{fontSize:12,color:P.faint}}>{k}</span><span style={{fontSize:12,fontWeight:500,color:P.cream,textTransform:"capitalize"}}>{v}</span></div>))}</Card>{saved?(<div style={{background:P.olive+"22",border:"1px solid "+P.olive+"44",borderRadius:12,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:500,color:P.olive}}>Plan saved</div><div style={{fontSize:12,color:P.muted,marginTop:3}}>Find it in Up Next on the home screen</div></div>):(<PrimaryBtn onClick={()=>setShowSheet(true)}>Save Plan</PrimaryBtn>)}<SecondaryBtn>Share Plan</SecondaryBtn>{showSheet&&<SaveSheet onStartNow={()=>{setShowSheet(false);onStartNow();}} onSaveLater={d=>{setShowSheet(false);onSaveLater(d);}} onSaveNow={()=>{setShowSheet(false);onSaveLater("Soon");}}/>}</div>);
}

// ─── ACTIVE COOK ──────────────────────────────────────────────────────────────
function buildMs(cut,plan){
  const pm={pellet:{mins:15,note:"Turn on and set to temp. It will be ready quickly."},offset:{mins:55,note:"Light your fire now. Offsets need 45 to 60 min to stabilize."},kamado:{mins:35,note:"Light charcoal, open vents wide, stabilize before closing down."},pit_barrel:{mins:25,note:"Fill the basket, light, let the drum come to temp."},kettle:{mins:30,note:"Light your chimney. Let it ash over before spreading."},gas:{mins:10,note:"Preheat lid closed, all burners on, then set indirect zone."}};
  const prep=pm[plan.cookerTypeId||"pellet"]||pm.pellet;
  const w=plan.weight||12;const base=cut.base*w*(plan.cookerTempMod||1.0);
  const total=Math.round(base+(plan.startTempAdj||0)+(plan.wrapAdj||0));
  const hasStall=["brisket_packer","brisket_flat","pork_shoulder","chuck_roast"].includes(cut.id);
  const isLow=cut.base>=45;const needsTemper=["brisket_packer","brisket_flat","pork_shoulder","prime_rib","beef_tenderloin","leg_of_lamb"].includes(cut.id);
  const ms=[];
  if(needsTemper) ms.push({id:"temper",offset:-(prep.mins+60),label:"Pull from fridge",desc:"Let the meat approach room temp before it goes on.",phase:"prep",action:null});
  if(isLow) ms.push({id:"season",offset:-(prep.mins+30),label:"Season",desc:"Apply your rub or binder. Let it rest while the cooker comes up.",phase:"prep",action:null});
  ms.push({id:"fire",offset:-prep.mins,label:"Fire up the cooker",desc:prep.note,phase:"prep",action:"reminder"});
  ms.push({id:"on",offset:0,label:"Meat goes on",desc:"Complete your prep, get to temp, then start the clock.",phase:"cook",action:"start"});
  if(isLow) ms.push({id:"firstcheck",offset:Math.round(total*0.35),label:"First temp check",desc:"Optional. No action needed yet.",phase:"cook",action:"log"});
  if(hasStall){ms.push({id:"stall",offset:Math.round(total*0.45),label:"Stall zone likely",desc:"Internal temp may plateau at 155 to 165F for 1 to 3 hrs. Normal.",phase:"cook",action:"reminder"});ms.push({id:"wrap",offset:Math.round(total*0.55),label:"Wrap decision",desc:"Check your bark. Deep mahogany and set? Wrap now. Still forming? Give it 30 more min.",phase:"cook",action:"log"});}
  ms.push({id:"tender",offset:Math.round(total*0.80),label:isLow?"Start probing for tenderness":"Check internal temp",desc:isLow?"Probe the thickest part. Looking for it to slide in like soft butter.":"Getting close. Check temp vs your target.",phase:"cook",action:"log"});
  ms.push({id:"pull",offset:total,label:"Pull window",desc:"Target is "+(plan.targetTemp||cut.defaultTarget)+"F. USDA safe minimum: "+getUsdaInfo(cut.id).temp+"F. Trust feel over thermometer.",phase:"pull",action:"done"});
  ms.push({id:"rest",offset:total+5,label:"Rest",desc:"Into a cooler or warm oven. Minimum "+cut.restMin+" min.",phase:"rest",action:null});
  ms.push({id:"serve",offset:total+Math.round((cut.restMin+cut.restMax)/2),label:"Best serving window",desc:"Slice and serve.",phase:"serve",action:null});
  return ms;
}

function MilestoneList({milestones,elMins,done,activeMs,logs,cut,pastCooks,cookStartTime,sessionStartTime,cookStarted,targetTemp,onLogMs,onDoneMs,onShowFinish}){
  let sp=false,sc=false;
  const totalMins=(milestones.find(m=>m.id==="pull")||{offset:60}).offset;
  return milestones.filter(ms=>ms.id!=="on"||cookStarted).map((ms,i,arr)=>{
    const isCompleted=done.includes(ms.id);
    const isCurrent=!!(activeMs&&ms.id===activeMs.id);
    const isDelayed=!isCompleted&&!isCurrent&&cookStarted&&elMins>ms.offset+15;
    const isSkipped=isCompleted&&logs.filter(l=>l.ms===ms.label).length===0&&ms.action==="log";
    const isPast=!isCurrent&&(isCompleted||elMins>ms.offset);
    const isPrep=ms.phase==="prep";
    const msLogs=logs.filter(l=>l.ms===ms.label);
    const lastLog=msLogs[msLogs.length-1];
    const hdrs=[];
    if(isPrep&&!sp){sp=true;hdrs.push(<Lbl key="ph" style={{marginBottom:6,marginTop:4}}>Prep</Lbl>);}
    if(!isPrep&&!sc){sc=true;hdrs.push(<Lbl key="ch" style={{marginBottom:6,marginTop:12}}>Cook</Lbl>);}
    const tip=isCurrent?getMsTip(ms.id,cut,pastCooks):null;
    let interp=null;
    if(lastLog&&lastLog.tempNum&&isCurrent){
      const stage=getCookStage(cut,elMins,totalMins,lastLog.tempNum);
      interp=interpretTemp(cut,lastLog.tempNum,targetTemp,stage,msLogs);
    }
    let timeLabel;
    const anchor=cookStartTime||sessionStartTime;
    if(ms.offset<0) timeLabel=fmtClock(anchor+ms.offset*60*1000);
    else if(ms.offset===0) timeLabel=cookStartTime?fmtClock(cookStartTime):"meat on";
    else timeLabel=fmtClock(anchor+ms.offset*60*1000);
    const accentColor=isDelayed?P.amber:isCurrent?P.ember:P.div;
    return(<div key={ms.id}>
      {hdrs}
      <div style={{display:"flex",gap:12,marginBottom:10,opacity:isPast&&!isCurrent&&!msLogs.length?0.35:1}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20,flexShrink:0}}>
          <div style={{width:10,height:10,borderRadius:5,background:isCompleted?(isSkipped?P.faint:P.olive):isCurrent?P.ember:isDelayed?P.amber:P.bg4,border:isCurrent?"2px solid "+P.ember:isDelayed?"2px solid "+P.amber:"none",marginTop:4,flexShrink:0,boxSizing:"border-box"}}/>
          {i<arr.length-1&&<div style={{width:1,flex:1,background:P.div,minHeight:20,marginTop:4}}/>}
        </div>
        <div style={{flex:1,background:isCurrent?P.bg3:P.bg2,borderRadius:12,padding:isCurrent?"14px 15px":"10px 14px",border:"1px solid "+accentColor+(isCurrent?"55":isDelayed?"55":""),borderLeft:isDelayed&&!isCurrent?"3px solid "+P.amber:undefined,marginBottom:2}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontSize:isCurrent?14:13,fontWeight:isCurrent?600:400,color:isCompleted?P.faint:isDelayed?P.amber:(PHASE[ms.phase]||P.cream)}}>
              {ms.label}
              {isSkipped&&<span style={{fontSize:10,color:P.faint,marginLeft:8}}>skipped</span>}
              {isDelayed&&!isCurrent&&<span style={{fontSize:10,color:P.amber,marginLeft:8}}>later than estimated</span>}
            </div>
            <div style={{fontSize:11,color:isCurrent&&cookStartTime?P.amber:P.faint,flexShrink:0,marginLeft:8,fontWeight:isCurrent&&cookStartTime?500:400}}>{timeLabel}</div>
          </div>
          {(isCurrent||!isPast)&&<div style={{fontSize:12,color:P.muted,marginTop:5,lineHeight:1.6}}>{ms.desc}</div>}
          {tip&&<div style={{fontSize:11,color:P.amber,marginTop:8,paddingLeft:10,borderLeft:"2px solid "+P.amber+"55",lineHeight:1.6}}>{tip}</div>}
          {interp&&(<div style={{marginTop:10,background:P.bg4,borderRadius:10,padding:"10px 12px",borderLeft:"3px solid "+(interp.status==="stall"||interp.status==="behind"?P.amber:interp.status==="attention"?P.ember:P.olive)}}>
            <div style={{fontSize:12,color:P.cream,lineHeight:1.6,marginBottom:4}}>{interp.interpretation}</div>
            <div style={{fontSize:12,fontWeight:500,color:interp.status==="stall"||interp.status==="behind"?P.amber:interp.status==="attention"?P.ember:P.olive}}>{interp.nextAction}</div>
          </div>)}
          {isCurrent&&(<div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            {ms.action==="start"&&<button onClick={()=>onDoneMs(ms.id)} style={{flex:1,background:P.ember,border:"none",borderRadius:10,padding:"12px 0",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Meat is on — start the clock</button>}
            {ms.action==="log"&&<button onClick={()=>onLogMs(ms)} style={{background:P.ember,border:"none",borderRadius:9,padding:"9px 18px",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>{msLogs.length?"+ Log another":"Log temp"}</button>}
            {ms.action==="done"&&<button onClick={()=>{onDoneMs(ms.id);onShowFinish();}} style={{background:P.ember,border:"none",borderRadius:9,padding:"9px 18px",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>Pull it</button>}
            {ms.action==="reminder"&&<button style={{background:P.bg4,border:"none",borderRadius:9,padding:"9px 14px",color:P.faint,fontSize:12,cursor:"pointer"}}>Set reminder</button>}
            {(ms.action==="log"||ms.action==="reminder"||ms.action===null)&&ms.action!=="start"&&ms.action!=="done"&&<button onClick={()=>onDoneMs(ms.id)} style={{background:"none",border:"1px solid "+P.div,borderRadius:9,padding:"9px 14px",color:P.faint,fontSize:12,cursor:"pointer"}}>Done</button>}
          </div>)}
          {msLogs.length>0&&(<div style={{marginTop:10,background:P.bg4,borderRadius:9,padding:"9px 11px",display:"flex",flexDirection:"column",gap:7}}>
            {msLogs.map((l,li)=>(<div key={li} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:10,alignItems:"center"}}>{l.temp&&<span style={{fontSize:15,fontWeight:600,color:P.cream}}>{l.temp}F</span>}{l.note&&<span style={{fontSize:11,color:P.muted}}>{l.note}</span>}</div><span style={{fontSize:10,color:P.faint}}>{l.time}</span></div>))}
            {isCurrent&&ms.action==="log"&&<button onClick={()=>onLogMs(ms)} style={{background:"none",border:"none",color:P.ember,fontSize:11,cursor:"pointer",textAlign:"left",padding:"2px 0",marginTop:2}}>+ Add another reading</button>}
          </div>)}
        </div>
      </div>
    </div>);
  });
}

function ActiveCookScreen({cut,plan,onFinish,pastCooks}){
  const [elapsed,setElapsed]=useState(0);
  const [cookStarted,setCookStarted]=useState(false);
  const [cookStartTime,setCookStartTime]=useState(null);
  const [sessionStartTime]=useState(Date.now());
  const [logs,setLogs]=useState([]);
  const [logging,setLogging]=useState(false);
  const [logTemp,setLogTemp]=useState("");
  const [logNote,setLogNote]=useState("");
  const [logMs,setLogMs]=useState(null);
  const [logTimestamp,setLogTimestamp]=useState("");
  const [done,setDone]=useState([]);
  const [showFinish,setShowFinish]=useState(false);
  const [restMode,setRestMode]=useState(false);
  const [restEl,setRestEl]=useState(0);
  const targetTemp=plan.targetTemp||cut.defaultTarget;
  const milestones=buildMs(cut,plan);
  const totalMins=(milestones.find(m=>m.id==="pull")||{offset:60}).offset;
  const elMins=Math.floor(elapsed/60);
  useEffect(()=>{const t=setInterval(()=>{if(cookStarted)setElapsed(e=>e+1);if(restMode)setRestEl(e=>e+1);},1000);return()=>clearInterval(t);},[cookStarted,restMode]);
  const activeMs=milestones.find(m=>m.offset>elMins&&!done.includes(m.id)&&m.id!=="on");
  const pct=Math.min(100,Math.round((elMins/totalMins)*100));
  const lastTempLog=logs.filter(l=>l.tempNum).slice(-1)[0];
  const cookStage=lastTempLog?getCookStage(cut,elMins,totalMins,lastTempLog.tempNum):"early";
  const cookInterp=lastTempLog?interpretTemp(cut,lastTempLog.tempNum,targetTemp,cookStage,logs.filter(l=>l.tempNum)):null;
  const cookStatus=cookInterp?statusLabel(cookInterp.status):null;
  const revised=logs.filter(l=>l.tempNum).length>=2?getRevisedFinish(logs.filter(l=>l.tempNum),targetTemp):null;
  const revisedChanged=revised&&cookStartTime&&Math.abs((cookStartTime+totalMins*60*1000)-revised.newFinishEpoch)>15*60*1000;
  const openLog=ms=>{setLogMs(ms);setLogTemp("");setLogNote("");setLogTimestamp(nowLabel());setLogging(true);};
  const saveLog=()=>{if(!logTemp&&!logNote)return;const tempNum=parseFloat(logTemp)||null;setLogs(l=>[...l,{ms:logMs?logMs.label:"Manual",temp:logTemp,tempNum,note:logNote,time:logTimestamp,epochMs:Date.now()}]);setLogTemp("");setLogNote("");setLogTimestamp(nowLabel());};
  const markDone=id=>{setDone(d=>[...d,id]);if(id==="on"){setCookStarted(true);setCookStartTime(Date.now());}};

  if(restMode){
    const rm=Math.floor(restEl/60);const pctR=Math.min(100,Math.round((rm/cut.restMin)*100));
    return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:14,background:P.bg1}}><Card style={{background:P.bg3,textAlign:"center",padding:"28px 20px"}}><div style={{fontSize:11,color:P.olive,fontWeight:600,marginBottom:8,letterSpacing:0.5,textTransform:"uppercase"}}>Resting</div><div style={{fontSize:40,fontWeight:600,color:P.cream,letterSpacing:-1}}>{fmtEl(restEl)}</div><div style={{fontSize:12,color:P.muted,marginTop:6}}>Min {cut.restMin} min · Ideal {cut.restMax} min</div><div style={{background:P.bg4,borderRadius:4,height:6,margin:"16px 0 8px",overflow:"hidden"}}><div style={{background:P.olive,height:"100%",width:pctR+"%",borderRadius:4,transition:"width 1s linear"}}/></div>{rm>=cut.restMin?<div style={{fontSize:13,color:P.olive,fontWeight:500}}>Rest complete — serving window open</div>:<div style={{fontSize:12,color:P.muted}}>{cut.restMin-rm} min until minimum rest</div>}</Card><PrimaryBtn onClick={onFinish} style={{background:P.olive}}>Finish and Reflect on the Cook</PrimaryBtn></div>);
  }
  if(showFinish) return(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32,background:P.bg1}}><div style={{width:64,height:64,borderRadius:32,background:P.ember+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Flame size={32} color={P.ember} filled={true}/></div><div style={{fontSize:24,fontWeight:600,color:P.cream,textAlign:"center"}}>Nice work.</div><div style={{fontSize:14,color:P.muted,textAlign:"center"}}>{cut.label} · {fmtEl(elapsed)}</div><PrimaryBtn onClick={()=>setRestMode(true)} style={{background:P.olive,marginTop:8}}>Start Resting</PrimaryBtn><SecondaryBtn onClick={onFinish}>Skip to Reflection</SecondaryBtn></div>);

  return(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <div style={{padding:"13px 16px 11px",borderBottom:"1px solid "+P.div,background:P.bg0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{cut.label}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>{plan.cookerLabel} · {plan.weight} lbs</div></div>
        <div style={{textAlign:"right"}}>{cookStarted?(<><div style={{fontSize:22,fontWeight:600,color:P.cream,letterSpacing:-0.5}}>{fmtEl(elapsed)}</div><div style={{fontSize:10,color:P.faint}}>cook time</div></>):(<><div style={{fontSize:13,fontWeight:600,color:P.olive}}>Prep mode</div><div style={{fontSize:10,color:P.faint,marginTop:2}}>clock running</div></>)}</div>
      </div>
      {cookStarted&&(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:3,background:cookStatus?cookStatus.color:P.olive}}/><span style={{fontSize:11,fontWeight:500,color:cookStatus?cookStatus.color:P.olive}}>{cookStatus?cookStatus.label:"On track"}</span></div>
        {lastTempLog&&<span style={{fontSize:11,color:P.faint}}>Last: <span style={{color:P.cream,fontWeight:500}}>{lastTempLog.temp}F</span></span>}
      </div>)}
      <div style={{background:P.bg3,borderRadius:3,height:4,marginBottom:9,overflow:"hidden"}}><div style={{background:cookStarted?P.ember:P.bg4,height:"100%",width:pct+"%",borderRadius:3,transition:"width 1s linear"}}/></div>
      {cookStarted&&(<div style={{fontSize:12,color:P.muted}}>
        {revisedChanged&&revised?(<span>Pull revised to <span style={{color:P.amber,fontWeight:500}}>{fmtClock(revised.newFinishEpoch)}</span> based on current pace</span>):activeMs?(<>Next: <span style={{color:P.cream,fontWeight:500}}>{activeMs.label}</span> · <span style={{color:P.faint}}>{fmtClock((cookStartTime||sessionStartTime)+activeMs.offset*60*1000)}</span></>):<span style={{color:P.olive}}>Serving window</span>}
      </div>)}
      {!cookStarted&&<div style={{fontSize:12,color:P.faint}}>Work through prep steps below, then start the clock</div>}
    </div>
    {!cookStarted&&(<div style={{padding:"10px 16px",borderBottom:"1px solid "+P.ember+"44",background:P.emberDim}}>
      <button onClick={()=>markDone("on")} style={{width:"100%",background:P.ember,border:"none",borderRadius:12,padding:"14px 0",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Flame size={18} color="#fff" filled={true}/>Meat is on — start the clock</button>
      <div style={{fontSize:11,color:P.muted,textAlign:"center",marginTop:7}}>Tap when the meat hits the grate and you are ready to track</div>
    </div>)}
    <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
      <MilestoneList milestones={milestones} elMins={elMins} done={done} activeMs={activeMs} logs={logs} cut={cut} pastCooks={pastCooks} cookStartTime={cookStartTime} sessionStartTime={sessionStartTime} cookStarted={cookStarted} targetTemp={targetTemp} onLogMs={openLog} onDoneMs={markDone} onShowFinish={()=>setShowFinish(true)}/>
      <div style={{padding:"8px 0 20px"}}><button onClick={()=>openLog(null)} style={{width:"100%",background:"none",border:"1px dashed "+P.div,borderRadius:12,padding:"11px",color:P.faint,fontSize:12,cursor:"pointer"}}>+ Log a checkpoint</button></div>
    </div>
    {logging&&(<div style={{position:"absolute",bottom:0,left:0,right:0,background:P.bg2,borderTop:"1px solid "+P.div,borderRadius:"16px 16px 0 0",padding:20,zIndex:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:15,fontWeight:500,color:P.cream}}>{logMs?logMs.label:"Manual checkpoint"}</div><button onClick={()=>setLogging(false)} style={{background:"none",border:"none",color:P.faint,fontSize:13,cursor:"pointer"}}>Done</button></div>
      {logs.filter(l=>l.ms===(logMs?logMs.label:"Manual")).length>0&&(<div style={{marginBottom:12,background:P.bg3,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:P.faint,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8}}>Previous entries</div>{logs.filter(l=>l.ms===(logMs?logMs.label:"Manual")).map((l,i,arr)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:i<arr.length-1?8:0,marginBottom:i<arr.length-1?8:0,borderBottom:i<arr.length-1?"1px solid "+P.div:"none"}}><div style={{display:"flex",gap:10,alignItems:"center"}}>{l.temp&&<span style={{fontSize:15,fontWeight:600,color:P.cream}}>{l.temp}F</span>}{l.note&&<span style={{fontSize:12,color:P.muted}}>{l.note}</span>}</div><span style={{fontSize:11,color:P.faint}}>{l.time}</span></div>))}</div>)}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <input type="number" value={logTemp} onChange={e=>setLogTemp(e.target.value)} placeholder="—" style={{width:90,background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"12px 10px",color:P.cream,fontSize:28,fontWeight:600,textAlign:"center",outline:"none"}}/>
        <div style={{flex:1}}><div style={{fontSize:13,color:P.muted,marginBottom:6}}>F internal</div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:P.faint}}>at</span><input value={logTimestamp} onChange={e=>setLogTimestamp(e.target.value)} style={{background:"none",border:"none",borderBottom:"1px solid "+P.div,padding:"2px 4px",color:P.muted,fontSize:12,width:70,outline:"none"}}/></div></div>
      </div>
      {(()=>{
        const t=parseFloat(logTemp);
        if(!t||t<50||t>250) return null;
        const _target=plan.targetTemp||cut.defaultTarget;
        const _total=(buildMs(cut,plan).find(m=>m.id==="pull")||{offset:60}).offset;
        const previewLogs=[...logs.filter(l=>l.tempNum),{tempNum:t,epochMs:Date.now()}];
        const stage=getCookStage(cut,elMins,_total,t);
        const interp=interpretTemp(cut,t,_target,stage,previewLogs);
        const sl=statusLabel(interp.status);
        const ac=interp.status==="stall"||interp.status==="behind"?P.amber:interp.status==="attention"?P.ember:P.olive;
        return(<div style={{marginBottom:12,borderRadius:10,overflow:"hidden",border:"1px solid "+ac+"44"}}>
          <div style={{background:ac+"18",padding:"8px 12px",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid "+ac+"33"}}><div style={{width:6,height:6,borderRadius:3,background:ac,flexShrink:0}}/><span style={{fontSize:11,fontWeight:600,color:ac,letterSpacing:0.3}}>{sl.label}</span></div>
          <div style={{background:P.bg3,padding:"10px 12px"}}><div style={{fontSize:12,color:P.cream,lineHeight:1.6,marginBottom:6}}>{interp.interpretation}</div><div style={{fontSize:12,fontWeight:500,color:ac,lineHeight:1.5}}>{interp.nextAction}</div>{interp.minsToTarget&&interp.minsToTarget>0&&interp.minsToTarget<300&&<div style={{fontSize:11,color:P.faint,marginTop:6}}>~{interp.minsToTarget} min to target at current pace</div>}</div>
        </div>);
      })()}
      <input value={logNote} onChange={e=>setLogNote(e.target.value)} placeholder="Note (optional)..." style={{width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px 12px",color:P.cream,fontSize:13,boxSizing:"border-box",marginBottom:12,outline:"none"}}/>
      <button onClick={saveLog} disabled={!logTemp&&!logNote} style={{width:"100%",background:logTemp||logNote?P.ember:P.bg4,border:"none",borderRadius:12,padding:"13px 0",color:logTemp||logNote?"#fff":P.faint,fontSize:14,fontWeight:600,cursor:logTemp||logNote?"pointer":"default"}}>+ Log entry</button>
    </div>)}
  </div>);
}

// ─── POST COOK ────────────────────────────────────────────────────────────────
function PostCookScreen({cut,plan,onDone}){
  const [rating,setRating]=useState(0);const [wentWell,setWentWell]=useState("");const [change,setChange]=useState("");const [onTrack,setOnTrack]=useState(null);const [submitted,setSubmitted]=useState(false);
  const ta={width:"100%",background:P.bg3,border:"1px solid "+P.div,borderRadius:9,padding:"10px 12px",color:P.cream,fontSize:13,boxSizing:"border-box",resize:"none",fontFamily:"inherit",outline:"none"};
  const handleSave=()=>{const nc={id:Date.now(),cut:cut.label,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),rating,weight:plan.weight||0,cooker:plan.cookerLabel||"-",cookerTypeId:plan.cookerTypeId,wood:plan.wood||null,notes:wentWell||change||"No notes added.",wentWell,changeNextTime:change,onTrack,estimatedMins:Math.round(cut.base*(plan.weight||10)*(plan.cookerTempMod||1)),actualMins:Math.round(cut.base*(plan.weight||10)*(plan.cookerTempMod||1)),pullTempTarget:plan.targetTemp||cut.defaultTarget,pullTempActual:plan.targetTemp||cut.defaultTarget};setSubmitted(true);setTimeout(()=>onDone(nc),1600);};
  if(submitted) return(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32,background:P.bg1}}><div style={{width:56,height:56,borderRadius:28,background:P.ember+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Flame size={28} color={P.ember} filled={true}/></div><div style={{fontSize:20,fontWeight:600,color:P.cream,textAlign:"center"}}>Cook saved to journal</div><div style={{fontSize:13,color:P.muted,textAlign:"center",lineHeight:1.6}}>Your notes will shape future recommendations for {cut.label}.</div></div>);
  return(<div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,background:P.bg1}}>
    <div style={{fontSize:18,fontWeight:600,color:P.cream,paddingTop:4}}>How did it go?</div>
    <Card><div style={{fontSize:12,color:P.muted,marginBottom:12}}>Overall rating</div><Stars rating={rating} onChange={setRating}/></Card>
    <Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>What went well?</div><textarea value={wentWell} onChange={e=>setWentWell(e.target.value)} placeholder="Bark was great, smoke ring deep..." rows={3} style={ta}/></Card>
    <Card><div style={{fontSize:12,color:P.muted,marginBottom:8}}>What would you change next time?</div><textarea value={change} onChange={e=>setChange(e.target.value)} placeholder="Pull 5 degrees earlier, wrap sooner..." rows={3} style={ta}/></Card>
    <Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Did the cook go to plan?</div><div style={{display:"flex",gap:8}}>{["On track","Ran long","Ran short"].map(o=><Chip key={o} label={o} active={onTrack===o} onClick={()=>setOnTrack(o)}/>)}</div></Card>
    <Card><div style={{fontSize:12,color:P.muted,marginBottom:10}}>Add a photo</div><div style={{background:P.bg3,borderRadius:10,height:80,display:"flex",alignItems:"center",justifyContent:"center",border:"1px dashed "+P.div,cursor:"pointer"}}><span style={{fontSize:12,color:P.faint}}>+ Tap to add photo</span></div></Card>
    <PrimaryBtn onClick={handleSave} disabled={!rating}>Save to Journal</PrimaryBtn>
    <SecondaryBtn>Do this later</SecondaryBtn>
  </div>);
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function JournalScreen({cooks,onDetail}){
  const cutGroups={};
  cooks.forEach(c=>{if(!cutGroups[c.cut])cutGroups[c.cut]={ratings:[],lastNote:null,count:0};cutGroups[c.cut].ratings.push(c.rating);cutGroups[c.cut].count++;if(c.changeNextTime)cutGroups[c.cut].lastNote=c.changeNextTime;});
  return(<div style={{flex:1,overflowY:"auto",padding:16,background:P.bg1}}>
    {Object.keys(cutGroups).length>0&&(<div style={{marginBottom:20}}><Lbl>Your Patterns</Lbl>{Object.entries(cutGroups).map(([cut,data])=>{const avg=data.ratings.reduce((a,b)=>a+b,0)/data.ratings.length;return(<div key={cut} style={{background:P.bg2,borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid "+P.div}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{cut}</div><div style={{display:"flex",alignItems:"center",gap:6}}><Stars rating={Math.round(avg)}/><span style={{fontSize:11,color:P.faint}}>{avg.toFixed(1)} avg</span></div></div>{data.lastNote&&<div style={{fontSize:11,color:P.muted,lineHeight:1.5,paddingLeft:10,borderLeft:"2px solid "+P.div}}>"{data.lastNote}"</div>}<div style={{fontSize:10,color:P.faint,marginTop:6}}>{data.count} cook{data.count!==1?"s":""} logged</div></div>);})}</div>)}
    <Lbl>Cook History</Lbl>
    {cooks.length===0&&<div style={{fontSize:13,color:P.faint,padding:"8px 0"}}>No cooks logged yet.</div>}
    {cooks.map(c=>(<div key={c.id} onClick={()=>onDetail(c)} style={{background:P.bg2,borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid "+P.div,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div><div style={{fontSize:14,fontWeight:500,color:P.cream}}>{c.cut}</div><div style={{fontSize:11,color:P.faint,marginTop:2}}>{c.date} · {c.weight} lbs · {c.cooker}</div></div><Stars rating={c.rating}/></div>{c.notes&&<div style={{fontSize:12,color:P.muted,lineHeight:1.5}}>{c.notes}</div>}</div>))}
  </div>);
}

function CookDetailScreen({cook}){
  return(<div style={{flex:1,overflowY:"auto",padding:16,background:P.bg1}}>
    <Card style={{marginBottom:12}}><div style={{fontSize:16,fontWeight:600,color:P.cream,marginBottom:4}}>{cook.cut}</div><div style={{fontSize:12,color:P.faint,marginBottom:12}}>{cook.date} · {cook.weight} lbs · {cook.cooker}</div><Stars rating={cook.rating}/></Card>
    {cook.wentWell&&<Card style={{marginBottom:12}}><Lbl style={{marginBottom:6}}>What went well</Lbl><div style={{fontSize:13,color:P.cream,lineHeight:1.6}}>{cook.wentWell}</div></Card>}
    {cook.changeNextTime&&<Card style={{marginBottom:12}}><Lbl style={{marginBottom:6}}>Change next time</Lbl><div style={{fontSize:13,color:P.cream,lineHeight:1.6}}>{cook.changeNextTime}</div></Card>}
    <Card style={{marginBottom:12}}><div style={{display:"flex",gap:10}}>{[["Est. time",Math.round(cook.estimatedMins/60*10)/10+"h"],["Actual",Math.round(cook.actualMins/60*10)/10+"h"],["Pull temp",cook.pullTempActual+"F"]].map(([k,v])=>(<div key={k} style={{flex:1,background:P.bg3,borderRadius:10,padding:"10px"}}><div style={{fontSize:10,color:P.faint,marginBottom:3}}>{k}</div><div style={{fontSize:13,fontWeight:500,color:P.cream}}>{v}</div></div>))}</div></Card>
    {cook.changeNextTime&&<div style={{background:P.amber+"14",border:"1px solid "+P.amber+"33",borderRadius:12,padding:"12px 14px"}}><div style={{fontSize:11,fontWeight:600,color:P.amber,marginBottom:6,letterSpacing:0.3}}>Carry forward</div><div style={{fontSize:12,color:P.cream,lineHeight:1.6}}>{cook.changeNextTime}</div></div>}
  </div>);
}

// ─── RECIPES ──────────────────────────────────────────────────────────────────
function RecipesScreen(){
  const [recipes,setRecipes]=useState(RECIPES);
  const toggle=id=>setRecipes(r=>r.map(x=>x.id===id?{...x,liked:!x.liked}:x));
  return(<div style={{flex:1,overflowY:"auto",padding:16,background:P.bg1}}><div style={{display:"flex",gap:10,marginBottom:16}}><input placeholder="Search recipes..." style={{flex:1,background:P.bg3,border:"1px solid "+P.div,borderRadius:10,padding:"10px 14px",color:P.cream,fontSize:13,outline:"none"}}/><button style={{background:P.ember,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>Import</button></div>{recipes.map(r=>(<div key={r.id} style={{background:P.bg2,borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid "+P.div}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:P.cream,marginBottom:4}}>{r.title}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[r.cut,r.method,r.time].map((t,i)=>(<span key={i} style={{fontSize:10,background:P.bg3,borderRadius:8,padding:"3px 8px",color:P.faint}}>{t}</span>))}</div></div><button onClick={()=>toggle(r.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"0 0 0 12px"}}><Flame size={20} filled={r.liked} color={r.liked?P.ember:P.faint}/></button></div></div>))}</div>);
}

// ─── EXPLORE ──────────────────────────────────────────────────────────────────
function ExploreScreen(){
  const topics=[{label:"Cuts Guide",icon:"🥩"},{label:"Techniques",icon:"🔥"},{label:"Prep and Finishing",icon:"🧂"},{label:"Smoke and Fire",icon:"💨"}];
  return(<div style={{flex:1,overflowY:"auto",padding:16,background:P.bg1}}><div style={{background:"linear-gradient(160deg,#2A1F16,#1E1A16)",borderRadius:14,padding:"20px",border:"1px solid "+P.div,marginBottom:16}}><div style={{fontSize:11,color:P.faint,marginBottom:6,letterSpacing:0.5,textTransform:"uppercase"}}>Featured</div><div style={{fontSize:17,fontWeight:600,color:P.cream,marginBottom:4}}>The Stall: What It Is and Why It Happens</div><div style={{fontSize:12,color:P.muted,lineHeight:1.5}}>Collagen breakdown, evaporative cooling, and how to decide when to wrap.</div></div><Lbl>Browse by topic</Lbl><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>{topics.map(t=>(<div key={t.label} style={{background:P.bg2,borderRadius:12,padding:"16px",border:"1px solid "+P.div,cursor:"pointer"}}><div style={{fontSize:24,marginBottom:8}}>{t.icon}</div><div style={{fontSize:13,fontWeight:500,color:P.cream}}>{t.label}</div></div>))}</div><Lbl>Quick Reference</Lbl>{["Internal temp cheat sheet","Wood pairing guide","Rest time by cut","Stall management options"].map(label=>(<div key={label} style={{background:P.bg2,borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid "+P.div,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}><span style={{fontSize:13,color:P.cream}}>{label}</span><span style={{color:P.faint,fontSize:16}}>›</span></div>))}</div>);
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({savedCookers,userName,onAddCooker,onDeleteCooker}){
  const [name,setName]=useState(userName||"");
  const [experience,setExperience]=useState("weekend");
  return(<div style={{flex:1,overflowY:"auto",padding:16,background:P.bg1}}>
    <Card style={{marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}><div style={{width:52,height:52,borderRadius:26,background:P.ember+"28",border:"2px solid "+P.ember+"55",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:22,fontWeight:600,color:P.ember}}>{name.charAt(0).toUpperCase()||"?"}</span></div><div style={{flex:1}}><input value={name} onChange={e=>setName(e.target.value)} style={{background:"none",border:"none",fontSize:17,fontWeight:600,color:P.cream,outline:"none",width:"100%"}}/><div style={{fontSize:12,color:P.muted,marginTop:2}}>Fahrenheit · lbs</div></div></div><Lbl style={{marginBottom:8}}>Experience level</Lbl><div style={{display:"flex",gap:8}}>{[["weekend","Weekend Cook"],["enthusiast","Enthusiast"],["pitmaster","Pitmaster"]].map(([v,l])=><Chip key={v} label={l} active={experience===v} onClick={()=>setExperience(v)}/>)}</div></Card>
    <Card style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><Lbl style={{marginBottom:0}}>My Cookers</Lbl><button onClick={onAddCooker} style={{background:"none",border:"none",color:P.ember,fontSize:12,fontWeight:500,cursor:"pointer"}}>+ Add</button></div>{savedCookers.map(c=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,marginBottom:10,borderBottom:"1px solid "+P.div}}><div style={{width:32,height:32,borderRadius:8,background:P.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:P.faint,flexShrink:0}}>{c.icon}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:P.cream}}>{c.nickname||c.label}</div><div style={{fontSize:11,color:P.faint}}>{c.type}</div></div><button onClick={()=>onDeleteCooker(c.id)} style={{background:"none",border:"none",color:P.faint,fontSize:11,cursor:"pointer"}}>Remove</button></div>))}</Card>
    <Card><Lbl style={{marginBottom:8}}>About</Lbl><div style={{fontSize:12,color:P.faint,marginBottom:12}}>Holy Smokes · MVP Preview</div><button onClick={()=>{if(window.confirm("Reset all data? This will clear your name, cookers, and cook history.")){try{["hs_cooks","hs_planned","hs_cookers","hs_onboarded","hs_name"].forEach(k=>localStorage.removeItem(k));}catch{}window.location.reload();}}} style={{background:"none",border:"1px solid "+P.ember+"55",borderRadius:9,padding:"8px 14px",color:P.ember,fontSize:12,cursor:"pointer"}}>Reset all data</button></Card>
  </div>);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [onboarded,setOnboarded]=useState(()=>loadLS("hs_onboarded",false));
  const [userName,setUserName]=useState(()=>loadLS("hs_name",""));
  const [tab,setTab]=useState("plan");
  const [planStep,setPlanStep]=useState(null);
  const [plan,setPlan]=useState({});
  const [selectedCut,setSelectedCut]=useState(null);
  const [cooks,setCooks]=useState(()=>loadLS("hs_cooks",INIT_COOKS));
  const [planned,setPlanned]=useState(()=>loadLS("hs_planned",INIT_PLANNED));
  const [savedCookers,setSavedCookers]=useState(()=>loadLS("hs_cookers",INIT_COOKERS));
  const [activeCook,setActiveCook]=useState(null);
  const [viewingCook,setViewingCook]=useState(null);
  const [showProfile,setShowProfile]=useState(false);
  const [addingCooker,setAddingCooker]=useState(false);
  const [addCookerReturnTo,setAddCookerReturnTo]=useState(null);
  const [newCookerId,setNewCookerId]=useState(null);
  const [planSaved,setPlanSaved]=useState(false);

  useEffect(()=>saveLS("hs_cooks",cooks),[cooks]);
  useEffect(()=>saveLS("hs_planned",planned),[planned]);
  useEffect(()=>saveLS("hs_cookers",savedCookers),[savedCookers]);

  const completeOnboarding=({name,cooker})=>{
    const n=name||"Pitmaster";
    setUserName(n);saveLS("hs_name",n);
    setSavedCookers([cooker]);saveLS("hs_cookers",[cooker]);
    setCooks([]);saveLS("hs_cooks",[]);
    setPlanned([]);saveLS("hs_planned",[]);
    saveLS("hs_onboarded",true);
    setOnboarded(true);
  };

  const startNewPlan=()=>{setPlan({});setSelectedCut(null);setPlanStep("cut");setPlanSaved(false);};
  const updatePlan=u=>setPlan(p=>({...p,...u}));

  const savePlanned=(cookDate)=>{
    const cutData=CUTS.find(c=>c.label===selectedCut.label)||selectedCut;
    const newP={id:"p"+Date.now(),cut:selectedCut.label,cookDate,serveTime:plan.serveTime||"18:00",weight:plan.weight||10,cooker:plan.cookerLabel||"-",cookerTypeId:plan.cookerTypeId,cookerTempMod:plan.cookerTempMod||1.0,startTempAdj:plan.startTempAdj||0,wrapAdj:plan.wrapAdj||0,estimatedCookMins:Math.round((cutData.base||60)*(plan.weight||10)*(plan.cookerTempMod||1.0)+(plan.startTempAdj||0)+(plan.wrapAdj||0)),restMin:cutData.restMin||30,restMax:cutData.restMax||60,targetTemp:plan.targetTemp||cutData.defaultTarget,cookTemp:plan.cookTemp||cutData.defaultCook,fuel:plan.fuel||"-",wood:plan.wood||null,guests:plan.guests||0};
    setPlanned(p=>[...p,newP]);setPlanSaved(true);
  };

  const startCookFromPlan=()=>{setActiveCook({cut:selectedCut,plan});setPlanStep(null);};
  const startPlannedCook=(cook)=>{const cut=CUTS.find(c=>c.label===cook.cut);if(!cut)return;setActiveCook({cut,plan:cook});setTab("plan");};
  const finishCook=(newCook)=>{if(newCook)setCooks(c=>[newCook,...c]);setActiveCook(null);setPlanStep(null);setTab("journal");};

  const handleAddCooker=()=>{setAddCookerReturnTo(planStep?"cooker":showProfile?"profile":"home");setAddingCooker(true);setShowProfile(false);};
  const handleSaveCooker=(cooker)=>{setSavedCookers(prev=>prev.find(c=>c.id===cooker.id)?prev:[...prev,cooker]);setNewCookerId(cooker.id);setAddingCooker(false);if(addCookerReturnTo==="profile")setShowProfile(true);};
  const deleteCooker=id=>setSavedCookers(c=>c.filter(x=>x.id!==id));

  const canGoBack=addingCooker||showProfile||viewingCook||!!planStep||!!activeCook;
  const handleBack=()=>{
    if(addingCooker){setAddingCooker(false);if(addCookerReturnTo==="profile")setShowProfile(true);return;}
    if(showProfile){setShowProfile(false);return;}
    if(viewingCook){setViewingCook(null);return;}
    if(planStep==="cut"){setPlanStep(null);return;}
    if(planStep==="qty"){setPlanStep("cut");return;}
    if(planStep==="cooker"){setPlanStep("qty");return;}
    if(planStep==="params"){setPlanStep("cooker");return;}
    if(planStep==="results"){setPlanStep("params");return;}
    if(planStep==="summary"){setPlanStep("results");return;}
    if(activeCook){setActiveCook(null);setPlanStep(null);return;}
  };

  let title="Holy Smokes";
  if(addingCooker) title="Add a Cooker";
  else if(showProfile) title="Profile";
  else if(viewingCook) title="Cook Detail";
  else if(activeCook) title="Active Cook";
  else if(planStep==="cut") title="Select Cut";
  else if(planStep==="qty") title="Quantity";
  else if(planStep==="cooker") title="Your Cooker";
  else if(planStep==="params") title="Fire and Temp";
  else if(planStep==="results") title="Your Estimate";
  else if(planStep==="summary") title="Plan Summary";
  else if(tab==="journal") title="Cook Journal";
  else if(tab==="recipes") title="Recipes";
  else if(tab==="explore") title="Explore";

  const showNavBar=!planStep&&!activeCook&&!showProfile&&!addingCooker&&!viewingCook;
  const showPlanProgress=planStep&&!activeCook;

  if(!onboarded) return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:P.bg0,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:P.cream,position:"relative",overflow:"hidden"}}>
      <TopBar title="Holy Smokes"/>
      <OnboardingScreen onComplete={completeOnboarding}/>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:P.bg0,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:P.cream,position:"relative",overflow:"hidden"}}>
      <TopBar title={title} onBack={canGoBack?handleBack:null} onProfile={!canGoBack?()=>setShowProfile(true):null} userName={userName}/>
      {showPlanProgress&&<PlanProgress step={planStep}/>}
      {activeCook&&!planStep&&!showProfile&&!addingCooker&&!viewingCook&&(
        <div onClick={()=>{setTab("plan");}} style={{background:P.ember+"18",borderBottom:"1px solid "+P.ember+"33",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
          <div style={{fontSize:12,color:P.ember,fontWeight:500}}>Cook in progress: {activeCook.cut.label}</div>
          <span style={{fontSize:11,color:P.ember}}>View ›</span>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {addingCooker?<AddCookerScreen onSave={handleSaveCooker} onBack={()=>{setAddingCooker(false);if(addCookerReturnTo==="profile")setShowProfile(true);}}/>
        :showProfile?<ProfileScreen savedCookers={savedCookers} userName={userName} onAddCooker={handleAddCooker} onDeleteCooker={deleteCooker}/>
        :viewingCook?<CookDetailScreen cook={viewingCook}/>
        :activeCook?<ActiveCookScreen cut={activeCook.cut} plan={activeCook.plan} pastCooks={cooks} onFinish={finishCook}/>
        :planStep==="cut"?<CutScreen onSelect={cut=>{setSelectedCut(cut);updatePlan({});setPlanStep("qty");}} pastCooks={cooks}/>
        :planStep==="qty"&&selectedCut?<QuantityScreen cut={selectedCut} plan={plan} onUpdate={updatePlan} onNext={()=>setPlanStep("cooker")}/>
        :planStep==="cooker"&&selectedCut?<CookerPickScreen savedCookers={savedCookers} plan={plan} onUpdate={updatePlan} onNext={()=>{setNewCookerId(null);setPlanStep("params");}} onAddCooker={handleAddCooker} pastCooks={cooks} selectedCut={selectedCut} autoSelectId={newCookerId}/>
        :planStep==="params"&&selectedCut?<ParamsScreen cut={selectedCut} plan={plan} onUpdate={updatePlan} onNext={()=>setPlanStep("results")}/>
        :planStep==="results"&&selectedCut?<ResultsScreen cut={selectedCut} plan={plan} onNext={()=>setPlanStep("summary")}/>
        :planStep==="summary"&&selectedCut?<SummaryScreen cut={selectedCut} plan={plan} onSaveLater={savePlanned} onStartNow={startCookFromPlan} saved={planSaved}/>
        :tab==="plan"?<HomeScreen onStart={startNewPlan} onCookDetail={setViewingCook} planned={planned} onStartPlanned={startPlannedCook} onDeletePlanned={id=>setPlanned(p=>p.filter(x=>x.id!==id))} pastCooks={cooks} userName={userName}/>
        :tab==="journal"?<JournalScreen cooks={cooks} onDetail={setViewingCook}/>
        :tab==="recipes"?<RecipesScreen/>
        :tab==="explore"?<ExploreScreen/>
        :null}
      </div>
      {showNavBar&&<NavBar active={tab} onNav={setTab}/>}
    </div>
  );
}