import {PlatformType} from './enum/platform-type.enum';

export class PlatformHelper {
    static platform: PlatformType;

    static isMobile() {
        return this.platform !== PlatformType.WEB;
    }
}
