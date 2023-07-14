import {Controller, Get, Query} from '@nestjs/common';

import {AuthorizedResource} from '../decorator/authorized.resource';
import {CurrentUser} from '../decorator/current-user.decorator';
import {UserService} from '../service/user.service';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';
import {CompanyPayload} from '../../../../../libs/shared_models/model/company-payload.model';
import {CompanyService} from '../service/company.service';

@Controller('company')
export class CompanyController {
    constructor(
        private companyService: CompanyService) {
    }


    @Get('retail')
    @AuthorizedResource()
    findUser(@CurrentUser() user: UserPayload): Promise<CompanyPayload[]> {
        return this.companyService.getAllRetailCompanies();
    }
}
