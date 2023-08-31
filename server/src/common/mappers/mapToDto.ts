import { UserAuthRes } from "../../auth/types";
import { UserStateDto } from "../../auth/dto";
//
export function mapToDto(user): UserStateDto {
  delete user.hashed_refresh
  delete user.updated_at
  delete user.password_hash
  return user;
}

export function stripFields(object: any, fields: string[]) {
  if (object && typeof object === 'object') {
    fields.forEach(field => delete object[field]);
  }
  return object;
}
// import { classToPlain, plainToClass } from 'class-transformer';
// import { cloneDeep } from 'lodash';
//
// export function mapToDto<T, D>(source: T, destinationClass: new () => D): D {
//   const plainObject = classToPlain(source);
//   const clonedObject = cloneDeep(plainObject);
//   const dtoInstance = plainToClass(destinationClass, clonedObject);
//   return dtoInstance;
// }
