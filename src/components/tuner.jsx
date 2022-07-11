import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ml5 from "ml5";

// ! если разница между настоящим звуком и следующим слишком большая, то не изменять положение пойнтера

let audioContext;
let pitch;
let threshold = 2;
let position = "30%";

// const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

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
   pitch = ml5.pitchDetection('model', audioContext, stream, modelLoaded); //instance ?
}

function modelLoaded() {
   console.log("model's loaded");
}


const audio = new Audio("tuner.mp3");

const playAudio = async () => {
   // const importRes = await import("./audio/tuner.mp3"); // make sure the path is correct
   // var audio = new Audio(importRes.default);
   try {
      await audio.play();
      console.log("Playing audio");
   } catch (err) {
      console.log("Failed to play, error: " + err);
   }
}



export const Tuner = () => {
   const [frequency, setFrequency] = useState(0);
   const [note, setNote] = useState("");
   const [diffD, setDiffD] = useState(0);
   const [diffG, setDiffG] = useState(0);


   // const getFreq = () => {
   //    console.log('pitch', pitch);
   //    if (pitch) {
   //       pitch.getPitch((err, frq) => {
   //          if (frq) {
   //             // freq = frequency


   //             // diffG = frq - 195.9977;

   //             // diffD = frq - 146.8324;
   //             // diffG = freq - 195.9977;
   //             // helper (freq);
   //             setFrequency({
   //                diffD: frq - 146.8324,
   //                diffG: frq - 195.9977,
   //                freq: frq.toFixed(2)
   //             });
   //             // help ();

   //             // setFrequency(freq);

   //          } else {
   //             setFrequency((prev) => ({ ...prev, freq: "No pitch detected" }));
   //          }
   //          setTimeout(() => {
   //             getFreq()
   //          }, 60);
   //       });
   //    }
   // }





   useEffect(() => {
      // console.log('1');
      // getFreq()
      // console.log('2');

      const interval = setInterval(() => {
         if (pitch) {
            pitch.getPitch((err, frq) => {
               console.log('?');
               // console.log(frq);
               if (frq) {
                  // diffG = frq - 195.9977;
                  // diffD = frq - 146.8324;

                  setFrequency(frq.toFixed(2));
                  setDiffD(frq - 146.8324);
                  setDiffG(frq - 195.9977);
                  
                  // setFrequency(freq);
               } else {
                  setFrequency("No pitch detected");
               }
            });
         }
      }, 100);
      return () => { 
         
         clearInterval(interval); 
         // audioContext.close();
      };
   }, []);



   let dColorClass = (note === "D") ? " green" : "";
   let gColorClass = (note === "G") ? " green" : "";


   useEffect(() => {
      if (note == "G" && diffG) {
         const absDiff = Math.abs(diffG);
         if (absDiff < 0.3) {
            position = 'calc(50% - 3px)';
            console.log(diffG)
            playAudio();
         } else if (diffG <= -2) {
            position = `calc(50% - 3px - ${ parseInt(absDiff, 0)/2 }px)`;
         } else if (diffG >= 2) {
            position = `calc(50% - 3px + ${ parseInt(absDiff, 0)/2 }px)`;
         }
      }

      if (note == "D" && diffD) {
         const absDiff = Math.abs(diffD);
         if (absDiff <= 0.3) {
            position = 'calc(50% - 3px)';
            playAudio();
         } else if (diffD <= (-1 * threshold)) {
            position = `calc(50% - 3px - ${ parseInt(absDiff, 0)/2 }px)`;
         } else if (diffD >= threshold) {
            position = `calc(50% - 3px + ${ parseInt(absDiff, 0)/2 }px)`;
         }
      }
   }, [note, diffG, diffD]);
   

   return (
      <>
         <div className="wrapper">
            <div className="area">
               <div className="origin"></div>
               <div className="pointer" style={{ left: position }}></div>
            </div>

            <Link to="/qobyz"><div className="qobyz">prima-qobyz</div></Link>

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
            <div className="img"><img width="390px" src={"paintDombyra.png"} /></div>
            <div className="num">{frequency}</div>
         </div>
      </>
   );
};
