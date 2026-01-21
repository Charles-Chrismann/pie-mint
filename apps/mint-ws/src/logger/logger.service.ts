
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Logger extends ConsoleLogger implements LoggerService {
	public verboseEnabled: boolean

	constructor(
		private readonly configService: ConfigService
	) {
		super()
		this.verboseEnabled = this.configService.getOrThrow<boolean>('LOGGER_VERBOSE', true);
	}

  verbose(message: unknown, context?: unknown, ...rest: unknown[]): void {
		if(this.verboseEnabled) {
			super.verbose(message)
		}
	}

	toggleVerbose() {
		this.verboseEnabled = !this.verboseEnabled
	}
}
