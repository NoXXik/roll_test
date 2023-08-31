import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from "rxjs";


@Injectable()
export class StripFieldsInterceptor implements NestInterceptor {
  constructor(private fieldsToRemove: string[] = []) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('1', this.fieldsToRemove)
    return next.handle().pipe(map(data => {
      console.log(data)
      this.stripFields(data);
    }));
  }

  private stripFields(data: any): any {
    console.log('2',this.fieldsToRemove)
    if (data && typeof data === 'object') {
      console.log('3',this.fieldsToRemove)
      this.fieldsToRemove.forEach(field => delete data[field]);
    }
    console.log(data)
    return data;
  }
}

