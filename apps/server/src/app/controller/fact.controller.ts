import {Controller, Get} from '@nestjs/common';
import {AppService} from '../app.service';
import {FactService} from '../service/fact.service';
import {AuthorizedResource} from '../../authorization/decorator/authorized.resource';

@Controller('fact')
export class FactController {
    constructor(private readonly factService: FactService) {
    }

    @Get('')
    @AuthorizedResource()
    getRandomFact(): Promise<{ text: string }[]> {
        return this.factService.getFacts();
    }
}
