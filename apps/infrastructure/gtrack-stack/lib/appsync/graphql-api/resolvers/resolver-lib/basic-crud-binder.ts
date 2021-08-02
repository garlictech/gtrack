import { BasicCreateResolver } from './basic-create-resolver';
import { BasicMultipleCreateResolver } from './basic-multiple-create-resolver';
import { BasicUpdateResolver } from './basic-update-resolver';

type validatorType<REQUIRED_TYPE> = (arg: any) => Observable<REQUIRED_TYPE>;

export function basicCrudBinder<CREATE_INPUT, UPDATE_INPUT, OUTPUT>({
  updateSymbol,
  createSymbol,
  createMultipleSymbol,
  modelSymbol,
  objectValidatorSymbol,
  createObjectValidatorSymbol,
  createMultipleObjectValidatorSymbol,
  updateObjectValidatorSymbol,
  objectModel,
  createObjectValidator,
  createMultipleObjectValidator,
  updateObjectValidator,
  objectValidator,
  hashGenerator,
  hashGeneratorSymbol,
}: {
  updateSymbol: symbol;
  createSymbol: symbol;
  createMultipleSymbol: symbol;
  modelSymbol: symbol;
  objectValidatorSymbol: symbol;
  createObjectValidatorSymbol: symbol;
  createMultipleObjectValidatorSymbol: symbol;
  updateObjectValidatorSymbol: symbol;
  hashGeneratorSymbol: symbol;
  objectModel: dynogels.Model;
  createObjectValidator: validatorType<CREATE_INPUT>;
  createMultipleObjectValidator: validatorType<CREATE_INPUT>;
  updateObjectValidator: validatorType<UPDATE_INPUT>;
  objectValidator: validatorType<OUTPUT>;
  hashGenerator: (input?: CREATE_INPUT) => string;
}) {
  return (container: Container): void => {
    container.bind(modelSymbol).toConstantValue(objectModel);
    container.bind(objectValidatorSymbol).toConstantValue(objectValidator);
    container
      .bind(createObjectValidatorSymbol)
      .toConstantValue(createObjectValidator);
    container
      .bind(createMultipleObjectValidatorSymbol)
      .toConstantValue(createMultipleObjectValidator);
    container
      .bind(updateObjectValidatorSymbol)
      .toConstantValue(updateObjectValidator);
    container.bind(hashGeneratorSymbol).toConstantValue(hashGenerator);

    container
      .bind(createSymbol)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new BasicCreateResolver<CREATE_INPUT, OUTPUT>(
            context.container.get(modelSymbol),
            context.container.get(createObjectValidatorSymbol),
            context.container.get(hashGeneratorSymbol)
          )
      )
      .inSingletonScope();

    container
      .bind(createMultipleSymbol)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new BasicMultipleCreateResolver<CREATE_INPUT, OUTPUT>(
            context.container.get(modelSymbol),
            context.container.get(createMultipleObjectValidatorSymbol),
            context.container.get(hashGeneratorSymbol)
          )
      )
      .inSingletonScope();

    container
      .bind(updateSymbol)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new BasicUpdateResolver<UPDATE_INPUT, OUTPUT>(
            context.container.get(modelSymbol),
            context.container.get(updateObjectValidatorSymbol)
          )
      )
      .inSingletonScope();
  };
}
