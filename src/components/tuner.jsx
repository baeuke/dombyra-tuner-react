import { useEffect, useState } from "react";
import ml5 from "ml5";


// ! если разница между настоящим звуком и следующим слишком большая, то не изменять положение пойнтера


let audioContext;
let pitch;



let diffD;
let diffG;

let absDiff = 0;


async function setup() {
   audioContext = new AudioContext();
   const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
   });
   startPitch(stream, audioContext);
}

setup();

function startPitch(stream, audioContext) {
   pitch = ml5.pitchDetection("model", audioContext, stream, modelLoaded); //instance ?
}

function modelLoaded() {
   console.log("model's loaded");
}

// let dFunc = () => {
//       diff = freq - 146.8324;
//       absDiff = Math.abs(diff);
//       if (absDiff < 1) {
//          return 'calc(50% - 3px)';
//       } else if (diff < -2) {
//          return `calc(50% - 3px - ${absDiff}px)`;
//       } else if (diff > 2) {
//          return `calc(50% - 3px + ${absDiff}px)`;
//       }
//    }

// let gFunc = () => {
//       diff = freq - 195.9977;
//       absDiff = Math.abs(diff);
//       if (absDiff < 1) {
//          return 'calc(50% - 3px)';
//       } else if (diff < -2) {
//          return `calc(50% - 3px - ${absDiff}px)`;
//       } else if (diff > 2) {
//          return `calc(50% - 3px + ${absDiff}px)`;
//       }
// }

export const Tuner = () => {
   const [frequency, setFrequency] = useState(0);
   const [note, setNote] = useState("");
   
   // const [position, setPosition] = useState('calc(50% - 3px)');

   useEffect(() => {
      const interval = setInterval(() => {
         if (pitch) {
            pitch.getPitch((err, frequency) => {
               if (frequency) {
                  // freq = frequency
                  diffG = frequency - 195.9977;
                  
                  diffD = frequency - 146.8324;
                  // diffG = freq - 195.9977;
                  // helper (freq);
                  setFrequency(frequency.toFixed(2));
                  // help ();

                  // setFrequency(freq);
               } else {
                  setFrequency("No pitch detected");
               }
            });
         }
      }, 50);
      return () => {clearInterval(interval)}
   }, []);


   // let help = () => {
   //    if (note == "D") {
   //       absDiff = toString(Math.abs(diffD));
   //       if (absDiff < 1) {
   //          setPtrPosition('calc(50% - 3px)');
   //       } else if (diffD < -2) {
   //          setPtrPosition(`calc(50% - 3px - ${absDiff}px)`);
   //       } else if (diffD > 2) {
   //          setPtrPosition(`calc(50% - 3px + ${absDiff}px)`);
   //       }
   //    }
   // };

   // let posPointer = (frq) => {
   //    if (note == "D") {
   //       diff = frq - 146.8324;
   //    } else if (note == "G") {
   //       diff = frq - 195.9977;
   //    }
   //    console.log(diff);
   // };
   


   let dColorClass = (note === "D") ? " green" : "";
   let gColorClass = (note === "G") ? " green" : "";

   // let ptrPos = (note == "D") ? dFunc() : 
   //    (note == "G") ? gFunc() : "calc(50% - 3px)";
   
   // if (note == "D") {
   //    absDiff = Math.abs(diffD);
   //    if (absDiff < 1) {
   //       ptrPos = 'calc(50% - 3px)';
   //    } else if (diffD < -2) {
   //       ptrPos = `calc(50% - 3px - ${absDiff}px)`;
   //    } else if (diffD > 2) {
   //       ptrPos = `calc(50% - 3px + ${absDiff}px)`;
   //    }
   // }

   // if (note == "G") {
   //    absDiff = Math.abs(diffG);
   //    if (absDiff < 1) {
   //       ptrPos = 'calc(50% - 3px)';
   //    } else if (diffG < -2) {
   //       ptrPos = `calc(50% - 3px - ${absDiff}px)`;
   //    } else if (diffG > 2) {
   //       ptrPos = `calc(50% - 3px + ${absDiff}px)`;
   //    }
   // }
   

   //RABOCHIY: *******
   // let pStyle = {
   //    left: `calc(50% - 3px + ${diff}px)`
   // };
   //******** */


   let pStyle = {
      left: `30%`
   };

   if (note == "G") {
      absDiff = Math.abs(diffG);
      if (absDiff < 1) {
         pStyle.left = 'calc(50% - 3px)';
      } else if (diffG < -2) {
         pStyle.left = `calc(50% - 3px - ${absDiff}px)`;
      } else if (diffG > 2) {
         pStyle.left = `calc(50% - 3px + ${absDiff}px)`;
      }
   }

   if (note == "D") {
      absDiff = Math.abs(diffD);
      if (absDiff < 1) {
         pStyle.left = 'calc(50% - 3px)';
      } else if (diffD < -2) {
         pStyle.left = `calc(50% - 3px - ${absDiff}px)`;
      } else if (diffD > 2) {
         pStyle.left = `calc(50% - 3px + ${absDiff}px)`;
      }
   }

   return (
      <>
         <div className="wrapper">
            <div className="area">
               <div className="origin"></div>
               <div className="pointer" style={pStyle}></div>
            </div>
            {/* style={{ left: `calc(50% - 3px + ${frq/10}px)`, position: "absolute"}} */}
            <button
               className={`d-note${dColorClass}`}
               onClick={() => {
                  setNote("D");
               }}
            >D</button>

            <button
               className={`g-note${gColorClass}`}
               onClick={() => {
                  setNote("G");
               }}
            >G</button>
            <div className="img"><img width="390px" src={"paintDombyra.png"}/></div>
            <div className="num">{frequency}</div>
         </div>
      </>
   );
};
