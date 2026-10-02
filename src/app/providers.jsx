"use client";

import { PageTransitionProvider } from '@/providers/PageTransitionProvider'
import { PageEnterProvider } from '@/providers/PageEnterProvider';
import { LenisProvider } from '@/providers/LenisProvider';
import { PreloaderProvider } from '@/providers/PreloaderProvider'
import { ModalProvider } from '@/providers/ModalProvider';
import { FooterVisibilityProvider } from '@/providers/FooterSlot';

export default function AppProviders({ children }) {
  return (
    <PageTransitionProvider>
      <PreloaderProvider>
        <PageEnterProvider>
          <LenisProvider>
            <ModalProvider>
              <FooterVisibilityProvider>
                {children}
              </FooterVisibilityProvider>
            </ModalProvider>
          </LenisProvider>
        </PageEnterProvider>
      </PreloaderProvider>
    </PageTransitionProvider>
  );
}
