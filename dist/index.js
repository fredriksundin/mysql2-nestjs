"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var NestMysql2Module_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectMysql = exports.NestMysql2Module = exports.helloMsn = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const module_ref_1 = require("@nestjs/core/injector/module-ref");
const promise_1 = require("mysql2/promise");
function helloMsn() {
    return 'hello mysql2 nestjs';
}
exports.helloMsn = helloMsn;
const NEST_MYSQL2_OPTIONS = 'NEST_MYSQL2_OPTIONS';
const NEST_MYSQL2_CONNECTION = 'NEST_MYSQL2_CONNECTION';
let NestMysql2Service = class NestMysql2Service {
    constructor(_NestMysql2Options) {
        this._NestMysql2Options = _NestMysql2Options;
        this.logger = new common_1.ConsoleLogger('NestMysql2Service');
        this.logger.setContext('MySQL');
    }
    getPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                try {
                    this.pool = promise_1.createPool(this._NestMysql2Options);
                    yield this.pool.query('SELECT 1+1;');
                    this.logger.log('MySQL connected...');
                }
                catch (error) {
                    this.logger.error("MySQL can't connect", error.message);
                }
            }
            return this.pool;
        });
    }
};
NestMysql2Service = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(NEST_MYSQL2_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], NestMysql2Service);
const connectionFactory = {
    provide: NEST_MYSQL2_CONNECTION,
    useFactory: (NestMysql2Service) => __awaiter(void 0, void 0, void 0, function* () {
        return yield NestMysql2Service.getPool();
    }),
    inject: [NestMysql2Service],
};
function createNestMysql2Providers(options) {
    return [
        {
            provide: NEST_MYSQL2_OPTIONS,
            useValue: options,
        },
    ];
}
let NestMysql2Module = NestMysql2Module_1 = class NestMysql2Module {
    constructor(options, pool, moduleRef) {
        this.options = options;
        this.pool = pool;
        this.moduleRef = moduleRef;
    }
    static register(options) {
        return {
            module: NestMysql2Module_1,
            providers: createNestMysql2Providers(options),
        };
    }
    static registerAsync(options) {
        return {
            module: NestMysql2Module_1,
            providers: [...this.createProviders(options)],
            imports: options.imports || [],
        };
    }
    static createProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }
        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: NEST_MYSQL2_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: NEST_MYSQL2_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createNestMysql2Options(); }),
            inject: [options.useExisting || options.useClass],
        };
    }
    onApplicationShutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
};
NestMysql2Module = NestMysql2Module_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [NestMysql2Service, connectionFactory],
        exports: [NestMysql2Service, connectionFactory],
    }),
    __param(0, common_1.Inject(NEST_MYSQL2_OPTIONS)),
    __param(1, common_1.Inject(NEST_MYSQL2_CONNECTION)),
    __metadata("design:paramtypes", [Object, Object, module_ref_1.ModuleRef])
], NestMysql2Module);
exports.NestMysql2Module = NestMysql2Module;
exports.InjectMysql = () => {
    return common_1.Inject(NEST_MYSQL2_CONNECTION);
};
