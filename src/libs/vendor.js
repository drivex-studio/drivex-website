import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(
    ScrollTrigger,
    useGSAP,
    ScrambleTextPlugin, 
    SplitText
 );
export{gsap,useGSAP,ScrollTrigger,SplitText,ScrambleTextPlugin};