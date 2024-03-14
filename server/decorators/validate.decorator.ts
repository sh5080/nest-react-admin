import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: "isEqualTo",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}

export function IsValidIndexList(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "isValidIndexList",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          if (typeof value !== "string") {
            return false;
          }
          const indexes = value.split(",").map(Number);
          if (indexes.some(isNaN)) {
            return false; // 숫자로 변환할 수 없는 값이 포함되어 있는 경우
          }
          if (new Set(indexes).size !== indexes.length) {
            return false; // 중복된 값이 포함되어 있는 경우
          }

          return indexes.every((index) => [0, 1, 2].includes(index)); // 허용된 인덱스만 포함되어 있는 경우
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}에 유효하지 않은 인덱스 목록이 포함되어 있습니다.`;
        },
      },
    });
  };
}
