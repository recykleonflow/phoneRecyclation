import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import VanillaTilt from 'vanilla-tilt';
import anime from 'animejs/lib/anime.es.js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Web3Service } from 'src/app/private/service/web3/web3.service';
import { NftDataPayload } from '../../../../../../../libs/shared_models/model/nft-data-payload';
import { PhoneService } from 'src/app/private/service/phone/phone.service';
import { UserPhonePayload } from '../../../../../../../libs/shared_models/model/user-phone-payload';
import { FlowService } from 'src/app/private/service/flow/flow-service';

interface ParticleOptions {
  type?: string;
  duration?: number;
  easing?: string;
  color?: string;
  direction?: string;
  size?: number;
  speed?: number;
  particlesAmountCoefficient?: number;
  oscillationCoefficient?: number;
  complete?: () => void;
}
declare var Particles: any;

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements AfterViewInit {
    imagesToLoad = 2;
    loadedImages = 0;
    isLoaded = false;
    nftData: NftDataPayload = new NftDataPayload();
    userPhone: UserPhonePayload = new UserPhonePayload();

    @ViewChild('nftCard') nftCard!: ElementRef;
    
    // rewards
    rewardPointCount = 0;
    maxRewards = 200;
    showRewards = false;

    particlesInstance: any;
    cardSwitched: boolean = false;
    showMetadata: boolean = true;

    get isConnectedWallet() {
      return this.flowService.isWalletConnected();
    }
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private flowService: FlowService,
                private phoneService: PhoneService,
                private cdr: ChangeDetectorRef) {
      this.showMetadata = data.showMetadata;
      this.nftData = data.userPhone.nftData;
      this.userPhone = data.userPhone;
    }

    async onClaim() {
      // minting of token on flow blockchain
      await this.flowService.mintToken(`${this.nftData.model}-${this.nftData.imei}`,'RecykleOnFlow NFT',this.nftData.compositeUrl);
      this.nftData.isClaimed = true;
      this.phoneService.claimPhoneNFT(this.nftData.ual).subscribe();
    }

    ngAfterViewInit() {
       if (!this.isMobileResolution()){
        VanillaTilt.init(this.nftCard.nativeElement, {
          max: 15, // Maximum tilt rotation (degrees)
          speed: 300, // Speed of the enter/exit transition
          //scale: 1.1, // 1.1 = 110% of original size
          glare:                  true,  // if it should have a "glare" effect
          "max-glare":            0.3,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
          gyroscope:              true,   // Boolean to enable/disable device orientation detection,
          gyroscopeMinAngleX:     -45,    // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
          gyroscopeMaxAngleX:     45,     // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
          gyroscopeMinAngleY:     -45,    // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
          gyroscopeMaxAngleY:     45,     // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
      });
      }

      if (!this.nftData.isRevealed) {
        this.isLoaded = true;
        this.cdr.detectChanges;
        this.particlesInit();
      }
    }

    imageLoaded() {
      if (this.nftData.isRevealed) {
        this.loadedImages++;
        if (this.loadedImages === this.imagesToLoad) {
          this.isLoaded = true;
          this.cdr.detectChanges;
        }
      }
    }

    isMobileResolution(): boolean {
      const mobileWidthThreshold = 600; // Set the breakpoint for mobile resolution, e.g., 768px
      return window.innerWidth <= mobileWidthThreshold;
    }

    onClick() {
        if (this.nftData.isRevealed) {
          this.cardSwitched = !this.cardSwitched;
        }
    }

    // refactor this
    particlesInit() {
      const arrOpts: ParticleOptions[] = [
    {},

    {
      type: "rectangle",
      duration: 500,
      easing: "easeOutQuad",
      color: "#091388",
      direction: "top",
      size: 8
    },

    {
      duration: 1300,
      easing: "easeInExpo",
      size: 3,
      speed: 1,
      particlesAmountCoefficient: 10,
      oscillationCoefficient: 1
    },

    {
      duration: 500,
      easing: "easeOutQuad",
      speed: 0.1,
      particlesAmountCoefficient: 10,
      oscillationCoefficient: 80
    }
  ];

    const items = document.querySelectorAll(".grid__item");
    items.forEach((el, pos) => {
    const bttn = el.querySelector("button.particles-button") as HTMLElement;
    const bttnBack = el.querySelector("button.action") as HTMLElement;

    let particlesOpts = arrOpts[pos];
    particlesOpts.complete = () => {
      if (!buttonVisible) {
        anime.remove(bttnBack);
        anime({
          targets: bttnBack,
          duration: 300,
          easing: "easeOutQuint",
          opacity: 1,
          scale: [0, 1]
        });
        //bttnBack.style.pointerEvents = "auto";
        this.nftData.isRevealed = true;
        this.phoneService.revealPhoneNFT(this.nftData.ual).subscribe();
      }
    };
    const particles = new Particles(bttn, particlesOpts);

    let buttonVisible = true;
    bttn.addEventListener("click", () => {
      this.showRewards = true;
      this.animateCounter();
      if (!particles.isAnimating() && buttonVisible) {
        particles.disintegrate({
          duration: 1500,
          easing: "easeInExpo",
          direction: "top",
          speed: 1,
          particlesAmountCoefficient: 10,
          oscillationCoefficient: 10,
        });
        buttonVisible = !buttonVisible;
      }
    });
  });
    }

    public animateCounter() {
      // Reset the rewardPointCount to 0
      this.rewardPointCount = 0;
    
      // Define the increment value and the delay (in milliseconds)
      const increment = 1;
      const delay = 5;
    
      // Calculate the number of steps needed to reach maxRewards
      const steps = this.maxRewards / increment;
    
      // Create an interval to update the rewardPointCount
      const interval = setInterval(() => {
        // Increase the rewardPointCount by the increment value
        this.rewardPointCount += increment;
    
        // Check if the rewardPointCount has reached maxRewards
        if (this.rewardPointCount >= this.maxRewards) {
          // Set the rewardPointCount to maxRewards
          this.rewardPointCount = this.maxRewards;
    
          // Clear the interval
          clearInterval(interval);
        }
      }, delay);
    }
}
