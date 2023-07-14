import { CardRarity } from "../enum/card-rarity.enum";
import { RecycleState } from "../enum/recycleState";

export class NftDataPayload {
    ual: string;
    model: string;
    imei: string;
    createdAt: string;
    state: RecycleState;
    phoneUrl: string;
    backgroundUrl: string;
    compositeUrl: string;
    metadataIpfsUrl: string;
    isRevealed: boolean;
    isClaimed: boolean;
    rarity: CardRarity;
}