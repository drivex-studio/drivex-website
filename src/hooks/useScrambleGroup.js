"use client";
import { useContext } from 'react'; 
import { ScrambleContext } from '@/contexts/ScrambleContext';

export function useScrambleGroup() {
  return useContext(ScrambleContext);
}