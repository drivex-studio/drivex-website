import { useBreakpoint } from '@/hooks/useBreakpoint'; 
import { ASCII_CONFIG } from '@/libs/constants/config';

export function useAsciiDelay() {
  const delay = 0.1 * ASCII_CONFIG.REVEAL_DURATION; 
  const isMdScreen = useBreakpoint("md");
  return isMdScreen ? delay : 0;
}
